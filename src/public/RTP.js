const socket = io();

socket.on('connect', () => {
    console.log("Connected", socket.id)
})

socket.on('realTime', (products) => {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {

        const productHTML = `
                    <div class="product-div">
                        <li>
                            <h2>${product.title}</h2>
                            <p>${product.description}</p>
                            <p>Precio: ${product.price}</p>
                            <p>Stock: ${product.stock}</p>
                            <p>Categoría: ${product.category}</p>
                            <button id="btn-delete" onclick="deleteProduct(product.id)">Eliminar</button>
                        </li>
                    </div>
                `;
                productList.innerHTML += productHTML;
    });
})

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
    
        addProduct(title, description, code, price, stock, category);
        clearForm();
    };
    
function addProduct(title, description, code, price, stock, category) {
    const data = { title, description, code, price, stock, category };
    socket.emit('newProduct', data);
}

function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('code').value = '';
    document.getElementById('price').value = '';
    document.getElementById('stock').value = '';
    document.getElementById('category').value = '';
}

// document.getElementById('btn-delete').addEventListener('click', (e) => {
//     e.preventDefault()
//     deleteProduct(product.id);
// })

// function deleteProduct(productId) {
//     socket.emit('deleteProduct', productId);
//     console.log("Producto eliminado: " + productId);
// }