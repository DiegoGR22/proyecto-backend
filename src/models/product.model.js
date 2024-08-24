import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import aggregatePaginate from "mongoose-aggregate-paginate-v2"

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

ProductSchema.plugin(aggregatePaginate)
// ProductSchema.plugin(mongoosePaginate)

export const ProductModel = model('products', ProductSchema);