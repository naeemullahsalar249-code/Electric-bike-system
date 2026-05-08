document.addEventListener("DOMContentLoaded", () => {
    // Determine path prefix based on whether we are in the root or a subdirectory
    const isInPages = window.location.pathname.includes('/pages/');
    const navbarPath = isInPages ? 'navbar.html' : 'pages/navbar.html';

    fetch(navbarPath)
        .then(response => {
            if (!response.ok) throw new Error('Navbar fetch failed');
            return response.text();
        })
        .then(data => {
            const placeholder = document.getElementById("navbar-placeholder");
            if (placeholder) {
                placeholder.innerHTML = data;
                initNavbar();
            }
        })
        .catch(err => console.error('Error loading navbar:', err));
});

function initNavbar() {
    const toggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');
    if (toggle && navUl) {
        toggle.addEventListener('click', () => {
            navUl.classList.toggle('open');
        });
    }

    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.parentElement.classList.toggle('open');
            }
        });
    });
}
