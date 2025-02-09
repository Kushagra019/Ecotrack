document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const formTitle = document.getElementById("form-title");
    const toggleText = document.getElementById("toggle-text");
    const toggleLink = document.getElementById("toggle-link");

    // Toggle between login and signup forms
    toggleLink.addEventListener("click", function (event) {
        event.preventDefault();

        if (loginForm.classList.contains("hidden")) {
            loginForm.classList.remove("hidden");
            signupForm.classList.add("hidden");
            formTitle.textContent = "Login";
            toggleText.textContent = "Don't have an account?";
            toggleLink.textContent = "Sign Up";
        } else {
            loginForm.classList.add("hidden");
            signupForm.classList.remove("hidden");
            formTitle.textContent = "Sign Up";
            toggleText.textContent = "Already have an account?";
            toggleLink.textContent = "Login";
        }
    });

    // Handle form submission (basic validation)
    function handleFormSubmit(event, formType) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        fetch(`/${formType}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(data).toString(),
        })
        .then(response => response.text())
        .then(result => {
            if (result.includes("Invalid") || result.includes("already exists")) {
                alert(result); // Show error message
            } else {
                window.location.href = "/dashboard"; // Redirect on success
            }
        })
        .catch(error => console.error("Error:", error));
    }

    // Attach form submit event listeners
    loginForm.addEventListener("submit", (event) => handleFormSubmit(event, "login"));
    signupForm.addEventListener("submit", (event) => handleFormSubmit(event, "signup"));
});
