import { Router } from 'express';
import { productManager } from '../routes/product.router.js';
import { __dirname } from '../utils.js';

const router = Router();

// router.get('/', async (req, res) => {
//     try{
//         const product = await productManager.getProductList();
//         res.render('home', {product})
//     } catch (error) {
//         console.error("Error al obtener la lista de productos:", error);
//         res.status(500).send("Error al obtener la lista de productos");
//     }
// })

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
})

export default router;
