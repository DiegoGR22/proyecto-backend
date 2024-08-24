import { ProductModel } from "../models/product.model.js";

export const getProductsPagination = async () => {
    try {
        const products = await ProductModel.paginate({status: true}, {limit: 10, page: 1})
        
        console.log("🚀 ~ getProductsPagination ~ products:", products)
        
        return;
    } catch (error) {
        console.error("Error during pagination:", error);
        throw error;
    }
}