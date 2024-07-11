import { Router } from "express";
import CartManager from '../class/cartManager.js';
import { __dirname } from '../utils.js';

const router = Router();

const cartManager = new CartManager(__dirname + '/data/cart.json');

router.post('/', async (req, res) => {

    await cartManager.addCart(); 

    res.status(201).json({ message: 'Añadido!' });
})

router.get('/', async (req, res) => {

    const cartList = await cartManager.getCartList(); 

    res.status(200).json({ message: cartList });
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params

    const cartFind = await cartManager.getCartById(pid);

    res.status(201).json({ message: cartFind });
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const updatedCart = req.body

    try {
        const cartUpdate = await cartManager.updateCartById(pid, updatedCart);

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

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params

    try {
        const cartDelete = await cartManager.deleteCartById(pid);

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

export default router