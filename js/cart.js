// Books Corner — Cart Manager
// localStorage key: bc_cart

const CartManager = (() => {
    const KEY = 'bc_cart';

    function get() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    }

    function save(cart) {
        localStorage.setItem(KEY, JSON.stringify(cart));
        document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart } }));
    }

    function add(product) {
        const cart = get();
        const idx = cart.findIndex(i => i.id === product.id);
        if (idx >= 0) {
            cart[idx].qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        save(cart);
    }

    function remove(id) {
        save(get().filter(i => i.id !== id));
    }

    function update(id, qty) {
        qty = Math.max(1, parseInt(qty) || 1);
        const cart = get();
        const idx = cart.findIndex(i => i.id === id);
        if (idx >= 0) { cart[idx].qty = qty; save(cart); }
    }

    function clear() {
        localStorage.removeItem(KEY);
        document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { cart: [] } }));
    }

    function count() {
        return get().reduce((sum, i) => sum + i.qty, 0);
    }

    function total() {
        return get().reduce((sum, i) => sum + i.qty * i.price, 0);
    }

    function buildWhatsAppMessage(waNumber, deliveryCharge) {
        function generateOrderId() {
            return "BC-" + crypto.randomUUID().split("-")[0].toUpperCase();
        }

        const cart = get();
        if (!cart.length) return null;
        deliveryCharge = parseFloat(deliveryCharge) || 0;

        const orderId = generateOrderId();

        const lines = cart.map((item, idx) =>
            `${idx + 1}. *${item.name_en}*\n   Qty: ${item.qty} x Rs.${item.price.toLocaleString()} = Rs.${(item.qty * item.price).toLocaleString()}`
        ).join('\n\n');

        const subtotal = total();
        const grandTotal = subtotal + deliveryCharge;

        const now = new Date();

        const date = now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        const time = now.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        });

        const orderDate = `${date} ${time}`;

        let msg = `*🛒 New Order - Books Corner*\n\n`;
        msg += `📦 *Order ID:* ${orderId}\n`;
        msg += `📅 *Order Date:* ${orderDate}\n`;
        msg += `*Order Details:*\n\n${lines}\n\n----------------------------\n`;

        if (deliveryCharge > 0) {
            msg += `Subtotal: Rs. ${subtotal.toLocaleString()}\nDelivery: Rs. ${deliveryCharge.toLocaleString()}\n`;
        }
        msg += `*Total: Rs. ${grandTotal.toLocaleString()}*\n\nPlease confirm availability and delivery details.\n\nThank you!`;

        return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    }

    return { get, add, remove, update, clear, count, total, buildWhatsAppMessage };
})();

// ── Add-to-cart buttons (product cards) ──────────────────
document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-add-cart]');
        if (!btn) return;
        e.preventDefault();
        const product = {
            id: parseInt(btn.dataset.id),
            name_en: btn.dataset.nameEn,
            name_si: btn.dataset.nameSi,
            price: parseFloat(btn.dataset.price),
            image: btn.dataset.image || '',
            slug: btn.dataset.slug || ''
        };
        CartManager.add(product);
        updateCartBadge();
        showCartToast(product.name_en);

        // Feedback animation
        btn.classList.add('added');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Added!';
        setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('added'); }, 1400);
    });

    // Cart page rendering
    if (document.getElementById('cartItems')) renderCart();

    // Listen for updates to re-render cart page
    document.addEventListener('cartUpdated', () => {
        if (document.getElementById('cartItems')) renderCart();
        updateCartBadge();
    });
});

// ── Cart Page Render ──────────────────────────────────────
function renderCart() {
    const container = document.getElementById('cartItems');
    const summary = document.getElementById('cartSummary');
    if (!container) return;

    const cart = CartManager.get();

    if (!cart.length) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="bi bi-cart-x"></i>
                <h3>Your cart is empty</h3>
                <p>Browse our ceremony packages and stationery to add items to your order.</p>
                <a href="products" class="btn btn-gold">Browse Products</a>
            </div>`;
        if (summary) summary.style.display = 'none';
        return;
    }

    if (summary) summary.style.display = '';

    const rows = cart.map(item => `
        <tr>
            <td>
                <img src="${item.image || '/shop/images/favicon.png'}" alt="${escHtml(item.name_en)}" class="cart-item-img">
            </td>
            <td>
                <div class="cart-item-name">${escHtml(item.name_en)}</div>
                <div class="cart-item-name-si">${escHtml(item.name_si)}</div>
            </td>
            <td>Rs. ${item.price.toLocaleString()}</td>
            <td>
                <div class="qty-stepper">
                    <button onclick="CartManager.update(${item.id}, ${item.qty - 1}); pulseStepper(this)" aria-label="Decrease">−</button>
                    <input type="number" value="${item.qty}" min="1" onchange="CartManager.update(${item.id}, this.value)" aria-label="Quantity">
                    <button onclick="CartManager.update(${item.id}, ${item.qty + 1}); pulseStepper(this)" aria-label="Increase">+</button>
                </div>
            </td>
            <td><strong>Rs. ${(item.qty * item.price).toLocaleString()}</strong></td>
            <td>
                <button class="cart-remove" data-remove-id="${item.id}" aria-label="Remove item">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th style="width:80px">Image</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th style="width:140px">Qty</th>
                    <th>Total</th>
                    <th style="width:48px"></th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>`;

    // Update summary
    if (summary) {
        const subtotal = CartManager.total();
        let delivery = (typeof window.BC_DELIVERY !== 'undefined') ? window.BC_DELIVERY : 0;

        // Add Rs.100 extra delivery for product ID 1
        const hasSpecialItem = cart.some(item => item.id === 5);
        // Update summary
        if (summary) {
            const subtotal = CartManager.total();

            let delivery = 350; // default delivery

            const hasSpecialItem = cart.some(item => item.id === 5);

            if (hasSpecialItem) {
                delivery = 450;
            }

            const grandTotal = subtotal + delivery;
            const itemCount = CartManager.count();

            summary.querySelector('#summaryCount').textContent =
                `${itemCount} item${itemCount !== 1 ? 's' : ''}`;

            summary.querySelector('#summarySubtotal').textContent =
                `Rs. ${subtotal.toLocaleString()}`;

            summary.querySelector('#summaryDelivery').textContent =
                `Rs. ${delivery.toLocaleString()}`;

            summary.querySelector('#summaryTotal').textContent =
                `Rs. ${grandTotal.toLocaleString()}`;
        }

    }
}

function escHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// WhatsApp checkout button (cart page)
document.addEventListener('click', e => {
    const btn = e.target.closest('#checkoutWhatsapp');
    if (!btn) return;
    const waNumber = btn.dataset.wa || '94761909344';
    let delivery = (typeof window.BC_DELIVERY !== 'undefined') ? window.BC_DELIVERY : 0;

    const hasSpecialItem = CartManager.get().some(item => item.id === 5);

    if (hasSpecialItem) {
        delivery = 450;
    }
    const url = CartManager.buildWhatsAppMessage(waNumber, delivery);
    if (!url) { alert('Your cart is empty.'); return; }
    window.open(url, '_blank');
});

// WhatsApp nav + float buttons — send cart if items exist, otherwise plain chat
document.addEventListener('click', e => {
    const btn = e.target.closest('#navWhatsapp, #floatWhatsapp');
    if (!btn) return;
    const waNumber = btn.dataset.wa || '94761909344';
    let delivery = (typeof window.BC_DELIVERY !== 'undefined') ? window.BC_DELIVERY : 0;

    const hasSpecialItem = CartManager.get().some(item => item.id === 5);

    if (hasSpecialItem) {
        delivery = 450;

    }
    const url = CartManager.buildWhatsAppMessage(waNumber, delivery);
    if (url) {
        e.preventDefault();
        window.open(url, '_blank');
    }
    // else: let the default href open (plain WhatsApp chat)
});

// ── Cart remove with fade animation ──────────────────
document.addEventListener('click', e => {
    const btn = e.target.closest('[data-remove-id]');
    if (!btn) return;
    const id = parseInt(btn.dataset.removeId);
    const row = btn.closest('tr');
    if (row) {
        row.style.transition = 'opacity 0.28s ease, transform 0.28s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateX(16px)';
        setTimeout(() => CartManager.remove(id), 290);
    } else {
        CartManager.remove(id);
    }
});

// ── Toast notification ────────────────────────────────
function showCartToast(name) {
    const t = document.createElement('div');
    t.className = 'cart-toast';
    t.innerHTML = `<i class="bi bi-bag-check-fill"></i> <span><strong>${escHtml(name)}</strong> added to cart</span>`;
    document.body.appendChild(t);
    requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
    setTimeout(() => {
        t.classList.remove('show');
        setTimeout(() => t.remove(), 300);
    }, 2500);
}

// ── Qty stepper pulse ─────────────────────────────────
function pulseStepper(btn) {
    const input = btn.closest('.qty-stepper')?.querySelector('input');
    if (!input) return;
    input.classList.remove('pulse');
    void input.offsetWidth; // reflow to restart animation
    input.classList.add('pulse');
    setTimeout(() => input.classList.remove('pulse'), 220);
}
