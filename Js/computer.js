// Product data
var products = [
    {
        id: 1,
        name: 'LG ULTRAGEAR - 27GP850',
        category: 'Monitors',
        originalPrice: 32799,
        currentPrice: 24499,
        preOwned: true,
        image: 'https://example.com/monitor.jpg'
    },
    {
        id: 2,
        name: 'CORSAIR VENGEANCE RGB PRO 1X8GB DDR4',
        category: 'Memory (RAM)',
        originalPrice: 2999,
        currentPrice: 2399,
        preOwned: true,
        image: 'https://example.com/ram.jpg'
    },
    {
        id: 3,
        name: 'RYZEN 5 3600X - PC COMPONENTS',
        category: 'Processors',
        originalPrice: 8599,
        currentPrice: 6799,
        preOwned: true,
        image: 'https://example.com/processor.jpg'
    },
    {
        id: 4,
        name: 'ASUS RTX 2070 8GB DUAL',
        category: 'Graphic Cards',
        originalPrice: 22399,
        currentPrice: 18399,
        preOwned: true,
        image: 'https://example.com/graphics-card.jpg'
    }
    // Add more products here
];

// Favorites
var favorites = [];

// Render products
function renderProducts(filteredProducts) {
    // If no products are provided, use all products
    if (!filteredProducts) {
        filteredProducts = products;
    }
    
    var grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    // Loop through each product
    for (var i = 0; i < filteredProducts.length; i++) {
        var product = filteredProducts[i];
        
        // Create card element
        var card = document.createElement('div');
        card.className = 'product-card';
        
        // Pre-owned tag HTML
        var preOwnedHTML = '';
        if (product.preOwned) {
            preOwnedHTML = '<span class="pre-owned-tag">Pre Owned</span>';
        }
        
        // Build HTML for the card
        card.innerHTML = 
            '<img src="' + product.image + '" alt="' + product.name + '" class="product-image">' +
            preOwnedHTML +
            '<button class="favorite-btn" onclick="toggleFavorite(' + product.id + ')">' +
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
                    '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
                '</svg>' +
            '</button>' +
            '<div class="product-details">' +
                '<div class="product-name">' + product.name + '</div>' +
                '<div class="product-category">' + product.category + '</div>' +
                '<div class="price-section">' +
                    '<span class="original-price">₹' + product.originalPrice.toLocaleString() + '</span>' +
                    '<span class="current-price">₹' + product.currentPrice.toLocaleString() + '</span>' +
                '</div>' +
                '<button class="add-to-cart-btn">Add to Cart</button>' +
            '</div>';
            
        grid.appendChild(card);
    }
}

// Toggle favorite
function toggleFavorite(productId) {
    var favoriteBtn = document.querySelector('.favorite-btn[onclick="toggleFavorite(' + productId + ')"]');
    
    // Check if product is already in favorites
    var isAlreadyFavorite = false;
    for (var i = 0; i < favorites.length; i++) {
        if (favorites[i] === productId) {
            isAlreadyFavorite = true;
            break;
        }
    }
    
    if (isAlreadyFavorite) {
        // Remove from favorites
        var newFavorites = [];
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i] !== productId) {
                newFavorites.push(favorites[i]);
            }
        }
        favorites = newFavorites;
        favoriteBtn.classList.remove('active');
    } else {
        // Add to favorites
        favorites.push(productId);
        favoriteBtn.classList.add('active');
    }
}

// Sort products
function sortProducts(method) {
    var sortedProducts = [];
    
    // Create a copy of the products array
    for (var i = 0; i < products.length; i++) {
        sortedProducts.push(products[i]);
    }
    
    if (method === 'low-to-high') {
        // Sort by price low to high
        sortedProducts.sort(function(a, b) {
            return a.currentPrice - b.currentPrice;
        });
    } 
    else if (method === 'high-to-low') {
        // Sort by price high to low
        sortedProducts.sort(function(a, b) {
            return b.currentPrice - a.currentPrice;
        });
    }
    // Default: no sorting (original order)
    
    renderProducts(sortedProducts);
}

// Filter modal functions
function openFilterModal() {
    document.getElementById('filterModal').style.display = 'flex';
}

function closeFilterModal() {
    document.getElementById('filterModal').style.display = 'none';
}

// Apply filters
function applyFilters() {
    var checkboxes = document.querySelectorAll('input[name="category"]:checked');
    var selectedCategories = [];
    
    // Get all checked categories
    for (var i = 0; i < checkboxes.length; i++) {
        selectedCategories.push(checkboxes[i].value);
    }

    var filteredProducts = [];
    
    if (selectedCategories.length > 0) {
        // Filter products by selected categories
        for (var i = 0; i < products.length; i++) {
            for (var j = 0; j < selectedCategories.length; j++) {
                if (products[i].category === selectedCategories[j]) {
                    filteredProducts.push(products[i]);
                    break;
                }
            }
        }
    } else {
        // No filters selected, show all products
        filteredProducts = products;
    }

    renderProducts(filteredProducts);
    closeFilterModal();
}

// Initialize the page by displaying all products
window.onload = function() {
    renderProducts();
};

// Cart array to store items
let cart = [];
let cartCount = 0;
let cartTotal = 0;

// DOM Ready function
document.addEventListener('DOMContentLoaded', function() {
  // Add click event to all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Get product info from the card
      const card = this.closest('.product-card');
      const productName = card.querySelector('.product-title').textContent;
      const productPrice = parseFloat(card.querySelector('.new-price').textContent.replace('Rs. ', '').replace(',', ''));
      const productImage = card.querySelector('img').src;
      
      // Add item to cart
      addItemToCart(productName, productPrice, productImage);
      
      // Show notification
      showNotification(`${productName} added to cart`);
    });
  });
  
  // Cart panel toggle
  const cartIcon = document.querySelector('.cart-icon');
  if (cartIcon) {
    cartIcon.addEventListener('click', function(e) {
      e.preventDefault();
      document.getElementById('cart-panel').classList.toggle('show');
    });
  }
  
  // Close cart button
  const closeCartBtn = document.getElementById('close-cart');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', function() {
      document.getElementById('cart-panel').classList.remove('show');
    });
  }
  
  // Clear cart button
  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
  
  // Add event listeners for the favorites buttons
  setupFavoritesButtons();
  
  // Load cart from localStorage on page load
  loadCart();
});

// Function to add an item to the cart
function addItemToCart(name, price, image) {
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.name === name);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  // Update cart
  updateCart();
}

// Function to update cart UI and localStorage
function updateCart() {
  const cartItemsContainer = document.querySelector('.cart-items');
  cartItemsContainer.innerHTML = '';
  
  cartCount = 0;
  cartTotal = 0;
  
  // If cart is empty
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    document.getElementById('cart-total-amount').textContent = 'Rs. 0';
    document.querySelector('.cart-count').textContent = '0';
    saveCart();
    return;
  }
  
  // Loop through cart items
  cart.forEach((item, index) => {
    cartCount += item.quantity;
    cartTotal += item.price * item.quantity;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <div class="cart-item-price">Rs. ${item.price.toLocaleString()}</div>
        <div class="cart-item-quantity">
          <button class="quantity-decrease" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-increase" data-index="${index}">+</button>
        </div>
      </div>
      <button class="remove-item" data-index="${index}">×</button>
    `;
    
    cartItemsContainer.appendChild(cartItem);
  });
  
  // Update total and cart count
  document.getElementById('cart-total-amount').textContent = `Rs. ${cartTotal.toLocaleString()}`;
  document.querySelector('.cart-count').textContent = cartCount.toString();
  
  // Add event listeners to quantity buttons
  const decreaseButtons = document.querySelectorAll('.quantity-decrease');
  const increaseButtons = document.querySelectorAll('.quantity-increase');
  const removeButtons = document.querySelectorAll('.remove-item');
  
  decreaseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      decreaseQuantity(index);
    });
  });
  
  increaseButtons.forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      increaseQuantity(index);
    });
  });
  
  removeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      removeItem(index);
    });
  });
  
  // Save cart to localStorage
  saveCart();
}

// Function to decrease quantity
function decreaseQuantity(index) {
  if (cart[index].quantity > 1) {
    cart[index].quantity--;
  } else {
    removeItem(index);
  }
  updateCart();
}

// Function to increase quantity
function increaseQuantity(index) {
  cart[index].quantity++;
  updateCart();
}

// Function to remove item
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
  showNotification('Item removed from cart');
}

// Function to clear the cart
function clearCart() {
  cart = [];
  updateCart();
  showNotification('Cart cleared');
}

// Function to save cart to localStorage
function saveCart() {
  localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

// Function to load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('shoppingCart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

// Function to show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.add('hide');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

// FAVORITES FUNCTIONALITY

// Function to setup favorites buttons
function setupFavoritesButtons() {
  const saveButton = document.getElementById('save-favorites-btn');
  const applyButton = document.getElementById('apply-favorites-btn');
  
  if (saveButton) {
    saveButton.addEventListener('click', saveAsFavorites);
  }
  
  if (applyButton) {
    applyButton.addEventListener('click', applyFavorites);
  }
}

// Function to save current cart as favorites
function saveAsFavorites() {
  if (cart.length === 0) {
    showNotification('Your cart is empty. Add items to save as favorites.');
    return;
  }
  
  localStorage.setItem('favorites', JSON.stringify(cart));
  showNotification('Your current items have been saved as favorites!');
}

// Function to apply saved favorites to cart
function applyFavorites() {
  const savedFavorites = localStorage.getItem('favorites');
  
  if (!savedFavorites) {
    showNotification('No favorites found. Save your favorites first.');
    return;
  }
  
  // Ask for confirmation if cart is not empty
  if (cart.length > 0) {
    if (!confirm('This will replace your current cart items. Continue?')) {
      return;
    }
  }
  
  // Apply favorites to cart
  cart = JSON.parse(savedFavorites);
  updateCart();
  
  // Open cart panel to show applied favorites
  document.getElementById('cart-panel').classList.add('show');
  
  showNotification('Favorites have been applied to your cart!');
}

// CSS for notifications
document.addEventListener('DOMContentLoaded', function() {
  const style = document.createElement('style');
  style.textContent = `
    .notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #333;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }
    
    .notification.hide {
      animation: slideOut 0.5s ease;
    }
    
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});