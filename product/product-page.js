// 1. Helper Functions
function updateMetaTag(selector, attr, value) {
    const element = document.querySelector(selector);
    if (element) {
        element.setAttribute(attr, value);
    }
}

const esc = (str) => (str || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// 2. Google Rich Snippets (Price, Image, Availability) සදහා JSON-LD Schema Update කිරීම
function updateSchemaData(product) {
    let script = document.querySelector('script[type="application/ld+json"]');
    
    if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
    }

    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.nameEn,
        "image": [product.image],
        "description": product.description || `${product.nameEn} - ${product.nameSi || ''} available at Books Corner Sri Lanka.`,
        "sku": String(product.id || product.slug),
        "brand": {
            "@type": "Brand",
            "name": "Books Corner"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "LKR",
            "price": product.price,
            "priceValidUntil": "2027-12-31",
            "itemCondition": "https://schema.org/NewCondition",
            "availability": "https://schema.org/InStock"
        }
    };

    script.textContent = JSON.stringify(schemaData);
}

// 3. Main Product Load Function
function loadSingleProduct() {
    const productWrapper = document.getElementById('single-product-wrapper');
    const productSuggestion = document.getElementById('productsGridContainerX');
    if (!productWrapper) return;

    // Get Slug from URL Path or Query Parameter
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    let slug = pathSegments.pop();

    if (!slug || slug === 'product' || slug === 'index.html') {
        const urlParams = new URLSearchParams(window.location.search);
        slug = urlParams.get('slug');
    }

    // Validate & Find Product
    if (!slug || typeof webProducts === 'undefined') {
        productWrapper.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Product not found!</h2></div>`;
        return;
    }

    const product = webProducts.find(p => p.slug === slug);

    if (!product) {
        productWrapper.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Product not found!</h2></div>`;
        return;
    }

    // --- SEO, Social Share & Google Price Schema Update ---
    const pageTitle = `${product.nameEn} | Books Corner Akuru Kiyaweema`;
    document.title = pageTitle;

    const metaDesc = product.description || `${product.nameEn} - ${product.nameSi || ''} available at Books Corner Akuru Kiyaweema Sri Lanka.`;

    updateMetaTag('meta[name="description"]', 'content', metaDesc);
    updateMetaTag('meta[property="og:title"]', 'content', pageTitle);
    updateMetaTag('meta[property="og:description"]', 'content', metaDesc);
    updateMetaTag('meta[property="og:image"]', 'content', product.image);
    updateMetaTag('meta[property="product:price:amount"]', 'content', product.price);
    updateMetaTag('meta[property="product:price:currency"]', 'content', 'LKR');

    // Google Rich Snippet Update Call
    updateSchemaData(product);

    // Calculate Discount & Related Products
    const relatedProducts = webProducts.filter(
        p => p.category === product.category && p.slug !== product.slug
    );

    const oldPrice = product.oldPrice || product.price;
    const hasDiscount = oldPrice > product.price;
    const discount = hasDiscount ? Math.round(((oldPrice - product.price) / oldPrice) * 100) : 0;

    // Render Main Product UI
    productWrapper.innerHTML = `
        <div class="product-page-card swiper-slide featured-slide" style="background: linear-gradient(130deg, #644100 5%, #100018 15%, #080018 80%, #645a00 100%); margin-top: 2rem;">
            ${hasDiscount ? `<span class="discount-label">${discount}% OFF</span>` : ''}
            
            <div class="featured-slide-img">
                <img class="productPageImg" src="${esc(product.image)}" alt="${esc(product.nameEn)}" style="border-radius:10px">
            </div>
                        
            <div class="featured-slide-body">
                <div class="featured-slide-cat">${esc(product.category)}</div>
                <div class="featured-slide-name">${esc(product.nameEn)}</div>
                <div class="product-detail-name-si si" style="color:#aaa; margin-top: 4px;">${esc(product.nameSi)}</div>
                
                <div class="featured-slide-price" style="margin-top: 15px;">
                    Rs. ${product.price.toLocaleString()}
                    ${hasDiscount ? `<span class="price-old" style="margin-left: 10px; text-decoration: line-through; opacity: 0.7;">Rs. ${oldPrice.toLocaleString()}</span>` : ''}
                </div>

                <div class="product-actions" style="margin-top: 25px;">
                    <button class="btn btn-gold btn-sm" 
                        data-add-cart
                        data-id="${product.id}"
                        data-name-en="${esc(product.nameEn)}"
                        data-name-si="${esc(product.nameSi)}"
                        data-price="${product.price}"
                        data-image="${esc(product.image)}"
                        data-slug="${esc(product.slug)}">
                        <i class="bi bi-bag-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>

        <hr style="margin: 3rem 0; border-color: rgba(255,255,255,0.1);">
    `;

    // Render Related Products Suggestions
    if (productSuggestion) {
        productSuggestion.innerHTML = `
            <div class="section-title" style="text-align: center; margin-bottom: 1.5rem;">
                <h2 id="productsHeading">~ You May Also Like ~</h2>
                <div class="title-line"></div>
            </div>
            
            <div class="products-grid"
                 id="productsGridContainer"
                 data-root=""
                 data-category="${esc(product.category)}">
            </div>
        `;

        if (typeof displayProducts === 'function') {
            displayProducts(relatedProducts, true);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadSingleProduct);
