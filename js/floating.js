// Floating Scroll Buttons JavaScript
(function() {
    'use strict';

    // Create floating buttons
    function createFloatingButtons() {
        const floatingContainer = document.createElement('div');
        floatingContainer.className = 'floating-scroll-buttons';
        floatingContainer.id = 'floating-scroll-buttons';

        // Scroll to Top Button
        const scrollTopBtn = document.createElement('button');
        scrollTopBtn.className = 'floating-scroll-btn scroll-top';
        scrollTopBtn.id = 'scroll-to-top';
        scrollTopBtn.setAttribute('aria-label', 'Scroll to Top');
        scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollTopBtn.title = 'Kembali ke Atas';

        // Scroll to Bottom Button
        const scrollBottomBtn = document.createElement('button');
        scrollBottomBtn.className = 'floating-scroll-btn scroll-bottom';
        scrollBottomBtn.id = 'scroll-to-bottom';
        scrollBottomBtn.setAttribute('aria-label', 'Scroll to Bottom');
        scrollBottomBtn.innerHTML = '<i class="fas fa-arrow-down"></i>';
        scrollBottomBtn.title = 'Ke Bawah';

        floatingContainer.appendChild(scrollTopBtn);
        floatingContainer.appendChild(scrollBottomBtn);

        document.body.appendChild(floatingContainer);

        return {
            scrollTopBtn,
            scrollBottomBtn
        };
    }

    // Initialize floating buttons
    function initFloatingButtons() {
        const buttons = createFloatingButtons();
        const scrollTopBtn = buttons.scrollTopBtn;
        const scrollBottomBtn = buttons.scrollBottomBtn;

        // Scroll to Top functionality
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Scroll to Bottom functionality
        function scrollToBottom() {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        }

        // Show/Hide buttons based on scroll position
        function toggleButtons() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollBottom = documentHeight - (scrollTop + windowHeight);

            // Show scroll to top button when scrolled down more than 300px
            if (scrollTop > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }

            // Show scroll to bottom button when not at bottom (more than 300px from bottom)
            if (scrollBottom > 300) {
                scrollBottomBtn.classList.add('show');
            } else {
                scrollBottomBtn.classList.remove('show');
            }
        }

        // Event listeners
        scrollTopBtn.addEventListener('click', scrollToTop);
        scrollBottomBtn.addEventListener('click', scrollToBottom);

        // Show/hide buttons on scroll
        window.addEventListener('scroll', toggleButtons);
        
        // Initial check
        toggleButtons();

        // Show buttons after page load
        window.addEventListener('load', function() {
            setTimeout(toggleButtons, 500);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingButtons);
    } else {
        initFloatingButtons();
    }
})();

