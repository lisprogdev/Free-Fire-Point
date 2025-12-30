// FAQ Section JavaScript
(function() {
    'use strict';

    function initFAQSection() {
        // FAQ Accordion functionality
        const faqQuestions = document.querySelectorAll('.faq-question-modern');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.closest('.faq-item-modern');
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item-modern').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq-question-modern').setAttribute('aria-expanded', 'false');
                });
                
                // Toggle current item
                if (!isActive) {
                    faqItem.classList.add('active');
                    this.setAttribute('aria-expanded', 'true');
                }
            });
        });

        // Fade in up animation for FAQ items
        const faqItems = document.querySelectorAll('.faq-item-modern');
        
        if (faqItems.length > 0) {
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

            faqItems.forEach(item => {
                observer.observe(item);
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFAQSection);
    } else {
        initFAQSection();
    }
})();

