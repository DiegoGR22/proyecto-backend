import fs from 'fs';
import { generateUniqueId } from '../utils.js';

const uniqueId = generateUniqueId();

class CartManager {
    constructor(path){
        this.path = path;
        this.cartList = [];
    }

    async getCartById(id){
        await this.getCartList();

        return this.cartList.find(cart => cart.id === id);
    }

    async getCartList(){
        const list = await fs.promises.readFile(this.path, 'utf-8');
        this.cartList = [...JSON.parse(list).data]
        return [...this.cartList]
    }

    async addCart(cart){

        await this.getCartList();

        const newCart = {
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

        this.cartList.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify({ data: this.cartList}))
    }

    async updateCartById(id, updatedCart){
        const carts = await this.getCartList();
        const cartIndex = carts.findIndex(cart => cart.id === id);

        if(cartIndex === -1){
            return null;
        }
        carts[cartIndex] = {...carts[cartIndex], ...updatedCart};

        await fs.promises.writeFile(this.path, JSON.stringify({ data: carts }), 'utf-8');

        return carts[cartIndex]

    }

    async deleteCartById(id){
        const carts = await this.getCartList();
        const cartIndex = carts.findIndex(cart => cart.id === id);

        if(cartIndex === -1){
            return null;
        }

        const cartFiltered = carts.filter(cart => cart.id !== id);
        console.log("🚀 ~ CartManager ~ deleteCartById ~ cartFiltered:", cartFiltered)
        this.cartList = [...cartFiltered];

        await fs.promises.writeFile(this.path, JSON.stringify({ data: cartFiltered }), 'utf-8');

        return cartFiltered;
    }
}

export default CartManager