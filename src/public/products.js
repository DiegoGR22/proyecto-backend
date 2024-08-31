const socket = io();

socket.on('connect', () => {
    console.log("Connected on Products", socket.id)

    const urlParams = new URLSearchParams(window.location.search);
    const params = {
        page: urlParams.get('page') || 1,
        limit: urlParams.get('limit') || 10,
        cat: urlParams.get('cat') || "",
        status: urlParams.get('status') || "",
        sort: urlParams.get('sort') || "desc",
    }
    console.log("🚀 ~ socket.on ~ params Products:", params)

    socket.emit('requestProducts', params)
})

socket.on('products', ({ products }) => {
    console.log("🚀 ~ socket.on ~ received products Products:", products)
    updateProductContainer(products)
});

function updateProductContainer(products) {
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
        const pid = product._id.toString();
        btnAdd.onclick = () => addProductToCart("66d13c0ee3e44f70aa5b8e22", pid);

        div.appendChild(li);
        li.appendChild(title);
        li.appendChild(description);
        li.appendChild(price);
        li.appendChild(stock);
        li.appendChild(category);
        li.appendChild(btnAdd);

        productContainer.appendChild(div);
    })
};

function addProductToCart(cartId, productId) {
    socket.emit('addProductToCart', { cartId, productId });
    console.log(`Producto agregado: ${productId} al carrito: ${cartId}`);
}