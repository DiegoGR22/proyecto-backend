import { Router } from "express";
import { __dirname } from '../../utils.js';
import { CartModel } from "../../models/cart.model.js";
import { ProductModel } from "../../models/product.model.js";
import { UserModel } from "../../models/user.model.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await CartModel.find().populate('products.product');
        res.status(200).json({ message: "Carts found", payload: result })
    } catch (error) {
        res.status(400).json({ message: "Cart not found" })
    }
})

// router.post('/', async (req, res) => {
//     const cart = req.body;

//     try {
//         const result = await CartModel.create(cart);
//         res.status(201).json({ message: "Cart created successfully", payload: result })
//     } catch (error) {
//         res.status(400).json({ message: "Cart not created" })
//     }
// })

router.post('/', async (req, res) => {
    const userId = req.user._id; // Asumiendo que tienes autenticación y el ID del usuario está disponible en req.user

    try {
        // Busca el usuario por su ID
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verifica si el usuario ya tiene un carrito
        if (user.cart) {
            return res.status(200).json({ message: 'Cart already exists', cartId: user.cart });
        }

        // Si el usuario no tiene un carrito, crea uno nuevo
        const newCart = new CartModel({ products: [] });
        await newCart.save();

        // Asigna el ID del nuevo carrito al usuario y guarda el usuario
        user.cart = newCart._id;
        await user.save();

        res.status(201).json({ message: 'Cart created', cartId: newCart._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating cart' });
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params

    try {
        const result = await CartModel.findById(cid).populate('products.product')
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
        // Verificar si el producto existe
        const product = await ProductModel.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        
        // Intentar actualizar la cantidad del producto existente
        const updatedCart = await CartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $inc: { 'products.$.quantity': 1 } },
            { new: true }
        );

        // Si el producto no se encuentra en el carrito, agregarlo
        if (!updatedCart) {
            const cartUpdate = await CartModel.findByIdAndUpdate(
                cid,
                { $push: { products: { product: pid, quantity: 1 } } },
                { new: true }
            );

            return res.status(201).json({ message: 'Product added to cart', payload: cartUpdate });
        }

        return res.status(200).json({ message: 'Quantity updated successfully', payload: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error adding product to cart' });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = await ProductModel.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const initialProductCount = cart.products.length;

        const updatedCart = await CartModel.findOneAndUpdate(
            {_id: cid},
            {$pull: {products: { product: pid } } },
            {new: true}
        );

        const finalProductCount = updatedCart.products.length;

        if(initialProductCount === finalProductCount) {
            return res.status(404).json({ message: `Product ${pid} not found in cart`, payload: updatedCart });
        } else {
            return res.status(200).json({ message: "Product removed from cart", payload: updatedCart });
        }
        
    } catch (error) {
        res.status(500).json({ message: "Error deleting product from cart" })
    }
})

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    const quantityToIncrease = parseInt(quantity, 10);
    // console.log("🚀 ~ router.put ~ quantityToIncrease:", quantityToIncrease)

    if (isNaN(quantityToIncrease)) {
        return res.status(400).json({ message: "Invalid quantity value" });
    }

    try {
        const cart = await CartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const product = await ProductModel.findById(pid);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updatedCart = await CartModel.findOneAndUpdate(
            { _id: cid, 'products.product': pid },
            { $inc: { 'products.$.quantity': quantity } },
            {new: true}
        );

        return res.status(200).json({ message: 'Quantity updated successfully', payload: updatedCart });
        
    } catch (error) {
        res.status(500).json({ message: "Error updating quantity of product from cart" })
    }
})


export default router