// Ad Modal Functions
function showAdModal() {
    const adModal = document.getElementById('adModal');
    const adModalContent = document.getElementById('adModalContent');
    
    if (adModal && adModalContent) {
        adModal.classList.remove('hidden');
        adModal.classList.add('show');
        
        // Trigger animation
        setTimeout(() => {
            adModalContent.classList.add('show');
            
            // Load AdSense after modal is visible
            setTimeout(() => {
                const adElement = adModal.querySelector('.adsbygoogle');
                if (adElement && typeof adsbygoogle !== 'undefined') {
                    try {
                        (adsbygoogle = window.adsbygoogle || []).push({});
                    } catch (error) {
                        // AdSense loading error
                    }
                }
            }, 100);
        }, 10);
        
        // Blur main content
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.add('blur-active');
        }
    }
}

function closeAdModal() {
    const adModal = document.getElementById('adModal');
    const adModalContent = document.getElementById('adModalContent');
    
    if (adModal && adModalContent) {
        adModalContent.classList.remove('show');
        
        setTimeout(() => {
            adModal.classList.add('hidden');
            adModal.classList.remove('show');
        }, 300);
        
        // Remove blur from main content
        const mainContent = document.getElementById('mainContent');
        if (mainContent) {
            mainContent.classList.remove('blur-active');
        }
    }
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    const adModal = document.getElementById('adModal');
    const adModalContent = document.getElementById('adModalContent');
    
    if (adModal && !adModal.classList.contains('hidden')) {
        if (event.target === adModal) {
            closeAdModal();
        }
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const adModal = document.getElementById('adModal');
        if (adModal && !adModal.classList.contains('hidden')) {
            closeAdModal();
        }
    }
});

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
    // Navigation functionality moved to js/navigation.js

    // Menu items and smooth scroll functionality moved to js/navigation.js

    // Navigation scroll effects moved to js/navigation.js

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

// ========================================
// COPY REQUEST FORMAT FUNCTION
// ========================================

function copyRequestFormat() {
    // Format text to copy
    const formatText = `Jenis: Fast Turnamen
Team: 12 Team
Match: 4 Match
Format: Standard`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(formatText).then(function() {
        showCopySuccessAlert();
    }).catch(function(err) {
        console.error('Failed to copy: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = formatText;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            document.execCommand('copy');
            showCopySuccessAlert();
        } catch (err) {
            console.error('Fallback copy failed: ', err);
        }
        document.body.removeChild(textArea);
    });
}

function showCopySuccessAlert() {
    const alert = document.getElementById('copySuccessAlert');
    if (alert) {
        // Show alert
        alert.classList.remove('hidden');
        
        // Auto hide after 3 seconds
        setTimeout(function() {
            alert.classList.add('hidden');
        }, 3000);
    }
}

// Renovation Banner Functions
document.addEventListener('DOMContentLoaded', function() {
    const renovationBanner = document.getElementById('renovation-banner');
    const closeRenovationBtn = document.getElementById('close-renovation-banner');
    
    // Check if user has closed the banner before
    const bannerClosed = localStorage.getItem('renovationBannerClosed');
    
    if (bannerClosed === 'true') {
        if (renovationBanner) {
            renovationBanner.classList.add('hidden');
        }
    }
    
    // Close banner function
    if (closeRenovationBtn && renovationBanner) {
        closeRenovationBtn.addEventListener('click', function() {
            renovationBanner.classList.add('hidden');
            // Save preference to localStorage
            localStorage.setItem('renovationBannerClosed', 'true');
        });
    }
    
    // Adjust hero section padding when banner is visible
    function adjustHeroPadding() {
        const heroSection = document.getElementById('hero');
        if (heroSection && !renovationBanner.classList.contains('hidden')) {
            const bannerHeight = renovationBanner.offsetHeight;
            heroSection.style.paddingTop = `calc(128px + ${bannerHeight}px)`;
        } else if (heroSection) {
            heroSection.style.paddingTop = '128px';
        }
    }
    
    // Adjust padding on load and resize
    adjustHeroPadding();
    window.addEventListener('resize', adjustHeroPadding);
    
    // Adjust padding when banner is closed
    if (renovationBanner) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    adjustHeroPadding();
                }
            });
        });
        
        observer.observe(renovationBanner, {
            attributes: true,
            attributeFilter: ['class']
        });
    }
});
