import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import ProductRouter, { productManager } from './routes/product.router.js';
import CartRouter, { cartManager } from './routes/cart.router.js';
import ViewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io'
import mongoose from 'mongoose';
import 'dotenv/config';
import { ProductModel } from './models/product.model.js';

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
    // console.log("Server listening on")
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

    // socket.on('addProductToCart', async (cartId ,productId) => {
        
    //     try {
    //         await cartManager.addProductOnCart(cartId, productId);
    //         const products = await productManager.getProductList();
    //         io.emit('products', products);
    //     } catch(err) {
    //         console.error("Error al agregar el producto al carrito", err);
    //     }
    // })
})
