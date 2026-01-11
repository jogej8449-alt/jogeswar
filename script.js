document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ Study Hub JS Loaded");

    // Elements
    const loginForm = document.getElementById("loginForm");
    const snackbar = document.getElementById("snackbar");
    const flashSnackbar = document.getElementById("flashSnackbar");

    // 🔧 SNACKBAR UTILITY (Enhanced)
    function showSnackbar(message, duration = 3000) {
        if (!snackbar) return;
        
        snackbar.textContent = message;
        snackbar.classList.remove("show");
        
        // Trigger reflow
        snackbar.offsetHeight;
        snackbar.classList.add("show");
        
        setTimeout(() => {
            snackbar.classList.remove("show");
        }, duration);
    }

    // 🔧 AUTO-HIDE FLASH MESSAGES
    if (flashSnackbar) {
        setTimeout(() => {
            flashSnackbar.classList.remove("show");
        }, 4000);
    }

    // 🚀 LOGIN FORM HANDLING (Clean - No interference)
    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            // Visual feedback only - Flask handles everything
            const submitBtn = loginForm.querySelector("button[type='submit']");
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = "Logging in... 🔄";
            submitBtn.disabled = true;
            showSnackbar("Validating credentials...");
            
            // Flask POST will handle redirect/auth
            // NO preventDefault() - Pure server-side flow
        });

        // Input focus animations
        const inputs = loginForm.querySelectorAll("input");
        inputs.forEach(input => {
            input.addEventListener("focus", function() {
                this.parentElement.style.transform = "scale(1.02)";
            });
            input.addEventListener("blur", function() {
                this.parentElement.style.transform = "scale(1)";
            });
        });
    }

    // 🌟 DASHBOARD FEATURES (Future-ready)
    const dashboardWelcome = document.getElementById("welcomeText");
    if (dashboardWelcome) {
        // Welcome animation
        dashboardWelcome.style.opacity = "0";
        setTimeout(() => {
            dashboardWelcome.style.transition = "opacity 0.8s ease";
            dashboardWelcome.style.opacity = "1";
        }, 200);

        // Auto-show welcome snackbar
        showSnackbar("Welcome back! Files loading from database 💾", 4000);
    }

    // 🔒 LOGOUT BUTTON (Dashboard)
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function() {
            showSnackbar("Logging out...");
            // Flask handles session clear
            window.location.href = "/logout";
        });
    }

    // 📱 MOBILE RESPONSIVE CHECK
    function checkMobile() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            document.body.classList.add("mobile");
        }
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // 🎨 SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    console.log("✅ All JS features loaded successfully!");
});
