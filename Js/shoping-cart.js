// Initialize cart array from localStorage or create empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Update cart count in the navbar
function updateCartCount() {
  const cartCountElements = document.querySelectorAll('.cart-count');
  cartCountElements.forEach(element => {
    // Show total quantity of all items in cart
    const totalQuantity = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    element.textContent = totalQuantity;
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
  
  // Check if item already exists in cart
  const existingItem = cart.find(item => item.name === productName);
  
  if (existingItem) {
    // Increment quantity if item already exists
    existingItem.quantity = (existingItem.quantity || 1) + 1;
  } else {
    // Add new item with quantity 1
    const product = {
      image: productImage,
      name: productName,
      price: priceValue,
      formattedPrice: productPrice,
      quantity: 1
    };
    cart.push(product);
  }
  
  saveCart();
  
  // Show confirmation message
  alert(`${productName} has been added to your cart!`);
}

// Update item quantity in cart
function updateQuantity(index, newQuantity) {
  if (newQuantity < 1) return; // Don't allow quantities less than 1
  
  cart[index].quantity = newQuantity;
  saveCart();
  displayCart();
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
  const total = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const formattedTotal = `Rs. ${total.toLocaleString()}`;
  
  const totalElement = document.getElementById('cart-total');
  if (totalElement) {
    totalElement.textContent = formattedTotal;
  }
  
  return formattedTotal;
}

// Handle quantity change
function handleQuantityChange(event, index) {
  const newQuantity = parseInt(event.target.value);
  if (!isNaN(newQuantity) && newQuantity >= 1) {
    updateQuantity(index, newQuantity);
  }
}

// Handle quantity button clicks
function handleQuantityButton(index, change) {
  const currentQuantity = cart[index].quantity || 1;
  const newQuantity = currentQuantity + change;
  
  if (newQuantity >= 1) {
    updateQuantity(index, newQuantity);
  }
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
  
  // Update table header to include quantity column
  const thead = cartTable.querySelector('thead tr');
  if (thead && thead.querySelectorAll('th').length === 4) {
    // Insert quantity column header after price
    const priceCell = thead.children[2];
    const quantityHeader = document.createElement('th');
    quantityHeader.textContent = 'Quantity';
    thead.insertBefore(quantityHeader, priceCell.nextSibling);
  }
  
  // Add cart items to table
  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    
    // Calculate item total
    const itemTotal = item.price * (item.quantity || 1);
    const formattedItemTotal = `Rs. ${itemTotal.toLocaleString()}`;
    
    row.innerHTML = `
      <td><img src="${item.image}" alt="${item.name}" class="cart-item-image"></td>
      <td>${item.name}</td>
      <td>${item.formattedPrice}</td>
      <td class="quantity-cell">
        <button class="quantity-btn minus" data-index="${index}">-</button>
        <input type="number" min="1" value="${item.quantity || 1}" class="quantity-input" data-index="${index}">
        <button class="quantity-btn plus" data-index="${index}">+</button>
      </td>
      <td><button class="remove-item" data-index="${index}">Remove</button></td>
    `;
    
    tableBody.appendChild(row);
  });
  
  // Calculate and display total
  calculateTotal();
  
  // Add event listeners for quantity controls and remove buttons
  const quantityInputs = tableBody.querySelectorAll('.quantity-input');
  quantityInputs.forEach(input => {
    const index = parseInt(input.getAttribute('data-index'));
    input.addEventListener('change', (event) => handleQuantityChange(event, index));
  });
  
  const minusButtons = tableBody.querySelectorAll('.quantity-btn.minus');
  minusButtons.forEach(button => {
    const index = parseInt(button.getAttribute('data-index'));
    button.addEventListener('click', () => handleQuantityButton(index, -1));
  });
  
  const plusButtons = tableBody.querySelectorAll('.quantity-btn.plus');
  plusButtons.forEach(button => {
    const index = parseInt(button.getAttribute('data-index'));
    button.addEventListener('click', () => handleQuantityButton(index, 1));
  });
  
  const removeButtons = tableBody.querySelectorAll('.remove-item');
  removeButtons.forEach(button => {
    const index = parseInt(button.getAttribute('data-index'));
    button.addEventListener('click', () => removeFromCart(index));
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