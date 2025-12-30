// Cara Penggunaan - Modern Animations & Interactions

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.usage-reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// Fade In Up Animation on Scroll
function initFadeInUp() {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
        observer.observe(element);
    });
}

// Parallax Effect for Background
function initParallax() {
    const sections = document.querySelectorAll('.usage-section');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        sections.forEach(section => {
            const rate = scrolled * 0.5;
            const before = section.querySelector('::before');
            if (section) {
                section.style.transform = `translateY(${rate * 0.1}px)`;
            }
        });
    });
}

// Card Hover Effects Enhancement
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.usage-step-card, .usage-guide-card, .usage-tips-card, .usage-calculator-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    });
}

// Number Badge Animation
function initNumberBadgeAnimation() {
    const badges = document.querySelectorAll('.usage-step-number, .usage-calculator-badge');
    
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.animation = 'pulseGlow 1s ease infinite';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.animation = 'pulseGlow 3s ease-in-out infinite';
        });
    });
}

// List Item Stagger Animation
function initListStagger() {
    const lists = document.querySelectorAll('.usage-list-item');
    
    lists.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}

// Smooth Scroll for Internal Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
}

// Initialize all animations on page load
document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initFadeInUp();
    initParallax();
    initCardHoverEffects();
    initNumberBadgeAnimation();
    initListStagger();
    initSmoothScroll();
    
    // Add reveal class to elements that should animate on scroll
    const gridItems = document.querySelectorAll('.usage-grid-item');
    gridItems.forEach(item => {
        item.classList.add('usage-reveal');
    });
    
    // Trigger AOS refresh after dynamic content loads
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
});

// Re-initialize on window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});
