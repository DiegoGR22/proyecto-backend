const socket = io();

socket.on('connect', () => {
    console.log("Connected on RTP", socket.id)

    const urlParams = new URLSearchParams(window.location.search);
    const params = {
        page: urlParams.get('page') || 1,
        limit: urlParams.get('limit') || 1000,
        cat: urlParams.get('cat') || "",
        status: urlParams.get('status') || "",
        sort: urlParams.get('sort') || "desc",
    }
    console.log("🚀 ~ socket.on ~ params RTP:", params)

    socket.emit('requestProducts', params)
})

socket.on('realTime', (data) => {
    console.log("🚀 ~ socket.on ~ Received data for RTP:", data);
    if (data && data.products && Array.isArray(data.products)) {
        updateProductContainer(data.products);
    } else {
        console.error("Data received for RTP is not in the expected format:", data);
    }
});

function updateProductContainer(products) {
    console.log("🚀 ~ updateProductContainer ~ products:", products)
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    if (Array.isArray(products)) {
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

            const btnDelete = document.createElement('button');
            btnDelete.innerHTML = 'Eliminar';
            btnDelete.classList.add("btn-delete")
            btnDelete.onclick = () => deleteProduct(product._id);

            div.appendChild(li);
            li.appendChild(title);
            li.appendChild(description);
            li.appendChild(price);
            li.appendChild(stock);
            li.appendChild(category);
            li.appendChild(btnDelete);

            productList.appendChild(div);
        });
    } else {
        console.error("The products parameter is not an array or is undefined");
    }
}

document.getElementById('addButton').addEventListener('click', (event) => {
    event.preventDefault();
    validateProduct();
});

function validateProduct() {
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        const code = document.getElementById('code').value.trim();
        const price = parseFloat(document.getElementById('price').value);
        const stock = parseInt(document.getElementById('stock').value);
        const category = document.getElementById('category').value.trim();
    
        let isValid = true;
        let message = '';
    
        // Validaciones
        if (!title) {
            isValid = false;
            message += 'El título es obligatorio.\n';
        }
    
        if (!description) {
            isValid = false;
            message += 'La descripción es obligatoria.\n';
        }
    
        if (!code) {
            isValid = false;
            message += 'El código es obligatorio.\n';
        }
    
        if (isNaN(price) || price <= 0) {
            isValid = false;
            message += 'El precio debe ser un número positivo.\n';
        }
    
        if (isNaN(stock) || stock < 0) {
            isValid = false;
            message += 'El stock debe ser un número no negativo.\n';
        }
    
        if (!category) {
            isValid = false;
            message += 'La categoría es obligatoria.\n';
        }
    
        if (!isValid) {
            alert(message);
            return;
        }
    

        const data = { title, description, code, price, stock, category };
        socket.emit('newProduct', data);
        clearForm();
    };

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('category').value = '';
}

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
    console.log("Producto eliminado: " + productId);
}