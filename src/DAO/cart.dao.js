import { CartModel } from "../models/cart.model.js"

export const findCartsAndPopulateDAO = async () => {
    return await CartModel.find().populate('products.product')
}

export const createCartDAO = async () => {
    const newCart = new CartModel({ products: [] });
    await newCart.save();
    return newCart;
}

export const findCartByIdAndPopulateDAO = async (cid) => {
    return await CartModel.findById(cid).populate('products.product')
}

export const updateCartDAO = async (cid, updatedCart) => {
    return await CartModel.findByIdAndUpdate(cid, updatedCart, { new: true })
}

export const deleteCartDAO = async (cid) => {
    return await CartModel.findByIdAndDelete(cid)
}

export const findCartByIdDAO = async (cid) => {
    return await CartModel.findById(cid)
}

export const updateExistingProductQuantityOnCartDAO = async (cid, pid) => {
    return await CartModel.findOneAndUpdate(
        { _id: cid, 'products.product': pid },
        { $inc: { 'products.$.quantity': 1 } },
        { new: true }
    );
}

export const addProductOnCartDAO = async (cid, pid) => {
    return await CartModel.findByIdAndUpdate(
        cid,
        { $push: { products: { product: pid, quantity: 1 } } },
        { new: true }
    );
}

export const deleteProductOnCartDAO = async (cid, pid) => {
    return await CartModel.findOneAndUpdate(
        {_id: cid},
        {$pull: {products: { product: pid } } },
        {new: true}
    );
}

export const updateProductQuantityOnCart = async (cid, pid) => {
    return await CartModel.findOneAndUpdate(
        { _id: cid, 'products.product': pid },
        { $inc: { 'products.$.quantity': quantity } },
        {new: true}
    );
}

export const assignCartToUserDAO = async (user, cartId) => {
    user.cart = cartId;
    await user.save();
    return user
}