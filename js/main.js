// Books Corner — Main JS

// Keep the global click listener for normal buttons/links
document.addEventListener('click', function (e) {
    if (e.target.closest('button, a:not(#floatWhatsapp)')) {
        if (navigator.vibrate) {
            navigator.vibrate(45);
        }
    }
});

// Use 'pointerdown' specifically for the WhatsApp button to beat the app-switch delay
const whatsappBtn = document.getElementById('floatWhatsapp');
if (whatsappBtn) {
    whatsappBtn.addEventListener('pointerdown', function () {
        if (navigator.vibrate) {
            navigator.vibrate(45);
        }
    });
}





document.addEventListener('DOMContentLoaded', () => {

    // ── Navbar scroll effect ─────────────────────────────
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── Mobile nav drawer ────────────────────────────────
    const hamburger = document.getElementById('navHamburger');
    const drawer    = document.getElementById('navDrawer');
    const closeBtn  = document.getElementById('navCloseBtn');
    if (hamburger && drawer) {
        hamburger.addEventListener('click', () => {
            const open = drawer.classList.toggle('open');
            hamburger.setAttribute('aria-expanded', open);
        });
        closeBtn?.addEventListener('click', () => {
            drawer.classList.remove('open');
            hamburger.setAttribute('aria-expanded', false);
        });
        document.addEventListener('click', e => {
            if (!navbar.contains(e.target) && !drawer.contains(e.target)) drawer.classList.remove('open');
        });
    }

    // ── Scroll reveal ────────────────────────────────────
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
        });
    }, { threshold: 0.08 });
    document.querySelectorAll('.product-card, .blog-card, .ceremony-feature, .featured-slide').forEach(el => {
        el.classList.add('reveal');
        revealObserver.observe(el);
    });

    // ── Cart badge sync ──────────────────────────────────
    updateCartBadge();

    // ── Search autocomplete ──────────────────────────────
    const searchInput   = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    if (searchInput && searchResults) {
        let timer;
        searchInput.addEventListener('input', () => {
            clearTimeout(timer);
            const q = searchInput.value.trim();
            if (q.length < 2) { searchResults.classList.remove('open'); return; }
            timer = setTimeout(() => fetchSearchResults(q), 300);
        });
        document.addEventListener('click', e => {
            if (!searchInput.closest('.search-bar').contains(e.target)) {
                searchResults.classList.remove('open');
            }
        });
    }

    // ── Flash auto-dismiss ───────────────────────────────
    document.querySelectorAll('.alert').forEach(el => {
        setTimeout(() => { el.style.transition = 'opacity 0.5s'; el.style.opacity = '0'; setTimeout(() => el.remove(), 500); }, 5000);
    });
});

let previousCartCount = 0;

// ── Cart Badge ────────────────────────────────────────────
function updateCartBadge() {
    const badge = document.getElementById('cartBadge');
    const cartBtn = document.querySelector('.cart-btn');

    if (!badge) return;

    const count = CartManager.count();

    badge.textContent = count;
    badge.classList.toggle('show', count > 0);

    // Animate only when the count increases
    if (cartBtn && count > previousCartCount) {
        cartBtn.classList.remove('cart-attention');

        // Restart animation
        void cartBtn.offsetWidth;

        cartBtn.classList.add('cart-attention');
    }

    previousCartCount = count;
}


const cartBtn = document.querySelector('.cart-btn');

cartBtn.classList.remove('cart-attention');
void cartBtn.offsetWidth; // Restart animation
cartBtn.classList.add('cart-attention');

document.addEventListener("click", (e) => {
    const el = e.target.closest("button, .btn, a");
    if (!el) return;

    el.classList.remove("click-pop");
    void el.offsetWidth; // Restart animation
    el.classList.add("click-pop");
});
