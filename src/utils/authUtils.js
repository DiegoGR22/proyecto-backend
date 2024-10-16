import bcrypt, { genSaltSync } from 'bcrypt';    
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

//* BCRYPT

// Hashes the password
export const createHash = password => bcrypt.hashSync(password, genSaltSync(10))

// Validates the hashed password
export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password)

//* JWT
const SECRET_KEY = config.passportKey;

export const generateToken = (user) => {
    const token = jwt.sign({ _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, age: user.age, role: user.role, cart: user.cart  }, SECRET_KEY, { expiresIn: '24h' })
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