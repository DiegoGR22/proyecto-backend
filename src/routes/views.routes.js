import { Router } from 'express';
import { productManager } from '../routes/product.router.js';
import { __dirname } from '../utils.js';
import { ProductModel } from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    res.render('home');
})

router.get('/products', async (req, res) => {

    const { page = 1, limit = 10, cat = "", status = "", sort = "desc" } = req.query;

    try {
        const result = await productManager.getProducts({ page, limit, cat, status, sort });

            res.render('products', {
                products: result.docs,
                totalPages: result.totalPages,
                currentPage: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                limit: result.limit
            })
        
    } catch (error) {
        res.status(500).json({ message: "Error fetching products "})
    }

})

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
})

router.get('/carts/:cid', async (req, res) => {
    res.render('carts');
})

export default router;
