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
    const searchInput = document.getElementById('searchInput');
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


const cartBtn = document.querySelector(".cart-btn");

if (cartBtn) {
    cartBtn.classList.remove("cart-attention");
    void cartBtn.offsetWidth;
    cartBtn.classList.add("cart-attention");
}

document.addEventListener("click", (e) => {
    const el = e.target.closest("button, .btn, a");
    if (!el) return;

    // Don't animate the category button
    if (el.id === "categoryBtn") return;

    el.classList.remove("click-pop");
    void el.offsetWidth;
    el.classList.add("click-pop");


    el.addEventListener("animationend", () => {
        el.classList.remove("click-pop");
    }, { once: true });


});

const hamburger = document.getElementById("navHamburger");
const drawer = document.getElementById("navDrawer");
const closeBtn = document.getElementById("navCloseBtn");
const backdrop = document.getElementById("drawerBackdrop");

if (hamburger && drawer && backdrop) {

    function openDrawer() {
        drawer.classList.add("open");
        backdrop.classList.add("show");
        hamburger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
    }

    function closeDrawer() {
        drawer.classList.remove("open");
        backdrop.classList.remove("show");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
    }

    hamburger.addEventListener("click", (e) => {
        e.stopPropagation();

        if (drawer.classList.contains("open")) {
            closeDrawer();
        } else {
            openDrawer();
        }
    });

    closeBtn?.addEventListener("click", closeDrawer);
    backdrop.addEventListener("click", closeDrawer);

    document.addEventListener("click", (e) => {
        if (
            drawer.classList.contains("open") &&
            !drawer.contains(e.target) &&
            !hamburger.contains(e.target)
        ) {
            closeDrawer();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDrawer();
    });

    drawer.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeDrawer);
    });
}
