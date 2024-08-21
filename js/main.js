document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM completamente cargado y analizado');
    
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('Cart Items:', cartItems);

    const cartSection = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const cartCount = document.getElementById('cart-count');
    const catalog = document.querySelector('.catalog');

    if (!cartSection || !totalPriceElement || !cartCount || !catalog) {
        console.error('Uno o más elementos no se encontraron en el DOM');
        return;
    }


    function updateCart() {
        cartSection.innerHTML = '';
        let total = 0;

        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.textContent = `${item.name} - $${item.price.toFixed(2)}`;
            cartSection.appendChild(itemElement);
            total += item.price;
        });

        totalPriceElement.textContent = `Total: $${total.toFixed(2)}`;
        cartCount.textContent = cartItems.length;
    }

 
    fetch('../productos.json')
        .then(response => response.json())
        .then(products => {
            catalog.innerHTML = '';

            products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-info">
                        <h2>${product.name}</h2>
                        <p>📍Ubicación: ${product.location}</p>
                        <span>💵Venta: $${product.price.toLocaleString('es-MX')}</span>
                        <button class="btn btn-primary add-to-cart" data-name="${product.name}" data-price="${product.price}">Agregar al carrito</button>
                    </div>
                `;
                catalog.appendChild(productDiv);
            });

            
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', () => {
                    const name = button.getAttribute('data-name');
                    const price = parseFloat(button.getAttribute('data-price'));

                    cartItems.push({ name, price });
                    localStorage.setItem('cartItems', JSON.stringify(cartItems));

                    updateCart();

                    Toastify({
                        text: `${name} añadido al carrito.`,
                        duration: 3000,
                        close: true,
                        gravity: "top",
                        position: 'right',
                        backgroundColor: "#4caf50"
                    }).showToast();
                });
            });
        })
        .catch(error => console.error('Error loading products:', error));

    
    document.getElementById('checkout').addEventListener('click', () => {
        if (cartItems.length === 0) {
            Toastify({
                text: "El carrito está vacío.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: 'right',
                backgroundColor: "#f44336"
            }).showToast();
        } else {
            Toastify({
                text: "Proceso de compra finalizado.",
                duration: 3000,
                close: true,
                gravity: "top",
                position: 'right',
                backgroundColor: "#2196F3"
            }).showToast();

            localStorage.removeItem('cartItems');
            cartItems.length = 0;
            updateCart();
        }
    });

    // Vaciar carrito
    document.getElementById('clear-cart').addEventListener('click', () => {
        localStorage.removeItem('cartItems');
        cartItems.length = 0;
        updateCart();

        Toastify({
            text: "El carrito ha sido vaciado.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: 'right',
            backgroundColor: "#f44336"
        }).showToast();
    });

    
    updateCart();
});
