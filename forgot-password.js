document.getElementById('forgotPasswordForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();



    // Get users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);

    if (user) {
        // Update the user's password
        user.password = password;
        localStorage.setItem('users', JSON.stringify(users));
        alert("Password reset successfully. You can now log in with your new password.");
        window.location.href = "login.html"; // Redirect to login page
    } else {
        alert("Invalid credentials. Please try again.");
    }
});
