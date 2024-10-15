import { createHash, generateToken } from "../utils/authUtils.js";
import User, { updateUserRole, updateUserPassword } from "../DAO/user.dao.js";

const userService = new User()

export const register = async (req, res) => { 
    res.redirect('/login')
}

export const failRegister = async (req, res) => {
    console.error("Something went wrong")
    return res.redirect('/error?message=ERROR: Something went wrong');
}

export const login = async (req, res) => {
    const token = generateToken(req.user)

    res.cookie('authToken', token, {
        httpOnly: true,
        maxAge: 60 * 1000
    })

    res.redirect("/");
}

export const failLogin = async (req, res) => {
    console.error("Something went wrong")
    // res.status(400).send({ message: 'Something went wrong' });
    return res.redirect('/error?message=ERROR: Email or password are invalid');
}

export const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                res.status(400).json({ error: "Logout failed", details: err.message });
            } else {
                res.clearCookie("connect.sid");
                res.clearCookie("authToken");
                res.redirect('/login');
                console.log("You have been logged out");
            }
        });
    } catch (error) {
        console.error("Something went wrong");
        res.status(500).json({ error: "Something went wrong", details: error.message });
    }
}

export const role = async (req, res) => {
    const user = req.user;
    const roleModified = user.role === 'admin' ? 'user' : 'admin';
    
    try {
        const modifiedUser = await userService.updateUserRole(user.email, roleModified);

        if (!modifiedUser) {
            console.error("User not found");
            return res.status(404).send({ error: "User not found" });
        } 

        console.log("Role modified to: " + roleModified);
        req.user.role = roleModified;

        const newToken = generateToken(req.user);

        res.cookie('authToken', newToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        res.redirect("/profile");

    } catch (error) {
        console.error("Login failed", error);
        res.status(500).send({ error: "Login failed", details: error.message });
    }
}

export const restorePswd = async (req, res) => {
    const { email, newPassword } = req.body;
    
    try {
        const user = await userService.updateUserPassword(email, createHash(newPassword));

        if (!user) {
            console.error("User not found");
            return res.status(404).send({ error: "User not found" });
        }

        console.log("Password successfully changed");
        setTimeout(() => {
            res.redirect('/login');
        }, 3000);

    } catch (error) {
        console.error("An error occurred while changing password", error);
        res.status(500).send({ error: "An error occurred while changing password", details: error.message });
    }
}

export const githubLogin = async (req, res) => {
    const token = generateToken(req.user);

    res.cookie('authToken', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    });

    res.redirect('/');
}

export const current = async (req, res) => {
    res.redirect('/current');
}