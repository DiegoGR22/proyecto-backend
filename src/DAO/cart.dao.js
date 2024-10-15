import { CartModel } from "../models/cart.model.js"

export default class Cart {
    findCartsAndPopulate = async () => {
        try {
            return await CartModel.find().populate('products.product')
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    createCart = async () => {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    findCartByIdAndPopulate = async (cid) => {
        try {
            return await CartModel.findById(cid).populate('products.product')
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    updateCart = async (cid, updatedCart) => {
        try {
            return await CartModel.findByIdAndUpdate(cid, updatedCart, { new: true })
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    deleteCart = async (cid) => {
        try {
            return await CartModel.findByIdAndDelete(cid)
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    findCartById = async (cid) => {
        try {
            return await CartModel.findById(cid)
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    updateExistingProductQuantityOnCart = async (cid, pid) => {
        try {
            return await CartModel.findOneAndUpdate(
                { _id: cid, 'products.product': pid },
                { $inc: { 'products.$.quantity': 1 } },
                { new: true }
            );
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    addProductOnCart = async (cid, pid) => {
        try {
            return await CartModel.findByIdAndUpdate(
                cid,
                { $push: { products: { product: pid, quantity: 1 } } },
                { new: true }
            );
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    deleteProductOnCart = async (cid, pid) => {
        try {
            return await CartModel.findOneAndUpdate(
                { _id: cid },
                { $pull: { products: { product: pid } } },
                { new: true }
            );
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    updateProductQuantityOnCart = async (cid, pid, quantity) => {
        try {
            return await CartModel.findOneAndUpdate(
                { _id: cid, 'products.product': pid },
                { $inc: { 'products.$.quantity': quantity } },
                { new: true }
            );
        } catch (error) {
            console.error(error.message)
            return null
        }
    }

    assignCartToUser = async (user, cartId) => {
        try {
            user.cart = cartId;
            await user.save();
            return user
        } catch (error) {
            console.error(error.message)
            return null
        }
    }
}