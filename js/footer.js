// Footer JavaScript Functions
document.addEventListener('DOMContentLoaded', function() {
    // Initialize footer functionality
    initializeFooter();
});

function initializeFooter() {
    // Add hover effects to footer links
    const footerLinks = document.querySelectorAll('footer a');
    
    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-1px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click effects to footer icons
    const footerIcons = document.querySelectorAll('footer i');
    
    footerIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    // Add smooth scroll to footer links that point to page sections
    const internalLinks = document.querySelectorAll('footer a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add animation to footer on scroll
    const footer = document.querySelector('footer');
    if (footer) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // Add margin to trigger earlier on mobile
        });

        // Set initial state with fallback for mobile
        footer.style.opacity = '0';
        footer.style.transform = 'translateY(20px)';
        footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

        // Fallback: ensure footer is visible after a delay (for mobile compatibility)
        setTimeout(() => {
            if (footer.style.opacity === '0') {
                footer.style.opacity = '1';
                footer.style.transform = 'translateY(0)';
            }
        }, 1000);

        observer.observe(footer);
    }
}

// Footer utility functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export functions for external use
window.Footer = {
    scrollToTop: scrollToTop,
    scrollToSection: scrollToSection,
    initializeFooter: initializeFooter
};
