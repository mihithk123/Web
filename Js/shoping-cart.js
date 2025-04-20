// Initialize cart array from localStorage or create empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Update cart count in the navbar
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    element.textContent = cart.length;
  });
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

// Add item to cart
function addToCart(event) {
  const productCard = event.target.closest('.product-card');
  if (!productCard) return;

  const productImage = productCard.querySelector('img').src;
  const productName = productCard.querySelector('.product-title').textContent;
  const productPrice = productCard.querySelector('.new-price').textContent;
  
  // Extract numerical price (remove "Rs. " and convert to number)
  const priceValue = parseFloat(productPrice.replace('Rs. ', '').replace(',', ''));
  
  const product = {
    image: productImage,
    name: productName,
    price: priceValue,
    formattedPrice: productPrice
  };
  
  cart.push(product);
  saveCart();
  
  // Show confirmation message
  alert(`${productName} has been added to your cart!`);
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  displayCart();
}

// Clear entire cart
function clearCart() {
  cart = [];
  saveCart();
  displayCart();
}

// Save current cart as favorites
function saveFavorites() {
  favorites = [...cart];
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Your current cart has been saved as favorites!');
}

// Apply favorites to current cart
function applyFavorites() {
  if (favorites.length === 0) {
    alert('No favorites saved!');
    return;
  }
  
  // Ask for confirmation if cart is not empty
  if (cart.length > 0) {
    const confirmed = confirm('This will replace your current cart. Continue?');
    if (!confirmed) return;
  }
  
  cart = [...favorites];
  saveCart();
  displayCart();
  alert('Favorites have been applied to your cart!');
}

// Calculate and display total cart value
function calculateTotal() {
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  const formattedTotal = `Rs. ${total.toLocaleString()}`;
  
  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = formattedTotal;
  }
  
  return formattedTotal;
}

// Display cart items in the cart page
function displayCart() {
  const cartTable = document.getElementById('cart-table');
  const emptyCartMessage = document.querySelector('.empty-cart-message');
  const cartActions = document.querySelector('.cart-actions');
  
  if (!cartTable) return; // Not on cart page
  
  const tableBody = cartTable.querySelector('tbody');
  tableBody.innerHTML = '';
  
  if (cart.length === 0) {
    // Show empty cart message, hide table and actions
    if (emptyCartMessage) emptyCartMessage.style.display = 'block';
    cartTable.style.display = 'none';
    if (cartActions) cartActions.style.display = 'none';
    return;
  }
  
  // Hide empty cart message, show table and actions
  if (emptyCartMessage) emptyCartMessage.style.display = 'none';
  cartTable.style.display = 'table';
  if (cartActions) cartActions.style.display = 'flex';
  
  // Add cart items to table
  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" class="cart-item-image"></td>
      <td>${item.name}</td>
      <td>${item.formattedPrice}</td>
      <td><button class="remove-item" data-index="${index}">Remove</button></td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Calculate and display total
  calculateTotal();
  
  // Add event listeners to remove buttons
  const removeButtons = tableBody.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const index = parseInt(button.getAttribute('data-index'));
      removeFromCart(index);
    });
  });
}

// Event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Update cart count on initial load
  updateCartCount();
  
  // Add event listeners for "Add to Cart" buttons on product page
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
  });
  
  // Display cart if on cart page
  if (document.querySelector('.cart-section')) {
    displayCart();
    
    // Add event listeners for cart actions
    const clearCartButton = document.getElementById('clear-cart');
    if (clearCartButton) {
      clearCartButton.addEventListener('click', clearCart);
    }
    
    const saveFavoritesButton = document.getElementById('save-favorites');
    if (saveFavoritesButton) {
      saveFavoritesButton.addEventListener('click', saveFavorites);
    }
    
    const applyFavoritesButton = document.getElementById('apply-favorites');
    if (applyFavoritesButton) {
      applyFavoritesButton.addEventListener('click', applyFavorites);
    }
  }
});