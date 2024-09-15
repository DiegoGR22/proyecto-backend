import passport from "passport";
import local from 'passport-local'
import { UserModel } from "../models/user.model.js";
import { createHash, validatePassword } from "../utils.js";

const localStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new localStrategy({
        passReqToCallback: true, usernameField: 'email' 
    }, async (req, username, password, done) => {
        const { firstName, lastName, email, age } = req.body;
        try {
            let user = await UserModel.findOne({ email: username });

            if(user){
                console.warn("User already exists")
                return done(null, false)
            }

            const newUser = { firstName, lastName, email, age, password: createHash(password) }

            let result = await UserModel.create(newUser)
            return done(null, result);

        } catch (error) {
            return done("Error creating user: " + error.message)
        }
    }))

    passport.use('login', new localStrategy({
        usernameField: 'email'
    }, async (username, password, done) => {
        try {
            const user = await UserModel.findOne({ email: username });

            if(!user){
                console.error("User not found")
                return done(null, false)
            }

            if(!validatePassword(user, password)) return done(null, false)

            return done(null, user)

        } catch (error) {
            return done(error)
        }
    }))

        
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    
    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById(id);
        done(null, user)
    });
}

export default initializePassport