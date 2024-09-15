import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';
import bcrypt, { genSaltSync } from 'bcrypt';    
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url); // nos da la ruta desde donde se esta haciendo el import

export const __dirname = dirname(__filename); 

//* Multer

// Verificamos si el directorio existe, si no lo creamos
const uploadDir = __dirname + '/public/img';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/public/img')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

export const uploader = multer({ storage })

//* UUID

export function generateUniqueId() {
    return uuidv4();
}

//* BCRYPT

// Hashes the password
export const createHash = password => bcrypt.hashSync(password, genSaltSync(10))

// Validates the hashed password
export const validatePassword = (user, password) => bcrypt.compareSync(password, user.password)

//* JWT
const SECRET_KEY = 'ada123';

export const generateToken = (user) => {
    const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '1m' })
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