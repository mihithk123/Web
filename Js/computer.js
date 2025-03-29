
// Product data
const products = [
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
let favorites = [];

// Render products
function renderProducts(filteredProducts = products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            ${product.preOwned ? '<span class="pre-owned-tag">Pre Owned</span>' : ''}
            <button class="favorite-btn" onclick="toggleFavorite(${product.id})">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
            </button>
            <div class="product-details">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="price-section">
                    <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
                    <span class="current-price">₹${product.currentPrice.toLocaleString()}</span>
                </div>
                <button class="add-to-cart-btn">Add to Cart</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Toggle favorite
function toggleFavorite(productId) {
    const favoriteBtn = document.querySelector(`.favorite-btn[onclick="toggleFavorite(${productId})"]`);
    if (favorites.includes(productId)) {
        favorites = favorites.filter(id => id !== productId);
        favoriteBtn.classList.remove('active');
    } else {
        favorites.push(productId);
        favoriteBtn.classList.add('active');
    }
}

// Sort products
function sortProducts(method) {
    let sortedProducts = [...products];
    switch(method) {
        case 'low-to-high':
            sortedProducts.sort((a, b) => a.currentPrice - b.currentPrice);
            break;
        case 'high-to-low':
            sortedProducts.sort((a, b) => b.currentPrice - a.currentPrice);
            break;
        default:
            // Relevance (original order)
            break;
    }
    renderProducts(sortedProducts);
}

// Filter modal
function openFilterModal() {
    document.getElementById('filterModal').style.display = 'flex';
}

function closeFilterModal() {
    document.getElementById('filterModal').style.display = 'none';
}

// Apply filters
function applyFilters() {
    const checkboxes = document.querySelectorAll('input[name="category"]:checked');
    const selectedCategories = Array.from(checkboxes).map(cb => cb.value);

    let filteredProducts = products;
    if (selectedCategories.length > 0) {
        filteredProducts = products.filter(product => 
            selectedCategories.includes(product.category)
        );
    }

    renderProducts(filteredProducts);
    closeFilterModal();
}

// Initial render
renderProducts();
