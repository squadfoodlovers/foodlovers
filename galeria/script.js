document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const menuItems = document.querySelectorAll('.menu-item');
    const navLinks = document.querySelectorAll('.nav a');
    const modal = document.getElementById('dishModal');
    const modalClose = modal.querySelector('.modal-close');

    // Modal functionality
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('.menu-item-title').textContent;
            const price = this.querySelector('.menu-item-price').textContent;
            const description = this.querySelector('.menu-item-description').textContent;
            const imgSrc = this.querySelector('.menu-item-image img').src;

            // Populate modal content
            modal.querySelector('.modal-title').textContent = title;
            modal.querySelector('.modal-price').textContent = price;
            modal.querySelector('.modal-description').textContent = description;
            modal.querySelector('.modal-image').innerHTML = `<img src="${imgSrc}" alt="${title}">`;

            // Extract ingredients from description
            const ingredients = description.split(',').map(item => item.trim());
            const ingredientsList = modal.querySelector('.modal-ingredients');
            ingredientsList.innerHTML = ingredients.map(ing => `<li>${ing}</li>`).join('');

            // Show modal
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close modal functionality
    modalClose.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Rest of the existing functionality...
    // (Keep all the existing search and filter code)

    // Add click handler for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default anchor behavior
            const category = this.getAttribute('href').replace('#', '');
            
            // Update the category filter to match
            categoryFilter.value = category;
            
            // Trigger the filtering
            filterMenuItems();
            
            // Only scroll if not selecting "Todo"
            if (category !== 'all') {
                document.getElementById(category).scrollIntoView({ behavior: 'smooth' });
            } else {
                // For "Todo", scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    function filterMenuItems() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        let hasVisibleItems = false;

        // Show all sections when "Todo" or "all" is selected
        document.querySelectorAll('.menu-section').forEach(section => {
            section.style.display = (selectedCategory === 'all') ? 'block' : 'none';
        });

        menuItems.forEach(item => {
            const title = item.querySelector('.menu-item-title').textContent.toLowerCase();
            const description = item.querySelector('.menu-item-description').textContent.toLowerCase();
            const itemSection = item.closest('.menu-section').id;
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || itemSection === selectedCategory;

            const shouldShow = matchesSearch && matchesCategory;
            item.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                hasVisibleItems = true;
                // Show the section containing matching items
                item.closest('.menu-section').style.display = 'block';
            }
        });

        // Show/hide no results message
        document.querySelectorAll('.no-results').forEach(el => el.remove());
        if (!hasVisibleItems) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No se encontraron resultados';
            document.querySelector('.search-container').after(noResults);
        }
    }

    // Add event listeners for search and filter
    searchInput.addEventListener('input', filterMenuItems);
    categoryFilter.addEventListener('change', filterMenuItems);
});
