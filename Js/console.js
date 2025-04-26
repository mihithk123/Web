
var currentSlide = 0;

// Get all carousel images
var slides = document.querySelectorAll('.carousel-image');


function showSlide(index) {
  // Loop through all slides
  for (var i = 0; i < slides.length; i++) {
    // If this is the slide we want to show
    if (i === index) {
      slides[i].style.display = 'block';
    } 
    // Otherwise hide it
    else {
      slides[i].style.display = 'none';
    }
  }
}

// Function to show the next slide
function nextSlide() {
  // Increase the current slide index
  currentSlide = currentSlide + 1;
  

  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  
  // Show the new current slide
  showSlide(currentSlide);
}

// Function to show the previous slide
function prevSlide() {
  // Decrease the current slide index
  currentSlide = currentSlide - 1;
  
 
  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }
  
  // Show the new current slide
  showSlide(currentSlide);
}

// Show the first slide when the page loads
showSlide(currentSlide);
