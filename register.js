document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value.trim();

    // Validate fields
    if (!name || !email || !password) {
        alert("Please fill all fields.");
        return;
    }

    // Get existing users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if email is already registered
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        alert("Email already registered. Please login.");
        window.location.href = "login.html";
        return;
    }

    // Add new user with registration timestamp
    const registeredAt = new Date().toLocaleString();
    users.push({ name, email, password, registeredAt });

    // Save updated user list to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert("Registration successful! Redirecting to login page.");
    window.location.href = "login.html";
});
