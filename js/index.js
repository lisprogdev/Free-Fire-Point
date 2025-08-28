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
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
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

    document.addEventListener('click', function(event) {
        const isClickInsideMenu = mobileMenu.contains(event.target);
        const isClickOnButton = mobileMenuButton.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenuIcon.classList.remove('fa-times');
            mobileMenuIcon.classList.add('fa-bars');
        }
    });

    const menuItems = document.querySelectorAll('.menu-nav-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
            
            menuItems.forEach(menuItem => {
                menuItem.classList.remove('active');
            });
            
            this.classList.add('active');
            
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            }
                
                // Smooth scroll to target section
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const navHeight = document.querySelector('nav').offsetHeight * 2; // Account for both navbars
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For external links (like pages/kalkulator.html), let the browser handle normally
        });
    });

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

    // Hero button now links directly to kalkulator.html - no need for scroll behavior

    const heroStatsNumbers = document.querySelectorAll('.hero-stats-number');
    const animateNumbers = () => {
        heroStatsNumbers.forEach(number => {
            const target = number.textContent;
            const isNumeric = !isNaN(target);
            
            if (isNumeric) {
                let current = 0;
                const increment = target / 30;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        number.textContent = target;
                        clearInterval(timer);
                    } else {
                        number.textContent = Math.floor(current);
                    }
                }, 50);
            }
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }

    const characterImages = document.querySelectorAll('.character-image');
    let currentCharacter = 0;

    const rotateCharacters = () => {
        characterImages.forEach((img, index) => {
            img.classList.remove('active');
        });

        characterImages[currentCharacter].classList.add('active');
        currentCharacter = (currentCharacter + 1) % characterImages.length;
    };

    if (characterImages.length > 0) {
        rotateCharacters(); // Show the first image immediately
        setInterval(rotateCharacters, 4000);
    }

    // About Section Animations
    const aboutSection = document.querySelector('#tentang');
    const pointsTable = document.querySelector('.points-table');
    const tableRows = document.querySelectorAll('.points-table tbody tr');

    // Animate table rows on scroll
    if (pointsTable && tableRows.length > 0) {
        const tableObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate table rows with staggered delay
                    tableRows.forEach((row, index) => {
                        setTimeout(() => {
                            row.style.opacity = '1';
                            row.style.transform = 'translateX(0)';
                        }, index * 100);
                    });
                    tableObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        // Initially hide table rows for animation
        tableRows.forEach(row => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            row.style.transition = 'all 0.5s ease';
        });

        tableObserver.observe(pointsTable);
    }

    // Enhanced hover effects for table rows
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px) scale(1.02)';
            this.style.zIndex = '10';
        });

        row.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
            this.style.zIndex = '1';
        });
    });

    // Booyah row special effects
    const booyahRow = document.querySelector('.points-table tbody tr:first-child');
    if (booyahRow) {
        let shimmerInterval = setInterval(() => {
            booyahRow.classList.add('shimmer-effect');
            setTimeout(() => {
                booyahRow.classList.remove('shimmer-effect');
            }, 1000);
        }, 5000);

        // Stop shimmer when user hovers
        booyahRow.addEventListener('mouseenter', () => {
            clearInterval(shimmerInterval);
        });

        booyahRow.addEventListener('mouseleave', () => {
            shimmerInterval = setInterval(() => {
                booyahRow.classList.add('shimmer-effect');
                setTimeout(() => {
                    booyahRow.classList.remove('shimmer-effect');
                }, 1000);
            }, 5000);
        });
    }

    // Smooth scroll for navigation links (handled in main menu event listener above)
    // This section is now integrated into the main menuItems event listener to avoid conflicts

    // Parallax effect for background elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const backgroundElements = document.querySelectorAll('.background-element');
        
        backgroundElements.forEach((element, index) => {
            const speed = (index + 1) * 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Counter animation for stats (if any stats are added later)
    const animateCounter = (element, target, duration = 2000) => {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    };

    // Intersection Observer for animations
    const observeElements = document.querySelectorAll('[data-aos]');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, { threshold: 0.1 });

    observeElements.forEach(element => {
        animationObserver.observe(element);
    });

    // Scroll-based Navigation Active State
    function updateActiveNavigation() {
        const sections = ['hero', 'tentang', 'kontak', 'faq'];
        const navItems = document.querySelectorAll('.menu-nav-item[data-section]');
        
        let currentSection = '';
        
        // Check which section is currently in view
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                const rect = section.getBoundingClientRect();
                const sectionTop = rect.top;
                const sectionBottom = rect.bottom;
                
                // Consider section active if it's in the middle of viewport
                if (sectionTop <= window.innerHeight / 2 && sectionBottom >= window.innerHeight / 2) {
                    currentSection = sectionId;
                }
            }
        });
        
        // If no section is detected in middle, use the one closest to top
        if (!currentSection) {
            let closestSection = '';
            let closestDistance = Infinity;
            
            sections.forEach(sectionId => {
                const section = document.getElementById(sectionId);
                if (section) {
                    const rect = section.getBoundingClientRect();
                    const distance = Math.abs(rect.top);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestSection = sectionId;
                    }
                }
            });
            
            currentSection = closestSection;
        }
        
        // Update active states
        navItems.forEach(item => {
            const section = item.getAttribute('data-section');
            // If current section is FAQ, remove all active states
            if (currentSection === 'faq') {
                item.classList.remove('active');
            } else if (section === currentSection) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveNavigation, 10);
    });
    
    // Initial call
    updateActiveNavigation();

    // Support Modal Functions
    function showSupportModal() {
        const modal = document.getElementById('supportModal');
        const modalContent = document.getElementById('modalContent');
        const mainContent = document.getElementById('mainContent');
        
        if (modal && modalContent && mainContent) {
            modal.classList.remove('hidden');
            mainContent.classList.add('blur-active');
            
            // Trigger animation after a small delay
            setTimeout(() => {
                modal.classList.add('show');
                modalContent.style.transform = 'scale(1)';
                modalContent.style.opacity = '1';
            }, 10);
        }
    }

    // Check if modal should be shown on page load
    function checkShowModal() {
        const dontShowAgain = localStorage.getItem('ffpoint_dont_show_support_modal');
        
        // Don't show if user clicked "don't show again"
        if (dontShowAgain === 'true') {
            return;
        }
        
        // Always show modal after 3 seconds on every visit
        setTimeout(() => {
            showSupportModal();
        }, 3000); // Show after 3 seconds
    }

    // Initialize modal check
    checkShowModal();

});

// FAQ Toggle Function
function toggleFAQ(button) {
    const faqItem = button.closest('.faq-item');
    const answer = faqItem.querySelector('.faq-answer');
    const icon = button.querySelector('.faq-icon i');
    const allFaqItems = document.querySelectorAll('.faq-item');
    
    // Close all other FAQ items
    allFaqItems.forEach(item => {
        if (item !== faqItem) {
            const otherAnswer = item.querySelector('.faq-answer');
            const otherIcon = item.querySelector('.faq-icon i');
            
            otherAnswer.classList.add('hidden');
            otherIcon.classList.remove('fa-minus', 'rotate-180');
            otherIcon.classList.add('fa-plus');
            item.classList.remove('faq-active');
        }
    });
    
    // Toggle current FAQ item
    if (answer.classList.contains('hidden')) {
        answer.classList.remove('hidden');
        icon.classList.remove('fa-plus');
        icon.classList.add('fa-minus', 'rotate-180');
        faqItem.classList.add('faq-active');
        
        // Smooth scroll to FAQ item
        setTimeout(() => {
            faqItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 100);
    } else {
        answer.classList.add('hidden');
        icon.classList.remove('fa-minus', 'rotate-180');
        icon.classList.add('fa-plus');
        faqItem.classList.remove('faq-active');
    }
}

// Global Modal Control Functions
function closeSupportModal() {
    const modal = document.getElementById('supportModal');
    const modalContent = document.getElementById('modalContent');
    const mainContent = document.getElementById('mainContent');
    
    if (modal && modalContent && mainContent) {
        modal.classList.remove('show');
        modalContent.style.transform = 'scale(0.95)';
        modalContent.style.opacity = '0';
        mainContent.classList.remove('blur-active');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
}

function dontShowAgain() {
    localStorage.setItem('ffpoint_dont_show_support_modal', 'true');
    closeSupportModal();
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const modal = document.getElementById('supportModal');
    const modalContent = document.getElementById('modalContent');
    
    if (modal && modalContent && event.target === modal) {
        closeSupportModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeSupportModal();
    }
});
