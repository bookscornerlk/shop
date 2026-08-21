// ============================================================
// BOOKS CORNER - SINGLE PRODUCT PAGE
// Supabase Database Version
// ============================================================

// 1. Helper
function updateMetaTag(selector, attr, value) {
    const element = document.querySelector(selector);

    if (element && value !== undefined && value !== null) {
        element.setAttribute(attr, value);
    }
}

function esc(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


// ============================================================
// 2. Google Schema
// ============================================================

function updateSchemaData(product) {

    let script = document.querySelector(
        'script[type="application/ld+json"]'
    );

    if (!script) {
        script = document.createElement("script");
        script.type = "application/ld+json";
        document.head.appendChild(script);
    }

    const imageUrl = product.image || product.image_url || "";

    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",

        "name": product.nameEn,

        "image": [
            new URL(imageUrl, window.location.origin).href
        ],

        "description":
            product.description ||
            `${product.nameEn} - ${product.nameSi || ""} available at Books Corner Sri Lanka.`,

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


// ============================================================
// 3. Get Slug
// ============================================================

function getProductSlug() {

    const urlParams = new URLSearchParams(
        window.location.search
    );

    // Primary method:
    // product/index.html?slug=the-classic-package
    let slug = urlParams.get("slug");

    if (slug) {
        return slug.trim();
    }

    // Fallback for clean URL
    const pathSegments = window.location.pathname
        .split("/")
        .filter(Boolean);

    if (pathSegments.length) {

        const last = pathSegments[pathSegments.length - 1];

        if (
            last !== "product" &&
            last !== "index.html"
        ) {
            return decodeURIComponent(last);
        }
    }

    return null;
}


// ============================================================
// 4. Convert Database Row → Website Product Object
// ============================================================

function normalizeProduct(row) {

    return {
        id: row.id,

        nameEn: row.name_en,
        nameSi: row.name_si,

        category: row.category,

        price: Number(row.price || 0),
        oldPrice: Number(row.old_price || row.price || 0),

        image: row.image_url || row.image || "",

        slug: row.slug,

        description: row.description || ""
    };
}


// ============================================================
// 5. Load Single Product
// ============================================================

async function loadSingleProduct() {

    const productWrapper =
        document.getElementById("single-product-wrapper");

    const productSuggestion =
        document.getElementById("productsGridContainerX") ||
        document.getElementById("productsGridContainer");

    if (!productWrapper) {
        return;
    }


    // --------------------------------------------------------
    // Get slug
    // --------------------------------------------------------

    const slug = getProductSlug();

    if (!slug) {

        productWrapper.innerHTML = `
            <div style="text-align:center;padding:50px;">
                <h2>Product not found!</h2>
            </div>
        `;

        return;
    }


    // --------------------------------------------------------
    // Check Supabase
    // --------------------------------------------------------

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "Supabase client is not available."
        );

        productWrapper.innerHTML = `
            <div style="text-align:center;padding:50px;">
                <h2>Unable to load product.</h2>
                <p>Database connection is not available.</p>
            </div>
        `;

        return;
    }


    // --------------------------------------------------------
    // Show loading
    // --------------------------------------------------------

    productWrapper.innerHTML = `
        <div style="
            text-align:center;
            padding:70px 20px;
        ">
            <div class="ak-spinner"></div>
            <p style="margin-top:20px;">
                Loading product...
            </p>
        </div>
    `;


    try {

        // ----------------------------------------------------
        // Get product from Supabase
        // ----------------------------------------------------

        const {
            data,
            error
        } = await supabaseClient
            .from("products")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();


        if (error) {

            console.error(
                "Supabase product error:",
                error
            );

            throw error;
        }


        if (!data) {

            productWrapper.innerHTML = `
                <div style="
                    text-align:center;
                    padding:70px 20px;
                ">
                    <h2>Product not found!</h2>
                    <p>
                        No product found for:
                        <strong>${esc(slug)}</strong>
                    </p>
                </div>
            `;

            return;
        }


        // ----------------------------------------------------
        // Convert DB row
        // ----------------------------------------------------

        const product = normalizeProduct(data);


        // ====================================================
        // SEO
        // ====================================================

        const pageTitle =
            `${product.nameEn} | Books Corner Akuru Kiyaweema`;

        document.title = pageTitle;


        const metaDesc =
            product.description ||
            `${product.nameEn} - ${product.nameSi || ""} available at Books Corner Akuru Kiyaweema Sri Lanka.`;


        updateMetaTag(
            'meta[name="description"]',
            "content",
            metaDesc
        );

        updateMetaTag(
            'meta[property="og:title"]',
            "content",
            pageTitle
        );

        updateMetaTag(
            'meta[property="og:description"]',
            "content",
            metaDesc
        );

        updateMetaTag(
            'meta[property="og:image"]',
            "content",
            product.image
        );

        updateMetaTag(
            'meta[property="product:price:amount"]',
            "content",
            product.price
        );

        updateMetaTag(
            'meta[property="product:price:currency"]',
            "content",
            "LKR"
        );


        updateSchemaData(product);


        // ====================================================
        // Price
        // ====================================================

        const oldPrice =
            product.oldPrice || product.price;

        const hasDiscount =
            oldPrice > product.price;

        const discount =
            hasDiscount
                ? Math.round(
                    ((oldPrice - product.price) /
                        oldPrice) * 100
                )
                : 0;


        // ====================================================
        // Main Product
        // ====================================================

        productWrapper.innerHTML = `

            <div
                class="product-page-card swiper-slide featured-slide"
                style="
                    background:
                    linear-gradient(
                        130deg,
                        #644100 5%,
                        #100018 15%,
                        #080018 80%,
                        #645a00 100%
                    );
                    margin-top:2rem;
                "
            >

                ${
                    hasDiscount
                        ? `
                            <span class="discount-label">
                                ${discount}% OFF
                            </span>
                          `
                        : ""
                }


                <div class="featured-slide-img">

                    <img
                        class="productPageImg"
                        src="${esc(product.image)}"
                        alt="${esc(product.nameEn)}"
                        style="border-radius:10px"
                    >

                </div>


                <div class="featured-slide-body">

                    <div class="featured-slide-cat">
                        ${esc(product.category)}
                    </div>


                    <div class="featured-slide-name">
                        ${esc(product.nameEn)}
                    </div>


                    <div
                        class="product-detail-name-si si"
                        style="
                            color:#aaa;
                            margin-top:4px;
                        "
                    >
                        ${esc(product.nameSi)}
                    </div>


                    <div
                        class="featured-slide-price"
                        style="margin-top:15px;"
                    >

                        Rs.
                        ${product.price.toLocaleString()}

                        ${
                            hasDiscount
                                ? `
                                    <span
                                        class="price-old"
                                        style="
                                            margin-left:10px;
                                            text-decoration:line-through;
                                            opacity:.7;
                                        "
                                    >
                                        Rs.
                                        ${oldPrice.toLocaleString()}
                                    </span>
                                  `
                                : ""
                        }

                    </div>


                    <div
                        class="product-actions"
                        style="margin-top:25px;"
                    >

                        <button
                            class="btn btn-gold btn-sm"
                            data-add-cart
                            data-id="${esc(product.id)}"
                            data-name-en="${esc(product.nameEn)}"
                            data-name-si="${esc(product.nameSi)}"
                            data-price="${product.price}"
                            data-image="${esc(product.image)}"
                            data-slug="${esc(product.slug)}"
                        >

                            <i class="bi bi-bag-plus"></i>

                            Add to Cart

                        </button>

                    </div>

                </div>

            </div>

            <hr
                style="
                    margin:3rem 0;
                    border-color:rgba(255,255,255,.1);
                "
            >

        `;


        // ====================================================
        // Related Products
        // ====================================================

        if (productSuggestion) {

            productSuggestion.innerHTML = `

                <div
                    class="section-title"
                    style="
                        text-align:center;
                        margin-bottom:1.5rem;
                    "
                >

                    <h2 id="productsHeading">
                        ~ You May Also Like ~
                    </h2>

                    <div class="title-line"></div>

                </div>


                <div
                    class="products-grid"
                    id="relatedProductsGrid"
                >
                </div>

            `;


            // ------------------------------------------------
            // Get related products from database
            // ------------------------------------------------

            const {
                data: relatedData,
                error: relatedError
            } = await supabaseClient
                .from("products")
                .select("*")
                .eq("category", data.category)
                .neq("slug", slug)
                .limit(8);


            if (relatedError) {

                console.error(
                    "Related products error:",
                    relatedError
                );

                return;
            }


            const relatedProducts =
                (relatedData || [])
                    .map(normalizeProduct);


            const relatedGrid =
                document.getElementById(
                    "relatedProductsGrid"
                );


            // ------------------------------------------------
            // Render related products
            // ------------------------------------------------

            if (
                relatedGrid &&
                relatedProducts.length
            ) {

                relatedGrid.innerHTML =
                    relatedProducts
                        .map(prod => {

                            const prodOld =
                                prod.oldPrice ||
                                prod.price;

                            const prodDiscount =
                                prodOld > prod.price
                                    ? Math.round(
                                        (
                                            (prodOld -
                                                prod.price) /
                                            prodOld
                                        ) * 100
                                    )
                                    : 0;

                            return `

                                <article
                                    class="product-card"
                                >

                                    ${
                                        prodDiscount
                                            ? `
                                                <span
                                                    class="discount-label"
                                                >
                                                    ${prodDiscount}% OFF
                                                </span>
                                              `
                                            : ""
                                    }


                                    <a
                                        href="/product/index.html?slug=${encodeURIComponent(prod.slug)}"
                                    >

                                        <img
                                            src="${esc(prod.image)}"
                                            alt="${esc(prod.nameEn)}"
                                            loading="lazy"
                                        >

                                    </a>


                                    <div
                                        class="product-card-body"
                                    >

                                        <div
                                            class="product-card-cat"
                                        >
                                            ${esc(prod.category)}
                                        </div>


                                        <h3
                                            class="product-card-name"
                                        >

                                            <a
                                                href="/product/index.html?slug=${encodeURIComponent(prod.slug)}"
                                                style="
                                                    text-decoration:none;
                                                    color:inherit;
                                                "
                                            >
                                                ${esc(prod.nameEn)}
                                            </a>

                                        </h3>


                                        <p
                                            class="product-card-name-si si"
                                        >
                                            ${esc(prod.nameSi)}
                                        </p>


                                        <div
                                            class="product-card-price"
                                        >

                                            <span
                                                class="price-current"
                                            >
                                                Rs.
                                                ${prod.price.toLocaleString()}
                                            </span>

                                            ${
                                                prodOld > prod.price
                                                    ? `
                                                        <span
                                                            class="price-old"
                                                        >
                                                            <del>
                                                                Rs.
                                                                ${prodOld.toLocaleString()}
                                                            </del>
                                                        </span>
                                                      `
                                                    : ""
                                            }

                                        </div>


                                        <div
                                            class="product-card-actions"
                                        >

                                            <button
                                                class="btn-add-cart"
                                                data-add-cart
                                                data-id="${esc(prod.id)}"
                                                data-name-en="${esc(prod.nameEn)}"
                                                data-name-si="${esc(prod.nameSi)}"
                                                data-price="${prod.price}"
                                                data-image="${esc(prod.image)}"
                                                data-slug="${esc(prod.slug)}"
                                            >

                                                <i
                                                    class="bi bi-bag-plus"
                                                ></i>

                                                Add to Cart

                                            </button>

                                        </div>

                                    </div>

                                </article>

                            `;
                        })
                        .join("");

            }

        }


    } catch (error) {

        console.error(
            "Single product loading failed:",
            error
        );

        productWrapper.innerHTML = `

            <div
                style="
                    text-align:center;
                    padding:70px 20px;
                "
            >

                <h2>
                    Unable to load product
                </h2>

                <p>
                    Please try again later.
                </p>

            </div>

        `;
    }
}


// ============================================================
// 6. Start
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    loadSingleProduct
);
