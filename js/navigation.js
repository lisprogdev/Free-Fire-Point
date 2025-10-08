// Navigation JavaScript Functions
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Navigation
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        const mobileMenuIcon = mobileMenuButton.querySelector('i');

        mobileMenuButton.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-times');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = mobileMenu.contains(event.target);
            const isClickOnButton = mobileMenuButton.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnButton && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            }
        });
    }

    // Close calculator dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const calculatorDropdowns = document.querySelectorAll('#calculator-dropdown, #calculator-dropdown-mobile');
        const calculatorTriggers = document.querySelectorAll('#calculator-trigger, #calculator-trigger-mobile');
        const calculatorArrows = document.querySelectorAll('#calculator-arrow, #calculator-arrow-mobile');
        
        let isClickInsideDropdown = false;
        let isClickOnTrigger = false;
        
        // Check if click is inside any dropdown
        calculatorDropdowns.forEach(dropdown => {
            if (dropdown.contains(event.target)) {
                isClickInsideDropdown = true;
            }
        });
        
        // Check if click is on calculator trigger
        calculatorTriggers.forEach(trigger => {
            if (trigger.contains(event.target)) {
                isClickOnTrigger = true;
            }
        });
        
        // Close dropdowns if click is outside
        if (!isClickInsideDropdown && !isClickOnTrigger) {
            calculatorDropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
            
            // Reset arrows
            calculatorArrows.forEach(arrow => {
                arrow.style.transform = 'rotate(0deg)';
            });
        }
    });

    // Close calculator dropdown when clicking on dropdown links
    document.addEventListener('click', function(event) {
        // Check if clicked element is a dropdown link
        const dropdownLink = event.target.closest('#calculator-dropdown a, #calculator-dropdown-mobile a');
        
        if (dropdownLink) {
            // Close all calculator dropdowns
            const calculatorDropdowns = document.querySelectorAll('#calculator-dropdown, #calculator-dropdown-mobile');
            const calculatorArrows = document.querySelectorAll('#calculator-arrow, #calculator-arrow-mobile');
            
            calculatorDropdowns.forEach(dropdown => {
                dropdown.classList.remove('show');
            });
            
            // Reset arrows
            calculatorArrows.forEach(arrow => {
                arrow.style.transform = 'rotate(0deg)';
            });
            
            // Close mobile menu if on mobile
            const isMobile = window.innerWidth < 768;
            if (isMobile && mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                if (mobileMenuButton) {
                    const mobileMenuIcon = mobileMenuButton.querySelector('i');
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuIcon.classList.add('fa-bars');
                }
            }
        }
    });

    // Calculator dropdown functionality for both desktop and mobile
    const calculatorTriggers = document.querySelectorAll('#calculator-trigger, #calculator-trigger-mobile');
    const calculatorDropdowns = document.querySelectorAll('#calculator-dropdown, #calculator-dropdown-mobile');
    const calculatorArrows = document.querySelectorAll('#calculator-arrow, #calculator-arrow-mobile');
    
    calculatorTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = calculatorDropdowns[index];
            const arrow = calculatorArrows[index];
            const isVisible = dropdown.classList.contains('show');
            
            // Close all dropdowns first
            calculatorDropdowns.forEach(drop => {
                drop.classList.remove('show');
            });
            
            // Reset all arrows
            calculatorArrows.forEach(arr => {
                arr.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current dropdown
            if (!isVisible) {
                dropdown.classList.add('show');
                arrow.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Menu item interactions
    const menuItems = document.querySelectorAll('.menu-nav-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Skip calculator items as they are handled separately
            if (item.getAttribute('data-section') === 'kalkulator') {
                return;
            }
            
            // Close mobile menu when other items are clicked
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                if (mobileMenuButton) {
                    const mobileMenuIcon = mobileMenuButton.querySelector('i');
                    mobileMenuIcon.classList.remove('fa-times');
                    mobileMenuIcon.classList.add('fa-bars');
                }
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (href === '#' || href.length <= 1) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navigation scroll effects
    const navbars = document.querySelectorAll('nav');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        navbars.forEach(navbar => {
            if (scrollTop > 50) {
                navbar.style.backdropFilter = 'blur(15px)';
                navbar.style.background = 'linear-gradient(135deg, rgba(26, 26, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%)';
            } else {
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.background = 'linear-gradient(135deg, var(--ff-primary) 0%, var(--ff-secondary) 100%)';
            }
        });
    });

    // Handle window resize to close calculator dropdowns when switching between mobile/desktop
    window.addEventListener('resize', function() {
        // Close all calculator dropdowns when resizing
        const calculatorDropdowns = document.querySelectorAll('#calculator-dropdown, #calculator-dropdown-mobile');
        const calculatorArrows = document.querySelectorAll('#calculator-arrow, #calculator-arrow-mobile');
        
        calculatorDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        
        // Reset arrows
        calculatorArrows.forEach(arrow => {
            arrow.style.transform = 'rotate(0deg)';
        });
    });

    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
});

// Global navigation functions
function updateActiveNavigation() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-nav-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href && currentPath.includes(href.replace('#', ''))) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Export functions for external use
window.Navigation = {
    updateActiveNavigation: updateActiveNavigation,
    closeMobileMenu: function() {
        const mobileMenu = document.getElementById('mobile-menu');
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        
        if (mobileMenu && mobileMenuButton) {
            mobileMenu.classList.add('hidden');
            const mobileMenuIcon = mobileMenuButton.querySelector('i');
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        }
    }
};
