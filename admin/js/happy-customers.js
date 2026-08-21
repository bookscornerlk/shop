// js/happy-customers.js

document.addEventListener("DOMContentLoaded", () => {

    const tableBody = document.getElementById("customersTableBody");
    const customerCount = document.getElementById("customerCount");
    const searchInput = document.getElementById("searchCustomers");

    const customerModal = document.getElementById("customerModal");
    const customerForm = document.getElementById("customerForm");

    const addCustomerBtn = document.getElementById("addCustomerBtn");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const cancelCustomerBtn = document.getElementById("cancelCustomerBtn");

    const modalTitle = document.getElementById("modalTitle");
    const customerId = document.getElementById("customerId");

    const imageFile = document.getElementById("imageFile");
    const imageUrlInput = document.getElementById("imageUrlInput");
    const image = document.getElementById("image");

    const imageUploadModeBtn =
        document.getElementById("imageUploadModeBtn");

    const imageUrlModeBtn =
        document.getElementById("imageUrlModeBtn");

    const imageUploadBox =
        document.getElementById("imageUploadBox");

    const imageUrlBox =
        document.getElementById("imageUrlBox");

    const imagePreview =
        document.getElementById("imagePreview");

    const previewImage =
        document.getElementById("previewImage");

    const removeImageBtn =
        document.getElementById("removeImageBtn");

    const saveCustomerBtn =
        document.getElementById("saveCustomerBtn");

    const toast =
        document.getElementById("toast");


    let customers = [];
    let imageMode = "upload";


    // =========================================
    // LOAD CUSTOMERS
    // =========================================

    async function loadCustomers() {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="loading">
                    Loading happy customers...
                </td>
            </tr>
        `;

        try {

            const { data, error } = await supabaseClient
                .from("happy_customers")
                .select("*")
                .order("id", { ascending: false });

            if (error) {
                throw error;
            }

            customers = data || [];

            renderCustomers(customers);

        } catch (error) {

            console.error("Happy Customers Error:", error);

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        Failed to load happy customers.<br>
                        <small>${escapeHtml(error.message)}</small>
                    </td>
                </tr>
            `;

            customerCount.textContent = "0 customers";
        }
    }


    // =========================================
    // RENDER CUSTOMERS
    // =========================================

    function renderCustomers(list) {

        customerCount.textContent =
            `${list.length} customer${list.length === 1 ? "" : "s"}`;

        if (!list.length) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty">
                        No happy customers found.
                    </td>
                </tr>
            `;

            return;
        }

        tableBody.innerHTML = list.map(customer => {

            const customerImage =
                customer.image ||
                customer.image_url ||
                "";

            return `
                <tr>

                    <td>
                        ${
                            customerImage
                            ? `
                                <img
                                    class="customer-image"
                                    src="${escapeAttribute(customerImage)}"
                                    alt="Happy Customer"
                                    onerror="this.style.opacity='0.35';"
                                >
                            `
                            : `
                                <div class="customer-image"></div>
                            `
                        }
                    </td>

                    <td>
                        <span class="customer-id">
                            ${escapeHtml(String(customer.id ?? ""))}
                        </span>
                    </td>

                    <td>
                        <div class="customer-image-url">
                            ${escapeHtml(customerImage)}
                        </div>
                    </td>

                    <td>
                        <span class="status">
                            Active
                        </span>
                    </td>

                    <td>
                        <div class="actions">

                            <button
                                class="action-btn edit-btn"
                                onclick="editCustomer('${escapeAttribute(String(customer.id))}')"
                            >
                                Edit
                            </button>

                            <button
                                class="action-btn delete-btn"
                                onclick="deleteCustomer('${escapeAttribute(String(customer.id))}')"
                            >
                                Delete
                            </button>

                        </div>
                    </td>

                </tr>
            `;

        }).join("");
    }


    // =========================================
    // SEARCH
    // =========================================

    searchInput.addEventListener("input", () => {

        const search = searchInput.value
            .trim()
            .toLowerCase();

        if (!search) {
            renderCustomers(customers);
            return;
        }

        const filtered = customers.filter(customer => {

            const id =
                String(customer.id || "").toLowerCase();

            const image =
                String(
                    customer.image ||
                    customer.image_url ||
                    ""
                ).toLowerCase();

            return (
                id.includes(search) ||
                image.includes(search)
            );
        });

        renderCustomers(filtered);
    });


    // =========================================
    // OPEN ADD MODAL
    // =========================================

    addCustomerBtn.addEventListener("click", () => {

        resetForm();

        modalTitle.textContent =
            "Add Happy Customer";

        saveCustomerBtn.textContent =
            "Save Customer";

        customerModal.classList.add("show");
    });


    // =========================================
    // CLOSE MODAL
    // =========================================

    function closeModal() {
        customerModal.classList.remove("show");
    }

    closeModalBtn.addEventListener("click", closeModal);
    cancelCustomerBtn.addEventListener("click", closeModal);

    customerModal.addEventListener("click", (e) => {

        if (e.target === customerModal) {
            closeModal();
        }

    });


    // =========================================
    // IMAGE MODE
    // =========================================

    imageUploadModeBtn.addEventListener("click", () => {

        imageMode = "upload";

        imageUploadModeBtn.classList.add("active");
        imageUrlModeBtn.classList.remove("active");

        imageUploadBox.style.display = "block";
        imageUrlBox.style.display = "none";
    });


    imageUrlModeBtn.addEventListener("click", () => {

        imageMode = "url";

        imageUrlModeBtn.classList.add("active");
        imageUploadModeBtn.classList.remove("active");

        imageUploadBox.style.display = "none";
        imageUrlBox.style.display = "block";
    });


    // =========================================
    // IMAGE FILE PREVIEW
    // =========================================

    imageFile.addEventListener("change", () => {

        const file = imageFile.files[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {

            showToast(
                "Image must be smaller than 5MB.",
                "error"
            );

            imageFile.value = "";
            return;
        }

        if (!file.type.startsWith("image/")) {

            showToast(
                "Please select an image file.",
                "error"
            );

            imageFile.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {

            previewImage.src = e.target.result;
            imagePreview.classList.add("show");

        };

        reader.readAsDataURL(file);
    });


    // =========================================
    // IMAGE URL PREVIEW
    // =========================================

    imageUrlInput.addEventListener("input", () => {

        const url = imageUrlInput.value.trim();

        if (!url) {
            imagePreview.classList.remove("show");
            return;
        }

        previewImage.src = url;

        imagePreview.classList.add("show");
    });


    // =========================================
    // REMOVE IMAGE
    // =========================================

    removeImageBtn.addEventListener("click", () => {

        imageFile.value = "";
        imageUrlInput.value = "";
        image.value = "";

        previewImage.src = "";

        imagePreview.classList.remove("show");
    });


    // =========================================
    // SAVE CUSTOMER
    // =========================================

    customerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        saveCustomerBtn.classList.add("saving");
        saveCustomerBtn.textContent = "Saving...";

        try {

            let imageUrl = image.value.trim();

            // -----------------------------
            // IMAGE URL
            // -----------------------------

            if (imageMode === "url") {

                imageUrl =
                    imageUrlInput.value.trim();

                if (!imageUrl) {
                    throw new Error(
                        "Please enter an image URL."
                    );
                }
            }


            // -----------------------------
            // IMAGE UPLOAD
            // -----------------------------

            if (
                imageMode === "upload" &&
                imageFile.files.length > 0
            ) {

                const file = imageFile.files[0];

                const extension =
                    file.name.split(".").pop();

                const fileName =
                    `${Date.now()}-${Math.random()
                        .toString(36)
                        .substring(2)}.${extension}`;

                const filePath =
                    `happy-customers/${fileName}`;


                const { error: uploadError } =
                    await supabaseClient
                        .storage
                        .from("customer-images")
                        .upload(
                            filePath,
                            file,
                            {
                                cacheControl: "3600",
                                upsert: false
                            }
                        );

                if (uploadError) {
                    throw uploadError;
                }


                const { data: publicData } =
                    supabaseClient
                        .storage
                        .from("customer-images")
                        .getPublicUrl(filePath);

                imageUrl =
                    publicData.publicUrl;
            }


            if (!imageUrl) {
                throw new Error(
                    "Please upload an image or provide an image URL."
                );
            }


            // =================================
            // UPDATE
            // =================================

            if (customerId.value) {

                const { error } =
                    await supabaseClient
                        .from("happy_customers")
                        .update({
                            image: imageUrl
                        })
                        .eq("id", customerId.value);

                if (error) {
                    throw error;
                }

                showToast(
                    "Customer updated successfully!",
                    "success"
                );

            }

            // =================================
            // INSERT
            // =================================

            else {

                const { error } =
                    await supabaseClient
                        .from("happy_customers")
                        .insert([
                            {
                                image: imageUrl
                            }
                        ]);

                if (error) {
                    throw error;
                }

                showToast(
                    "Happy customer added successfully!",
                    "success"
                );
            }


            closeModal();

            await loadCustomers();

        } catch (error) {

            console.error(
                "Save customer error:",
                error
            );

            showToast(
                error.message ||
                "Failed to save customer.",
                "error"
            );

        } finally {

            saveCustomerBtn.classList.remove("saving");

            saveCustomerBtn.textContent =
                "Save Customer";
        }
    });


    // =========================================
    // EDIT CUSTOMER
    // =========================================

    window.editCustomer = function(id) {

        const customer =
            customers.find(
                c => String(c.id) === String(id)
            );

        if (!customer) return;

        const customerImage =
            customer.image ||
            customer.image_url ||
            "";

        customerId.value = customer.id;

        image.value = customerImage;

        imageUrlInput.value =
            customerImage;

        previewImage.src =
            customerImage;

        if (customerImage) {
            imagePreview.classList.add("show");
        }

        imageMode = "url";

        imageUrlModeBtn.classList.add("active");
        imageUploadModeBtn.classList.remove("active");

        imageUploadBox.style.display = "none";
        imageUrlBox.style.display = "block";

        modalTitle.textContent =
            "Edit Happy Customer";

        saveCustomerBtn.textContent =
            "Update Customer";

        customerModal.classList.add("show");
    };


    // =========================================
    // DELETE CUSTOMER
    // =========================================

    window.deleteCustomer = async function(id) {

        const confirmed =
            confirm(
                "Are you sure you want to delete this happy customer?"
            );

        if (!confirmed) return;

        try {

            const { error } =
                await supabaseClient
                    .from("happy_customers")
                    .delete()
                    .eq("id", id);

            if (error) {
                throw error;
            }

            showToast(
                "Customer deleted successfully!",
                "success"
            );

            await loadCustomers();

        } catch (error) {

            console.error(
                "Delete customer error:",
                error
            );

            showToast(
                error.message ||
                "Failed to delete customer.",
                "error"
            );
        }
    };


    // =========================================
    // RESET FORM
    // =========================================

    function resetForm() {

        customerForm.reset();

        customerId.value = "";
        image.value = "";

        imagePreview.classList.remove("show");
        previewImage.src = "";

        imageMode = "upload";

        imageUploadModeBtn.classList.add("active");
        imageUrlModeBtn.classList.remove("active");

        imageUploadBox.style.display = "block";
        imageUrlBox.style.display = "none";
    }


    // =========================================
    // TOAST
    // =========================================

    function showToast(message, type = "") {

        toast.textContent = message;

        toast.className =
            `toast show ${type}`;

        setTimeout(() => {
            toast.className = "toast";
        }, 3000);
    }


    // =========================================
    // SECURITY HELPERS
    // =========================================

    function escapeHtml(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function escapeAttribute(value) {
        return escapeHtml(value);
    }


    // =========================================
    // INITIAL LOAD
    // =========================================

    loadCustomers();

});