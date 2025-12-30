// About Section JavaScript
(function() {
    'use strict';

    // Donation Modal Functions
    function initDonationModal() {
        const donationBtn = document.getElementById('about-donation-btn');
        const donationModal = document.getElementById('donation-ad-modal');
        const closeDonationModal = document.getElementById('close-donation-ad-modal');
        const skipDonationAd = document.getElementById('skip-donation-ad');
        const continueDonationAd = document.getElementById('continue-donation-ad');
        const donationUrl = 'https://saweria.co/teknoogi';

        function showDonationModal() {
            if (donationModal) {
                donationModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
                
                // Load AdSense in modal
                setTimeout(() => {
                    const adElement = donationModal.querySelector('.adsbygoogle');
                    if (adElement && typeof adsbygoogle !== 'undefined') {
                        try {
                            (adsbygoogle = window.adsbygoogle || []).push({});
                        } catch (error) {
                            console.error('AdSense loading error:', error);
                        }
                    }
                }, 100);
            }
        }

        function hideDonationModal() {
            if (donationModal) {
                donationModal.classList.add('hidden');
                document.body.style.overflow = '';
            }
        }

        function redirectToDonation() {
            window.open(donationUrl, '_blank', 'noopener,noreferrer');
            hideDonationModal();
        }

        // Event Listeners
        if (donationBtn) {
            donationBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showDonationModal();
            });
        }

        if (closeDonationModal) {
            closeDonationModal.addEventListener('click', hideDonationModal);
        }

        if (skipDonationAd) {
            skipDonationAd.addEventListener('click', redirectToDonation);
        }

        if (continueDonationAd) {
            continueDonationAd.addEventListener('click', redirectToDonation);
        }

        // Close modal when clicking outside
        if (donationModal) {
            donationModal.addEventListener('click', function(e) {
                if (e.target === donationModal || e.target.classList.contains('donation-ad-modal-overlay')) {
                    hideDonationModal();
                }
            });
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && donationModal && !donationModal.classList.contains('hidden')) {
                hideDonationModal();
            }
        });
    }

    function typeTextLoop(element, text, speed = 50, delay = 0) {
        return new Promise((resolve) => {
            setTimeout(() => {
                element.textContent = '';
                element.style.borderRight = '2px solid #fbbf24';
                
                let index = 0;
                const typeInterval = setInterval(() => {
                    if (index < text.length) {
                        element.textContent += text[index];
                        index++;
                    } else {
                        clearInterval(typeInterval);
                        // Wait before deleting
                        setTimeout(() => {
                            // Delete text
                            const deleteInterval = setInterval(() => {
                                if (element.textContent.length > 0) {
                                    element.textContent = element.textContent.slice(0, -1);
                                } else {
                                    clearInterval(deleteInterval);
                                    element.style.borderRight = '2px solid #fbbf24';
                                    // Restart typing
                                    resolve();
                                }
                            }, speed / 2);
                        }, 2000); // Wait 2 seconds before deleting
                    }
                }, speed);
            }, delay);
        });
    }

    function startTypingLoop(element, text, speed = 50) {
        const typingElement = element.querySelector('.typing-text') || element;
        const originalText = text || typingElement.textContent.trim();
        
        function loop() {
            typeTextLoop(typingElement, originalText, speed, 0).then(() => {
                // Restart the loop
                setTimeout(() => {
                    loop();
                }, 500);
            });
        }
        
        loop();
    }

    function initAboutSection() {
        // Typing animation for card titles (continuous loop)
        const cardTitles = document.querySelectorAll('.about-card-title');
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting && !entry.target.classList.contains('typing-started')) {
                    entry.target.classList.add('typing-started');
                    const typingElement = entry.target.querySelector('.typing-text');
                    
                    if (typingElement) {
                        const originalText = typingElement.textContent.trim();
                        // Start continuous typing loop
                        setTimeout(() => {
                            startTypingLoop(entry.target, originalText, 50);
                        }, index * 300);
                    }
                }
            });
        }, observerOptions);

        cardTitles.forEach(title => {
            titleObserver.observe(title);
        });

        // Read More functionality for section description only
        const sectionReadMoreBtn = document.querySelector('.about-section-read-more-btn');
        const sectionDescription = document.querySelector('.about-section-description.full');
        const sectionShortDescription = document.querySelector('.about-section-description:not(.full)');
        
        if (sectionReadMoreBtn && sectionDescription && sectionShortDescription) {
            sectionReadMoreBtn.addEventListener('click', function() {
                if (sectionDescription.classList.contains('show')) {
                    // Collapse
                    sectionDescription.classList.remove('show');
                    sectionShortDescription.style.display = 'block';
                    this.innerHTML = '<i class="fas fa-chevron-down"></i> Baca Selengkapnya';
                    this.classList.remove('expanded');
                } else {
                    // Expand
                    sectionShortDescription.style.display = 'none';
                    sectionDescription.classList.add('show');
                    this.innerHTML = '<i class="fas fa-chevron-up"></i> Tutup';
                    this.classList.add('expanded');
                }
            });
        }

        // Fade in animation on scroll
        const aboutCards = document.querySelectorAll('.about-card');
        
        if (aboutCards.length > 0) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        }, index * 100);
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            aboutCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        }

        // FAQ toggle (Tentang Kami page)
        const faqItems = document.querySelectorAll('[data-about-faq-item]');
        if (faqItems.length > 0) {
            faqItems.forEach(item => {
                const toggleBtn = item.querySelector('[data-about-faq-toggle]');
                const body = item.querySelector('.about-faq-body');

                if (!toggleBtn || !body) return;

                // Set initial max-height for active item
                if (item.classList.contains('about-faq-item-active')) {
                    body.style.maxHeight = body.scrollHeight + 'px';
                }

                toggleBtn.addEventListener('click', () => {
                    const isActive = item.classList.contains('about-faq-item-active');

                    // Tutup semua item lain
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('about-faq-item-active');
                            const otherBody = otherItem.querySelector('.about-faq-body');
                            if (otherBody) {
                                otherBody.style.maxHeight = null;
                            }
                        }
                    });

                    // Toggle item ini
                    if (isActive) {
                        item.classList.remove('about-faq-item-active');
                        body.style.maxHeight = null;
                    } else {
                        item.classList.add('about-faq-item-active');
                        body.style.maxHeight = body.scrollHeight + 'px';
                    }
                });
            });
        }
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initAboutSection();
            initDonationModal();
        });
    } else {
        initAboutSection();
        initDonationModal();
    }
})();

