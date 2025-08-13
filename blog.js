document.addEventListener("DOMContentLoaded", () => {
    const blogContainer = document.getElementById("blogContainer");
    const loadMoreBtn = document.getElementById("loadMoreBtn");
    const popularBlogContent = document.getElementById("popularBlogContent");

    let blogs = JSON.parse(localStorage.getItem("blogs")) || [];
    let likesData = JSON.parse(localStorage.getItem("likesData")) || {}; // store likes

    let currentIndex = 0;
    const blogsPerPage = 2;

    function renderBlogs() {
        let displayedBlogs = blogs.slice(currentIndex, currentIndex + blogsPerPage);
        displayedBlogs.forEach((blog, index) => {
            const blogId = currentIndex + index;
            const likes = likesData[blogId] || 0;

            const blogHTML = `
                <div class="blog-post" data-id="${blogId}">
                    <h2 class="blog-title">${blog.title}</h2>
                    <img src="${blog.image}" alt="Blog Image" class="blog-img">
                    
                    <div class="author-info">
                        <img src="${blog.authorImage}" class="author-pic" alt="${blog.author}">
                        <span class="author-name">${blog.author}</span>
                        <span class="blog-date"><i class="fa fa-calendar"></i> ${blog.date}</span>
                    </div>

                    <p class="blog-summary">${blog.summary}</p>
                    <p class="blog-content">${blog.content}</p>

                    <div class="social-icons">
                        ${blog.instagram ? `<a href="${blog.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>` : ''}
                        ${blog.facebook ? `<a href="${blog.facebook}" target="_blank"><i class="fab fa-facebook"></i></a>` : ''}
                        ${blog.whatsapp ? `<a href="${blog.whatsapp}" target="_blank"><i class="fab fa-whatsapp"></i></a>` : ''}
                        ${blog.linkedin ? `<a href="${blog.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    </div>

                    <div class="blog-actions">
                        <button class="like-btn"><i class="fa fa-thumbs-up"></i> Like <span class="like-count">${likes}</span></button>
                        <button class="comment-btn"><i class="fa fa-comment"></i> Comment</button>
                        <button class="share-btn"><i class="fa fa-share"></i> Share</button>
                    </div>

                    <div class="comment-section" style="display:none;">
                        <textarea class="comment-input" placeholder="Write a comment..."></textarea>
                        <button class="submit-comment">Post Comment</button>
                        <div class="comments-list"></div>
                    </div>
                </div>
            `;
            blogContainer.innerHTML += blogHTML;
        });

        addEventListeners();
        currentIndex += blogsPerPage;
        if (currentIndex >= blogs.length) {
            loadMoreBtn.style.display = "none";
        }

        updatePopularBlog();
    }

    function addEventListeners() {
        document.querySelectorAll(".like-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                const blogPost = this.closest(".blog-post");
                const blogId = blogPost.dataset.id;
                const likeCount = this.querySelector(".like-count");

                if (!likesData[blogId]) likesData[blogId] = 0;
                likesData[blogId]++;

                likeCount.innerText = likesData[blogId];
                localStorage.setItem("likesData", JSON.stringify(likesData));

                updatePopularBlog();
            });
        });

        // Comment toggle
        document.querySelectorAll(".comment-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                const commentSection = this.closest(".blog-post").querySelector(".comment-section");
                commentSection.style.display = commentSection.style.display === "none" ? "block" : "none";
            });
        });

        // Post comment
        document.querySelectorAll(".submit-comment").forEach((btn) => {
            btn.addEventListener("click", function () {
                const blogPost = this.closest(".blog-post");
                const commentInput = blogPost.querySelector(".comment-input");
                const commentsList = blogPost.querySelector(".comments-list");

                if (commentInput.value.trim() !== "") {
                    const comment = document.createElement("p");
                    comment.innerText = commentInput.value;
                    commentsList.appendChild(comment);
                    commentInput.value = "";
                }
            });
        });

        // Share button
        document.querySelectorAll(".share-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                const blogTitle = this.closest(".blog-post").querySelector(".blog-title").innerText;
                const shareData = { title: blogTitle, text: `Check out this blog: ${blogTitle}`, url: window.location.href };

                if (navigator.share) {
                    navigator.share(shareData).catch(console.error);
                } else {
                    navigator.clipboard.writeText(`${blogTitle} - ${window.location.href}`);
                    alert("Blog link copied to clipboard!");
                }
            });
        });
    }

    function updatePopularBlog() {
        let highestLikes = 0;
        let popularBlog = null;

        blogs.forEach((blog, index) => {
            const likes = likesData[index] || 0;
            if (likes > highestLikes) {
                highestLikes = likes;
                popularBlog = { ...blog, likes };
            }
        });

        if (popularBlog) {
            popularBlogContent.innerHTML = `
                <div class="blog-post highlight">
                    <h3 class="blog-title">${popularBlog.title} (🔥 ${popularBlog.likes} Likes)</h3>
                    <img src="${popularBlog.image}" class="blog-img" alt="Popular Blog">
                    <p class="blog-summary">${popularBlog.summary}</p>
                </div>
            `;
        } else {
            popularBlogContent.innerHTML = "No trending blog yet.";
        }
    }

    if (blogs.length === 0) {
        blogContainer.innerHTML = "<p>No blogs available.</p>";
        loadMoreBtn.style.display = "none";
    } else {
        renderBlogs();
    }

    loadMoreBtn.addEventListener("click", renderBlogs);
});
