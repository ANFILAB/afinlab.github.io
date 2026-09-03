/* ==========================================================================
   AFINLAB (Applied Finance Learning Lab) - RESPONSIVE INTERACTION LOGIC
   ========================================================================== */

// 0. SIEMPRE EMPEZAR EN "INICIO", SALVO QUE LA PERSONA HAYA HECHO CLIC
//    EN UN ENLACE ESPECÍFICO (ej. "Sobre nosotros") EN ESTA MISMA SESIÓN.
//
// Sin esto, el navegador puede "recordar" un scroll anterior o una URL
// con #sobre-nosotros pegada (por historial/autocompletado) y dejarte
// ahí en vez de en el Inicio.

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

const AFINLAB_NAV_FLAG = 'afinlab-intentional-hash-nav';

// Antes de que se cargue esta página, marcamos si el salto a un ancla
// (#sobre-nosotros, etc.) vino de un clic real en un enlace de esta web.
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*="#"]');
    if (link) {
        sessionStorage.setItem(AFINLAB_NAV_FLAG, '1');
    }
});

window.addEventListener('load', () => {
    const cameFromIntentionalClick = sessionStorage.getItem(AFINLAB_NAV_FLAG) === '1';
    sessionStorage.removeItem(AFINLAB_NAV_FLAG);

    if (!cameFromIntentionalClick) {
        forceScrollToTopAndCleanHash();
    }
    // Si sí vino de un clic intencional, dejamos que el navegador haga
    // su salto normal al ancla (#sobre-nosotros, etc.) sin interferir.
});

// Cuando el navegador restaura la página desde su caché interna
// (por ejemplo, al usar el botón "Atrás"), NO se dispara 'load' —
// se dispara 'pageshow' con persisted=true. Sin esto, el navegador
// deja el scroll exactamente donde estaba, aunque no fue un clic
// intencional a una sección.
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        forceScrollToTopAndCleanHash();
    }
});

function forceScrollToTopAndCleanHash() {
    window.scrollTo(0, 0);
    if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
    }
}

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

    // 3. POP-UP MODAL CONVOCATORIA (FLYER)
    const convoModal = document.getElementById('convo-popup-modal');
    const convoCloseBtn = document.getElementById('convo-popup-close');

    if (convoModal) {
        // Mostrar pop-up automáticamente al cargar la página
        setTimeout(() => {
            convoModal.classList.add('active');
        }, 400);

        // Función para cerrar el pop-up
        const closeConvoModal = () => {
            convoModal.classList.remove('active');
        };

        // Cerrar al hacer clic en la 'X'
        if (convoCloseBtn) {
            convoCloseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeConvoModal();
            });
        }

        // Cerrar al hacer clic en el fondo oscuro exterior
        convoModal.addEventListener('click', (e) => {
            if (e.target === convoModal) {
                closeConvoModal();
            }
        });

        // Cerrar con la tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && convoModal.classList.contains('active')) {
                closeConvoModal();
            }
        });
    }
});

// 3. FRIENDLY ALERTS FOR OTHER MENUS (PLACEHOLDERS AS REQUESTED)
function showSectionAlert(sectionName) {
    alert(`Sección "${sectionName}" en desarrollo. Próximamente se integrarán las visualizaciones de datos del semillero.`);
}