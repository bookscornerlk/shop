// 1. Products List (Data Array)
let webProducts = [];

async function loadWebProducts() {

    const { data, error } = await supabaseClient
        .from("products")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Products loading error:", error);
        return;
    }

    webProducts = data.map(product => ({
        id: String(product.id),
        nameEn: product.name_en,
        nameSi: product.name_si,
        category: product.category,
        price: Number(product.price),
        oldPrice: Number(product.old_price || product.price),
        image: product.image,
        slug: product.slug
    }));

    displayProducts();
}

function displayProducts(customProductsList = null) {
    const gridContainer = document.getElementById('productsGridContainer');

    if (gridContainer) {
        const root = gridContainer.getAttribute('data-root') || "";
        const targetCategory = gridContainer.getAttribute('data-category');
        const limit = parseInt(gridContainer.getAttribute('data-limit')) || null;
        const targetIdsString = gridContainer.getAttribute('data-ids');

        // Allow passing a custom product list (e.g. Related Products) or fallback to global list
        let filteredProducts = Array.isArray(customProductsList) ? [...customProductsList] : [...webProducts];

        // A. Filter by specific IDs if provided
        if (!customProductsList && targetIdsString) {
            const targetIds = targetIdsString.split(',').map(id => id.trim());
            filteredProducts = filteredProducts.filter(prod => targetIds.includes(prod.id.toString()));
            filteredProducts.sort((a, b) => targetIds.indexOf(a.id.toString()) - targetIds.indexOf(b.id.toString()));
        }
        // B. Filter by Category if no custom array or IDs specified
        else if (!customProductsList && targetCategory) {
            filteredProducts = filteredProducts.filter(prod => prod.category === targetCategory);
        }

        // C. Apply display limit
        if (limit) {
            filteredProducts = filteredProducts.slice(0, limit);
        }

        // D. Build HTML Cards Array
        const cardsHTML = filteredProducts.map(prod => {
            // Exclude current product if viewing a single product page via query parameter
            const urlParams = new URLSearchParams(window.location.search);
            const currentSlug = urlParams.get("slug");
            if (currentSlug && prod.slug === currentSlug) {
                return "";
            }

            const oldPrice = prod.oldPrice || prod.price;
            const discount = Math.round(((oldPrice - prod.price) / oldPrice) * 100);
            const productUrl = `${root}/product/index.html?slug=${prod.slug}`;

            return `
<article class="product-card">
    ${oldPrice > prod.price ? `
        <span class="discount-label">
            ${discount}% OFF
        </span>
    ` : ""}

    <a href="${productUrl}">
        <img src="${root}${prod.image}" alt="${prod.nameEn} - ${prod.nameSi}" loading="lazy">
    </a>

    <div class="product-card-body">
        <div class="product-card-cat">${prod.category}</div>

        <h3 class="product-card-name">
            <a href="${productUrl}" style="text-decoration:none; color:inherit;">
                <p>${prod.nameEn}</p>
            </a>
        </h3>

        <p class="product-card-name-si si">${prod.nameSi}</p>

        <div class="product-card-price">
            <span class="price-current">
                Rs. ${prod.price.toLocaleString()}
            </span>

            ${oldPrice > prod.price ? `
                <span class="price-old">
                    <del> Rs. ${oldPrice.toLocaleString()}</del>
                </span>
            ` : ""}
        </div>

        <div class="product-card-actions">
            <button class="btn-add-cart"
                data-add-cart
                data-id="${prod.id}"
                data-name-en="${prod.nameEn}"
                data-name-si="${prod.nameSi}"
                data-price="${prod.price}"
                data-image="${root}${prod.image}"
                data-slug="${prod.slug}">
                <i class="bi bi-bag-plus"></i> Add to Cart
            </button>
        </div>
    </div>
</article>
`;
        });

        // Batch update innerHTML once to optimize performance
        gridContainer.innerHTML = cardsHTML.join("");
    }
}

// Render UI in Browser automatically on pages with #productsGridContainer
if (typeof document !== 'undefined') {
    document.addEventListener("DOMContentLoaded", async () => {

    if (!document.getElementById("single-product-wrapper")) {
        await loadWebProducts();
    }

});
}
