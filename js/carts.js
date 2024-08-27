// Función para obtener los artículos del carrito desde el almacenamiento local
function getCartItems() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Función para guardar los artículos del carrito en el almacenamiento local
function saveCartItems(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para añadir un producto al carrito
function addToCart(name, price, imgSrc) {
    const cart = getCartItems();
    const product = cart.find(item => item.name === name);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1, imgSrc });
    }
    saveCartItems(cart);
    updateCartDisplay();
    updateCartCount();

    // Mostrar una notificación con Toastify
    Toastify({
        text: `${name} ha sido añadido al carrito.`,
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        backgroundColor: "#007bff",
        stopOnFocus: true
    }).showToast();
}

// Función para actualizar la visualización del carrito
function updateCartDisplay() {
    const cartItems = getCartItems();
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;

    cartItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-content">
                <img src="${item.imgSrc}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <p class="name">${item.name}</p>
                    <p class="quantity">${item.quantity} x $${item.price.toFixed(2)} MXN</p>
                    <p class="price">Total: $${(item.quantity * item.price).toFixed(2)} MXN</p>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
        totalPrice += item.quantity * item.price;
    });

    totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)} MXN`;
}

// Función para actualizar el conteo de productos en el carrito
function updateCartCount() {
    const cartItems = getCartItems();
    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalQuantity;
    }
}

// Función para vaciar el carrito
function clearCart() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Esto eliminará todos los productos del carrito.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Solo vaciar el carrito si el usuario confirma
            localStorage.removeItem('cart');
            updateCartDisplay();
            updateCartCount();

            Toastify({
                text: 'El carrito ha sido vaciado.',
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: "#dc3545",
                stopOnFocus: true
            }).showToast();
        }
        // No hacer nada si el usuario cancela, solo asegurar que el carrito se mantenga
        else {
            updateCartDisplay(); // Esto asegura que el carrito sigue igual si se cancela
            updateCartCount(); // Actualiza el conteo del carrito para reflejar cualquier cambio
        }
    }).catch(error => {
        // Manejo de errores si necesario
    });
}

// Función para manejar el proceso de checkout
function checkout() {
    Swal.fire({
        title: '¡Gracias por tu compra!',
        text: 'Tu transacción ha sido procesada con éxito.',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Volver al inicio',
        cancelButtonText: 'Cerrar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Vaciar el carrito y redirigir al usuario a la página de inicio
            localStorage.removeItem('cart');
            updateCartDisplay();
            updateCartCount();
            window.location.href = '../index.html'; 
        }
        // Vaciar el carrito solo si se cierra el modal
        else {
            localStorage.removeItem('cart');
            updateCartDisplay();
            updateCartCount();
        }
    }).catch(error => {
        // Manejo de errores si necesario
    });
}

// Añadir eventos después de que el DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    updateCartCount(); 

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            const imgSrc = button.getAttribute('data-img');
            addToCart(name, price, imgSrc);
        });
    });

    document.getElementById('clear-cart').addEventListener('click', (event) => {
        event.preventDefault(); // Evita el comportamiento predeterminado del formulario, si aplica
        clearCart();
    });

    document.getElementById('checkout').addEventListener('click', checkout);

    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('#navbarSupportedContent');
    navbarToggler.addEventListener('click', () => {
        navbarCollapse.classList.toggle('show');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
});


