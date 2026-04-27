name=script.js
let cart = JSON.parse(localStorage.getItem('tooWellCart')) || [];
let currentCustomization = null;

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', updateCartCount);

// Cart Functions
function addToCart(productName, price) {
    cart.push({
        name: productName,
        price: price,
        id: Date.now()
    });
    saveCart();
    showToast(`${productName} added to cart!`);
    updateCartCount();
}

function customizeAndAdd(productName, basePrice) {
    currentCustomization = { productName, basePrice };
    document.getElementById('customText').value = '';
    document.getElementById('customColor').value = 'white';
    document.getElementById('customModal').style.display = 'block';
}

function submitCustomization() {
    const customText = document.getElementById('customText').value;
    const customColor = document.getElementById('customColor').value;
    
    if (!customText.trim()) {
        alert('Please enter customization text');
        return;
    }
    
    const cartItem = {
        name: currentCustomization.productName,
        price: currentCustomization.basePrice + 5, // Add $5 for customization
        customization: customText,
        color: customColor,
        id: Date.now()
    };
    
    cart.push(cartItem);
    saveCart();
    showToast(`${currentCustomization.productName} with "${customText}" added to cart!`);
    closeCustomModal();
    updateCartCount();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    displayCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('tooWellCart', JSON.stringify(cart));
}

function updateCartCount() {
    document.querySelector('.cart-count').textContent = cart.length;
}

function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align: center; color: #999;">Your cart is empty</p>';
        document.getElementById('cartTotal').textContent = '$0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        total += item.price;
        const customInfo = item.customization ? `<div class="cart-item-custom">✓ Customized: ${item.customization} (${item.color})</div>` : '';
        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    ${customInfo}
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
}

function openCart() {
    displayCart();
    document.getElementById('cartModal').style.display = 'block';
}

function closeCart() {
    document.getElementById('cartModal').style.display = 'none';
}

function closeCustomModal() {
    document.getElementById('customModal').style.display = 'none';
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('Thank you for your order! Proceeding to secure checkout...\n\nOrder Summary:\n' + cart.map(item => `- ${item.name}: $${item.price.toFixed(2)}`).join('\n'));
    cart = [];
    saveCart();
    updateCartCount();
    closeCart();
}

// Form Handlers
function submitForm(e) {
    e.preventDefault();
    alert('Thank you for your message! We will respond soon.');
    e.target.reset();
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const cartModal = document.getElementById('cartModal');
    const customModal = document.getElementById('customModal');
    
    if (event.target == cartModal) {
        cartModal.style.display = 'none';
    }
    if (event.target == customModal) {
        customModal.style.display = 'none';
    }
}