document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");
    const loginBtn = document.getElementById("loginBtn");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        loginBtn.disabled = true;
        loginBtn.textContent = "Signing in...";

        loginMessage.textContent = "";

        const { data, error } =
            await supabaseClient.auth.signInWithPassword({
                email,
                password
            });

        if (error) {

            loginMessage.textContent = error.message;
            loginMessage.className = "error";

            loginBtn.disabled = false;
            loginBtn.textContent = "Login";

            return;
        }

        window.location.href = "products.html";

    });

});