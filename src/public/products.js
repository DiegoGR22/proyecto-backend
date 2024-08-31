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
    // console.log("🚀 ~ socket.on ~ params Products:", params)

    socket.emit('requestProducts', params)
})

socket.on('products', ({ products, page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, limit, params }) => {
    updateProductContainer(products)
    controlPaginate(page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, limit, params)
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

function controlPaginate(page, totalPages, hasPrevPage, hasNextPage, prevPage, nextPage, limit, params) {
    const productControllers = document.getElementById('p-controllers');
    productControllers.innerHTML = '';

    const nav = document.createElement('nav');
    nav.classList.add('navigation')

    const ul = document.createElement('ul');
    ul.classList.add('pagination');

    const liPrev = document.createElement('li');
    liPrev.classList.add('page-item');
    
    const aPrev = document.createElement('a');
    aPrev.classList.add('page-link');
    aPrev.innerText = "Previous"
    aPrev.href = `/products?page=${prevPage}&limit=${limit}&cat=${params.cat}&status=${params.status}&sort=${params.sort}`;

    const liNext = document.createElement('li');
    liNext.classList.add('page-item');

    const aNext = document.createElement('a');
    aNext.classList.add('page-link');
    aNext.innerText = "Next"
    aNext.href = `/products?page=${nextPage}&limit=${limit}&cat=${params.cat}&status=${params.status}&sort=${params.sort}`

    if(!hasPrevPage){
        aPrev.classList.add('disabled');
    }

    if(!hasNextPage){
        aNext.classList.add('disabled');
    }

    const li1 = document.createElement('li');
    liPrev.classList.add('page-item');

    const a1 = document.createElement('a');
    a1.classList.add('page-link', 'disabled');
    a1.innerText = page
    a1.href = "#"

    const ulReset = document.createElement('ul');
    ulReset.classList.add('pagination', 'navigation');
    const divReset = document.createElement('div');
    const liReset = document.createElement('li');
    liReset.classList.add('page-item');
    const aReset = document.createElement('a');
    aReset.classList.add('page-link');
    aReset.innerText = "Reset filters"
    aReset.href = `/products`


    nav.appendChild(ul);
    ul.append(liPrev, li1, liNext);
    liPrev.appendChild(aPrev);
    liNext.appendChild(aNext);
    li1.appendChild(a1);

    ulReset.appendChild(divReset);
    divReset.appendChild(liReset);
    liReset.appendChild(aReset);

    productControllers.appendChild(nav);
    productControllers.appendChild(ulReset);

}

function addProductToCart(cartId, productId) {
    socket.emit('addProductToCart', { cartId, productId });
    console.log(`Producto agregado: ${productId} al carrito: ${cartId}`);
}