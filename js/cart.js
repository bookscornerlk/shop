/* =========================================================
   Books Corner — Cart Manager
   WhatsApp Checkout + Customer Details
   ========================================================= */

const CartManager = (() => {

    const KEY = 'bc_cart';


    /* =====================================================
       Get Cart
       ===================================================== */

    function get() {
        try {
            return JSON.parse(
                localStorage.getItem(KEY)
            ) || [];
        } catch {
            return [];
        }
    }


    /* =====================================================
       Save Cart
       ===================================================== */

    function save(cart) {

        localStorage.setItem(
            KEY,
            JSON.stringify(cart)
        );

        document.dispatchEvent(
            new CustomEvent('cartUpdated', {
                detail: { cart }
            })
        );
    }


    /* =====================================================
       Add Product
       ===================================================== */

    function add(product) {

        const cart = get();

        const idx = cart.findIndex(
            item => item.id === product.id
        );

        if (idx >= 0) {

            cart[idx].qty =
                Number(cart[idx].qty || 0) + 1;

        } else {

            cart.push({
                ...product,
                qty: 1
            });
        }

        save(cart);
    }


    /* =====================================================
       Remove Product
       ===================================================== */

    function remove(id) {

        save(
            get().filter(
                item => item.id !== id
            )
        );
    }


    /* =====================================================
       Update Quantity
       ===================================================== */

    function update(id, qty) {

        qty = Math.max(
            1,
            parseInt(qty, 10) || 1
        );

        const cart = get();

        const idx = cart.findIndex(
            item => item.id === id
        );

        if (idx >= 0) {

            cart[idx].qty = qty;

            save(cart);
        }
    }


    /* =====================================================
       Clear Cart
       ===================================================== */

    function clear() {

        localStorage.removeItem(KEY);

        document.dispatchEvent(
            new CustomEvent('cartUpdated', {
                detail: {
                    cart: []
                }
            })
        );
    }


    /* =====================================================
       Item Count
       ===================================================== */

    function count() {

        return get().reduce(
            (sum, item) =>
                sum + Number(item.qty || 0),
            0
        );
    }


    /* =====================================================
       Cart Total
       ===================================================== */

    function total() {

        return get().reduce(
            (sum, item) =>
                sum +
                (
                    Number(item.qty || 0) *
                    Number(item.price || 0)
                ),
            0
        );
    }


    /* =====================================================
       Generate Order ID
       ===================================================== */

    function generateOrderId() {

        if (
            typeof crypto !== 'undefined' &&
            typeof crypto.randomUUID === 'function'
        ) {

            return (
                'BC-' +
                crypto
                    .randomUUID()
                    .split('-')[0]
                    .toUpperCase()
            );
        }

        return (
            'BC-' +
            Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase()
        );
    }


    /* =====================================================
       Build Customer WhatsApp Message
       ===================================================== */

    function buildWhatsAppMessage(
        waNumber,
        deliveryCharge,
        customer = {}
    ) {

        const cart = get();

        if (!cart.length) {
            return null;
        }

        deliveryCharge =
            parseFloat(deliveryCharge) || 0;


        const orderId =
            customer.orderId ||
            generateOrderId();


        /* -------------------------------------------------
           Product Lines
           ------------------------------------------------- */

        const lines = cart
            .map((item, index) => {

                const qty =
                    Number(item.qty || 0);

                const price =
                    Number(item.price || 0);

                const lineTotal =
                    qty * price;

                return (
                    `${index + 1}. *${item.name_en || 'Product'}*\n` +
                    `   Qty: ${qty} × Rs.${price.toLocaleString()} = ` +
                    `Rs.${lineTotal.toLocaleString()}`
                );

            })
            .join('\n\n');


        /* -------------------------------------------------
           Totals
           ------------------------------------------------- */

        const subtotal =
            total();

        const grandTotal =
            subtotal + deliveryCharge;


        /* -------------------------------------------------
           Date / Time
           ------------------------------------------------- */

        const now = new Date();

        const date =
            now.toLocaleDateString(
                'en-US',
                {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }
            );

        const time =
            now.toLocaleTimeString(
                'en-US',
                {
                    hour: 'numeric',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }
            );

        const orderDate =
            `${date} ${time}`;


        /* -------------------------------------------------
           Customer Details Message
           ------------------------------------------------- */

        const msg =
`*🛒 NEW ORDER — BOOKS CORNER*

📦 *Order ID:* ${orderId}
📅 *Order Date:* ${orderDate}

━━━━━━━━━━━━━━━━━━
*CUSTOMER DETAILS*
━━━━━━━━━━━━━━━━━━

👤 *Name:* ${customer.name || '-'}
📞 *Phone:* ${customer.phone || '-'}
🏠 *Address:* ${customer.address || '-'}
📍 *Nearest City:* ${customer.city || '-'}

━━━━━━━━━━━━━━━━━━
*ORDER DETAILS*
━━━━━━━━━━━━━━━━━━

${lines}

━━━━━━━━━━━━━━━━━━

💰 *Subtotal:* Rs. ${subtotal.toLocaleString()}
🚚 *Delivery:* Rs. ${deliveryCharge.toLocaleString()}
💵 *TOTAL:* Rs. ${grandTotal.toLocaleString()}

━━━━━━━━━━━━━━━━━━

Please confirm my order and delivery details.

Thank you! ❤️

*Books Corner*`;


        /* -------------------------------------------------
           Correct WhatsApp URL
           ------------------------------------------------- */

        return (
            `https://wa.me/${waNumber}` +
            `?text=${encodeURIComponent(msg)}`
        );
    }


    /* =====================================================
       Build Cart-Only WhatsApp Message
       ===================================================== */

    function buildCartOnlyWhatsAppMessage(
        waNumber,
        deliveryCharge
    ) {

        const cart = get();

        if (!cart.length) {
            return null;
        }

        deliveryCharge =
            parseFloat(deliveryCharge) || 0;


        const orderId =
            generateOrderId();


        /* -------------------------------------------------
           Product Lines
           ------------------------------------------------- */

        const lines = cart
            .map((item, index) => {

                const qty =
                    Number(item.qty || 0);

                const price =
                    Number(item.price || 0);

                const lineTotal =
                    qty * price;

                return (
                    `${index + 1}. *${item.name_en || 'Product'}*\n` +
                    `   Qty: ${qty} × Rs.${price.toLocaleString()} = ` +
                    `Rs.${lineTotal.toLocaleString()}`
                );

            })
            .join('\n\n');


        /* -------------------------------------------------
           Totals
           ------------------------------------------------- */

        const subtotal =
            total();

        const grandTotal =
            subtotal + deliveryCharge;


        /* -------------------------------------------------
           Date / Time
           ------------------------------------------------- */

        const now = new Date();

        const date =
            now.toLocaleDateString(
                'en-US',
                {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                }
            );

        const time =
            now.toLocaleTimeString(
                'en-US',
                {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }
            );


        /* -------------------------------------------------
           Cart Only Message
           ------------------------------------------------- */

        const msg =
`*🛍️ BOOKS CORNER — CART INQUIRY*

📦 *Reference:* ${orderId}
📅 *Date:* ${date}
⏰ *Time:* ${time}

━━━━━━━━━━━━━━━━━━
*SELECTED ITEMS*
━━━━━━━━━━━━━━━━━━

${lines}

━━━━━━━━━━━━━━━━━━

💰 *Subtotal:* Rs. ${subtotal.toLocaleString()}
🚚 *Delivery:* Rs. ${deliveryCharge.toLocaleString()}
💵 *TOTAL:* Rs. ${grandTotal.toLocaleString()}

━━━━━━━━━━━━━━━━━━

Hello Books Corner 👋
I would like to check the availability of these items.

Thank you! ❤️`;


        return (
            `https://wa.me/${waNumber}` +
            `?text=${encodeURIComponent(msg)}`
        );
    }


    return {
        get,
        add,
        remove,
        update,
        clear,
        count,
        total,
        buildWhatsAppMessage,
        buildCartOnlyWhatsAppMessage
    };

})();



/* =========================================================
   DOM READY
   ========================================================= */

document.addEventListener(
    'DOMContentLoaded',
    () => {


        /* =================================================
           Add To Cart
           ================================================= */

        document.addEventListener(
            'click',
            e => {

                const btn =
                    e.target.closest(
                        '[data-add-cart]'
                    );

                if (!btn) return;

                e.preventDefault();


                const product = {

                    id:
                        parseInt(
                            btn.dataset.id,
                            10
                        ),

                    name_en:
                        btn.dataset.nameEn || '',

                    name_si:
                        btn.dataset.nameSi || '',

                    price:
                        parseFloat(
                            btn.dataset.price
                        ) || 0,

                    image:
                        btn.dataset.image || '',

                    slug:
                        btn.dataset.slug || ''
                };


                CartManager.add(product);


                if (
                    typeof updateCartBadge ===
                    'function'
                ) {
                    updateCartBadge();
                }


                if (
                    typeof showCartToast ===
                    'function'
                ) {
                    showCartToast(
                        product.name_en
                    );
                }


                /* Button feedback */

                btn.classList.add('added');

                const originalHTML =
                    btn.innerHTML;

                btn.innerHTML =
                    '<i class="bi bi-check-lg"></i> Added!';


                setTimeout(
                    () => {

                        btn.innerHTML =
                            originalHTML;

                        btn.classList.remove(
                            'added'
                        );

                    },
                    1400
                );

            }
        );


        /* =================================================
           Initial Cart Render
           ================================================= */

        if (
            document.getElementById(
                'cartItems'
            )
        ) {

            renderCart();
        }


        /* =================================================
           Cart Updated
           ================================================= */

        document.addEventListener(
            'cartUpdated',
            () => {

                if (
                    document.getElementById(
                        'cartItems'
                    )
                ) {

                    renderCart();
                }


                if (
                    typeof updateCartBadge ===
                    'function'
                ) {

                    updateCartBadge();
                }

            }
        );


        /* =================================================
           Checkout Button
           ================================================= */

        document.addEventListener(
            'click',
            e => {

                const btn =
                    e.target.closest(
                        '#checkoutWhatsapp'
                    );

                if (!btn) return;

                e.preventDefault();
                e.stopPropagation();


                const cart =
                    CartManager.get();


                if (!cart.length) {

                    alert(
                        'Your cart is empty.'
                    );

                    return;
                }


                openCustomerDetailsModal();

            }
        );

    }
);



/* =========================================================
   Delivery Charge
   ========================================================= */

function getDeliveryCharge() {

    const cart =
        CartManager.get();

    const specialIds = [
        5,
        12,
        74
    ];

    return cart.some(
        item =>
            specialIds.includes(
                Number(item.id)
            )
    )
        ? 450
        : 350;
}



/* =========================================================
   Render Cart
   ========================================================= */

function renderCart() {

    const cart =
        CartManager.get();

    const container =
        document.getElementById(
            'cartItems'
        );

    const summary =
        document.getElementById(
            'cartSummary'
        );


    if (!container) {
        return;
    }


    /* =====================================================
       Empty Cart
       ===================================================== */

    if (!cart.length) {

        container.innerHTML = `

            <div class="cart-empty">

                <i class="bi bi-cart-x"></i>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Browse our ceremony packages
                    and stationery to add items
                    to your order.
                </p>

                <a
                    href="products"
                    class="btn btn-gold"
                >
                    Browse Products
                </a>

            </div>

        `;


        if (summary) {
            summary.style.display = 'none';
        }

        return;
    }


    if (summary) {
        summary.style.display = '';
    }


    /* =====================================================
       Cart Rows
       ===================================================== */

    const rows =
        cart.map(item => {

            const qty =
                Number(item.qty || 1);

            const price =
                Number(item.price || 0);

            const itemTotal =
                qty * price;


            return `

                <tr>

                    <td>

                        <img
                            src="${item.image || '/shop/images/favicon.png'}"
                            alt="${escHtml(
                                item.name_en || ''
                            )}"
                            class="cart-item-img"
                        >

                    </td>


                    <td>

                        <div
                            class="cart-item-name"
                        >
                            ${escHtml(
                                item.name_en || ''
                            )}
                        </div>

                        <div
                            class="cart-item-name-si"
                        >
                            ${escHtml(
                                item.name_si || ''
                            )}
                        </div>

                    </td>


                    <td>
                        Rs.${price.toLocaleString()}
                    </td>


                    <td>

                        <div class="qty-stepper">

                            <button
                                type="button"
                                onclick="
                                    CartManager.update(
                                        ${item.id},
                                        ${Math.max(
                                            1,
                                            qty - 1
                                        )}
                                    );
                                    pulseStepper(this)
                                "
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>


                            <input
                                type="number"
                                value="${qty}"
                                min="1"
                                onchange="
                                    CartManager.update(
                                        ${item.id},
                                        this.value
                                    )
                                "
                                aria-label="Quantity"
                            >


                            <button
                                type="button"
                                onclick="
                                    CartManager.update(
                                        ${item.id},
                                        ${qty + 1}
                                    );
                                    pulseStepper(this)
                                "
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                        </div>

                    </td>


                    <td>

                        <strong>
                            Rs.${itemTotal.toLocaleString()}
                        </strong>

                    </td>


                    <td>

                        <button
                            type="button"
                            class="cart-remove"
                            data-remove-id="${item.id}"
                            aria-label="Remove item"
                        >
                            <i class="bi bi-trash"></i>
                        </button>

                    </td>

                </tr>

            `;

        }).join('');


    /* =====================================================
       Cart Table
       ===================================================== */

    container.innerHTML = `

        <table class="cart-table">

            <thead>

                <tr>

                    <th style="width:80px">
                        Image
                    </th>

                    <th>
                        Product
                    </th>

                    <th>
                        Price
                    </th>

                    <th style="width:140px">
                        Qty
                    </th>

                    <th>
                        Total
                    </th>

                    <th style="width:48px">
                    </th>

                </tr>

            </thead>


            <tbody>
                ${rows}
            </tbody>

        </table>

    `;


    /* =====================================================
       Update Summary
       ===================================================== */

    if (summary) {

        const subtotal =
            CartManager.total();

        const delivery =
            getDeliveryCharge();

        const grandTotal =
            subtotal + delivery;

        const itemCount =
            CartManager.count();


        const countEl =
            summary.querySelector(
                '#summaryCount'
            );

        const subtotalEl =
            summary.querySelector(
                '#summarySubtotal'
            );

        const deliveryEl =
            summary.querySelector(
                '#summaryDelivery'
            );

        const totalEl =
            summary.querySelector(
                '#summaryTotal'
            );


        if (countEl) {

            countEl.textContent =
                `${itemCount} item${
                    itemCount !== 1
                        ? 's'
                        : ''
                }`;
        }


        if (subtotalEl) {

            subtotalEl.textContent =
                `Rs. ${subtotal.toLocaleString()}`;
        }


        if (deliveryEl) {

            deliveryEl.textContent =
                `Rs. ${delivery.toLocaleString()}`;
        }


        if (totalEl) {

            totalEl.textContent =
                `Rs. ${grandTotal.toLocaleString()}`;
        }

    }
}



/* =========================================================
   Escape HTML
   ========================================================= */

function escHtml(str) {

    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}



/* =========================================================
   CUSTOMER CHECKOUT MODAL
   ========================================================= */

function openCustomerDetailsModal() {

    /* Remove existing modal */

    const oldModal =
        document.getElementById(
            'bcCustomerOverlay'
        );

    if (oldModal) {
        oldModal.remove();
    }


    /* Make sure cart has items */

    const cart =
        CartManager.get();

    if (!cart.length) {

        alert(
            'Your cart is empty.'
        );

        return;
    }


    /* Create modal */

    const modal =
        document.createElement(
            'div'
        );

    modal.id =
        'bcCustomerOverlay';


    /* -----------------------------------------------------
       Modal HTML
       ----------------------------------------------------- */

    modal.innerHTML = `

        <div
            class="bc-customer-overlay-bg"
            id="bcCustomerBackdrop"
        ></div>


        <div
            class="bc-customer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bcCustomerTitle"
        >


            <!-- Close -->

            <button
                type="button"
                class="bc-customer-close"
                id="bcCustomerClose"
                aria-label="Close"
            >
                <i class="bi bi-x-lg"></i>
            </button>


            <!-- Header -->

            <div class="bc-customer-top">

                <div class="bc-customer-icon">

                    <i
                        class="bi bi-bag-check"
                    ></i>

                </div>


                <div>

                    <span class="bc-small-label">
                        BOOKS CORNER
                    </span>

                    <h2 id="bcCustomerTitle">
                        How would you like to order?
                    </h2>

                    <p>
                        Choose how you'd like to send
                        your cart to us on WhatsApp.
                    </p>

                </div>

            </div>


            <!-- =================================================
                 OPTION 1 — CUSTOMER DETAILS
                 ================================================= -->

            <button
                type="button"
                class="bc-checkout-option bc-details-option"
                id="bcDetailsOption"
            >

                <div class="bc-option-icon">

                    <i
                        class="bi bi-person-vcard"
                    ></i>

                </div>


                <div class="bc-option-content">

                    <strong>
                        Continue with delivery details
                    </strong>

                    <small>
                        Name, phone, address &amp;
                        nearest city
                    </small>

                </div>


                <i
                    class="bi bi-arrow-right bc-option-arrow"
                ></i>

            </button>


            <!-- =================================================
                 OPTION 2 — CART ONLY
                 ================================================= -->

            <button
                type="button"
                class="bc-checkout-option bc-cart-only-option"
                id="bcCartOnlyOption"
            >

                <div class="bc-option-icon">

                    <i class="bi bi-cart3"></i>

                </div>


                <div class="bc-option-content">

                    <strong>
                        Send cart only
                    </strong>

                    <small>
                        Send selected items directly,
                        without customer details
                    </small>

                </div>


                <i
                    class="bi bi-arrow-right bc-option-arrow"
                ></i>

            </button>


            <!-- =================================================
                 CUSTOMER DETAILS PANEL
                 ================================================= -->

            <div
                class="bc-details-panel"
                id="bcDetailsPanel"
                hidden
            >


                <div class="bc-panel-heading">

                    <button
                        type="button"
                        class="bc-panel-back"
                        id="bcPanelBack"
                        aria-label="Back"
                    >
                        <i class="bi bi-arrow-left"></i>
                    </button>


                    <div>

                        <strong>
                            Delivery details
                        </strong>

                        <small>
                            We'll include these
                            in your WhatsApp order.
                        </small>

                    </div>

                </div>


                <form
                    id="bcCustomerForm"
                    autocomplete="on"
                    novalidate
                >


                    <!-- Name -->

                    <div class="bc-form-group">

                        <label
                            for="bcCustomerName"
                        >
                            Full Name
                        </label>


                        <div
                            class="bc-input-box"
                        >

                            <i
                                class="bi bi-person"
                            ></i>


                            <input
                                id="bcCustomerName"
                                name="name"
                                type="text"
                                placeholder="Enter your full name"
                                autocomplete="name"
                                required
                            >

                        </div>


                        <small
                            class="bc-inline-error"
                            data-error="name"
                        ></small>

                    </div>


                    <!-- Phone -->

                    <div class="bc-form-group">

                        <label
                            for="bcCustomerPhone"
                        >
                            Phone Number
                        </label>


                        <div
                            class="bc-input-box"
                        >

                            <i
                                class="bi bi-telephone"
                            ></i>


                            <input
                                id="bcCustomerPhone"
                                name="phone"
                                type="tel"
                                inputmode="tel"
                                placeholder="07XXXXXXXX"
                                autocomplete="tel"
                                required
                            >

                        </div>


                        <small
                            class="bc-inline-error"
                            data-error="phone"
                        ></small>

                    </div>


                    <!-- Address -->

                    <div class="bc-form-group">

                        <label
                            for="bcCustomerAddress"
                        >
                            Full Address
                        </label>


                        <div
                            class="bc-input-box bc-textarea-box"
                        >

                            <i
                                class="bi bi-house-door"
                            ></i>


                            <textarea
                                id="bcCustomerAddress"
                                name="address"
                                rows="3"
                                placeholder="House number, street, area..."
                                autocomplete="street-address"
                                required
                            ></textarea>

                        </div>


                        <small
                            class="bc-inline-error"
                            data-error="address"
                        ></small>

                    </div>


                    <!-- City -->

                    <div class="bc-form-group">

                        <label
                            for="bcCustomerCity"
                        >
                            Nearest City
                        </label>


                        <div
                            class="bc-input-box"
                        >

                            <i
                                class="bi bi-geo-alt"
                            ></i>


                            <input
                                id="bcCustomerCity"
                                name="city"
                                type="text"
                                placeholder="e.g. Negombo"
                                autocomplete="address-level2"
                                required
                            >

                        </div>


                        <small
                            class="bc-inline-error"
                            data-error="city"
                        ></small>

                    </div>


                    <!-- Note -->

                    <div class="bc-private-note">

                        <i
                            class="bi bi-shield-check"
                        ></i>


                        <span>
                            Your details will be
                            included with your
                            WhatsApp order.
                        </span>

                    </div>


                    <!-- Submit -->

                    <button
                        type="submit"
                        class="bc-whatsapp-submit"
                    >

                        <span>
                            Continue to WhatsApp
                        </span>

                        <i
                            class="bi bi-whatsapp"
                        ></i>

                    </button>

                </form>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    /* Open animation */

    requestAnimationFrame(() => {

        modal.classList.add(
            'show'
        );

    });


    /* =====================================================
       Close Button
       ===================================================== */

    const closeButton =
        document.getElementById(
            'bcCustomerClose'
        );


    closeButton.addEventListener(
        'click',
        closeCustomerDetailsModal
    );


    /* =====================================================
       Backdrop
       ===================================================== */

    const backdrop =
        document.getElementById(
            'bcCustomerBackdrop'
        );


    backdrop.addEventListener(
        'click',
        closeCustomerDetailsModal
    );


    /* =====================================================
       ESC
       ===================================================== */

    document.addEventListener(
        'keydown',
        customerModalEscHandler
    );


    /* =====================================================
       Customer Details Option
       ===================================================== */

    const detailsOption =
        document.getElementById(
            'bcDetailsOption'
        );

    const cartOnlyOption =
        document.getElementById(
            'bcCartOnlyOption'
        );

    const detailsPanel =
        document.getElementById(
            'bcDetailsPanel'
        );


    detailsOption.addEventListener(
        'click',
        () => {

            detailsPanel.hidden =
                false;

            detailsOption.hidden =
                true;

            cartOnlyOption.hidden =
                true;

        }
    );


    /* =====================================================
       Back To Options
       ===================================================== */

    document
        .getElementById(
            'bcPanelBack'
        )
        .addEventListener(
            'click',
            () => {

                detailsPanel.hidden =
                    true;

                detailsOption.hidden =
                    false;

                cartOnlyOption.hidden =
                    false;

            }
        );


    /* =====================================================
       Cart Only
       ===================================================== */

    cartOnlyOption.addEventListener(
        'click',
        () => {

            sendCartOnlyToWhatsApp();

        }
    );


    /* =====================================================
       Customer Form Submit
       ===================================================== */

    const form =
        document.getElementById(
            'bcCustomerForm'
        );


    form.addEventListener(
        'submit',
        e => {

            e.preventDefault();


            const name =
                document
                    .getElementById(
                        'bcCustomerName'
                    )
                    .value
                    .trim();


            const phone =
                document
                    .getElementById(
                        'bcCustomerPhone'
                    )
                    .value
                    .trim();


            const address =
                document
                    .getElementById(
                        'bcCustomerAddress'
                    )
                    .value
                    .trim();


            const city =
                document
                    .getElementById(
                        'bcCustomerCity'
                    )
                    .value
                    .trim();


            let valid = true;


            /* Name */

            if (name.length < 2) {

                showCustomerError(
                    'name',
                    'Please enter your full name.'
                );

                valid = false;

            } else {

                clearCustomerError(
                    'name'
                );
            }


            /* Phone */

            const phoneDigits =
                phone.replace(
                    /\D/g,
                    ''
                );


            const validPhone =
                /^(?:0?7\d{8}|947\d{8})$/
                    .test(
                        phoneDigits
                    );


            if (!validPhone) {

                showCustomerError(
                    'phone',
                    'Please enter a valid Sri Lankan phone number.'
                );

                valid = false;

            } else {

                clearCustomerError(
                    'phone'
                );
            }


            /* Address */

            if (address.length < 5) {

                showCustomerError(
                    'address',
                    'Please enter your delivery address.'
                );

                valid = false;

            } else {

                clearCustomerError(
                    'address'
                );
            }


            /* City */

            if (city.length < 2) {

                showCustomerError(
                    'city',
                    'Please enter your nearest city.'
                );

                valid = false;

            } else {

                clearCustomerError(
                    'city'
                );
            }


            if (!valid) {
                return;
            }


            /* Save customer details */

            try {

                localStorage.setItem(
                    'bc_customer_details',
                    JSON.stringify({
                        name,
                        phone,
                        address,
                        city
                    })
                );

            } catch (error) {

                console.warn(
                    'Could not save customer details.',
                    error
                );
            }


            /* Send */

            sendCustomerOrderToWhatsApp({

                name,
                phone,
                address,
                city

            });

        }
    );


    /* =====================================================
       Load Saved Customer Details
       ===================================================== */

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    'bc_customer_details'
                )
            );


        if (saved) {

            const nameField =
                document.getElementById(
                    'bcCustomerName'
                );

            const phoneField =
                document.getElementById(
                    'bcCustomerPhone'
                );

            const addressField =
                document.getElementById(
                    'bcCustomerAddress'
                );

            const cityField =
                document.getElementById(
                    'bcCustomerCity'
                );


            if (nameField) {
                nameField.value =
                    saved.name || '';
            }

            if (phoneField) {
                phoneField.value =
                    saved.phone || '';
            }

            if (addressField) {
                addressField.value =
                    saved.address || '';
            }

            if (cityField) {
                cityField.value =
                    saved.city || '';
            }

        }

    } catch (error) {

        console.warn(
            'Could not load saved customer details.',
            error
        );
    }

}



/* =========================================================
   Customer Order → WhatsApp
   ========================================================= */

function sendCustomerOrderToWhatsApp(
    customer
) {

    const checkoutBtn =
        document.getElementById(
            'checkoutWhatsapp'
        );


    const waNumber =
        checkoutBtn?.dataset?.wa ||
        '94761909344';


    const delivery =
        getDeliveryCharge();


    const url =
        CartManager.buildWhatsAppMessage(
            waNumber,
            delivery,
            customer
        );


    if (!url) {

        alert(
            'Your cart is empty.'
        );

        return;
    }


    window.location.href =
        url;
}



/* =========================================================
   Cart Only → WhatsApp
   ========================================================= */

function sendCartOnlyToWhatsApp() {

    const cart =
        CartManager.get();


    if (!cart.length) {

        alert(
            'Your cart is empty.'
        );

        return;
    }


    const checkoutBtn =
        document.getElementById(
            'checkoutWhatsapp'
        );


    const waNumber =
        checkoutBtn?.dataset?.wa ||
        '94761909344';


    const delivery =
        getDeliveryCharge();


    const url =
        CartManager.buildCartOnlyWhatsAppMessage(
            waNumber,
            delivery
        );


    if (!url) {

        alert(
            'Your cart is empty.'
        );

        return;
    }


    window.location.href =
        url;
}



/* =========================================================
   Customer Modal ESC
   ========================================================= */

function customerModalEscHandler(e) {

    if (
        e.key === 'Escape'
    ) {

        closeCustomerDetailsModal();
    }
}



/* =========================================================
   Close Customer Modal
   ========================================================= */

function closeCustomerDetailsModal() {

    const modal =
        document.getElementById(
            'bcCustomerOverlay'
        );


    if (!modal) {
        return;
    }


    modal.classList.remove(
        'show'
    );


    setTimeout(
        () => {

            if (modal) {
                modal.remove();
            }


            document.removeEventListener(
                'keydown',
                customerModalEscHandler
            );

        },
        260
    );
}



/* =========================================================
   Customer Field Error
   ========================================================= */

function showCustomerError(
    field,
    message
) {

    const error =
        document.querySelector(
            `[data-error="${field}"]`
        );


    if (error) {

        error.textContent =
            message;
    }
}


function clearCustomerError(
    field
) {

    const error =
        document.querySelector(
            `[data-error="${field}"]`
        );


    if (error) {

        error.textContent =
            '';
    }
}



/* =========================================================
   Cart Remove Animation
   ========================================================= */

document.addEventListener(
    'click',
    e => {

        const btn =
            e.target.closest(
                '[data-remove-id]'
            );


        if (!btn) {
            return;
        }


        const id =
            parseInt(
                btn.dataset.removeId,
                10
            );


        const row =
            btn.closest('tr');


        if (row) {

            row.style.transition =
                'opacity .28s ease, transform .28s ease';

            row.style.opacity =
                '0';

            row.style.transform =
                'translateX(16px)';


            setTimeout(
                () => {

                    CartManager.remove(
                        id
                    );

                },
                290
            );

        } else {

            CartManager.remove(
                id
            );
        }

    }
);



/* =========================================================
   Cart Toast
   ========================================================= */

function showCartToast(name) {

    const toast =
        document.createElement(
            'div'
        );


    toast.className =
        'cart-toast';


    toast.innerHTML = `

        <i class="bi bi-bag-check-fill"></i>

        <span>

            <strong>
                ${escHtml(name)}
            </strong>

            added to cart

        </span>

    `;


    document.body.appendChild(
        toast
    );


    requestAnimationFrame(
        () => {

            requestAnimationFrame(
                () => {

                    toast.classList.add(
                        'show'
                    );

                }
            );

        }
    );


    setTimeout(
        () => {

            toast.classList.remove(
                'show'
            );


            setTimeout(
                () => {

                    toast.remove();

                },
                300
            );

        },
        2500
    );
}



/* =========================================================
   Quantity Stepper Pulse
   ========================================================= */

function pulseStepper(btn) {

    const input =
        btn
            .closest('.qty-stepper')
            ?.querySelector(
                'input'
            );


    if (!input) {
        return;
    }


    input.classList.remove(
        'pulse'
    );


    void input.offsetWidth;


    input.classList.add(
        'pulse'
    );


    setTimeout(
        () => {

            input.classList.remove(
                'pulse'
            );

        },
        220
    );
}
