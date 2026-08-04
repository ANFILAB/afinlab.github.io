/* ==========================================================================
   AFINLAB (Applied Finance Learning Lab) - RESPONSIVE INTERACTION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. MOBILE HAMBURGER MENU TOGGLE
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const navbarNav = document.getElementById('navbar-menu-nav');

    if (menuToggleBtn && navbarNav) {
        menuToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggleBtn.classList.toggle('open');
            navbarNav.classList.toggle('open');
            
            // Update aria-expanded attribute for accessibility
            const isOpen = menuToggleBtn.classList.contains('open');
            menuToggleBtn.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbarNav.contains(e.target) && !menuToggleBtn.contains(e.target)) {
                menuToggleBtn.classList.remove('open');
                navbarNav.classList.remove('open');
                menuToggleBtn.setAttribute('aria-expanded', false);
            }
        });

        // Close menu when clicking on nav links (smooth scroll targets)
        const navLinks = navbarNav.querySelectorAll('.navbar-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggleBtn.classList.remove('open');
                navbarNav.classList.remove('open');
                menuToggleBtn.setAttribute('aria-expanded', false);
            });
        });
    }

    // 2. REVEAL ANIMATIONS ON SCROLL (SUBTLE INTERACTION)
    const animElements = document.querySelectorAll('.reveal-fade-in');
    
    // Trigger initial reveal on load
    setTimeout(() => {
        animElements.forEach(el => {
            el.classList.add('active');
        });
    }, 100);
});

// 3. FRIENDLY ALERTS FOR OTHER MENUS (PLACEHOLDERS AS REQUESTED)
function showSectionAlert(sectionName) {
    alert(`Sección "${sectionName}" en desarrollo. Próximamente se integrarán las visualizaciones de datos del semillero.`);
}
