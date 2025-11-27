// Typing animation for title
const text = "Welcome to Ichiraku Ramen";
let index = 0;
const typingSpeed = 100;

function typeText() {
  if (index < text.length) {
    document.getElementById("typing-text").textContent += text.charAt(index);
    index++;
    setTimeout(typeText, typingSpeed);
  }
}

// Dynamic greeting
function displayGreeting() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = document.getElementById("greeting");

  if (hour < 12) {
    greeting.textContent = "🌅 Good morning, ramen hero!";
  } else if (hour < 18) {
    greeting.textContent = "☀️ Good afternoon! Perfect time for noodles!";
  } else {
    greeting.textContent = "🌙 Good evening, hungry shinobi!";
  }
}

function orderNow() {
  alert("🍜 Ichiraku Online Orders coming soon — stay tuned!");
}

// Background parallax effect
document.addEventListener("mousemove", (e) => {
  const moveX = (e.pageX / window.innerWidth - 0.5) * 30;
  const moveY = (e.pageY / window.innerHeight - 0.5) * 30;
  document.querySelector(".hero").style.backgroundPosition = `${50 + moveX}% ${50 + moveY}%`;
});

// Run effects on load
window.onload = () => {
  typeText();
  displayGreeting();
};

