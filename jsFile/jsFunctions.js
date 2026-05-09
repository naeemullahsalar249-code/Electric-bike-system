// jsFunctions.js

// Global Route Guard
enforceLogin();

function enforceLogin() {
    const isLoginPage = window.location.pathname.endsWith('login.html');
    const isSignupPage = window.location.pathname.endsWith('signup.html');
    
    // Allow users to stay on login or signup pages
    if (isLoginPage || isSignupPage) return;

    const userStr = localStorage.getItem('ebike_user');
    if (!userStr) {
        // Not logged in, redirect to login page
        const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('Electric%20Bike%20Store/');
        window.location.href = isRoot ? 'pages/login.html' : 'login.html';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
});

function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    // Adjust path based on whether we are in the root directory or pages directory
    const isRoot = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('Electric%20Bike%20Store/');
    const navbarPath = isRoot ? 'pages/navbar.html' : 'navbar.html';

    fetch(navbarPath)
        .then(response => {
            if (!response.ok) throw new Error("Could not load navbar");
            return response.text();
        })
        .then(data => {
            placeholder.innerHTML = data;
            
            // Adjust links in the loaded navbar based on current directory
            const navLinks = placeholder.querySelectorAll('a');
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('http') && !href.startsWith('#')) {
                    if (isRoot) {
                        // We are in root, links to pages should be prefixed with pages/ unless it's index.html
                        if (href !== 'index.html' && !href.startsWith('pages/')) {
                            link.setAttribute('href', 'pages/' + href);
                        }
                    } else {
                        // We are in pages/, link to index.html should be ../index.html
                        if (href === 'index.html') {
                            link.setAttribute('href', '../index.html');
                        }
                    }
                }
            });

            // Initialize mobile menu
            initMobileMenu();
            
            // Check auth state and update navbar
            updateNavbarAuth(isRoot);
        })
        .catch(error => console.error("Error loading navbar:", error));
}

function updateNavbarAuth(isRoot) {
    const authMenu = document.getElementById('auth-menu');
    const authDropdown = document.getElementById('auth-dropdown');
    if (!authMenu || !authDropdown) return;

    const userStr = localStorage.getItem('ebike_user');
    
    if (userStr) {
        const user = JSON.parse(userStr);
        const adminDashPath = isRoot ? 'pages/dashboard.html' : 'dashboard.html';
        const userDashPath = isRoot ? 'pages/user-dashboard.html' : 'user-dashboard.html';
        const settingsPath = isRoot ? 'pages/admin-settings.html' : 'admin-settings.html';
        const rootPath = isRoot ? 'index.html' : '../index.html';

        let menuHtml = '';
        if (user.role === 'admin') {
            menuHtml += `<a href="${adminDashPath}">Dashboard (Admin)</a>`;
            menuHtml += `<a href="${settingsPath}">Admin Settings</a>`;
        } else {
            menuHtml += `<a href="${userDashPath}">Dashboard</a>`;
        }
        menuHtml += `<a href="#" id="logout-btn">Logout</a>`;
        
        const topDash = document.getElementById('nav-dashboard-link');
        if (topDash) {
            topDash.href = user.role === 'admin' ? adminDashPath : userDashPath;
            topDash.style.display = 'block';
        }
        
        authMenu.innerHTML = menuHtml;
        authDropdown.querySelector('a').innerText = `Hello, ${user.name} ▼`;

        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('ebike_user');
            window.location.href = rootPath;
        });
    }
}

function initMobileMenu() {
    const toggleBtn = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (toggleBtn && navUl) {
        toggleBtn.addEventListener('click', () => {
            navUl.classList.toggle('open');
        });
    }
}

// Auth Handlers
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
            
            let name = email.split('@')[0];
            if (role === 'admin') name = 'Admin';
            
            localStorage.setItem('ebike_user', JSON.stringify({ name: name, email: email, role: role }));
            if (role === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        });
    }

    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const role = document.getElementById('role').value;
            
            localStorage.setItem('ebike_user', JSON.stringify({ name: name, email: email, role: role }));
            if (role === 'admin') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'user-dashboard.html';
            }
        });
    }
});
