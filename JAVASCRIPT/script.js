// ==========================================
// CATHY'S CAKES - MAIN JAVASCRIPT
// Login, Registration, Orders, Lightbox,
// Dynamic Search and Category Filters
// ==========================================


// ==========================================
// GET LOGGED-IN CUSTOMER
// ==========================================

function getLoggedInUser() {

    const user = sessionStorage.getItem("loggedInUser");

    if (user) {

        try {
            return JSON.parse(user);
        } catch (error) {
            sessionStorage.removeItem("loggedInUser");
            return null;
        }

    }

    return null;

}


// ==========================================
// CHECK LOGIN STATUS
// ==========================================

function isLoggedIn() {

    return getLoggedInUser() !== null;

}


// ==========================================
// PROTECT ORDER PAGE
// ==========================================

function protectOrderPage() {

    const orderPage = document.getElementById("orderPage");

    if (orderPage && !isLoggedIn()) {

        window.location.replace("login.html?redirect=order");

    }

}


// ==========================================
// REGISTRATION
// ==========================================

function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("fullName").value.trim();

    const email = document.getElementById("registerEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    // Check that all fields are completed

    if (!name || !email || !password || !confirmPassword) {

        alert("Please complete all the registration fields.");

        return;

    }


    // Check email format

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        alert("Please enter a valid email address.");

        return;

    }


    // Check password length

    if (password.length < 8) {

        alert("Your password must contain at least 8 characters.");

        return;

    }


    // Check that passwords match

    if (password !== confirmPassword) {

        alert("Your passwords do not match.");

        return;

    }


    // Retrieve registered customers

    const users = JSON.parse(localStorage.getItem("cakeUsers")) || [];


    // Check whether email is already registered

    const existingUser = users.find(function(user) {

        return user.email === email;

    });


    if (existingUser) {

        alert("This email is already registered. Please log in.");

        window.location.href = "login.html";

        return;

    }


    // Create a new customer account

    const newUser = {

        name: name,
        email: email,
        password: password

    };


    // Save customer account

    users.push(newUser);

    localStorage.setItem("cakeUsers", JSON.stringify(users));


    alert("Registration successful! Please log in to continue.");

    window.location.href = "login.html";

}


// ==========================================
// LOGIN
// ==========================================

function loginUser(event) {

    event.preventDefault();


    const email = document.getElementById("loginEmail")
        .value.trim().toLowerCase();

    const password = document.getElementById("loginPassword").value;


    // Retrieve registered customers

    const users = JSON.parse(localStorage.getItem("cakeUsers")) || [];


    // Find customer with matching login details

    const user = users.find(function(customer) {

        return customer.email === email &&
               customer.password === password;

    });


    // Check login details

    if (!user) {

        alert("Incorrect email or password. Please try again.");

        return;

    }


    // Store current login session

    sessionStorage.setItem("loggedInUser", JSON.stringify({

        name: user.name,
        email: user.email

    }));


    // Activate sprinkle animation after login

    sessionStorage.setItem("showSprinkles", "true");


    alert("Login successful! Welcome to Cathy's Cakes.");


    // Redirect customer to requested page

    const parameters = new URLSearchParams(window.location.search);

    const redirect = parameters.get("redirect");


    if (redirect === "order") {

        window.location.href = "ordernow.html";

    } else {

        window.location.href = "index.html";

    }

}


// ==========================================
// PERSONAL WELCOME MESSAGE
// ==========================================

function displayWelcomeMessage() {

    const welcomeMessage = document.getElementById("welcomeMessage");

    const user = getLoggedInUser();


    if (welcomeMessage && user) {

        welcomeMessage.textContent =
            "Welcome back, " + user.name +
            "! 🎂 We're happy to have you here.";

        welcomeMessage.style.display = "block";

    }

}


// ==========================================
// SPRINKLE ANIMATION
// ==========================================

function createSprinkles() {


    // Only run after successful login

    if (sessionStorage.getItem("showSprinkles") !== "true") {

        return;

    }


    sessionStorage.removeItem("showSprinkles");


    // Add animation keyframes

    if (!document.getElementById("sprinkleAnimationStyle")) {

        const style = document.createElement("style");

        style.id = "sprinkleAnimationStyle";

        style.textContent = `
            @keyframes sprinkleFall {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 1;
                }

                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;

        document.head.appendChild(style);

    }


    // Create sprinkle container

    const sprinkleContainer = document.createElement("div");

    sprinkleContainer.id = "sprinkleContainer";

    sprinkleContainer.style.position = "fixed";
    sprinkleContainer.style.top = "0";
    sprinkleContainer.style.left = "0";
    sprinkleContainer.style.width = "100%";
    sprinkleContainer.style.height = "100%";
    sprinkleContainer.style.pointerEvents = "none";
    sprinkleContainer.style.overflow = "hidden";
    sprinkleContainer.style.zIndex = "9999";


    document.body.appendChild(sprinkleContainer);


    // Sprinkle colours

    const sprinkleColours = [

        "#ff69b4",
        "#ffd700",
        "#87ceeb",
        "#ff6347",
        "#98fb98",
        "#da70d6",
        "#ff1493"

    ];


    // Create 100 colourful sprinkles

    for (let i = 0; i < 100; i++) {

        const sprinkle = document.createElement("span");

        sprinkle.textContent = "●";

        sprinkle.style.position = "absolute";

        sprinkle.style.left = Math.random() * 100 + "%";

        sprinkle.style.top = "-20px";

        sprinkle.style.color =
            sprinkleColours[
                Math.floor(Math.random() * sprinkleColours.length)
            ];

        sprinkle.style.fontSize = (Math.random() * 10 + 6) + "px";

        sprinkle.style.animation =
            "sprinkleFall " + (Math.random() * 3 + 2) +
            "s linear forwards";

        sprinkle.style.animationDelay = Math.random() * 2 + "s";

        sprinkleContainer.appendChild(sprinkle);

    }


    // Remove animation after it finishes

    setTimeout(function() {

        sprinkleContainer.remove();

    }, 7000);

}


// ==========================================
// LOGOUT
// ==========================================

function logoutUser() {

    const confirmLogout = confirm(
        "Are you sure you want to log out?"
    );


    if (confirmLogout) {

        sessionStorage.removeItem("loggedInUser");

        sessionStorage.removeItem("showSprinkles");

        alert("You have successfully logged out.");

        window.location.href = "login.html";

    }

}


// ==========================================
// SET MINIMUM COLLECTION DATE
// ==========================================

function setMinimumCollectionDate() {

    const dateInput = document.getElementById("collectionDate");

    if (dateInput) {

        const today = new Date();

        const year = today.getFullYear();

        const month = String(today.getMonth() + 1).padStart(2, "0");

        const day = String(today.getDate()).padStart(2, "0");

        dateInput.min = year + "-" + month + "-" + day;

    }

}


// ==========================================
// ORDER FORM
// ==========================================

function submitCakeOrder(event) {

    event.preventDefault();


    // Check whether the customer is logged in

    if (!isLoggedIn()) {

        window.location.href = "login.html?redirect=order";

        return;

    }


    const form = document.getElementById("cakeOrderForm");

    const orderMessage = document.getElementById("orderMessage");


    // Check that all required fields are completed

    if (!form.checkValidity()) {

        form.reportValidity();

        return;

    }


    const user = getLoggedInUser();


    // Get form information

    const quantity = Number(
        document.getElementById("quantity").value
    );

    const collectionDate =
        document.getElementById("collectionDate").value;


    // Check quantity

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 500) {

        if (orderMessage) {

            orderMessage.textContent =
                "Please enter a quantity between 1 and 500.";

        } else {

            alert("Please enter a quantity between 1 and 500.");

        }

        return;

    }


    // Check collection date

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(collectionDate + "T00:00:00");


    if (selectedDate < today) {

        if (orderMessage) {

            orderMessage.textContent =
                "Please select today or a future collection date.";

        } else {

            alert("Please select today or a future collection date.");

        }

        return;

    }


    // Get optional phone number if the field exists

    const phoneInput = document.getElementById("customerPhone");

    const customerPhone = phoneInput
        ? phoneInput.value.trim()
        : "";


    // Create order summary

    const orderSummary = {

        customer: user.name,

        email: user.email,

        phone: customerPhone,

        cakeType: document.getElementById("cakeType").value,

        quantity: quantity,

        flavour: document.getElementById("flavour").value,

        collectionDate: collectionDate,

        theme: document.getElementById("theme").value.trim(),

        requirements:
            document.getElementById("requirements").value.trim(),

        orderDate: new Date().toLocaleString()

    };


    // Retrieve existing orders

    const orders =
        JSON.parse(localStorage.getItem("cakeOrders")) || [];


    // Add new order

    orders.push(orderSummary);


    // Save orders in browser storage

    localStorage.setItem("cakeOrders", JSON.stringify(orders));


    // Display confirmation

    const confirmationMessage =
        "Thank you, " + user.name +
        "! Your order enquiry has been saved. " +
        "Please contact Cathy's Cakes to confirm your order.";


    if (orderMessage) {

        orderMessage.textContent = confirmationMessage;

    } else {

        alert(confirmationMessage);

    }


    // Clear the form

    form.reset();


    // Set collection date again after resetting

    setMinimumCollectionDate();

}


// ==========================================
// GALLERY LIGHTBOX
// ==========================================

function initializeLightbox() {

    const lightbox = document.getElementById("lightbox");


    // Stop if the current page has no lightbox

    if (!lightbox) {

        return;

    }


    const lightboxImage = document.getElementById("lightboxImage");

    const lightboxCaption =
        document.getElementById("lightboxCaption");

    const closeButton =
        document.getElementById("lightboxClose");

    const previousButton =
        document.getElementById("lightboxPrevious");

    const nextButton =
        document.getElementById("lightboxNext");


    const galleryImages = Array.from(
        document.querySelectorAll(".lightbox-image")
    );


    // Check that all lightbox elements exist

    if (!lightboxImage || !lightboxCaption ||
        !closeButton || !previousButton || !nextButton) {

        return;

    }


    let currentIndex = 0;

    let lastFocusedElement = null;


    // Open selected image

    function openLightbox(index) {

        if (galleryImages.length === 0) {

            return;

        }


        currentIndex =
            (index + galleryImages.length) % galleryImages.length;


        const selectedImage = galleryImages[currentIndex];


        lightboxImage.src = selectedImage.src;

        lightboxImage.alt = selectedImage.alt;

        lightboxCaption.textContent = selectedImage.alt;


        lastFocusedElement = document.activeElement;


        lightbox.classList.add("active");

        lightbox.setAttribute("aria-hidden", "false");


        document.body.style.overflow = "hidden";


        closeButton.focus();

    }


    // Close lightbox

    function closeLightbox() {

        lightbox.classList.remove("active");

        lightbox.setAttribute("aria-hidden", "true");


        document.body.style.overflow = "";


        lightboxImage.src = "";

        lightboxImage.alt = "";


        if (lastFocusedElement) {

            lastFocusedElement.focus();

        }

    }


    // Show next image

    function showNextImage() {

        openLightbox(currentIndex + 1);

    }


    // Show previous image

    function showPreviousImage() {

        openLightbox(currentIndex - 1);

    }


    // Connect gallery images

    galleryImages.forEach(function(image, index) {

        image.addEventListener("click", function() {

            openLightbox(index);

        });


        image.addEventListener("keydown", function(event) {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                openLightbox(index);

            }

        });

    });


    // Connect buttons

    closeButton.addEventListener("click", closeLightbox);

    nextButton.addEventListener("click", showNextImage);

    previousButton.addEventListener("click", showPreviousImage);


    // Close when dark background is clicked

    lightbox.addEventListener("click", function(event) {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });


    // Keyboard controls

    document.addEventListener("keydown", function(event) {

        if (!lightbox.classList.contains("active")) {

            return;

        }


        if (event.key === "Escape") {

            closeLightbox();

        }


        if (event.key === "ArrowRight") {

            showNextImage();

        }


        if (event.key === "ArrowLeft") {

            showPreviousImage();

        }

    });

}


// ==========================================
// DYNAMIC PRODUCT SEARCH AND FILTER
// ==========================================

function initializeProductSearch() {

    const searchInput = document.getElementById("productSearch");

    const clearButton = document.getElementById("clearSearch");

    const categoryButtons =
        document.querySelectorAll(".category-btn");

    const products = document.querySelectorAll(".product-card");

    const resultsCount = document.getElementById("resultsCount");

    const dynamicMessage = document.getElementById("dynamicMessage");

    const noResults = document.getElementById("noResults");


    // Stop if this page does not have the search feature

    if (!searchInput || products.length === 0) {

        return;

    }


    let selectedCategory = "all";


    // Dynamic messages

    const categoryMessages = {

        all: "Explore our delicious collection of treats!",

        cakes: "Discover beautiful cakes for every occasion!",

        cupcakes: "Find your favourite cupcakes!",

        cakepops: "Enjoy our delightful cake pops!"

    };


    // Filter products

    function filterProducts() {

        const searchTerm = searchInput.value.trim().toLowerCase();

        let visibleCount = 0;


        products.forEach(function(product) {

            const productText = product.textContent.toLowerCase();

            const productCategory =
                product.dataset.category || "";


            const matchesSearch =
                productText.includes(searchTerm);


            const matchesCategory =
                selectedCategory === "all" ||
                productCategory === selectedCategory;


            if (matchesSearch && matchesCategory) {

                product.classList.remove("hidden-product");

                visibleCount++;

            } else {

                product.classList.add("hidden-product");

            }

        });


        // Update result counter

        if (resultsCount) {

            if (visibleCount === 1) {

                resultsCount.textContent = "Showing 1 product.";

            } else {

                resultsCount.textContent =
                    "Showing " + visibleCount + " products.";

            }

        }


        // Show or hide no-results message

        if (noResults) {

            noResults.classList.toggle("show", visibleCount === 0);

        }


        // Update dynamic message

        if (dynamicMessage) {

            if (searchTerm !== "") {

                dynamicMessage.textContent =
                    'Search results for "' +
                    searchInput.value.trim() + '"';

            } else {

                dynamicMessage.textContent =
                    categoryMessages[selectedCategory] ||
                    categoryMessages.all;

            }

        }

    }


    // Search while typing

    searchInput.addEventListener("input", filterProducts);


    // Clear search

    if (clearButton) {

        clearButton.addEventListener("click", function() {

            searchInput.value = "";

            selectedCategory = "all";


            categoryButtons.forEach(function(button) {

                button.classList.remove("active");

            });


            const allButton = document.querySelector(
                '.category-btn[data-category="all"]'
            );


            if (allButton) {

                allButton.classList.add("active");

            }


            filterProducts();

            searchInput.focus();

        });

    }


    // Category filtering

    categoryButtons.forEach(function(button) {

        button.addEventListener("click", function() {

            selectedCategory = button.dataset.category || "all";


            categoryButtons.forEach(function(otherButton) {

                otherButton.classList.remove("active");

            });


            button.classList.add("active");

            filterProducts();

        });

    });


    // Display initial product list

    filterProducts();

}


// ==========================================
// RUN WHEN PAGE LOADS
// ==========================================

document.addEventListener("DOMContentLoaded", function() {


    // Protect order page

    protectOrderPage();


    // Set minimum collection date

    setMinimumCollectionDate();


    // Display welcome message

    displayWelcomeMessage();


    // Run sprinkle animation after login

    createSprinkles();


    // Initialize gallery lightbox

    initializeLightbox();


    // Initialize product search

    initializeProductSearch();


    // Registration form

    const registrationForm =
        document.getElementById("registrationForm");


    if (registrationForm) {

        registrationForm.addEventListener("submit", registerUser);

    }


    // Login form

    const loginForm =
        document.getElementById("loginForm");


    if (loginForm) {

        loginForm.addEventListener("submit", loginUser);

    }


    // Cake order form

    const orderForm =
        document.getElementById("cakeOrderForm");


    if (orderForm) {

        orderForm.addEventListener("submit", submitCakeOrder);

    }


    // Logout buttons

    const logoutButtons =
        document.querySelectorAll(".logoutButton");


    logoutButtons.forEach(function(button) {

        button.addEventListener("click", logoutUser);

    });

});