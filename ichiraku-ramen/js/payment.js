// PAYMENT PAGE SCRIPT — dynamic order rendering

function readStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

// Load order items from cart storage
const cartItems = readStorage("ichirakuCart", []);
const service = readStorage("ichirakuService", "delivery");

// Update service text
document.getElementById("paymentServiceLabel").textContent =
  service.charAt(0).toUpperCase() + service.slice(1);

// Render order summary
function renderOrderSummary() {
  const itemsContainer = document.getElementById("orderItems");
  const totalEl = document.getElementById("orderTotal");

  if (!cartItems.length) {
    itemsContainer.innerHTML = "<p>Your basket was empty.</p>";
    totalEl.textContent = "£0.00";
    return;
  }

  let total = 0;
  itemsContainer.innerHTML = "";

  cartItems.forEach(item => {
    total += item.price * item.qty;
    itemsContainer.innerHTML += `
      <p><span>${item.name} x ${item.qty}</span> 
      <span>£${(item.price * item.qty).toFixed(2)}</span></p>
    `;
  });

  totalEl.textContent = `£${total.toFixed(2)}`;
}

renderOrderSummary();

// Handle payment submission
const paymentForm = document.getElementById("paymentForm");
const confirmMsg = document.getElementById("confirmMessage");

paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const requiredIds = [
    "fullName",
    "email",
    "phone",
    "cardName",
    "cardNumber",
    "expiry",
    "cvv"
  ];
  
  const missing = requiredIds.some(id => {
    const el = document.getElementById(id);
    return !el || !el.value.trim();
  });

  if (missing) {
    alert("⚠️ Please fill in all required fields.");
    return;
  }

  // Show success message
  confirmMsg.style.display = "block";

  // Clear stored cart
  localStorage.removeItem("ichirakuCart");

  // Redirect back after delay
  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
});


