// Wait for the page to fully load before running our code
document.addEventListener('DOMContentLoaded', function() {
    // Get the form elements
    var form = document.querySelector('.form-container');
    var continueButton = document.querySelector('.button-77');
    
    // List of all required fields by their ID
    var requiredFields = [
        'first-name', 'last-name', 'email', 'phone', 
        'address-line1', 'city', 'state', 'postal-code', 'country'
    ];
    
    // Handle what happens when the continue button is clicked
    continueButton.addEventListener('click', function(e) {
        // Prevent the form from submitting normally
        e.preventDefault();
        
        // Variables to track form validation
        var isValid = true;
        var invalidFields = [];
        
        // Check each required field
        for (var i = 0; i < requiredFields.length; i++) {
            var fieldId = requiredFields[i];
            var inputElement = document.getElementById(fieldId);
            
            // Check if the field is empty (after removing extra spaces)
            if (!inputElement.value.trim()) {
                isValid = false;
                invalidFields.push(fieldId);
                // Make the border red to show error
                inputElement.style.borderColor = 'rgba(255, 0, 0, 0.5)';
            } else {
                // Reset border color if field is filled
                inputElement.style.borderColor = 'var(--input-border)';
            }
        }
        
        // Check if email is valid
        var emailInput = document.getElementById('email');
        if (emailInput.value) {
            // Simple email validation - check for @ and .
            if (emailInput.value.indexOf('@') === -1 || 
                emailInput.value.indexOf('.') === -1 ||
                emailInput.value.indexOf('@') > emailInput.value.lastIndexOf('.')) {
                isValid = false;
                invalidFields.push('email');
                emailInput.style.borderColor = 'rgba(255, 0, 0, 0.5)';
            }
        }
        
        // Basic phone validation - check that it has 10-15 digits
        var phoneInput = document.getElementById('phone');
        if (phoneInput.value) {
            // Remove any spaces, parentheses, or dashes
            var phoneDigits = phoneInput.value.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/-/g, '');
            // Check if it has between 10 and 15 digits
            if (phoneDigits.length < 10 || phoneDigits.length > 15 || isNaN(phoneDigits)) {
                isValid = false;
                invalidFields.push('phone');
                phoneInput.style.borderColor = 'rgba(255, 0, 0, 0.5)';
            }
        }
        
        // If the form is valid, proceed
        if (isValid) {
            // Get selected delivery option
            var deliveryOptions = document.getElementsByName('delivery');
            var selectedDelivery = '';
            for (var i = 0; i < deliveryOptions.length; i++) {
                if (deliveryOptions[i].checked) {
                    selectedDelivery = deliveryOptions[i].value;
                    break;
                }
            }
            
            // Determine delivery days based on selection
            var deliveryDays = 0;
            if (selectedDelivery === 'standard') {
                // Random number between 3-5
                deliveryDays = Math.floor(Math.random() * 3) + 3;
            } else if (selectedDelivery === 'express') {
                // Random number between 1-2
                deliveryDays = Math.floor(Math.random() * 2) + 1;
            } else if (selectedDelivery === 'overnight') {
                deliveryDays = 1; // Next day
            }
            
            // Calculate delivery date
            var deliveryDate = calculateDeliveryDate(deliveryDays);
            
            // Get customer name
            var firstName = document.getElementById('first-name').value;
            var lastName = document.getElementById('last-name').value;
            
            // Show thank you message
            showThankYouMessage(firstName, lastName, deliveryDate, selectedDelivery);
        } else {
            // Show error message
            alert('Please fill in all required fields correctly to continue.');
        }
    });
    
    // Calculate delivery date (skipping weekends)
    function calculateDeliveryDate(days) {
        var date = new Date();
        var businessDays = 0;
        
        while (businessDays < days) {
            // Add one day
            date.setDate(date.getDate() + 1);
            
            // Skip weekends (0 = Sunday, 6 = Saturday)
            var dayOfWeek = date.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDays++;
            }
        }
        
        // Format date nicely
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }
    
    // Display thank you message
    function showThankYouMessage(firstName, lastName, deliveryDate, deliveryType) {
        // Create message container
        var messageContainer = document.createElement('div');
        messageContainer.className = 'thank-you-container';
        
        // Add CSS styles
        var styleElement = document.createElement('style');
        styleElement.textContent = 
            '.thank-you-container {' +
            '    background: rgba(255, 255, 255, 0.1);' +
            '    border-radius: 20px;' +
            '    backdrop-filter: blur(10px);' +
            '    border: 1px solid rgba(255, 255, 255, 0.2);' +
            '    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);' +
            '    padding: 40px;' +
            '    text-align: center;' +
            '    color: var(--text-color);' +
            '    margin: 30px auto;' +
            '    max-width: 600px;' +
            '    animation: fadeIn 0.5s ease-in-out;' +
            '}' +
            '.thank-you-icon {' +
            '    width: 80px;' +
            '    height: 80px;' +
            '    background: var(--button-gradient);' +
            '    border-radius: 50%;' +
            '    margin: 0 auto 20px;' +
            '    display: flex;' +
            '    align-items: center;' +
            '    justify-content: center;' +
            '    box-shadow: 0 5px 15px rgba(249, 58, 19, 0.3);' +
            '}' +
            '.thank-you-icon svg {' +
            '    width: 40px;' +
            '    height: 40px;' +
            '    fill: white;' +
            '}' +
            '.thank-you-title {' +
            '    font-size: 2.2rem;' +
            '    font-weight: 600;' +
            '    margin-bottom: 15px;' +
            '    background-image: linear-gradient(to right, #f8f9fa, #ffffff);' +
            '    -webkit-background-clip: text;' +
            '    -webkit-text-fill-color: transparent;' +
            '}' +
            '.thank-you-message {' +
            '    font-size: 1.1rem;' +
            '    line-height: 1.6;' +
            '    margin-bottom: 25px;' +
            '}' +
            '.delivery-info {' +
            '    background: rgba(255, 255, 255, 0.1);' +
            '    border-radius: 12px;' +
            '    padding: 15px;' +
            '    margin-bottom: 25px;' +
            '}' +
            '.delivery-date {' +
            '    font-weight: 600;' +
            '    color: #ff7426;' +
            '    font-size: 1.2rem;' +
            '    margin-top: 5px;' +
            '}' +
            '.back-button {' +
            '    background-image: var(--button-gradient);' +
            '    color: white;' +
            '    border: none;' +
            '    border-radius: 12px;' +
            '    padding: 12px 25px;' +
            '    font-size: 16px;' +
            '    font-weight: 600;' +
            '    cursor: pointer;' +
            '    transition: all 0.3s ease;' +
            '    font-family: "Poppins", sans-serif;' +
            '    letter-spacing: 1px;' +
            '}' +
            '.back-button:hover {' +
            '    transform: translateY(-2px);' +
            '    box-shadow: 0 8px 25px rgba(249, 58, 19, 0.3);' +
            '}' +
            '@keyframes fadeIn {' +
            '    from {' +
            '        opacity: 0;' +
            '        transform: translateY(20px);' +
            '    }' +
            '    to {' +
            '        opacity: 1;' +
            '        transform: translateY(0);' +
            '    }' +
            '}';
        
        document.head.appendChild(styleElement);
        
        // Set delivery type text
        var deliveryText = "";
        if (deliveryType === 'standard') {
            deliveryText = "Standard Delivery";
        } else if (deliveryType === 'express') {
            deliveryText = "Express Delivery";
        } else if (deliveryType === 'overnight') {
            deliveryText = "Next Day Delivery";
        }
        
        // Create the content for the thank you message
        var iconDiv = document.createElement('div');
        iconDiv.className = 'thank-you-icon';
        iconDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
                            '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>' +
                            '</svg>';
        
        var titleHeading = document.createElement('h2');
        titleHeading.className = 'thank-you-title';
        titleHeading.textContent = 'Thank You For Your Purchase!';
        
        var messageP = document.createElement('p');
        messageP.className = 'thank-you-message';
        messageP.textContent = 'Thank you, ' + firstName + ' ' + lastName + 
                              '! Your order has been successfully placed. ' +
                              'We\'ve sent a confirmation email to your inbox with all the details.';
        
        var deliveryInfoDiv = document.createElement('div');
        deliveryInfoDiv.className = 'delivery-info';
        
        var deliveryTypeP = document.createElement('p');
        deliveryTypeP.textContent = 'Your order will be delivered via ' + deliveryText + ' on:';
        
        var deliveryDateP = document.createElement('p');
        deliveryDateP.className = 'delivery-date';
        deliveryDateP.textContent = deliveryDate;
        
        deliveryInfoDiv.appendChild(deliveryTypeP);
        deliveryInfoDiv.appendChild(deliveryDateP);
        
        var backButton = document.createElement('button');
        backButton.className = 'back-button';
        backButton.textContent = 'Return to Homepage';
        backButton.onclick = function() {
            window.location.href = 'index.html';
        };
        
        // Build the message container
        messageContainer.appendChild(iconDiv);
        messageContainer.appendChild(titleHeading);
        messageContainer.appendChild(messageP);
        messageContainer.appendChild(deliveryInfoDiv);
        messageContainer.appendChild(backButton);
        
        // Replace form with thank you message
        var formContainer = document.querySelector('.form-container');
        formContainer.parentNode.replaceChild(messageContainer, formContainer);
        
        // Change page title to reflect completion
        var pageTitle = document.querySelector('.details-title h1');
        if (pageTitle) {
            pageTitle.textContent = "Order Confirmed";
        }
    }
    
    // Add input validation to all required fields
    for (var i = 0; i < requiredFields.length; i++) {
        var fieldId = requiredFields[i];
        var inputElement = document.getElementById(fieldId);
        
        // Check field when user leaves the input
        inputElement.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.style.borderColor = 'rgba(255, 0, 0, 0.5)';
            } else {
                this.style.borderColor = 'var(--input-border)';
            }
        });
        
        // Highlight field when user focuses on it
        inputElement.addEventListener('focus', function() {
            this.style.borderColor = 'var(--input-focus-border)';
        });
    }
    
    // Add specific validation for email field
    var emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', function() {
        if (this.value) {
            // Simple email validation - check for @ and .
            if (this.value.indexOf('@') === -1 || 
                this.value.indexOf('.') === -1 ||
                this.value.indexOf('@') > this.value.lastIndexOf('.')) {
                this.style.borderColor = 'rgba(255, 0, 0, 0.5)';
            }
        }
    });
    
    // Add specific validation for phone field
    var phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('blur', function() {
        if (this.value) {
            // Remove any spaces, parentheses, or dashes
            var phoneDigits = this.value.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '').replace(/-/g, '');
            // Check if it has between 10 and 15 digits
            if (phoneDigits.length < 10 || phoneDigits.length > 15 || isNaN(phoneDigits)) {
                this.style.borderColor = 'rgba(255, 0, 0, 0.5)';
            }
        }
    });
});