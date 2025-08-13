document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Check if Admin
    if (email === "admin@enkonix.in" && password === "admin123") {
        window.location.href = "admin.html";
        return;
    }

    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        // Save logged-in user name for home page display
        localStorage.setItem('loggedInUser', user.name);

        // Save login history for analytics
        let loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];
        loginHistory.push({
            email: user.email,
            name: user.name,
            loginTime: new Date().toLocaleString()
        });
        localStorage.setItem('loginHistory', JSON.stringify(loginHistory));

        window.location.href = "home.html";
    } else {
        alert("Invalid credentials. Please try again.");
    }
});
