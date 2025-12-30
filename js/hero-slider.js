// Hero Image Slider JavaScript
(function() {
    'use strict';

    let currentSlide = 0;
    let slideInterval;
    let isPaused = false;
    const slideDuration = 4000; // 4 seconds

    function initSlider() {
        const slides = document.querySelectorAll('.slider-slide');
        const indicators = document.querySelectorAll('.slider-indicator');
        const prevBtn = document.querySelector('.slider-prev');
        const nextBtn = document.querySelector('.slider-next');
        const sliderContainer = document.querySelector('.slider-container');

        if (slides.length === 0) return;

        // Function to show slide
        function showSlide(index) {
            // Remove active class from all slides and indicators
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));

            // Add active class to current slide and indicator
            if (slides[index]) {
                slides[index].classList.add('active');
            }
            if (indicators[index]) {
                indicators[index].classList.add('active');
            }

            currentSlide = index;
        }

        // Function to go to next slide
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        // Function to go to previous slide
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        // Function to go to specific slide
        function goToSlide(index) {
            if (index >= 0 && index < slides.length) {
                showSlide(index);
            }
        }

        // Auto-play function
        function startAutoPlay() {
            if (!isPaused) {
                slideInterval = setInterval(nextSlide, slideDuration);
            }
        }

        function stopAutoPlay() {
            clearInterval(slideInterval);
        }

        // Event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
                stopAutoPlay();
                setTimeout(startAutoPlay, 2000); // Resume after 2 seconds
            });
        });

        // Event listeners for navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 2000);
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 2000);
            });
        }

        // Pause on hover
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', () => {
                isPaused = true;
                stopAutoPlay();
            });

            sliderContainer.addEventListener('mouseleave', () => {
                isPaused = false;
                startAutoPlay();
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 2000);
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoPlay();
                setTimeout(startAutoPlay, 2000);
            }
        });

        // Start auto-play
        startAutoPlay();

        // Initialize first slide
        showSlide(0);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
    } else {
        initSlider();
    }
})();

