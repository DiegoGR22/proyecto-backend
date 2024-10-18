import express, { json } from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import ProductRouter from './routes/api/product.router.js';
import Product from './DAO/product.dao.js';
import CartRouter from './routes/api/cart.router.js';
import ViewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io'
import mongoose, { mongo } from 'mongoose';
import { ProductModel } from './models/product.model.js';
import { CartModel } from './models/cart.model.js';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import UserRouter from './routes/api/user.routes.js'
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import config from './config/config.js';
import PurchaseRouter from './routes/api/purchase.router.js'

const app = express();
const PORT = config.port || 3000;
const mongoUri = config.mongoUri;

app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    },
    helpers: {
        json: (context) => JSON.stringify(context)
    }
}));
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(cookieParser());
app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoUri,
        // ttl: 15
    }),
    secret: 'abc123',
    resave: false,
    saveUninitialized: false
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use('/', ViewsRouter);
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);
app.use('/api/session', UserRouter);
app.use('/api/purchase', PurchaseRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});

mongoose.connect(mongoUri, {
    dbName: 'proy-back'
}) .then(() => {
    console.log("Database connected successfully")
})

const io = new Server(httpServer);
const product = new Product()

io.on('connection', async (socket) => {
    console.log("New connection established", socket.id)

    socket.on('requestProducts', async (params) => {
        try {
            // console.log("🚀 ~ socket.on ~ params:", params)
            const { page = 1, limit = 10, cat = "", status = "", sort = "desc" } = params;
            const products = await product.productManager.getProducts({ page, limit, cat, status, sort });

            socket.emit('products', {
                products: products.docs,
                page: products.page,
                totalPages: products.totalPages,
                limit: products.limit,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                params
            })
            socket.emit('realTime', {
                products: products.docs
            })

        } catch (error) {
            console.error("Error para obtener los productos paginados", error);
        }
    })

    socket.on('newProduct', async (product) => {
        try {
            await ProductModel.create(product);
            const products = await ProductModel.find()
            io.emit('realTime', {products: products});
            io.emit('products', {products: products});
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
            // Obtener todos los carritos que contienen el producto
            const carts = await CartModel.find({ 'products.product': productId });

            // Actualizar cada carrito para eliminar el producto
            for (const cart of carts) {
                await CartModel.findByIdAndUpdate(
                    cart._id,
                    { $pull: { products: { product: productId } } }
                );
            }

            const products = await ProductModel.find().lean();
            io.emit('realTime', {products: products});
            io.emit('products', {products: products});
        } catch(err) {
            console.error("Error al eliminar el producto", err);
        }
    })

    socket.on('addProductToCart', async ({cartId, productId}) => {
        // console.log(cartId)
        // console.log(productId)
        try {
            const product = await ProductModel.findById(productId).lean();
            if (!product) {
                return console.error('Product not found');
            } 
    
            const cart = await CartModel.findById(cartId);
            if (!cart) {
                return console.error('Cart not found');
            }

            // Intentar actualizar la cantidad del producto existente
            const updatedCart = await CartModel.findOneAndUpdate(
                { _id: cartId, 'products.product': productId },
                { $inc: { 'products.$.quantity': 1 } },
                { new: true }
            );

            // Si el producto no se encuentra en el carrito, agregarlo
            if (!updatedCart) {
                const cartUpdate = await CartModel.findByIdAndUpdate(
                    cartId,
                    { $push: { products: { product: productId, quantity: 1 } } },
                    { new: true }
                );

                return console.log('Product added to cart')
            }

            return console.log('Quantity updated successfully');
    
        } catch (error) {
            console.error('Error adding product to cart');
        }
    })
})
