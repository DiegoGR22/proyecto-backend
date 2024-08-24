import { Router } from "express";
import CartManager from '../class/cartManager.js';
import ProductManager from "../class/productManager.js";
import { __dirname } from '../utils.js';

const router = Router();

export const cartManager = new CartManager(__dirname + '/data/cart.json');
const productManager = new ProductManager(__dirname + '/data/product.json');

router.post('/', async (req, res) => {

    await cartManager.addCart(); 

    res.status(201).json({ message: 'Añadido!' });
})

router.get('/', async (req, res) => {

    const cartList = await cartManager.getCartList(); 

    res.status(200).json({ message: cartList });
})

router.get('/:cid', async (req, res) => {
    try{
        const { cid } = req.params
        const cartFind = await cartManager.getCartById(cid);

        if(!cartFind){
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        return res.status(200).json({ message: 'Carrito encontrado', cartFind });
    }
    catch(err){
        return res.status(500).json({ message: 'Error al buscar el carrito', error: err.message });
    }

})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const updatedCart = req.body

    try {
        const cartUpdate = await cartManager.updateCartById(cid, updatedCart);

        if (cartUpdate === null) {
            res.status(404).json({ message: 'Carrito no encontrado' });
        } else {
            res.status(200).json({ message: 'Carrito actualizado!', cartUpdate });
        }
    } catch (error) {
        // Manejo de errores generales
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el carrito' });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const cartDelete = await cartManager.deleteCartById(cid);

        if (cartDelete === null) {
            res.status(404).json({ message: 'Carrito no encontrado' });
        } else {
            res.status(200).json({ message: 'Carrito eliminado!', cartDelete });
        }
    } catch (error) {
        // Manejo de errores generales
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el carrito' });
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const product = await productManager.getProductById(pid);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        const cartUpdate = await cartManager.addProductOnCart(cid, pid);

        if (cartUpdate === null) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        return res.status(201).json({ message: 'Producto añadido al carrito!', cart: cartUpdate });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al añadir el producto al carrito' });
    }
})

export default router