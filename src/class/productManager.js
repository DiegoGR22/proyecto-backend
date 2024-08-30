import { ProductModel } from '../models/product.model.js';

class ProductManager {
    // constructor(path){
    //     this.path = path;
    // }

    async getProducts({ page = 1, limit = 10, cat = "", status = "", sort = "desc" }) {
        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            lean: true
        };
    
        const prodAggreg = ProductModel.aggregate([
            {
                $match: cat ? { category: cat } : {}
            },
            {
                $match: status === "true" ? { status: true } : status === "false" ? { status: false } : {}
            },
            {
                $sort: sort === "asc" ? { price: 1 } : { price: -1 }
            }
        ]);
    
        const products = await ProductModel.aggregatePaginate(prodAggreg, options);
        // console.log("🚀 ~ ProductManager ~ getProducts ~ products:", products)

        // return ProductModel.aggregatePaginate(prodAggreg, options);
        return products;
    }
}

export default ProductManager