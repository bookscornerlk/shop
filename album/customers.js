// js/happy-customers-gallery.js

document.addEventListener("DOMContentLoaded", async () => {

    const gridContainer = document.getElementById("picsGridContainer");

    if (!gridContainer) return;

    // =========================================
    // SUPABASE DATA
    // =========================================

    let pics = [];

    try {

        const { data, error } = await supabaseClient
            .from("happy_customers")
            .select("id, image")
            .order("id", { ascending: true });

        if (error) {
            throw error;
        }

        pics = data || [];

        console.log("Happy Customers loaded:", pics);

    } catch (error) {

        console.error("Happy Customers load error:", error);

        gridContainer.innerHTML = `
            <div style="
                width:100%;
                text-align:center;
                padding:40px;
                color:#999;
            ">
                Failed to load happy customers.
            </div>
        `;

        return;
    }


    // =========================================
    // HTML SETTINGS
    // =========================================

    const root =
        gridContainer.getAttribute("data-root") || "";

    const limit =
        parseInt(
            gridContainer.getAttribute("data-limit")
        ) || null;

    const targetIdsString =
        gridContainer.getAttribute("data-ids");


    // =========================================
    // FILTER
    // =========================================

    let filteredPics = [...pics];


    // Specific IDs from HTML
    if (targetIdsString) {

        const targetIds =
            targetIdsString
                .split(",")
                .map(id => id.trim());

        filteredPics =
            filteredPics.filter(pic =>
                targetIds.includes(
                    pic.id.toString()
                )
            );

        filteredPics.sort(
            (a, b) =>
                targetIds.indexOf(a.id.toString()) -
                targetIds.indexOf(b.id.toString())
        );
    }


    // Limit
    if (limit) {
        filteredPics =
            filteredPics.slice(0, limit);
    }


    // =========================================
    // CLEAR GRID
    // =========================================

    gridContainer.innerHTML = "";


    // =========================================
    // CREATE GALLERY ITEMS
    // =========================================

    filteredPics.forEach((pic, index) => {

        /*
         * Supabase table එකේ image field එකේ
         * full URL එක තියෙනවා නම් root එක
         * නැවත එකතු නොකරන්න.
         */

        let imageUrl = pic.image || "";

        if (
            root &&
            !imageUrl.startsWith("http://") &&
            !imageUrl.startsWith("https://")
        ) {
            imageUrl = root + imageUrl;
        }


        const cardHTML = `
            <div
                class="gallery-item"
                data-idx="${index}"
                data-url="${escapeAttribute(imageUrl)}"
                data-caption=""
            >

                <img
                    src="${escapeAttribute(imageUrl)}"
                    alt="Happy Customer ${index + 1}"
                    loading="eager"
                >

                <div class="gallery-item-overlay">
                    <i class="bi bi-zoom-in"></i>
                </div>

            </div>
        `;

        gridContainer.insertAdjacentHTML(
            "beforeend",
            cardHTML
        );
    });


    // =========================================
    // LIGHTBOX
    // =========================================

    const items =
        Array.from(
            gridContainer.querySelectorAll(
                ".gallery-item"
            )
        );

    const lb =
        document.getElementById("lightbox");

    const lbImg =
        document.getElementById("lbImg");

    const lbCap =
        document.getElementById("lbCaption");

    const lbCtr =
        document.getElementById("lbCounter");

    const lbClose =
        document.getElementById("lbClose");

    const lbPrev =
        document.getElementById("lbPrev");

    const lbNext =
        document.getElementById("lbNext");


    // If lightbox elements don't exist
    if (
        !lb ||
        !lbImg ||
        !lbCap ||
        !lbCtr
    ) {
        console.warn(
            "Lightbox elements not found."
        );
        return;
    }


    let current = 0;


    // =========================================
    // OPEN
    // =========================================

    function openLightbox(index) {

        if (!items.length) return;

        current = index;

        const item = items[index];

        lbImg.src =
            item.dataset.url;

        lbImg.alt =
            item.dataset.caption ||
            "Happy Customer " +
            (index + 1);

        lbCap.textContent =
            item.dataset.caption || "";

        lbCtr.textContent =
            (index + 1) +
            " / " +
            items.length;

        lb.classList.add("active");

        document.body.style.overflow =
            "hidden";
    }


    // =========================================
    // CLOSE
    // =========================================

    function closeLightbox() {

        lb.classList.remove("active");

        document.body.style.overflow = "";

        lbImg.src = "";
    }


    // =========================================
    // PREVIOUS
    // =========================================

    function prev() {

        if (!items.length) return;

        openLightbox(
            (current - 1 + items.length) %
            items.length
        );
    }


    // =========================================
    // NEXT
    // =========================================

    function next() {

        if (!items.length) return;

        openLightbox(
            (current + 1) %
            items.length
        );
    }


    // =========================================
    // IMAGE CLICK
    // =========================================

    items.forEach((item, index) => {

        item.addEventListener(
            "click",
            () => openLightbox(index)
        );

    });


    // =========================================
    // LIGHTBOX BUTTONS
    // =========================================

    if (lbClose) {
        lbClose.addEventListener(
            "click",
            closeLightbox
        );
    }

    if (lbPrev) {
        lbPrev.addEventListener(
            "click",
            prev
        );
    }

    if (lbNext) {
        lbNext.addEventListener(
            "click",
            next
        );
    }


    // =========================================
    // CLICK OUTSIDE
    // =========================================

    lb.addEventListener("click", e => {

        if (e.target === lb) {
            closeLightbox();
        }

    });


    // =========================================
    // KEYBOARD
    // =========================================

    document.addEventListener(
        "keydown",
        e => {

            if (
                !lb.classList.contains(
                    "active"
                )
            ) {
                return;
            }

            if (e.key === "Escape") {
                closeLightbox();
            }

            if (e.key === "ArrowLeft") {
                prev();
            }

            if (e.key === "ArrowRight") {
                next();
            }

        }
    );


    // =========================================
    // ESCAPE HTML
    // =========================================

    function escapeAttribute(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

});
