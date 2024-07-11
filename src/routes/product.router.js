import { Router } from "express";
import ProductManager from '../class/productManager.js';
import { __dirname } from '../utils.js';

const router = Router();

const productManager = new ProductManager(__dirname + '/data/product.json');

router.post('/', async (req, res) => {
    // console.log("Entro en el post");

    await productManager.addProduct(); 

    res.status(201).json({ message: 'Añadido!' });
})

router.get('/', async (req, res) => {

    const productList = await productManager.getProductList(); 

    res.status(200).json({ message: productList });
})

router.get('/:pid', async (req, res) => {
    const { pid } = req.params

    const productFind = await productManager.getProductById(pid);

    res.status(201).json({ message: productFind });
})

router.put('/:pid', async (req, res) => {
    const { pid } = req.params
    const updatedProduct = req.body

    try {
        const productUpdate = await productManager.updateProductById(pid, updatedProduct);

        if (productUpdate === null) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.status(200).json({ message: 'Producto actualizado!', productUpdate });
        }
    } catch (error) {
        // Manejo de errores generales
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
});

router.delete('/:pid', async (req, res) => {
    const { pid } = req.params

    // const productFind = await productManager.deleteProductById(pid);

    // res.status(201).json({ message: 'Producto eliminado correctamente' });

    try {
        const productDelete = await productManager.deleteProductById(pid);

        if (productDelete === null) {
            res.status(404).json({ message: 'Producto no encontrado' });
        } else {
            res.status(200).json({ message: 'Producto eliminado!', productDelete });
        }
    } catch (error) {
        // Manejo de errores generales
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el producto' });
    }
})

export default router