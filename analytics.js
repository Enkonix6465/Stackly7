document.addEventListener("DOMContentLoaded", function () {
    // Fetch users and login history
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let loginHistory = JSON.parse(localStorage.getItem('loginHistory')) || [];

    // Update total users and total logins
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalLogins').textContent = loginHistory.length;

    // Prepare chart data (based on registration date)
    let userGrowthData = prepareUserGrowthData(users);

    // Create User Growth Chart
    renderUserGrowthChart(userGrowthData);
});

function prepareUserGrowthData(users) {
    // Group users by date (YYYY-MM-DD)
    let dateMap = {};

    users.forEach(user => {
        let date = new Date(user.registeredAt).toLocaleDateString();
        dateMap[date] = (dateMap[date] || 0) + 1;
    });

    let labels = Object.keys(dateMap);
    let values = Object.values(dateMap);

    return { labels, values };
}

function renderUserGrowthChart(data) {
    const ctx = document.getElementById('userGrowthChart').getContext('2d');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'User Registrations Over Time',
                data: data.values,
                borderColor: '#4cafef',
                backgroundColor: 'rgba(79, 172, 239, 0.2)',
                borderWidth: 3,
                pointBackgroundColor: '#ff6f61',
                tension: 0.4 // smooth curves
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: true }
            },
            scales: {
                x: { title: { display: true, text: 'Date' } },
                y: { title: { display: true, text: 'Registrations' }, beginAtZero: true }
            }
        }
    });
}
