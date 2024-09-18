import { dirname } from "path";
import { fileURLToPath } from "url";
import bcrypt, { genSaltSync } from 'bcrypt';    
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import passport from "passport";

const __filename = fileURLToPath(import.meta.url); // nos da la ruta desde donde se esta haciendo el import

export const __dirname = dirname(__filename); 

//* BCRYPT

// Hashes the password
export const createHash = password => bcrypt.hashSync(password, genSaltSync(10))

// Validates the hashed password
export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password)

//* JWT
const SECRET_KEY = process.env.SECRET_KEY;

export const generateToken = (user) => {
    const token = jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, age: user.age, role: user.role  }, SECRET_KEY, { expiresIn: '1m' })
    return token
}

// Se envia el token desde las cookies
export const authToken = (req, res, next) => {
    const token = req.cookies.authToken

    if(!token) return res.redirect('/error?message=ERROR 403: You are not allowed to access this');

    jwt.verify(token, SECRET_KEY, (error, credentials) => {
        if(error) return res.status(403).send({ message: "Not authorized"})
        
        req.user = credentials.user
        next()
    })
}

//* JWT PASSPORT CALL

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function(err, user, info){
            if(err){
                return next(err)
            }
            if(!user){
                // return res.status(401).send({ error: info.messages ? info.messages : 
                //     info.toString()})
                return res.redirect(`/error?message=ERROR: ${info.message}`);
            }

            req.user = user
            next()
        })
        (req, res, next)
    }
}