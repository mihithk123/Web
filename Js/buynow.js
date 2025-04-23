
document.addEventListener('DOMContentLoaded', function() {
    
    const submitButton = document.querySelector('.buynow');
    
    
    submitButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      
      const nameInput = document.getElementById('name'); // Get the name
      const customerName = nameInput.value.trim() || "Customer";
      
      
      const deliveryDate = getDeliveryDate(3);
      
      
      alert(`Thank you for your purchase, ${customerName}!\n\nYour order will be delivered on ${deliveryDate}.`);
    });
    
    
    function getDeliveryDate(daysToAdd) {
      const date = new Date();                                //  calculate delivery date
      date.setDate(date.getDate() + daysToAdd);
      
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }
  });