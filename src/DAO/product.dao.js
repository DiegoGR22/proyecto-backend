import { ProductModel } from "../models/product.model.js";
import ProductManager from '../class/productManager.js';
import { __dirname } from '../utils.js';

export const productManager = new ProductManager(__dirname + '/data/product.json');


export const getProductsDAO = async ({ page, limit, cat, status, sort }) => {
    return await productManager.getProducts({ page, limit, cat, status, sort })
}

export const createProductDAO = async (product) => {
    return await ProductModel.create(product);
}

export const createManyProductsDAO = async (products) => {
    return await ProductModel.insertMany(products);
}

export const findProductDAO = async (pid) => {
    return await ProductModel.findById(pid);
}

export const updateProductDAO = async (pid, updatedProduct) => {
    return await ProductModel.findByIdAndUpdate(pid, updatedProduct, { new : true });
}

export const deleteProductDAO = async (pid) => {
    return await ProductModel.findByIdAndDelete(pid);
}