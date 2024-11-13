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

const TicketSchema = new Schema({
    dateTime: {
        type: Date,
        default: Date.now
    },
    products: {
        type: [ProductSchema],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    user: {
        type: String,
        required: true
    },
})

export const TicketModel = model("tickets", TicketSchema)