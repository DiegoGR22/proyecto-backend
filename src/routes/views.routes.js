import { Router } from 'express';
import { productManager } from '../routes/product.router.js';
import { __dirname } from '../utils.js';
import { ProductModel } from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
    res.render('home');
})

router.get('/products', async (req, res) => {

    const { page = 1, limit = 10, query = "", sort = "desc" } = req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        lean: true
    }

    try {
        const prodAggreg = ProductModel.aggregate([
            {
                $match: query ? { category: query } : {}
            },
            {
                $sort: sort === "asc" ? { price: 1 } : { price: -1 }
            }
        ])

        const result = await ProductModel.aggregatePaginate(prodAggreg, options)
            console.log("🚀 ~ router.get ~ result:", result)

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

export default router;
