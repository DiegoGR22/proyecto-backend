import express from 'express';
import ProductRouter from './routes/product.router.js';
import CartRouter from './routes/cart.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/products', ProductRouter);
app.use('/api/carts', CartRouter);



app.listen(8080, () => {
    console.log("Server listening on")
});