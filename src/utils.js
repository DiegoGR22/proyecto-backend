import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // nos da la ruta desde donde se esta haciendo el import

export const __dirname = dirname(__filename); 
