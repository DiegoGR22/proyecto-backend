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
}