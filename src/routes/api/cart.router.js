import { Router } from "express";
import { addProductOnCart, createCart, deleteCart, deleteProductOnCart, findCartByIdAndPopulate, getCarts, updateCart, updateProductOnCart } from "../../controllers/cart.controller.js";

const router = Router();

router.get('/', getCarts)

router.post('/', createCart);

router.get('/:cid', findCartByIdAndPopulate)

router.put('/:cid', updateCart)

router.delete('/:cid', deleteCart)

router.post('/:cid/products/:pid', addProductOnCart);

router.delete('/:cid/products/:pid', deleteProductOnCart)

router.put('/:cid/products/:pid', updateProductOnCart)


export default router