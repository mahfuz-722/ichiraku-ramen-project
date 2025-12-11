// ========= UTILITIES =========
function readStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

// ========= GLOBAL STATE KEYS =========
const CART_KEY = "ichirakuCart";
const ORDERS_KEY = "ichirakuOrders";
const FAV_KEY = "ichirakuFavourites";
const THEME_KEY = "ichirakuTheme";
const SERVICE_KEY = "ichirakuService";
const USER_KEY = "ichirakuUser";
const LOGGED_KEY = "ichirakuLoggedIn";

let cart = [];
let orders = [];
let favourites = [];

// ========= HERO TYPING + GREETING (HOME ONLY) =========
const heroText = "Welcome to Ichiraku Ramen";
let heroIndex = 0;
const typingSpeed = 100;

function typeHeroText() {
  const typingEl = document.getElementById("typing-text");
  if (!typingEl) return; // only on home page
  if (heroIndex < heroText.length) {
    typingEl.textContent += heroText.charAt(heroIndex);
    heroIndex++;
    setTimeout(typeHeroText, typingSpeed);
  }
}

function displayGreeting() {
  const greeting = document.getElementById("greeting");
  if (!greeting) return;

  const now = new Date();
  const hour = now.getHours();

  if (hour < 12) {
    greeting.textContent = "🌅 Good morning, ramen hero!";
  } else if (hour < 18) {
    greeting.textContent = "☀️ Good afternoon! Perfect time for noodles!";
  } else {
    greeting.textContent = "🌙 Good evening, hungry shinobi!";
  }
}

// Order Now → ALWAYS go to menu page
function orderNow() {
  window.location.href = "menu.html";
}

// Background parallax effect (home only)
document.addEventListener("mousemove", (e) => {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const moveX = (e.pageX / window.innerWidth - 0.5) * 30;
  const moveY = (e.pageY / window.innerHeight - 0.5) * 30;
  hero.style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
});

// ========= THEME (DARK/LIGHT) =========
function applyThemeFromStorage() {
  const stored = readStorage(THEME_KEY, "dark");
  if (stored === "light") {
    document.body.classList.add("light-mode");
  } else {
    document.body.classList.remove("light-mode");
  }
  updateThemeToggleIcon();
}

function toggleTheme() {
  const isLight = document.body.classList.toggle("light-mode");
  writeStorage(THEME_KEY, isLight ? "light" : "dark");
  updateThemeToggleIcon();
}

function updateThemeToggleIcon() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  // 🌙 = dark mode ON, user can switch to light; ☀️ = light mode ON
  btn.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
}

// ========= SERVICE TYPE (DELIVERY/COLLECTION) =========
function initServiceToggle() {
  const serviceBtns = document.querySelectorAll(".service-btn");
  if (!serviceBtns.length) return;

  const stored = readStorage(SERVICE_KEY, "delivery");

  // highlight previously chosen service
  serviceBtns.forEach(btn => {
    const type = btn.dataset.service;
    if (type === stored) btn.classList.add("active");

    btn.addEventListener("click", () => {
      const chosen = btn.dataset.service;

      // visual active state
      serviceBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // remember in localStorage
      writeStorage(SERVICE_KEY, chosen);
      updateServiceLabels();

      // go to correct page
      if (chosen === "delivery") {
        window.location.href = "delivery.html";
      } else if (chosen === "collection") {
        window.location.href = "collection.html";
      }
    });
  });

  // set labels on first load (cart / payment)
  updateServiceLabels();
}

// ✅ This was missing before and was breaking everything
function updateServiceLabels() {
  const service = readStorage(SERVICE_KEY, "delivery");
  const cartLabel = document.getElementById("cartServiceLabel");
  const payLabel = document.getElementById("paymentServiceLabel");
  if (cartLabel) cartLabel.textContent = service;
  if (payLabel) payLabel.textContent = service;
}

// ========= AUTH (LOGIN / REGISTER) =========
function initAuth() {
  const loginModal = document.getElementById("loginModal");
  const registerModal = document.getElementById("registerModal");
  const loginBtn = document.querySelector(".login-btn");
  const registerBtn = document.querySelector(".register-btn");
  const logoutItem = document.getElementById("logoutItem");
  const navRight = document.querySelector(".nav-right");

  if (!loginModal || !registerModal || !loginBtn || !registerBtn || !navRight) return;

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginSuccess = document.getElementById("loginSuccess");
  const registerSuccess = document.getElementById("registerSuccess");
  const toRegister = document.getElementById("toRegister");
  const toLogin = document.getElementById("toLogin");
  const closeLogin = document.querySelector(".close-login");
  const closeRegister = document.querySelector(".close-register");

  function updateAuthUI() {
    const user = readStorage(LOGGED_KEY, null);

    if (user) {
      loginBtn.style.display = "none";
      registerBtn.style.display = "none";

      let badge = document.getElementById("userBadge");
      if (!badge) {
        badge = document.createElement("span");
        badge.id = "userBadge";
        badge.style.fontWeight = "bold";
        badge.style.fontSize = "0.9rem";
        badge.style.marginRight = "10px";
        navRight.insertBefore(badge, navRight.firstChild);
      }
      badge.textContent = `👤 ${user.username}`;
      if (logoutItem) logoutItem.style.display = "block";
    } else {
      loginBtn.style.display = "";
      registerBtn.style.display = "";
      const badge = document.getElementById("userBadge");
      if (badge) badge.remove();
      if (logoutItem) logoutItem.style.display = "none";
    }
  }

  updateAuthUI();

  // open modals
  loginBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
    if (loginSuccess) loginSuccess.style.display = "none";
  });

  registerBtn.addEventListener("click", () => {
    registerModal.style.display = "block";
    if (registerSuccess) registerSuccess.style.display = "none";
  });

  // close modals
  closeLogin.addEventListener("click", () => (loginModal.style.display = "none"));
  closeRegister.addEventListener("click", () => (registerModal.style.display = "none"));

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) loginModal.style.display = "none";
    if (e.target === registerModal) registerModal.style.display = "none";
  });

  // switch links
  if (toRegister) {
    toRegister.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "none";
      registerModal.style.display = "block";
    });
  }
  if (toLogin) {
    toLogin.addEventListener("click", (e) => {
      e.preventDefault();
      registerModal.style.display = "none";
      loginModal.style.display = "block";
    });
  }

  // register submit
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("regUsername").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const pass = document.getElementById("regPassword").value;
    const confirm = document.getElementById("regConfirmPassword").value;

    if (!username || !email || pass !== confirm) {
      alert("Please check your details. Passwords must match.");
      return;
    }

    writeStorage(USER_KEY, { username, email });
    writeStorage(LOGGED_KEY, { username, email });

    if (registerSuccess) registerSuccess.style.display = "block";
    registerForm.reset();
    updateAuthUI();
    setTimeout(() => (registerModal.style.display = "none"), 1500);
  });

  // login submit
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const stored = readStorage(USER_KEY, null);
    if (!stored || stored.username !== username) {
      alert("User not found. Please register first.");
      return;
    }
    writeStorage(LOGGED_KEY, stored);
    if (loginSuccess) loginSuccess.style.display = "block";
    loginForm.reset();
    updateAuthUI();
    setTimeout(() => (loginModal.style.display = "none"), 1500);
  });

  // logout (3-dot menu)
  if (logoutItem) {
    logoutItem.addEventListener("click", () => {
      writeStorage(LOGGED_KEY, null);
      updateAuthUI();
    });
  }
}

// ========= CART / ORDER HISTORY / FAVOURITES =========
function loadCartState() {
  cart = readStorage(CART_KEY, []);
  orders = readStorage(ORDERS_KEY, []);
  favourites = readStorage(FAV_KEY, []);
  updateCartCount();
}

function saveCartState() {
  writeStorage(CART_KEY, cart);
  writeStorage(ORDERS_KEY, orders);
  writeStorage(FAV_KEY, favourites);
}

function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (!countEl) return;
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = total;
}

function addToCart(item) {
  const existing = cart.find(p => p.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCartState();
  updateCartCount();
  showToast(`${item.name} added to your basket 🍜`);
}

// change quantity helper (+ / -)
function changeCartQuantity(id, delta) {
  const idx = cart.findIndex(i => i.id === id);
  if (idx === -1) return;

  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1); // remove item if qty 0
  }
  saveCartState();
  updateCartCount();
  renderCartModal();
}

function toggleFavourite(item) {
  const index = favourites.findIndex(f => f.id === item.id);
  if (index >= 0) favourites.splice(index, 1);
  else favourites.push(item);
  saveCartState();
}

function renderCartModal() {
  const cartModal = document.getElementById("cartModal");
  const itemsEl = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const serviceLabel = document.getElementById("cartServiceLabel");

  if (!cartModal || !itemsEl || !totalEl) return;

  itemsEl.innerHTML = "";
  if (!cart.length) {
    itemsEl.textContent = "Your basket is empty.";
    totalEl.textContent = "£0.00";
  } else {
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      const row = document.createElement("div");
      row.className = "cart-item-row";
      row.innerHTML = `
        <span class="cart-item-name">${item.name}</span>
        <div class="cart-qty-controls">
          <button class="qty-btn cart-minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="cart-qty">${item.qty}</span>
          <button class="qty-btn cart-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <span class="cart-item-price">£${(item.price * item.qty).toFixed(2)}</span>
      `;
      itemsEl.appendChild(row);
    });
    totalEl.textContent = `£${total.toFixed(2)}`;
  }

  const service = readStorage(SERVICE_KEY, "delivery");
  if (serviceLabel) serviceLabel.textContent = service;
}

function initCartAndMenu() {
  const cartBtn = document.getElementById("cartButton");
  const cartModal = document.getElementById("cartModal");
  const closeCart = document.querySelector(".close-cart");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const itemsEl = document.getElementById("cartItems");

  // NAV CART → open modal
  if (cartBtn && cartModal && closeCart) {
    cartBtn.addEventListener("click", () => {
      renderCartModal();
      cartModal.style.display = "block";
    });

    closeCart.addEventListener("click", () => (cartModal.style.display = "none"));

    window.addEventListener("click", (e) => {
      if (e.target === cartModal) cartModal.style.display = "none";
    });
  }

  // plus / minus inside cart modal (event delegation)
  if (itemsEl) {
    itemsEl.addEventListener("click", (e) => {
      const minusBtn = e.target.closest(".cart-minus");
      const plusBtn = e.target.closest(".cart-plus");
      if (minusBtn) {
        const id = minusBtn.dataset.id;
        changeCartQuantity(id, -1);
      } else if (plusBtn) {
        const id = plusBtn.dataset.id;
        changeCartQuantity(id, +1);
      }
    });
  }

  // CHECKOUT inside modal → go to payment page
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!cart.length) {
        alert("Your basket is empty 🍜");
        return;
      }
      saveCartState(); // ensure latest
      window.location.href = "payment.html";
    });
  }

  // MENU PAGE: attach add-to-cart / favourites
  // This version is robust even if you forgot data-id/data-price attributes.
  const menuItems = document.querySelectorAll(".menu-item");
  if (menuItems.length) {
    menuItems.forEach((card, index) => {
      let id = card.dataset.id;
      let name = card.dataset.name;
      let price = parseFloat(card.dataset.price || "0");

      // fallback if data-* missing
      if (!id) {
        id = `item-${index}`;
        card.dataset.id = id;
      }
      if (!name) {
        const h3 = card.querySelector("h3");
        name = h3 ? h3.textContent.trim() : `Item ${index + 1}`;
        card.dataset.name = name;
      }
      if (!card.dataset.price) {
        const priceEl = card.querySelector(".price");
        if (priceEl) {
          const text = priceEl.textContent.replace(/[^0-9.]/g, "");
          price = parseFloat(text) || 0;
          card.dataset.price = String(price);
        }
      }

      const addBtn = card.querySelector(".add-cart-btn");
      const favBtn = card.querySelector(".fav-btn");

      // Favourites indicator
      const favExists = favourites.find(f => f.id === id);
      if (favExists && favBtn) favBtn.classList.add("active");

      if (addBtn) {
        addBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          addToCart({ id, name, price });
        });
      } else {
        // If no separate button, click whole card
        card.addEventListener("click", () => {
          addToCart({ id, name, price });
        });
      }

      if (favBtn) {
        favBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          favBtn.classList.toggle("active");
          toggleFavourite({ id, name, price });
        });
      }
    });
  }
}

// ========= SMALL TOAST (item added) =========
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("visible");
  setTimeout(() => toast.classList.remove("visible"), 2000);
}

// ========= 3 DOTS USER MENU =========
function initUserMenu() {
  const toggleBtn = document.getElementById("userMenuToggle");
  const menu = document.getElementById("userMenu");
  const infoModal = document.getElementById("infoModal");
  const infoTitle = document.getElementById("infoTitle");
  const infoBody = document.getElementById("infoBody");
  const closeInfo = document.querySelector(".close-info");

  if (!toggleBtn || !menu || !infoModal || !infoTitle || !infoBody || !closeInfo) return;

  toggleBtn.addEventListener("click", () => {
    const visible = menu.style.display === "block";
    menu.style.display = visible ? "none" : "block";
  });

  window.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && e.target !== toggleBtn) {
      menu.style.display = "none";
    }
  });

  closeInfo.addEventListener("click", () => (infoModal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === infoModal) infoModal.style.display = "none";
  });

  function showInfo(title, html) {
    infoTitle.textContent = title;
    infoBody.innerHTML = html;
    infoModal.style.display = "block";
  }

  menu.querySelectorAll("button").forEach(btn => {
    btn.addEventListener("click", () => {
      const action = btn.dataset.action;
      menu.style.display = "none";

      if (action === "history") {
        if (!orders.length) {
          showInfo("Order History", "<p>No orders yet. Go to the menu and add some ramen!</p>");
          return;
        }
        const list = orders.map(o => {
          const items = o.items.map(i => `${i.name} x ${i.qty}`).join(", ");
          return `<li><strong>${o.created}</strong> — ${o.service} — ${items}</li>`;
        }).join("");
        showInfo("Order History", `<ul>${list}</ul>`);
      } else if (action === "favorites") {
        if (!favourites.length) {
          showInfo("Favourites", "<p>You don't have any favourites yet. Tap the ♡ on dishes you love.</p>");
          return;
        }
        const list = favourites
          .map(f => `<li>${f.name} — £${f.price.toFixed(2)}</li>`)
          .join("");
        showInfo("Favourites", `<ul>${list}</ul>`);
      } else if (action === "theme") {
        toggleTheme();
      } else if (action === "settings") {
        const service = readStorage(SERVICE_KEY, "delivery");
        const theme = document.body.classList.contains("light-mode") ? "Light" : "Dark";
        showInfo(
          "Settings",
          `<p>Current service: <strong>${service}</strong></p><p>Theme: <strong>${theme}</strong></p>`
        );
      } else if (action === "help") {
        showInfo(
          "Help & Support",
          `
          <p>For urgent issues with your order, please use the contact form on the Contact page.</p>
          <p>For allergy questions, always speak to staff in-store before eating.</p>
        `
        );
      } else if (action === "about") {
        window.location.href = "about.html";
      }
    });
  });
}

// ========= MENU CATEGORY FILTER (if you have buttons) =========
function initCategoryFilter() {
  const buttons = document.querySelectorAll(".category-btn");
  const items = document.querySelectorAll(".menu-item[data-category]");
  if (!buttons.length || !items.length) return;

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.category;
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      items.forEach(card => {
        const c = card.dataset.category;
        if (cat === "all" || cat === c) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

// ========= CONTACT FAQ & FORM =========
function initContactInteractions() {
  const faqButtons = document.querySelectorAll(".faq-question");
  faqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      const visible = answer.style.display === "block";
      answer.style.display = visible ? "none" : "block";
    });
  });

  const supportForm = document.getElementById("supportForm");
  if (supportForm) {
    const success = document.getElementById("supportSuccess");
    supportForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (success) success.style.display = "block";
      supportForm.reset();
      setTimeout(() => {
        if (success) success.style.display = "none";
      }, 2500);
    });
  }
}

// ========= ON LOAD =========
window.addEventListener("load", () => {
  applyThemeFromStorage();
  typeHeroText();
  displayGreeting();
  initServiceToggle();
  initAuth();
  loadCartState();
  initCartAndMenu();
  initUserMenu();
  initCategoryFilter();
  initContactInteractions();

  // theme button click (top bar)
  const themeToggleBtn = document.getElementById("themeToggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }
});












