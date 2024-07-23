import express from 'express';
import handlebars from 'express-handlebars';
import { __dirname } from './utils.js';
import ProductRouter from './routes/product.router.js';
import CartRouter from './routes/cart.router.js';
import ViewsRouter from './routes/views.routes.js';
import { Server } from 'socket.io'

const app = express();
const PORT = 8080 || 3000;

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
    console.log("Server listening on")
});

const io = new Server(httpServer);

io.on('connection', (socket) => {
    console.log("New connection established")
})