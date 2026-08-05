function loadSingleProduct() {
    const productWrapper = document.getElementById('single-product-wrapper');
    const productSuggestion = document.getElementById('productsGridContainerX');
    if (!productWrapper) return;



    // 1. URL එකෙන් Slug Parameter එක ලබා ගැනීම (?slug=your-slug)
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');

    if (!slug) {
        productWrapper.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Product not found!</h2></div>`;
        return;
    }



    // 2. Data Array එකෙන් Slug එකට සමාන Product එක සොයා ගැනීම
    const product = webProducts.find(p => p.slug === slug);

    if (!product) {
        productWrapper.innerHTML = `<div style="text-align:center; padding:50px;"><h2>Product not found!</h2></div>`;
        return;
    }

    const relatedProducts = webProducts.filter(
        p => p.category === product.category && p.slug !== product.slug
    );

    // Page එකේ Title එක වෙනස් කිරීම
    document.title = `${product.nameEn} - Books Corner`;

    const oldPrice = product.oldPrice || product.price;
    const discount = Math.round(((oldPrice - product.price) / oldPrice) * 100);

    // 3. Page එකේ UI එක render කිරීම
    productWrapper.innerHTML = `
    <br>
    <br>
    
        <div class="swiper-slide featured-slide" style="background: linear-gradient(130deg, #644100 5%, #100018 15%, #080018 80%, #645a00 100%);">
         <span class="discount-label">
            ${discount}% OFF
        </span>
            <div class="featured-slide-img" >
                <img  class="productPageImg" src="${product.image}" alt="${product.nameEn}" style="border-radius:10px">
            </div>
                        
            <div class="featured-slide-body">
                <div class="featured-slide-cat" >${product.category}</div>
                <div class="featured-slide-name" >${product.nameEn}</div>
                <div class="product-detail-name-si si" style="color:#555;">${product.nameSi}</div>
                
                <div class="featured-slide-price">
                    Rs. ${product.price.toLocaleString()}
                    ${oldPrice > product.price ? `
                        <span class="price-old">Rs. ${oldPrice.toLocaleString()}</span>
                    ` : ""}
                </div>

                <div class="product-actions" style="margin-top: 25px;">
                    <button  class="btn btn-gold btn-sm"" 
                        data-add-cart
                        data-id="${product.id}"
                        data-name-en="${product.nameEn}"
                        data-name-si="${product.nameSi}"
                        data-price="${product.price}"
                        data-image="${product.image}"
                        data-slug="${product.slug}">
                        <i class="bi bi-bag-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>

        <br>
        <br>
        <hr>
        <br>
        <br>
    `;

    if (productSuggestion) {
        productSuggestion.innerHTML = `
        <div class="section-title">
                    <h2 id="productsHeading">~ You May Also Like ~</h2>
                    <div class="title-line"></div>
                    
                </div>
        
        <div class="products-grid"
             id="productsGridContainer"
             data-root=""
             data-category="${product.category}">
        </div>
    `;


        displayProducts(relatedProducts, true);

    }

}

document.addEventListener('DOMContentLoaded', loadSingleProduct);