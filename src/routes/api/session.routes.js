import { Router } from "express";
import { UserModel } from "../../models/user.model.js";
import { createHash, validatePassword } from "../../utils.js";
import { validate } from "uuid";

const router = Router();

router.get('/', (req, res) => {
    try {
        if (req.session.counter) {
            req.session.counter++
            res.send(`This site has been visited ${req.session.counter} times.`);
        } else {
            req.session.counter = 1;
            res.send("Welcome, this is the first time you've visited this site")
        }
    } catch (error) {
        console.log(error);
    }
});

router.post('/register', async (req, res) => {
    const { firstName, lastName, age, email, password } = req.body;
    try {

        const user = new UserModel({ firstName, lastName, age, email, password: createHash(password) });
        // console.log("🚀 ~ router.post ~ user:", user)
        await user.save();

        res.redirect('/login');
    } catch (error) {
        console.error("Register failed", error);
        res.status(500).json({ error: "Register failed", details: error.message });
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await UserModel.findOne({ email });
        // console.log("🚀 ~ router.post ~ user:", user)

        if (!user) {
            console.error("User not found");
            return res.status(404).send({ error: "User not found" });
        }

        if (validatePassword(user, password)) {
            req.session.user = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                age: user.age,
                role: user.role
            };
            // console.log("🚀 ~ router.post ~ req.session.user:", req.session.user)

            res.redirect('/');
        } else {
            console.error("Invalid password");
            return res.status(401).send({ error: "Invalid password" });
        }
    } catch (error) {
        console.error("Login failed", error);
        res.status(500).send({ error: "Login failed", details: error.message });
    }
});

router.post('/logout', (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ error: "Logout failed", details: err.message });
            } else {
                res.clearCookie("connect.sid");
                res.redirect('/login');
                console.log("You have been logged out")
            }
        });
    } catch (error) {
        console.error("Something went wrong")
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
})

router.post('/role', async (req, res) => {
    const user = req.session.user;
    const roleModified = user.role === 'admin' ? 'user' : 'admin';
    
    try {
        const modifiedUser = await UserModel.findOneAndUpdate({ email: user.email }, { role: roleModified });

        if (!modifiedUser) {
            console.error("User not found");
            return res.status(404).send({ error: "User not found" });
        } 

        console.log("Role modified to: " + roleModified)
        req.session.user.role = roleModified
        res.redirect("/profile");

    } catch (error) {
        console.error("Login failed", error);
        res.status(500).send({ error: "Login failed", details: error.message });
    }
});

router.post('/restore-password', async (req, res) => {
    const { email, newPassword } = req.body;
    
    try {
        const user = await UserModel.findOneAndUpdate({ email: email }, { password: createHash(newPassword) });
        // console.log("🚀 ~ router.post ~ user:", user)

        if (!user) {
            console.error("User not found");
            return res.status(404).send({ error: "User not found" });
        }

        console.log("Password successfully changed")
        setTimeout(() => {
            res.redirect('/login')
        }, 3000);

    } catch (error) {
        console.error("An error occurred while changing password", error);
        res.status(500).send({ error: "An error occurred while changing password", details: error.message });
    }
})

export default router;