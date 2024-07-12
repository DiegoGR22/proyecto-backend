import fs from 'fs';
import { generateUniqueId } from '../utils.js';

const uniqueId = generateUniqueId();

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

    async addProduct(product){

        await this.getProductList();

        const newProduct = {
            id: uniqueId,
            title: 'Arroz',
            description: 'Hijo de gallina',
            code: '123',
            price: 20,
            status: true,
            stock: 10,
            category: 'abarrotes',
            thumbnails: [ 'data' ]
        }

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
}

export default ProductManager