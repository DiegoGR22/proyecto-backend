import { findCartByIdAndPopulateDAO } from "../DAO/cart.dao.js";
import { getProductsDAO } from "../DAO/product.dao.js";

export const home = async (req, res) => {
    try {
        res.render('home', {
            user: req.user
        });
    } catch (error) {
        console.error("Can not render home page", error);
        res.status(500).json({ message: "Can not render home page", details: error.message })
    }
}

export const productList = async (req, res) => {
    const { page = 1, limit = 10, cat = "", status = "", sort = "desc" } = req.query;

    try {
        const result = await getProductsDAO({ page, limit, cat, status, sort });

            res.render('products', {
                products: result.docs,
                totalPages: result.totalPages,
                currentPage: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                limit: result.limit,
                user: req.user
            })
        
    } catch (error) {
        res.status(500).json({ message: "Error fetching products "})
    }
}

export const realTimeProductList = async (req, res) => {
    res.render('realtimeproducts');
}

export const cart = async (req, res) => {
    const { cid } = req.params;
    
    try {
        // Busca el carrito por ID
        const cart = await findCartByIdAndPopulateDAO(cid);
        // console.log("🚀 ~ router.get ~ cart:", cart)

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Renderiza la vista de carritos pasando los datos del carrito
        res.render('carts', { cart }); 
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving cart', error: error.message });
    }
}

export const register = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error);
    }
}

export const userProfile = async (req, res) => {
    try {
        res.render('profile',{
            user: req.user
        });
    } catch (error) {
        console.log(error);
    }
}

export const errorPage = async (req, res) => {
    const message = req.query.message || 'An error occurred';
    res.render('error', { message });
}

export const restorePswd = async (req, res) => {
    try {
        res.render('restore-password')
    } catch (error) {
        console.log(error);
    }
}

export const currentLog = async (req, res) => {
    res.render('current', {
        user: req.user
    });
}