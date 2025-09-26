const mobileMenuButton = document.getElementById("mobile-menu-btn")
const mobileMenu = document.getElementById("mobile-menu")

function displayMobileMenu() {
    mobileMenu.classList.toggle("open")
}

mobileMenuButton.addEventListener("click",displayMobileMenu)