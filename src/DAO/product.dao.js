import { ProductModel } from "../models/product.model.js";
import ProductManager from '../class/productManager.js';
import { __dirname } from '../utils.js';

export default class Product {
    constructor() {
        this.productManager = new ProductManager(__dirname + '/data/product.json');
    }

    getProducts = async ({ page, limit, cat, status, sort }) => {
        try {
            return await this.productManager.getProducts({ page, limit, cat, status, sort });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    createProduct = async (product) => {
        try {
            return await ProductModel.create(product);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    createManyProducts = async (products) => {
        try {
            return await ProductModel.insertMany(products);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    findProduct = async (pid) => {
        try {
            return await ProductModel.findById(pid);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    updateProduct = async (pid, updatedProduct) => {
        try {
            return await ProductModel.findByIdAndUpdate(pid, updatedProduct, { new: true });
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    deleteProduct = async (pid) => {
        try {
            return await ProductModel.findByIdAndDelete(pid);
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    updateProductStock = async (product, quantity) => {
        try {
            console.log(`Attempting to update stock for product: ${product} by ${quantity}`);

        // Buscar el producto por su ObjectId
        const prod = await ProductModel.findById(product);
        console.log('Product found:', prod);  // Verifica si el producto se encuentra

        if (!prod) {
            console.log(`Product not found: ${product}`);
            return null; // Si no se encuentra el producto, retornamos null
        }

        // Verificar si hay suficiente stock
        if (prod.stock < quantity) {
            console.log(`Insufficient stock for product: ${product}. Current stock: ${prod.stock}, Quantity requested: ${quantity}`);
            throw new Error('Insufficient stock');
        }

        // Restar la cantidad del stock
        prod.stock -= quantity;
        console.log('Updated product stock:', prod.stock);  // Verifica el nuevo stock

        // Intentar guardar el producto actualizado
        const savedProduct = await prod.save();
        console.log('Product saved successfully:', savedProduct);

        return savedProduct;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }
}