import { Router } from 'express';
import { productManager } from './api/product.router.js';
import { __dirname } from '../utils.js';
import { ProductModel } from '../models/product.model.js';
import { CartModel } from '../models/cart.model.js';
import { isNotAuth, isAuth, isAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.render('home', {
            user: req.session.user
        });
    } catch (error) {
        console.error("Can not render home page", error);
        res.status(500).json({ message: "Can not render home page", details: error.message })
    }
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

router.get('/realtimeproducts', isAdmin, (req, res) => {
    res.render('realtimeproducts');
})

router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    
    try {
        // Busca el carrito por ID
        const cart = await CartModel.findById(cid).populate('products.product').lean();
        // console.log("🚀 ~ router.get ~ cart:", cart)

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Renderiza la vista de carritos pasando los datos del carrito
        res.render('carts', { cart }); // Asegúrate de tener una vista llamada 'cart.handlebars'
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart' });
    }
})

router.get('/register', isNotAuth, (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error);
    }
})

router.get('/login', isNotAuth, (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }
})

router.get('/profile', isAuth, (req, res) => {
    try {
        res.render('profile',{
            user: req.session.user
        });
    } catch (error) {
        console.log(error);
    }
})

router.get('/error', (req, res) => {
    const message = req.query.message || 'An error occurred';
    res.render('error', { message });
});

export default router;
