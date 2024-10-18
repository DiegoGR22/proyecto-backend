function renderCart(cart) {
    // Verificar el objeto cart en la consola
    console.log(cart);

    const pageContainer = document.getElementById("pageContainer");

    const container = document.getElementById("cartContainer");
    container.innerHTML = ""; // Limpiar el contenedor

    cart.products.forEach((product) => {
        product.isOverStock = product.quantity >= product.product.stock;

        const productHTML = `
            <div class="cartProduct ${product.isOverStock ? "overStock" : ""}">
                <li>
                    <h5>Title: ${product.product.title}</h5>
                    ${
                        product.isOverStock
                            ? `
                        <p>Quantity: ${product.quantity}</p>
                        <b>Not enough stock available</b>
                        <p>Stock: ${product.product.stock}</p>
                        <p>Total: ${product.quantity * product.product.price}</p>
                        `
                        : `
                        <p>Quantity: ${product.quantity}</p>
                        <p>Stock: ${product.product.stock}</p>
                        <p>Total: ${product.quantity * product.product.price}</p>
                        `
                    }
                </li>
            </div>
        `;
        container.innerHTML += productHTML;
    });

    const button = document.createElement("button");
    button.innerText = "Purchase";
    button.classList.add("btn", "btn-dark")
    button.addEventListener("click", async () => {
        pageContainer.innerHTML = "Processing purchase...";
        
        setTimeout(async () => {
            // Filtrar los productos que no están en isOverStock
            const availableProducts = cart.products.filter(
                (product) => !product.isOverStock
            );

            // Actualizar el carrito original eliminando los productos disponibles
            cart.products = cart.products.filter(
                (product) => product.isOverStock
            );

            // Enviar una solicitud al servidor para actualizar el carrito
            try {
                const response = await fetch(`/api/carts/${cart._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ products: cart.products })
                });

                if (!response.ok) {
                    throw new Error('Failed to update cart');
                }
            } catch (error) {
                console.error('Error:', error);
            }

            // Generar el HTML para los productos disponibles
            let productsHTML = "";
            availableProducts.forEach((product) => {
                productsHTML += `
                    <div class="cartProduct">
                        <li>
                            <h5>Title: ${product.product.title}</h5>
                            <p>Quantity: ${product.quantity}</p>
                            <p>Stock: ${product.product.stock}</p>
                            <p>Total: ${product.quantity * product.product.price}</p>
                        </li>
                    </div>
                `;
            });

            let total = 0;
            availableProducts.forEach((product) => {
                total += product.quantity * product.product.price;
            });

            // Actualizar el contenedor pageContainer con los productos disponibles
            pageContainer.innerHTML = productsHTML || "No products available for purchase.";
            pageContainer.innerHTML += `<p>Total: ${total}</p>`;
        }, 2000);
    });

    pageContainer.appendChild(button);
}

document.addEventListener("DOMContentLoaded", () => {
    renderCart(cart);
});
