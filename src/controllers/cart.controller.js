import { findCartsAndPopulateDAO, findCartByIdAndPopulateDAO, updateCartDAO, deleteCartDAO, findCartByIdDAO, updateExistingProductQuantityOnCartDAO, addProductOnCartDAO, deleteProductOnCartDAO, updateProductQuantityOnCart, createCartDAO, assignCartToUserDAO } from "../DAO/cart.dao.js";
import { findProductDAO } from "../DAO/product.dao.js";
import { findUserByIdDAO } from "../DAO/user.dao.js";

export const getCarts = async (req, res) => {
    try {
        const result = await findCartsAndPopulateDAO();
        res.status(200).json({ message: "Carts found", payload: result })
    } catch (error) {
        res.status(400).json({ message: "Cart not found" })
    }
}

export const createCart = async (req, res) => {
    const userId = req.user._id; // Asumiendo que tienes autenticación y el ID del usuario está disponible en req.user

    try {
        // Busca el usuario por su ID
        const user = await findUserByIdDAO(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica si el usuario ya tiene un carrito
        if (user.cart) {
            return res.status(200).json({ message: 'Cart already exists', cartId: user.cart });
        }

        // Si el usuario no tiene un carrito, crea uno nuevo
        const newCart = await createCartDAO()

        // Asigna el ID del nuevo carrito al usuario y guarda el usuario
        await assignCartToUserDAO(user, newCart._id)

        res.status(201).json({ message: 'Cart created', cartId: newCart._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating cart' });
    }
}

export const findCartByIdAndPopulate = async (req, res) => {
    const { cid } = req.params

    try {
        const result = await findCartByIdAndPopulateDAO(cid)
        res.status(200).json({ message: "Cart found successfully", payload: result })
    } catch (error) {
        res.status(404).json({ message: "Cart not found" })
    }
}

export const updateCart = async (req, res) => {
    const { cid } = req.params
    const updatedCart = req.body
    try {
        const result = await updateCartDAO(cid, updatedCart)
        res.status(200).json({ message: "Cart updated successfully", payload: result });
    } catch (error) {
        res.status(404).json({ message: "Cart not found" });
    }
}

export const deleteCart = async (req, res) => {
    const { cid } = req.params
    try {
        const result = await deleteCartDAO(cid)
        res.status(200).json({ message: "Cart deleted", payload: result });
    } catch (error) {
        res.status(500).json({ message: "Error deleting cart" })
    }
}

export const addProductOnCart = async (req, res) => {
    const { cid, pid } = req.params;

    try {
        // Verificar si el producto existe
        const product = await findProductDAO(pid)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Verificar si el carrito existe
        const cart = await findCartByIdDAO(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        // Intentar actualizar la cantidad del producto existente
        const updatedCart = await updateExistingProductQuantityOnCartDAO(cid, pid)

        // Si el producto no se encuentra en el carrito, agregarlo
        if (!updatedCart) {
            const cartUpdate = await addProductOnCartDAO(cid, pid)

            return res.status(201).json({ message: 'Product added to cart', payload: cartUpdate });
        }

        return res.status(200).json({ message: 'Quantity updated successfully', payload: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding product to cart' });
    }
}

export const deleteProductOnCart = async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await findCartByIdDAO(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = await findProductDAO(pid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const initialProductCount = cart.products.length;

        const updatedCart = await deleteProductOnCartDAO(cid, pid);

        const finalProductCount = updatedCart.products.length;

        if(initialProductCount === finalProductCount) {
            return res.status(404).json({ message: `Product ${pid} not found in cart`, payload: updatedCart });
        } else {
            return res.status(200).json({ message: "Product removed from cart", payload: updatedCart });
        }
        
    } catch (error) {
        res.status(500).json({ message: "Error deleting product from cart" })
    }
}

export const updateProductOnCart = async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    const quantityToIncrease = parseInt(quantity, 10);
    // console.log("🚀 ~ router.put ~ quantityToIncrease:", quantityToIncrease)

    if (isNaN(quantityToIncrease)) {
        return res.status(400).json({ message: "Invalid quantity value" });
    }

    try {
        const cart = await findCartByIdDAO(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = await findProductDAO(pid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedCart = await updateProductQuantityOnCart(cid, pid);

        return res.status(200).json({ message: 'Quantity updated successfully', payload: updatedCart });
        
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity of product from cart" })
    }
}