// This script helps transfer cart data to the personal details page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on cart page with checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        // Prepare cart data for the personal details page
        prepareCartDataForCheckout();
      });
    }
    
    // Check if we're on the personal details page
    if (document.querySelector('.order-summary')) {
      displayOrderSummary();
    }
  });
  
  // Function to prepare cart data before redirecting to personal details
  function prepareCartDataForCheckout() {
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Format cart data for the personal details page
    const formattedCartData = cart.map(item => ({
      title: item.name,
      price: item.formattedPrice,
      quantity: 1, // Assuming quantity is always 1
      image: item.image
    }));
    
    // Calculate total (reusing the function from shopping-cart.js)
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const formattedTotal = `Rs. ${total.toLocaleString()}`;
    
    // Save formatted data to localStorage
    localStorage.setItem('cartData', JSON.stringify(formattedCartData));
    localStorage.setItem('cartTotal', formattedTotal);
  }
  
  // Function to display order summary on personal details page
  function displayOrderSummary() {
    // Get cart data from localStorage
    const cartDataString = localStorage.getItem('cartData');
    const cartTotal = localStorage.getItem('cartTotal');
    
    const summaryItemsDiv = document.getElementById('summary-items');
    const summaryTotalSpan = document.getElementById('summary-total');
    
    if (!summaryItemsDiv || !summaryTotalSpan) return;
    
    // Check if we have cart data
    if (cartDataString && cartTotal) {
      const cartData = JSON.parse(cartDataString);
      
      // Clear existing content
      summaryItemsDiv.innerHTML = '';
      
      if (cartData.length === 0) {
        summaryItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        summaryTotalSpan.textContent = 'Rs. 0';
        return;
      }
      
      // Display each item in the summary
      cartData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        
        itemDiv.innerHTML = `
          <div class="summary-item-title">${item.title}</div>
          <div class="summary-item-details">
            <span class="summary-item-price">${item.price}</span>
            <span class="summary-item-quantity">Qty: ${item.quantity}</span>
          </div>
        `;
        
        summaryItemsDiv.appendChild(itemDiv);
      });
      
      // Display the total
      summaryTotalSpan.textContent = cartTotal;
    } else {
      // If no cart data, show a message
      summaryItemsDiv.innerHTML = '<p>Your cart is empty</p>';
      summaryTotalSpan.textContent = 'Rs. 0';
    }
  }