import { Router } from "express";
import ProductManager from '../class/productManager.js';
import { __dirname } from '../utils.js';
import { ProductModel } from "../models/product.model.js";

const router = Router();

export const productManager = new ProductManager(__dirname + '/data/product.json');

// router.post('/', async (req, res) => {
//     try{
//         const productData = req.body;
//         await productManager.addProduct(productData); 
//         res.status(201).json({ message: 'Añadido!' });
//     } 
//     catch(err){
//         res.status(500).json({ message: 'Error al añadir el producto', error: err.message });
//     }
// })

router.get('/fs', async (req, res) => {

    const productList = await productManager.getProductList();

    res.status(200).json({ message: productList });
})

// router.get('/', async (req, res) => {
//     try {
//         const result = await ProductModel.find();
//         res.status(200).json({ message: "Products found!", payload: result });
//     } catch (error) {
//         res.status(500).json({ message: "Products not found!" });
//     }
// });

router.get('/', async (req, res) => {
    const { page = 1, limit = 10, cat = "", status = "", sort = "desc" } = req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        lean: true
    }

    try {
        const result = await productManager.getProducts({ page, limit, cat, status, sort });

        // Crear los enlaces para la página anterior y siguiente
        const prevLink = result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&query=${query}&sort=${sort}` : null;
        const nextLink = result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&query=${query}&sort=${sort}` : null;

        // Estructura del objeto de respuesta
        const response = {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        };

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ message: "Error fetching products " })
    }
})

router.post('/', async (req, res) => {
    const product = req.body;

    try {
        const result = await ProductModel.create(product);
        res.status(201).json({ message: "Product created", payload: result });
    } catch (error) {
        res.status(500).json({ message: "Product not created!" });
    }
})

router.post('/many', async (req, res) => {
    const products = req.body;

    if (!Array.isArray(products)) {
        return res.status(400).json({ message: "Input data should be an array" })
    }

    try {
        const result = await ProductModel.insertMany(products);
        res.status(201).json({ message: "Product created", payload: result });
    } catch (error) {
        res.status(500).json({ message: "Product not created!" });
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const productFind = await productManager.getProductById(pid);

        if (!productFind) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        return res.status(200).json({ message: 'Producto encontrado', productFind });
    }
    catch (err) {
        return res.status(500).json({ message: 'Error al buscar el producto', error: err.message });
    }
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