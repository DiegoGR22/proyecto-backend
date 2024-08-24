const socket = io();

socket.on('connect', () => {
    console.log("Connected on Products", socket.id)
})

socket.on('products', (products) => {
    const productContainer = document.getElementById('p-container');
    productContainer.innerHTML = '';

    products.forEach(product => {
        
        const div = document.createElement('div');
        div.classList.add('product-div');

        const li = document.createElement('li');
        
        const title = document.createElement('h2');
        title.innerHTML = product.title;

        const description = document.createElement('p');
        description.innerHTML = product.description;

        const price = document.createElement('p');
        price.innerHTML = `Precio: ${product.price}`;

        const stock = document.createElement('p');
        stock.innerHTML = `Stock: ${product.stock}`;

        const category = document.createElement('p');
        category.innerHTML = `Categoría: ${product.category}`;

        const btnAdd = document.createElement('button');
        btnAdd.innerHTML = 'Add';
        btnAdd.classList.add("btn-add")
        btnAdd.onclick = () => addProductToCart(product.id);

        div.appendChild(li);
        li.appendChild(title);
        li.appendChild(description);
        li.appendChild(price);
        li.appendChild(stock);
        li.appendChild(category);
        li.appendChild(btnAdd);

        productContainer.appendChild(div);
    });
});

// function addProductToCart(carritoId, productId) {
//     socket.emit('addProductToCart', carritoId, productId);
//     console.log("Producto agregado: " + productId + "al carrito: " + carritoId);
// }