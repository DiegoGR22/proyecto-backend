import { Schema, model } from 'mongoose'

const ProductSchema = new Schema({
    id: Number,
    title: String,
    price: Number,
    quantity: {
        type: Number,
        default: 1,
    }
})

const CartSchema = new Schema({
    products: {
        type: [ProductSchema],
        required: true,
    }
})

export const CartModel = model('carts', CartSchema)