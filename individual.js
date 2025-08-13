const carousel = document.querySelector('.testimonial-carousel');
let scrollAmount = 0;

function slideTestimonials() {
    const testimonialWidth = document.querySelector('.testimonial').offsetWidth + 20;
    scrollAmount += testimonialWidth;

    if (scrollAmount >= carousel.scrollWidth - carousel.clientWidth) {
        scrollAmount = 0;
    }

    carousel.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

setInterval(slideTestimonials, 3000);