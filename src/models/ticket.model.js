import { Schema, model } from 'mongoose'

const TicketSchema = new Schema({
    code: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    },
    dateTime: {
        type: Date,
        default: Date.now
    },
    products: {
        type: [String],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users.email',
        required: true
    },
})

export const TicketModel = model("tickets", TicketSchema)