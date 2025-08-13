// script.js
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar");
  
    hamburger.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  });
  document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.getElementById("hamburger");
    const navbar = document.getElementById("navbar");
    const userInitials = document.getElementById("user-initials");
  
    hamburger.addEventListener("click", () => {
      navbar.classList.toggle("active");
    });
  
    // Get user initials from localStorage
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user && user.name) {
      userInitials.textContent = user.name
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("")
        .slice(0, 2);
    } else {
      userInitials.textContent = "GU"; // Default: Guest User
    }
  });
 
  document.addEventListener("DOMContentLoaded", function () {
    const faders = document.querySelectorAll(".fade-in");
    const counters = document.querySelectorAll(".count");
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Show animation
            entry.target.classList.add("visible");
  
            // If it's a count-box, start the counter
            if (entry.target.closest(".about-counts")) {
              startCounters();
            }
          } else {
            // Hide again for animation reset (optional)
            entry.target.classList.remove("visible");
  
            // Reset counters when section goes out of view
            if (entry.target.closest(".about-counts")) {
              resetCounters();
            }
          }
        });
      },
      { threshold: 0.45 }
    );
  
    faders.forEach((el) => observer.observe(el));
  
    function startCounters() {
      counters.forEach((counter) => {
        const target = +counter.getAttribute("data-target");
        let count = 0;
  
        const updateCount = () => {
          const inc = Math.ceil(target / 100);
          count += inc;
  
          if (count < target) {
            counter.innerText = count;
            setTimeout(updateCount, 20);
          } else {
            counter.innerText = target;
          }
        };
  
        updateCount();
      });
    }
  
    function resetCounters() {
      counters.forEach((counter) => {
        counter.innerText = "0";
      });
    }
  });
  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault(); // prevent actual form submission
    document.getElementById("formMessage").style.display = "block";
    document.getElementById("formMessage").textContent =
      "Thanks for your message. Our team will get back to you soon!";
    this.reset(); // clear form inputs
  });
    