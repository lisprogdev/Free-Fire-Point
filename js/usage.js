// Usage Section JavaScript
(function() {
    'use strict';

    function initUsageSection() {
        // Fade in up animation for step cards
        const stepCards = document.querySelectorAll('.usage-step-card');
        
        if (stepCards.length > 0) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.getAttribute('data-delay') || 0;
                        setTimeout(() => {
                            entry.target.classList.add('visible');
                        }, delay);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            stepCards.forEach(card => {
                observer.observe(card);
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUsageSection);
    } else {
        initUsageSection();
    }
})();

