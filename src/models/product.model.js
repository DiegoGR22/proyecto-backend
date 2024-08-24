import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = new Schema({
        // id: generateUniqueId(),
        title: String,
        description: String,
        code: String,
        price: Number,
        status: {
            type: Boolean,
            default: true,
        },
        stock: Number,
        category: String,
        // thumbnails: Array,
})

ProductSchema.plugin(mongoosePaginate)

export const ProductModel = model('products', ProductSchema);