import { Router } from "express";
import { createManyProducts, createProduct, deleteProduct, getProductById, getProducts, updateProduct, updateProductStock } from "../../controllers/product.controller.js";

const router = Router();

router.get('/', getProducts)

router.post('/', createProduct)

router.post('/many', createManyProducts)

router.get('/:pid', getProductById)

// router.put('/:pid', updateProduct);

router.delete('/:pid', deleteProduct)

router.put('/updateStock', updateProductStock)

export default router