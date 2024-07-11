import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url); // nos da la ruta desde donde se esta haciendo el import

export const __dirname = dirname(__filename); 

// Multer

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

// UUID

export function generateUniqueId() {
    return uuidv4();
}