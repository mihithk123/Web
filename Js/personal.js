
document.addEventListener('DOMContentLoaded', function() {
    // cart data from localStorage
    const cartDataString = localStorage.getItem('cartData');
    const cartTotal = localStorage.getItem('cartTotal');
    
    // Check if we have cart data
    if (cartDataString) {
      const cartData = JSON.parse(cartDataString);
      const summaryItemsDiv = document.getElementById('summary-items');
      
      // Display each item in the summary
      cartData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'summary-item';
        
        itemDiv.innerHTML = `
          <div class="summary-item-title">${item.title}</div>
          <div class="summary-item-details">
            <span>${item.price}</span>
            <span>${item.quantity}</span>
          </div>
        `;
        
        summaryItemsDiv.appendChild(itemDiv);
      });
      
      // Display the total
      document.getElementById('summary-total').textContent = cartTotal;
    } else {
      
      document.getElementById('summary-items').innerHTML = '<p>No items in cart</p>';
      document.getElementById('summary-total').textContent = 'Rs. 0';
    }
  });