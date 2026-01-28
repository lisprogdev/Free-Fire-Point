// Ad Modal Functions - REMOVED for better UX and AdSense compliance
// function showAdModal() { ... }
// function closeAdModal() { ... }

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    
    // Hero stats animation
    const heroStatsNumbers = document.querySelectorAll('.hero-stats-number');
    const animateNumbers = () => {
        heroStatsNumbers.forEach(number => {
            const target = number.textContent;
            const isNumeric = !isNaN(target);
            if (isNumeric) {
                // Animation logic here if needed
            }
        });
    };
});
