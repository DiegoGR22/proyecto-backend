import fs from 'fs';
import { generateUniqueId } from '../utils.js';

const uniqueId = generateUniqueId();

class CartManager {
    constructor(path){
        this.path = path;
        this.cartList = [];
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

    async getCartById(id){
        await this.getCartList();

        const cart = this.cartList.find(cart => cart.id === id);
        return cart || null;
    }

    async getCartList(){
        const list = await fs.promises.readFile(this.path, 'utf-8');
        this.cartList = [...JSON.parse(list).data]
        return [...this.cartList]
    }

    async addCart(cart= { products: [] }){

        await this.getCartList();

        const newCart = {
            id: uniqueId,
            // products: [{"product": "product1", "quantity": 1}, {"product": "product2", "quantity": 2}],
            products: cart.products || []
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
        this.cartList = [...cartFiltered];

        await fs.promises.writeFile(this.path, JSON.stringify({ data: cartFiltered }), 'utf-8');

        return cartFiltered;
    }

    async addProductOnCart(cid, pid){

        const carts = await this.getCartList();
        const cartIndex = carts.findIndex(cart => cart.id === cid);

        if(cartIndex === -1){
            return null;
        }

        const cart = carts[cartIndex];
        const productIndex = cart.products.findIndex(product => product.id === pid);

        if(productIndex === -1){
            cart.products.push({ id: pid, quantity: 1 });
        } else {
            cart.products[productIndex].quantity += 1;
        }

        carts[cartIndex] = cart;

        await fs.promises.writeFile(this.path, JSON.stringify({ data: carts }), 'utf-8');

        return cart;
    }
}

export default CartManager