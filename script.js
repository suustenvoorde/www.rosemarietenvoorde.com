const slides = document.querySelectorAll(".slide");
const pauseButton = document.querySelector("button");
const counter = document.querySelector(".counter");

let currentIndex = 0;
let isPaused = false;
let interval;
let cursor = null;

document.addEventListener('dblclick', function(event) {
  event.preventDefault(); // Voorkomt het inzoomen bij dubbelklikken
});

function adjustBodyHeight() {
  document.body.style.height = `${window.innerHeight}px`;
}

window.addEventListener('resize', adjustBodyHeight);
adjustBodyHeight();

function isMobile() {
  return window.innerWidth < 768;
}

function startSlider() {
  interval = setInterval(() => {
    if (!isPaused) {
      nextSlide();
    }
  }, 2000);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  updateSlider();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateSlider();
}

function updateSlider() {
  slides.forEach((slide, index) => {
    slide.style.display = index === currentIndex ? "block" : "none";
  });

  counter.textContent = `${currentIndex + 1}/${slides.length}`;

  if (cursor) {
    cursor.textContent = `${currentIndex + 1}/${slides.length}`;
  }
}

pauseButton.addEventListener("click", () => {
  event.stopPropagation();
  isPaused = !isPaused;
  pauseButton.classList.toggle('paused');
  pauseButton.children[0].textContent = isPaused ? "Resume autoplay" : "Pause autoplay";
});

document.addEventListener("click", (event) => {
  isPaused = true;
  pauseButton.classList.add('paused');
  pauseButton.children[0].textContent = "Resume autoplay";

  if (event.clientX < window.innerWidth / 2) {
    prevSlide();
  } else {
    nextSlide();
  }
});

function createCursor() {
  if (!cursor && !isMobile()) {
    cursor = document.createElement("div");
    cursor.classList.add("custom-cursor");
    document.body.appendChild(cursor);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", () => cursor.style.display = "none");
    document.addEventListener("mouseenter", () => cursor.style.display = "block");
  }
}

function removeCursor() {
  if (cursor) {
    document.removeEventListener("mousemove", handleMouseMove);
    cursor.remove();
    cursor = null;
  }
}

function handleMouseMove(event) {
  const x = event.clientX;
  const screenWidth = window.innerWidth;

  cursor.style.left = `${x}px`;
  cursor.style.top = `${event.clientY}px`;
  cursor.textContent = `${currentIndex + 1}/${slides.length}`;

  cursor.classList.toggle("left", x < screenWidth / 2);
  cursor.classList.toggle("right", x >= screenWidth / 2);
}

// **🔹 Luister naar schermgrootte veranderingen**
function checkScreenSize() {
  if (isMobile()) {
    removeCursor();
  } else {
    createCursor();
  }
}

window.addEventListener("resize", checkScreenSize);

// **🔹 Start de slider en setup cursor**
updateSlider();
startSlider();
checkScreenSize();
