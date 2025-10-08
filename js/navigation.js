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

    // Close mobile dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            const mobileDropdowns = document.querySelectorAll('.absolute.top-full');
            const calculatorItems = document.querySelectorAll('[data-section="kalkulator"]');
            
            let isClickInsideDropdown = false;
            let isClickOnCalculatorItem = false;
            
            // Check if click is inside any dropdown
            mobileDropdowns.forEach(dropdown => {
                if (dropdown.contains(event.target)) {
                    isClickInsideDropdown = true;
                }
            });
            
            // Check if click is on calculator item
            calculatorItems.forEach(item => {
                if (item.contains(event.target)) {
                    isClickOnCalculatorItem = true;
                }
            });
            
            // Close dropdowns if click is outside
            if (!isClickInsideDropdown && !isClickOnCalculatorItem) {
                mobileDropdowns.forEach(dropdown => {
                    dropdown.classList.add('hidden');
                });
            }
        }
    });

    // Close mobile dropdown when clicking on dropdown links
    document.addEventListener('click', function(event) {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Check if clicked element is a dropdown link
            const dropdownLink = event.target.closest('.absolute.top-full a');
            
            if (dropdownLink) {
                // Close all mobile dropdowns
                const mobileDropdowns = document.querySelectorAll('.absolute.top-full');
                mobileDropdowns.forEach(dropdown => {
                    dropdown.classList.add('hidden');
                });
                
                // Close mobile menu
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (mobileMenuButton) {
                        const mobileMenuIcon = mobileMenuButton.querySelector('i');
                        mobileMenuIcon.classList.remove('fa-times');
                        mobileMenuIcon.classList.add('fa-bars');
                    }
                }
            }
        }
    });

    // Menu item interactions
    const menuItems = document.querySelectorAll('.menu-nav-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Check if this is the calculator dropdown item in mobile
            const isCalculatorItem = item.getAttribute('data-section') === 'kalkulator';
            const isMobile = window.innerWidth < 768; // md breakpoint
            
            if (isCalculatorItem && isMobile) {
                e.preventDefault(); // Prevent default behavior
                e.stopPropagation(); // Stop event bubbling
                
                // Toggle mobile dropdown
                const mobileDropdown = item.parentElement.querySelector('.absolute');
                if (mobileDropdown) {
                    const isVisible = !mobileDropdown.classList.contains('hidden');
                    
                    // Close all other dropdowns first
                    document.querySelectorAll('.absolute.top-full').forEach(dropdown => {
                        if (dropdown !== mobileDropdown) {
                            dropdown.classList.add('hidden');
                        }
                    });
                    
                    // Toggle current dropdown
                    if (isVisible) {
                        mobileDropdown.classList.add('hidden');
                    } else {
                        mobileDropdown.classList.remove('hidden');
                    }
                }
            } else {
                // Close mobile menu when other items are clicked
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                    if (mobileMenuButton) {
                        const mobileMenuIcon = mobileMenuButton.querySelector('i');
                        mobileMenuIcon.classList.remove('fa-times');
                        mobileMenuIcon.classList.add('fa-bars');
                    }
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

    // Handle window resize to close mobile dropdowns when switching to desktop
    window.addEventListener('resize', function() {
        const isMobile = window.innerWidth < 768;
        
        if (!isMobile) {
            // Close all mobile dropdowns when switching to desktop
            const mobileDropdowns = document.querySelectorAll('.absolute.top-full');
            mobileDropdowns.forEach(dropdown => {
                dropdown.classList.add('hidden');
            });
        }
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
