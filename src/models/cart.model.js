import { Schema, model } from 'mongoose'

const ProductSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',  // Referencia al modelo de productos
    },
    quantity: {
        type: Number,
        default: 1,
    },
},{_id: false})

const CartSchema = new Schema({
    products: {
        type: [ProductSchema],
        required: true,
    }
})

export const CartModel = model('carts', CartSchema)