// Shopping Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart state
    let cart = JSON.parse(localStorage.getItem('gamerGonzoCart')) || [];
    updateCartCount();

    // Add event listeners to all "Add To Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product information from the parent card
            const card = this.closest('.product-card');
            const productTitle = card.querySelector('.product-title').textContent;
            const productPrice = card.querySelector('.new-price').textContent;
            const productImage = card.querySelector('img').src;
            
            // Create product object
            const product = {
                id: Date.now(), // Unique ID based on timestamp
                title: productTitle,
                price: productPrice.replace('Rs. ', '').trim(),
                image: productImage,
                quantity: 1
            };
            
            // Check if product is already in cart
            const existingProductIndex = cart.findIndex(item => item.title === product.title);
            
            if (existingProductIndex > -1) {
                // Increment quantity if product already exists
                cart[existingProductIndex].quantity += 1;
                showNotification(`Added another ${productTitle} to cart`);
            } else {
                // Add new product to cart
                cart.push(product);
                showNotification(`${productTitle} added to cart`);
            }
            
            // Save cart to localStorage
            localStorage.setItem('gamerGonzoCart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show cart panel
            toggleCartPanel(true);
        });
    });
    
    // Function to update cart count display
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }
    
    // Initialize cart panel
    // Note: The cart panel HTML is now directly in the HTML file
    
    // Add click event to cart icon to toggle cart panel
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCartPanel();
        });
    }
    
    // Add event listeners to cart panel buttons
    document.getElementById('close-cart').addEventListener('click', function() {
        toggleCartPanel(false);
    });
    
    document.getElementById('checkout-btn').addEventListener('click', function() {
        alert('Proceeding to checkout...');
        // Add checkout logic here
    });
    
    document.getElementById('clear-cart-btn').addEventListener('click', function() {
        if(confirm('Are you sure you want to clear your cart?')) {
            cart = [];
            localStorage.setItem('gamerGonzoCart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
            showNotification('Cart cleared');
        }
    });
    
    // Initial update of cart display
    updateCartDisplay();
    
    // Function to toggle cart panel visibility
    function toggleCartPanel(forceShow) {
        const cartPanel = document.getElementById('cart-panel');
        if (cartPanel) {
            if (forceShow === true) {
                cartPanel.classList.add('open');
            } else if (forceShow === false) {
                cartPanel.classList.remove('open');
            } else {
                cartPanel.classList.toggle('open');
            }
            
            if (cartPanel.classList.contains('open')) {
                updateCartDisplay();
            }
        }
    }
    
    // Function to update cart display
    function updateCartDisplay() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartTotalElement = document.getElementById('cart-total-amount');
        
        if (cartItemsContainer && cartTotalElement) {
            // Clear existing items
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
                cartTotalElement.textContent = 'Rs. 0';
                return;
            }
            
            // Calculate total
            let total = 0;
            
            // Add items to cart display
            cart.forEach(item => {
                const itemTotal = parseFloat(item.price.replace(/,/g, '')) * item.quantity;
                total += itemTotal;
                
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-details">
                        <h4>${item.title}</h4>
                        <p>Rs. ${item.price}</p>
                        <div class="quantity-controls">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Update total
            cartTotalElement.textContent = `Rs. ${total.toLocaleString()}`;
            
            // Add event listeners for quantity buttons and remove buttons
            document.querySelectorAll('.quantity-btn.minus').forEach(button => {
                button.addEventListener('click', function() {
                    updateItemQuantity(this.dataset.id, -1);
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(button => {
                button.addEventListener('click', function() {
                    updateItemQuantity(this.dataset.id, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    removeItemFromCart(this.dataset.id);
                });
            });
        }
    }
    
    // Function to update item quantity
    function updateItemQuantity(itemId, change) {
        const itemIndex = cart.findIndex(item => item.id == itemId);
        
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            
            if (cart[itemIndex].quantity <= 0) {
                // Remove item if quantity is zero or less
                removeItemFromCart(itemId);
            } else {
                // Update cart display
                localStorage.setItem('gamerGonzoCart', JSON.stringify(cart));
                updateCartDisplay();
                updateCartCount();
            }
        }
    }
    
    // Function to remove item from cart
    function removeItemFromCart(itemId) {
        const itemIndex = cart.findIndex(item => item.id == itemId);
        
        if (itemIndex > -1) {
            const removedItem = cart[itemIndex];
            cart.splice(itemIndex, 1);
            localStorage.setItem('gamerGonzoCart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
            showNotification(`${removedItem.title} removed from cart`);
        }
    }
    
    // Function to show notification
    function showNotification(message) {
        // Remove any existing notification
        const existingNotification = document.querySelector('.cart-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide and remove notification after a delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
});