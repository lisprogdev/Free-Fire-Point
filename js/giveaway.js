// Giveaway Banner Animations
(function() {
    'use strict';

    // Typing Animation
    function initTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const text = typingElement.getAttribute('data-text');
        if (!text) return;

        let index = 0;
        typingElement.textContent = '';

        function type() {
            if (index < text.length) {
                typingElement.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }

        // Start typing after a delay
        setTimeout(() => {
            type();
        }, 500);
    }

    // Fade In Up Animation on Scroll
    function initFadeInUp() {
        const elements = document.querySelectorAll('.fade-in-up');
        
        if (elements.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(element => {
            observer.observe(element);
        });
    }

    // Initialize on DOM ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initTypingAnimation();
                initFadeInUp();
            });
        } else {
            initTypingAnimation();
            initFadeInUp();
        }
    }

    init();
})();

