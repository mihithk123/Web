// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get the submit button
    const submitButton = document.querySelector('.button-77');
    
    // Add click event listener to the button
    submitButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Get the name input value (for personalization)
      const nameInput = document.getElementById('name');
      const customerName = nameInput.value.trim() || "Customer";
      
      // Calculate delivery date (current date + 3 days)
      const deliveryDate = getDeliveryDate(3);
      
      // Show thank you message with delivery date
      alert(`Thank you for your purchase, ${customerName}!\n\nYour order will be delivered on ${deliveryDate}.`);
    });
    
    // Function to calculate delivery date
    function getDeliveryDate(daysToAdd) {
      const date = new Date();
      date.setDate(date.getDate() + daysToAdd);
      
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  });