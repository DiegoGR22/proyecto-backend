import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import ProductRouter from './routes/product.router.js';
import CartRouter from './routes/cart.router.js';
import ViewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io'
import mongoose from 'mongoose';
import 'dotenv/config';
import { ProductModel } from './models/product.model.js';
import { CartModel } from './models/cart.model.js';

const app = express();
const PORT = 8080 || 3000;
const uri = process.env.MONGODB_URI;

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));
app.use('/', ViewsRouter);
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);


const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});

mongoose.connect(uri, {
    dbName: 'proy-back'
}) .then(() => {
    console.log("Database connected successfully")
})

const io = new Server(httpServer);

io.on('connection', async (socket) => {
    console.log("New connection established", socket.id)

    try{
        const products = await ProductModel.find()
        socket.emit('home', products);
        socket.emit('products', products);
        socket.emit('realTime', products);
    } catch(err) {
        console.error("Error para obtener la productList", err);
    }

    socket.on('newProduct', async (product) => {
        try {
            await ProductModel.create(product);
            const products = await ProductModel.find()
            io.emit('realTime', products);
        } catch(err) {
            console.error("Error al agregar el producto", err);
        }
    })

    // socket.on('updateProduct', async ({id, updatedProduct}) => {
    //     await productManager.updateProductById(id, updatedProduct);
    //     io.emit('updateProducts', productManager.getProductList());
    // })

    socket.on('deleteProduct', async (productId) => {
        
        try {
            await ProductModel.findByIdAndDelete(productId);
            const products = await ProductModel.find().lean();
            io.emit('realTime', products);
        } catch(err) {
            console.error("Error al eliminar el producto", err);
        }
    })

    socket.on('addProductToCart', async ({cartId, productId}) => {
        // console.log(cartId)
        // console.log(productId)
        try {
            const product = await ProductModel.findById(productId).lean();
            // console.log("🚀 ~ socket.on ~ product:", product)
    
            if (!product) {
                return console.error('Product not found');
            } 
    
            const cart = await CartModel.findById(cartId);
            // console.log("🚀 ~ socket.on ~ cart:", cart)
    
            if (!cart) {
                return console.error('Cart not found');
            }
    
            // Asegúrate de que products es un arreglo
            const products = Array.isArray(cart.products) ? cart.products : [];
    
            // Filtra valores null y NaN del arreglo
            const validProducts = products.filter(p => p && typeof p === 'object');
            // console.log("🚀 ~ router.post ~ validProducts:", validProducts);
    
            // Verifica si hay productos válidos
            if (validProducts.length > 0) {
                console.log("Products found");
                const existingProductOnCart = validProducts.findIndex(prod => prod._id.toString() === productId)
                    // console.log("🚀 ~ router.post ~ existingProductOnCart:", existingProductOnCart)
    
                if (existingProductOnCart !== -1) {
                    const updatedProduct = validProducts.map((prod, index) => {
                        if( index === existingProductOnCart ) {
                            return { ...prod, quantity: prod.quantity += 1}
                        }
                        return prod
                    })
                    
                    const cartUpdate = await CartModel.findByIdAndUpdate(cartId, { products: updatedProduct }, { new: true });
                    return console.log("Quantity updated successfully")
                } else {
                    const cartUpdate = await CartModel.findByIdAndUpdate(cartId,{ $push: { products: product } }, { new: true });
                    return console.log('Product added to cart')
                }
    
            } else {
                console.log("No products found");
                const cartUpdate = await CartModel.findByIdAndUpdate(cartId, { products: product }, { new: true });
                return console.log('Product added to cart')
            }
    
        } catch (error) {
            console.error('Error adding product to cart');
        }
    })
})
