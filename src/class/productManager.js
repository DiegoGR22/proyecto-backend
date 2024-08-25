import fs from 'fs';
import { generateUniqueId } from '../utils.js';
import { ProductModel } from '../models/product.model.js';

// const uniqueId = generateUniqueId();

class ProductManager {
    constructor(path){
        this.path = path;
        this.productList = [];
        this.init();
    }

    async init(){
        try{
            await fs.promises.access(this.path, fs.constants.F_OK);
            // console.log("existe")
        }
        catch(err){
            await fs.promises.writeFile(this.path, JSON.stringify({ data: this.cartList}), 'utf-8');
            console.log("creado")
        }
    }

    async getProductById(id){
        await this.getProductList();

        const product = this.productList.find(product => product.id === id);
        return product || null;
    }

    async getProductList(){
        const list = await fs.promises.readFile(this.path, 'utf-8');
        this.productList = [...JSON.parse(list).data]
        return [...this.productList]
    }

    validateProductData(productData) {
        if (!productData.title || !productData.description || !productData.code || 
            isNaN(productData.price) || productData.price <= 0 || 
            isNaN(productData.stock) || productData.stock < 0 || !productData.category) {
            return false;
        }
        return true;
    }

    async addProduct(productData){
        // Validar datos del producto
        if (!this.validateProductData(productData)) {
            console.error("Datos inválidos")
            throw new Error('Datos del producto no válidos');
        }

        await this.getProductList();

        const newProduct = {
            // id: uniqueId,
            id: generateUniqueId(),
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: productData.status,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails
        }

        console.log("Agregando nuevo producto:", newProduct); // Log para depuración

        this.productList.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.productList}))
    }

    async updateProductById(id, updatedProduct){
        const products = await this.getProductList();
        const productIndex = products.findIndex(product => product.id === id);

        if(productIndex === -1){
            return null;
        }
        products[productIndex] = {...products[productIndex], ...updatedProduct};

        await fs.promises.writeFile(this.path, JSON.stringify({ data: products }), 'utf-8');

        return products[productIndex]

    }

    async deleteProductById(id){
        const products = await this.getProductList();
        const productIndex = products.findIndex(product => product.id === id);

        if(productIndex === -1){
            return null;
        }

        const productFiltered = products.filter(product => product.id !== id);
        this.productList = [...productFiltered];

        await fs.promises.writeFile(this.path, JSON.stringify({ data: productFiltered }), 'utf-8');

        return productFiltered;
    }

    async getProducts({ page = 1, limit = 10, cat = "", status = "", sort = "desc" }) {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            lean: true
        };
    
        const prodAggreg = ProductModel.aggregate([
            {
                $match: cat ? { category: cat } : {}
            },
            {
                $match: status === "true" ? { status: true } : status === "false" ? { status: false } : {}
            },
            {
                $sort: sort === "asc" ? { price: 1 } : { price: -1 }
            }
        ]);
    
        const products = await ProductModel.aggregatePaginate(prodAggreg, options);
        console.log("🚀 ~ ProductManager ~ getProducts ~ products:", products)

        // return ProductModel.aggregatePaginate(prodAggreg, options);
        return products;
    }
}

export default ProductManager