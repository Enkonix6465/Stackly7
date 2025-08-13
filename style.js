document.addEventListener("DOMContentLoaded", function () {
    const userIcon = document.getElementById("user-initials");
    const logoutDropdown = document.getElementById("logout-dropdown");
    const logoutBtn = document.getElementById("logout-btn");
  
    // Toggle logout dropdown on click
    userIcon.addEventListener("click", function (e) {
      logoutDropdown.style.display =
        logoutDropdown.style.display === "block" ? "none" : "block";
      e.stopPropagation(); // prevent closing when clicking icon
    });
  
    // Hide dropdown when clicking outside
    document.addEventListener("click", function () {
      logoutDropdown.style.display = "none";
    });
  
    // Handle logout
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
    });
  });
  