// This script handles cart data display on the personal details page
document.addEventListener('DOMContentLoaded', function() {
    // Display cart summary on personal details page
    displayOrderSummary();
    
    // Handle checkout button on cart page (if present)
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function() {
        prepareCartDataForCheckout();
      });
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
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const formattedTotal = `Rs. ${total.toLocaleString()}`;
    
    // Save formatted data to localStorage
    localStorage.setItem('cartData', JSON.stringify(formattedCartData));
    localStorage.setItem('cartTotal', formattedTotal);
  }
  
  // Function to display order summary on personal details page
  function displayOrderSummary() {
    console.log("Displaying order summary"); // Debugging
    
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartData = [];
    let cartTotal = 'Rs. 0';
    
    // Check if we have cart data directly from cart
    if (cart.length > 0) {
      // Format cart data
      cart.forEach(item => {
        cartData.push({
          title: item.name,
          price: item.formattedPrice,
          quantity: 1,
          image: item.image
        });
      });
      
      // Calculate total
      const total = cart.reduce((sum, item) => sum + item.price, 0);
      cartTotal = `Rs. ${total.toLocaleString()}`;
      
    } else {
      // Try getting previously formatted cart data
      const cartDataString = localStorage.getItem('cartData');
      const savedTotal = localStorage.getItem('cartTotal');
      
      if (cartDataString) {
        const parsedData = JSON.parse(cartDataString);
        cartData.push(...parsedData);
        cartTotal = savedTotal || cartTotal;
      }
    }
    
    // Get summary elements
    const summaryItemsDiv = document.getElementById('summary-items');
    const summaryTotalSpan = document.getElementById('summary-total');
    
    if (!summaryItemsDiv || !summaryTotalSpan) {
      console.log("Summary elements not found"); // Debugging
      return;
    }
    
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
    console.log("Summary displayed with total:", cartTotal); // Debugging
  }