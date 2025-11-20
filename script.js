let cart = {};

function toggleMenu() {
    const nav = document.getElementById('nav');
    nav.classList.toggle('active');
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function addToCart(item, price, image) {
    if (cart[item]) {
        cart[item].quantity++;
    } else {
        cart[item] = {
            name: item,
            price: price,
            quantity: 1,
            image: image
        };
    }
    updateCart();
    showNotification(item + ' added to cart!');
}

function updateQuantity(item, change) {
    if (cart[item]) {
        cart[item].quantity += change;
        if (cart[item].quantity <= 0) {
            delete cart[item];
        }
        updateCart();
    }
}

function removeFromCart(item) {
    delete cart[item];
    updateCart();
    showNotification(item + ' removed from cart');
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    cartBadge.textContent = itemCount;
    cartTotal.textContent = '₹' + total.toLocaleString();
    
    if (itemCount === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some items to get started!</p>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cartItems.innerHTML = Object.values(cart).map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">−</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button class="remove-btn" onclick="removeFromCart('${item.name}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function checkout() {
    const itemCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
    const total = Object.values(cart).reduce((sum, item) => sum + item.price * item.quantity, 0);
    showNotification('Checkout: ' + itemCount + ' items - ₹' + total.toLocaleString());
    cart = {};
    updateCart();
    toggleCart();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    setTimeout(function () {
        notification.classList.remove('show');
    }, 3000);
}

function performSearch() {
    const input = document.getElementById('searchInput');
    const query = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.products-grid .product-card');

    if (!query) {
        cards.forEach(function (card) {
            card.style.display = '';
        });
        showNotification('Showing all products');
        return;
    }

    let found = 0;

    cards.forEach(function (card) {
        const titleEl = card.querySelector('h4');
        const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
        if (titleText.includes(query)) {
            card.style.display = '';
            found++;
        } else {
            card.style.display = 'none';
        }
    });

    if (found > 0) {
        showNotification('Showing ' + found + ' result' + (found > 1 ? 's' : '') + ' for "' + query + '"');
    } else {
        showNotification('No products found for "' + query + '"');
    }
}

document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

document.querySelectorAll('#nav a').forEach(function(link) {
    link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
        const nav = document.getElementById('nav');
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
        }
    });
});
