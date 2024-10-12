import passport from "passport";
import local from 'passport-local'
import { UserModel } from "../models/user.model.js";
import { createHash, validatePassword } from "../utils/authUtils.js";
import GitHubStrategy from 'passport-github2'
import jwt from 'passport-jwt'
import { CartModel } from "../models/cart.model.js";

const localStrategy = local.Strategy

const JWTStrategy = jwt.Strategy
const ExtractorJWT = jwt.ExtractJwt

const cookieExtractor = (req) => {
    let token = null
    // console.log(req.cookies)

    if(req && req.cookies){
        token = req.cookies['authToken']
    }
    return token
}

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
            
            const newCart = new CartModel({ products: [] });
            await newCart.save();

            const newUser = { firstName, lastName, email, age, password: createHash(password), cart: newCart._id }

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

    passport.use('github', new GitHubStrategy({
        clientID: "Iv23lilVAUY92TYz5VTV",
        clientSecret: "ce5d138cf12237ce6a54003ac06817b6e476f536",
        callbackURL: "http://localhost:8080/api/session/githubcallback",
    }, async (accesToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            let user = await UserModel.findOne({ email: profile._json.email });

            if(!user){

            const newCart = new CartModel({ products: [] });
            await newCart.save();

                let newUser = {
                    firstName: profile._json.name,
                    lastName: "",
                    age: undefined,
                    email: profile._json.email,
                    password: null,
                    cart: newCart._id
                }

                let result = await UserModel.create(newUser)
                done(null, result)
            } else {
                done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractorJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

export default initializePassport