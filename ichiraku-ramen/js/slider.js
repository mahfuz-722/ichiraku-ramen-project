// Simple autoplay slider for .slides elements

window.addEventListener("load", () => {
  const slides = document.querySelectorAll(".slides");
  if (!slides.length) return;

  let slideIndex = 0;
  let timer = null;

  function showSlide(n) {
    slides.forEach((s, i) => {
      s.style.display = i === n ? "block" : "none";
    });
  }

  function nextSlide() {
    slideIndex = (slideIndex + 1) % slides.length;
    showSlide(slideIndex);
  }

  showSlide(slideIndex);
  timer = setInterval(nextSlide, 4000);

  const slider = document.querySelector(".slider");
  if (slider) {
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", () => {
      timer = setInterval(nextSlide, 4000);
    });
  }
});
