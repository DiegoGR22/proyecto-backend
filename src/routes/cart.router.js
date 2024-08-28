import { Router } from "express";
import { __dirname } from '../utils.js';
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await CartModel.find();
        res.status(200).json({ message: "Carts found", payload: result })
    } catch (error) {
        res.status(400).json({ message: "Cart not found" })
    }
})

router.post('/', async (req, res) => {
    const cart = req.body;

    try {
        const result = await CartModel.create(cart);
        res.status(201).json({ message: "Cart created successfully", payload: result })
    } catch (error) {
        res.status(400).json({ message: "Cart not created" })
    }
})

router.get('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const result = await CartModel.findById(cid)
        res.status(200).json({ message: "Cart found successfully", payload: result })
    } catch (error) {
        res.status(404).json({ message: "Cart not found" })
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const updatedCart = req.body
    try {
        const result = await CartModel.findByIdAndUpdate(cid, updatedCart, { new: true })
        res.status(200).json({ message: "Cart updated successfully", payload: result });
    } catch (error) {
        res.status(404).json({ message: "Cart not found" });
    }
})

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        const result = await CartModel.findByIdAndDelete(cid)
        res.status(200).json({ message: "Cart deleted", payload: result });
    } catch (error) {
        res.status(500).json({ message: "Error deleting cart" })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const product = await ProductModel.findById(pid).lean();

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        } 

        const cart = await CartModel.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Asegúrate de que products es un arreglo
        const products = Array.isArray(cart.products) ? cart.products : [];

        // Filtra valores null y NaN del arreglo
        const validProducts = products.filter(p => p && typeof p === 'object');
        console.log("🚀 ~ router.post ~ validProducts:", validProducts);

        // Verifica si hay productos válidos
        if (validProducts.length > 0) {
            console.log("Products found");
            const existingProductOnCart = validProducts.findIndex(prod => prod._id.toString() === pid)
                console.log("🚀 ~ router.post ~ existingProductOnCart:", existingProductOnCart)

            if (existingProductOnCart !== -1) {
                const updatedProduct = validProducts.map((prod, index) => {
                    if( index === existingProductOnCart ) {
                        return { ...prod, quantity: prod.quantity += 1}
                    }
                    return prod
                })
                
                const cartUpdate = await CartModel.findByIdAndUpdate(cid, { products: updatedProduct }, { new: true });
                return res.status(201).json({ message: "Quantity updated successfully", payload: cartUpdate })
            } else {
                const cartUpdate = await CartModel.findByIdAndUpdate(cid,{ $push: { products: product } }, { new: true });
                return res.status(201).json({ message: 'Product added to cart', payload: cartUpdate });
            }

        } else {
            console.log("No products found");
            const cartUpdate = await CartModel.findByIdAndUpdate(cid, { products: product }, { new: true });
            return res.status(201).json({ message: 'Product added to cart', payload: cartUpdate });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding product to cart' });
    }
})


export default router