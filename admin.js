// Global chart instance
      let campaignChart;
      let userGrowthChartInstance;

      // Load users from local storage
      function loadUsers() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        document.getElementById("userCount").innerText = users.length;

        const tableBody = document.querySelector("#userTable tbody");
        tableBody.innerHTML = "";

        users.forEach((user) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${user.name || "N/A"}</td>
            <td>${user.email}</td>
            <td>${user.registeredAt || "N/A"}</td>
        `;
          tableBody.appendChild(row);
        });
      }

      // Show specific section
      function showSection(section) {
        const sections = [
          "users",
          "campaigns",
          "content",
          "leads",
          "analytics",
          "integrations",
        ];
        sections.forEach((sec) => {
          const secId = sec + "Section";
          const element = document.getElementById(secId);
          if (element) {
            element.style.display = sec === section ? "block" : "none";
          }
        });

        document
          .querySelectorAll(".sidebar-nav a")
          .forEach((link) => link.classList.remove("active"));
        document
          .querySelector(`.sidebar-nav a[onclick="showSection('${section}')"]`)
          .classList.add("active");

        if (section === "campaigns") {
          renderCampaignChart();
        }
        if (section === "analytics") {
          loadAnalyticsFromLocalStorage();
        }

        // For mobile, close sidebar after clicking a link
        if (window.innerWidth <= 1024) {
          document.getElementById("sidebar").classList.remove("open");
        }
      }

      // Render Campaigns Chart
      function renderCampaignChart() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const dateMap = {};
        users.forEach((user) => {
          const date = new Date(user.registeredAt).toLocaleDateString();
          dateMap[date] = (dateMap[date] || 0) + 1;
        });

        const labels = Object.keys(dateMap);
        const data = Object.values(dateMap);

        if (campaignChart) {
          campaignChart.destroy();
        }

        const ctx = document.getElementById("campaignChart").getContext("2d");
        campaignChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels.length > 0 ? labels : ["No Data"],
            datasets: [
              {
                label: "User Registrations",
                data: data.length > 0 ? data : [0],
                backgroundColor: function (context) {
                  const gradient = context.chart.ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    400
                  );
                  gradient.addColorStop(0, "#4facfe");
                  gradient.addColorStop(1, "#00f2fe");
                  return gradient;
                },
                borderRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: function (item) {
                    return ` ${item.raw} users`;
                  },
                },
              },
            },
            scales: {
              x: { grid: { color: "#444" }, ticks: { color: "#ccc" } },
              y: {
                grid: { color: "#444" },
                ticks: { color: "#ccc" },
                beginAtZero: true,
              },
            },
          },
        });
        // Update stats
        document.getElementById("totalUsersStat").innerText = users.length;
        const today = new Date().toLocaleDateString();
        const todaysCount = dateMap[today] || 0;
        document.getElementById("todaysUsersStat").innerText = todaysCount;
        const peakDay = labels.length
          ? labels[data.indexOf(Math.max(...data))]
          : "N/A";
        document.getElementById("peakDayStat").innerText = peakDay;
      }

      // Theme Toggle
      const themeToggle = document.getElementById("themeToggle");
      themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        document.body.classList.toggle("light");
        const isDark = document.body.classList.contains("dark");
        themeToggle.innerHTML = isDark
          ? '<i class="fas fa-sun"></i> Light Mode'
          : '<i class="fas fa-moon"></i> Dark Mode';
      });

      document.body.classList.add("dark");
      loadUsers();

      // Content management
      function showContentPanel(panel) {
        const panels = ["blogPanel", "socialPanel", "emailPanel"];
        panels.forEach((id) => {
          document.getElementById(id).style.display =
            id === panel + "Panel" ? "block" : "none";
        });
      }

      function loadBlogs() {
        const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
        const blogList = document.getElementById("blogList");
        blogList.innerHTML = "";

        blogs.forEach((blog, index) => {
          const li = document.createElement("li");
          li.innerHTML = `
            <strong>${blog.title}</strong>
            <p><img src="${blog.image}" alt="${blog.title}" style="max-width: 100px;"></p>
            <p>${blog.summary}</p>
            <p>By ${blog.author} on ${blog.date}</p>
            <button onclick="editBlog(${index})">Edit</button>
            <button onclick="deleteBlog(${index})">Delete</button>
        `;
          blogList.appendChild(li);
        });
      }

      function convertGoogleDriveLink(url) {
        const match = url.match(/\/d\/(.*?)\//);
        return match
          ? `https://drive.google.com/uc?export=view&id=${match[1]}`
          : url;
      }

      document
        .getElementById("blogForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();
          const title = document.getElementById("blogTitle").value.trim();
          const image = document.getElementById("blogImage").value.trim();
          const author = document.getElementById("authorName").value.trim();
          let authorImage = document.getElementById("authorImage").value.trim();
          const summary = document.getElementById("blogSummary").value.trim();
          const content = document.getElementById("blogContent").value.trim();
          const instagram = document.getElementById("instagramLink").value.trim();
          const facebook = document.getElementById("facebookLink").value.trim();
          const whatsapp = document.getElementById("whatsappLink").value.trim();
          const linkedin = document.getElementById("linkedinLink").value.trim();
          const date = new Date().toLocaleDateString();

          authorImage = convertGoogleDriveLink(authorImage);

          let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
          blogs.push({
            title,
            image,
            author,
            authorImage,
            summary,
            content,
            instagram,
            facebook,
            whatsapp,
            linkedin,
            date,
          });
          localStorage.setItem("blogs", JSON.stringify(blogs));
          this.reset();
          loadBlogs();
        });

      let editingIndex = null;

      function editBlog(index) {
        const blogs = JSON.parse(localStorage.getItem("blogs")) || [];
        const blog = blogs[index];

        document.getElementById("blogTitle").value = blog.title;
        document.getElementById("blogContent").value = blog.content;
        editingIndex = index;
      }

      function deleteBlog(index) {
        let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
        blogs.splice(index, 1);
        localStorage.setItem("blogs", JSON.stringify(blogs));
        loadBlogs();
      }

      loadBlogs();

      // Animate donut chart
      document.querySelectorAll(".donut-chart").forEach((chart) => {
        const percent = +chart.getAttribute("data-percent");
        const max = +chart.getAttribute("data-max");
        const statNumber = chart.nextElementSibling;
        let current = 0;
        let angle = 0;

        function animate() {
          if (current < percent) {
            current++;
            angle = (current / max) * 360;
            chart.style.setProperty("--angle", `${angle}deg`);
            statNumber.textContent = chart.getAttribute("data-percent").includes("%")
              ? current + "%"
              : current;
            requestAnimationFrame(animate);
          }
        }
        animate();
      });

      // Analytics
      function loadAnalyticsFromLocalStorage() {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const totalUsers = users.length;
        const loginHistory = JSON.parse(localStorage.getItem("loginHistory")) || [];
        const totalLogins = loginHistory.length;

        document.getElementById("totalUsers").textContent = totalUsers;
        document.getElementById("totalLogins").textContent = totalLogins;

        const dateCounts = {};
        users.forEach((user) => {
          const date = new Date(user.registeredAt).toLocaleDateString();
          dateCounts[date] = (dateCounts[date] || 0) + 1;
        });

        const labels =
          Object.keys(dateCounts).length > 0
            ? Object.keys(dateCounts)
            : ["No Data"];
        const dataPoints =
          Object.values(dateCounts).length > 0 ? Object.values(dateCounts) : [0];

        renderUserGrowthChart(labels, dataPoints);
      }

      function renderUserGrowthChart(labels, dataPoints) {
        const ctx = document.getElementById("userGrowthChart").getContext("2d");

        if (userGrowthChartInstance) {
          userGrowthChartInstance.destroy();
        }

        userGrowthChartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Registered Users",
                data: dataPoints,
                borderColor: "#feb47b",
                backgroundColor: "rgba(254, 180, 123, 0.2)",
                fill: true,
                tension: 0.4,
                pointBackgroundColor: "#ff7e5f",
                pointRadius: 5,
                pointHoverRadius: 7,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: { legend: { labels: { color: "#fff" } } },
            scales: {
              x: { ticks: { color: "#fff" } },
              y: { ticks: { color: "#fff" }, beginAtZero: true },
            },
          },
        });
      }

      // Integrations
      document
        .getElementById("saveIntegrations")
        .addEventListener("click", function () {
          const integrations = {
            googleAnalytics: {
              enabled: document.getElementById("gaToggle").checked,
              key: document.getElementById("gaKey").value,
            },
            facebookPixel: {
              enabled: document.getElementById("fbToggle").checked,
              key: document.getElementById("fbKey").value,
            },
            mailchimp: {
              enabled: document.getElementById("mcToggle").checked,
              key: document.getElementById("mcKey").value,
            },
          };
          localStorage.setItem("integrations", JSON.stringify(integrations));
          alert("Integrations saved successfully!");
        });

      window.addEventListener("load", function () {
        const saved = JSON.parse(localStorage.getItem("integrations")) || {};
        if (saved.googleAnalytics) {
          document.getElementById("gaToggle").checked = saved.googleAnalytics.enabled;
          document.getElementById("gaKey").value = saved.googleAnalytics.key;
        }
        if (saved.facebookPixel) {
          document.getElementById("fbToggle").checked = saved.facebookPixel.enabled;
          document.getElementById("fbKey").value = saved.facebookPixel.key;
        }
        if (saved.mailchimp) {
          document.getElementById("mcToggle").checked = saved.mailchimp.enabled;
          document.getElementById("mcKey").value = saved.mailchimp.key;
        }
      });

      function testConnection(keyId, statusId) {
        const keyValue = document.getElementById(keyId).value.trim();
        const statusElement = document.getElementById(statusId);
        statusElement.classList.remove("success", "fail");
        if (keyValue) {
          statusElement.textContent = "✔ Connection Successful!";
          statusElement.classList.add("success");
        } else {
          statusElement.textContent = "✖ No Key Found!";
          statusElement.classList.add("fail");
        }
      }

      // New sidebar toggle logic for responsiveness
      const sidebar = document.getElementById("sidebar");
      const openBtn = document.getElementById("openSidebarBtn");
      const closeBtn = document.getElementById("closeSidebarBtn");

      openBtn.onclick = function () {
        sidebar.classList.add("open");
      };

      closeBtn.onclick = function () {
        sidebar.classList.remove("open");
      };