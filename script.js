// ==========================================
// EVENT FILTER
// ==========================================

const filterButtons =
    document.querySelectorAll(".filter-btn");

const eventCards =
    document.querySelectorAll(".event-card");

filterButtons.forEach(function(button) {
    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const category = button.getAttribute("data-category");

        eventCards.forEach(function(card) {
            const cardCategory =
                card.getAttribute("data-category");

            card.style.display =
                category === "all" || category === cardCategory
                    ? "block"
                    : "none";
        });
    });
});


// ==========================================
// AUTH ELEMENTS
// ==========================================

const authModal = document.getElementById("auth-modal");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const profileContainer = document.getElementById("profile-container");
const profileBtn = document.getElementById("profile-btn");
const profileMenu = document.getElementById("profile-menu");
const logoutBtn = document.getElementById("logout-btn");
const accountBtn = document.getElementById("account-btn");
const authClose = document.getElementById("auth-close");
const authTitle = document.getElementById("auth-title");
const authSubtitle = document.getElementById("auth-subtitle");
const authForm = document.getElementById("auth-form");
const nameField = document.getElementById("name-field");
const branchField = document.getElementById("branch-field");
const rollField = document.getElementById("roll-field");
const accountName = document.getElementById("account-name");
const accountBranch = document.getElementById("account-branch");
const accountRoll = document.getElementById("account-roll");
const accountEmail = document.getElementById("account-email");
const accountPassword = document.getElementById("account-password");
const authMessage = document.getElementById("auth-message");
const switchText = document.getElementById("switch-text");
const switchAuth = document.getElementById("switch-auth");

let authMode = "login";


// ==========================================
// USER DATA HELPERS
// ==========================================

// ==========================================
// USER DATA HELPERS
// ==========================================

function getAllUsers() {
    try {
        const users = JSON.parse(
            localStorage.getItem("electroReckUsers")
        );

        return Array.isArray(users) ? users : [];
    } catch (error) {
        return [];
    }
}

function saveAllUsers(users) {
    localStorage.setItem(
        "electroReckUsers",
        JSON.stringify(users)
    );
}

function getStoredUser() {
    try {
        const user = JSON.parse(
            localStorage.getItem("electroReckUser")
        );

        if (!user) return null;

        if (!Array.isArray(user.registeredEvents)) {
            user.registeredEvents = [];

            if (typeof user.registeredEvent === "string") {
                user.registeredEvents.push(user.registeredEvent);
            } else if (Array.isArray(user.registeredEvent)) {
                user.registeredEvents.push(
                    ...user.registeredEvent
                );
            }
        }

        return user;
    } catch (error) {
        return null;
    }
}

function saveUser(user) {
    // Update the active user's data.
    localStorage.setItem(
        "electroReckUser",
        JSON.stringify(user)
    );

    // Also update that user's record in the accounts list.
    const users = getAllUsers();
    const index = users.findIndex(
        account => account.email === user.email
    );

    if (index !== -1) {
        users[index] = user;
        saveAllUsers(users);
    }
}

function isLoggedIn() {
    return localStorage.getItem("electroReckLoggedIn") === "true";
}

// ==========================================
// OPEN LOGIN
// ==========================================

loginBtn.addEventListener("click", function() {
    openLogin();
});

function openLogin() {
    authMode = "login";

    authTitle.textContent = "Login";
    authSubtitle.textContent =
        "Login to register for ElectroReck events.";

    nameField.style.display = "none";
    branchField.style.display = "none";
    rollField.style.display = "none";

    authForm.querySelector(".submit-btn").textContent = "Login";

    switchText.textContent = "Don't have an account?";
    switchAuth.textContent = "Create Account";

    authMessage.textContent = "";
    authForm.reset();
    authModal.style.display = "flex";
}


// ==========================================
// OPEN SIGNUP
// ==========================================

signupBtn.addEventListener("click", function() {
    openSignup();
});

function openSignup() {
    authMode = "signup";

    authTitle.textContent = "Create Account";
    authSubtitle.textContent =
        "Create your ElectroReck account.";

    nameField.style.display = "block";
    branchField.style.display = "block";
    rollField.style.display = "block";

    authForm.querySelector(".submit-btn").textContent =
        "Create Account";

    switchText.textContent = "Already have an account?";
    switchAuth.textContent = "Login";

    authMessage.textContent = "";
    authForm.reset();
    authModal.style.display = "flex";
}


// ==========================================
// SWITCH LOGIN / SIGNUP
// ==========================================

switchAuth.addEventListener("click", function() {
    if (authMode === "login") {
        openSignup();
    } else {
        openLogin();
    }
});


// ==========================================
// CREATE ACCOUNT / LOGIN
// ==========================================

authForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = accountName.value.trim();
    const branch = accountBranch.value.trim();
    const roll = accountRoll.value.trim();
    const email = accountEmail.value.trim().toLowerCase();
    const password = accountPassword.value;

    const allUsers = getAllUsers();

    // CREATE ACCOUNT
    if (authMode === "signup") {

        if (!name || !branch || !roll || !email || !password) {
            authMessage.textContent =
                "Please fill in all details.";
            return;
        }

        if (!/^[A-Za-z0-9._%+-]+@nitkkr\.ac\.in$/.test(email)) {
            authMessage.textContent =
                "Please use a valid @nitkkr.ac.in email address.";
            return;
        }

        const accountExists = allUsers.some(
    user => user.email === email
);

if (accountExists) {
    authMessage.textContent =
        "An account with this email already exists. Please login.";
    return;
}
        
        const user = {
            name: name,
            branch: branch,
            roll: roll,
            email: email,
            password: password,
            registeredEvents: []
        };

        allUsers.push(user);
        saveAllUsers(allUsers);
        saveUser(user);

        localStorage.setItem("electroReckLoggedIn", "true");

        authMessage.textContent =
            "Account created successfully!";

        setTimeout(function() {
            authModal.style.display = "none";
            updateAuthUI();
            updateRegistrationButtons();
        }, 800);
    }

    // LOGIN
    const user = allUsers.find(
    account => account.email === email
);

if (!user) {
    authMessage.textContent =
        "No account found with this email. Please create an account.";
    return;
}

if (password === user.password) {
    localStorage.setItem(
        "electroReckUser",
        JSON.stringify(user)
    );

    localStorage.setItem("electroReckLoggedIn", "true");

    authMessage.textContent = "Login successful!";

    setTimeout(function() {
        authModal.style.display = "none";
        updateAuthUI();
        updateRegistrationButtons();
    }, 700);
} else {
    authMessage.textContent = "Incorrect email or password.";
}   
});


// ==========================================
// PROFILE BUTTON
// ==========================================

profileBtn.addEventListener("click", function(event) {
    event.stopPropagation();
    profileMenu.classList.toggle("show");
});

document.addEventListener("click", function(event) {
    if (!profileContainer.contains(event.target)) {
        profileMenu.classList.remove("show");
    }
});


// ==========================================
// ACCOUNT
// ==========================================

accountBtn.addEventListener("click", function() {
    profileMenu.classList.remove("show");
    showAccount();
});


// ==========================================
// LOGOUT
// ==========================================

logoutBtn.addEventListener("click", function() {
    localStorage.setItem("electroReckLoggedIn", "false");

    profileMenu.classList.remove("show");

    updateAuthUI();
    updateRegistrationButtons();
});


// ==========================================
// UPDATE AUTH UI
// ==========================================

function updateAuthUI() {
    const loggedIn = isLoggedIn();

    loginBtn.style.display = loggedIn ? "none" : "inline-block";
    signupBtn.style.display = loggedIn ? "none" : "inline-block";
    profileContainer.style.display = loggedIn ? "block" : "none";
}


// ==========================================
// ACCOUNT MODAL
// ==========================================

const accountModal = document.getElementById("account-modal");
const accountClose = document.getElementById("account-close");
const displayName = document.getElementById("display-name");
const displayBranch = document.getElementById("display-branch");
const displayRoll = document.getElementById("display-roll");
const displayEmail = document.getElementById("display-email");
const displayEvent = document.getElementById("display-event");

function showAccount() {
    const user = getStoredUser();

    if (!user) return;

    displayName.textContent = user.name;
    displayBranch.textContent = user.branch;
    displayRoll.textContent = user.roll;
    displayEmail.textContent = user.email;

    displayEvent.textContent =
        user.registeredEvents.length > 0
            ? user.registeredEvents.join(", ")
            : "None";

    accountModal.style.display = "flex";
}

accountClose.addEventListener("click", function() {
    accountModal.style.display = "none";
});


// ==========================================
// EVENT REGISTRATION
// ==========================================

const registerButtons =
    document.querySelectorAll(".register-btn");

registerButtons.forEach(function(button) {
    button.addEventListener("click", function() {

        if (!isLoggedIn()) {
            openLogin();

            authSubtitle.textContent =
                "Please login or create an account before registering.";

            return;
        }

        const user = getStoredUser();

        if (!user) {
            openLogin();
            return;
        }

        const eventName = button.getAttribute("data-event");

        if (!eventName) {
            authMessage.textContent =
                "Event information is missing.";
            return;
        }

        // Do not register for the same event twice.
        if (user.registeredEvents.includes(eventName)) {
            return;
        }

        // Add only this event to the user's registrations.
        user.registeredEvents.push(eventName);

        saveUser(user);

        updateRegistrationButtons();

        const successPopup =
            document.getElementById("registration-success");

        const successText =
            document.getElementById("success-text");

        successText.textContent =
            "You are successfully registered for " +
            eventName + ".";

        successPopup.style.display = "flex";
    });
});


// ==========================================
// UPDATE REGISTRATION BUTTONS
// ==========================================

// ==========================================
// UPDATE REGISTRATION BUTTONS
// ==========================================

function updateRegistrationButtons() {
    const user = isLoggedIn() ? getStoredUser() : null;

    registerButtons.forEach(function(button) {
        const eventName = button.getAttribute("data-event");

        button.classList.remove(
            "registered",
            "registration-closed"
        );

        button.disabled = false;
        button.textContent = "Register";

        if (!user) return;

        if (user.registeredEvents.includes(eventName)) {
            button.textContent = "Registered ✓";
            button.classList.add("registered");
            button.disabled = true;
        }
    });
}


// ==========================================
// SUCCESS POPUP
// ==========================================

const successClose = document.getElementById("success-close");
const successPopup =
    document.getElementById("registration-success");

successClose.addEventListener("click", function() {
    successPopup.style.display = "none";
});


// ==========================================
// CLOSE AUTH MODAL
// ==========================================

authClose.addEventListener("click", function() {
    authModal.style.display = "none";
});


// ==========================================
// CLOSE MODALS WHEN CLICKING OUTSIDE
// ==========================================

window.addEventListener("click", function(event) {
    if (event.target === authModal) {
        authModal.style.display = "none";
    }

    if (event.target === accountModal) {
        accountModal.style.display = "none";
    }

    if (event.target === successPopup) {
        successPopup.style.display = "none";
    }
});


// ==========================================
// INITIALIZE WEBSITE
// ==========================================

updateAuthUI();
updateRegistrationButtons();

/* =================================
   E-RECK ELECTRICAL CIRCUIT ANIMATION
   ================================= */

(() => {
    const canvas = document.getElementById("circuit-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let width = 0;
    let height = 0;
    let animationFrame;
    let particles = [];

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        width = rect.width;
        height = rect.height;

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        createParticles();
        drawCircuits();
    }

    function createParticles() {
        const particleCount = Math.min(
            Math.floor((width * height) / 18000),
            65
        );

        particles = Array.from(
            { length: particleCount },
            () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.5 + 0.2
            })
        );
    }

    function drawCircuits() {
        ctx.clearRect(0, 0, width, height);

        // Draw subtle circuit-board lines
        const spacing = 65;

        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";

        for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + spacing * 0.45, y);
                ctx.lineTo(x + spacing * 0.45, y + spacing * 0.45);
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(
                    x + spacing * 0.45,
                    y + spacing * 0.45,
                    2,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
                ctx.fill();
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Redraw the subtle circuit pattern
        drawCircuits();

        // Animate the glowing particles
        particles.forEach((particle) => {
            ctx.beginPath();

            ctx.arc(
                particle.x,
                particle.y,
                particle.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = `rgba(56, 189, 248, ${particle.opacity})`;
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#38bdf8";
            ctx.fill();

            ctx.shadowBlur = 0;

            particle.y -= particle.speed;

            if (particle.y < 0) {
                particle.y = height;
                particle.x = Math.random() * width;
            }
        });

        animationFrame = requestAnimationFrame(animate);
    }

    resizeCanvas();

    if (!reduceMotion) {
        animate();
    }

    window.addEventListener("resize", resizeCanvas);

    // Pause animation when the page is hidden
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(animationFrame);
        } else if (!reduceMotion) {
            cancelAnimationFrame(animationFrame);
            animate();
        }
    });
})();

// ==========================================
// ANIMATED HERO STATISTICS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const counters = document.querySelectorAll(".stat-number");
    const duration = 1500;

    counters.forEach(function (counter) {

        const target = Number(counter.dataset.target);

        if (!Number.isFinite(target) || target < 0) {
            return;
        }

        const startTime = performance.now();

        function updateCounter(currentTime) {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth ease-out animation
            const easedProgress = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(
                easedProgress * target
            );

            counter.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);

    });

});
