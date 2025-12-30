// About Section AdSense Visibility Control
(function() {
    'use strict';

    function checkAdSenseVisibility() {
        const adContainers = document.querySelectorAll('.about-ads-container');
        
        if (adContainers.length === 0) return;

        adContainers.forEach(container => {
            const adElement = container.querySelector('ins.adsbygoogle');
            
            if (!adElement) {
                container.style.display = 'none';
                return;
            }

            // Set initial state to hidden
            container.style.display = 'none';
            container.style.visibility = 'hidden';
            container.style.height = '0';
            container.style.overflow = 'hidden';
            container.style.margin = '0';
            container.style.padding = '0';

            // Check if ad is loaded after a delay
            const checkInterval = setInterval(() => {
                // Check if ad has content (iframe or content)
                const hasIframe = adElement.querySelector('iframe');
                const hasContent = adElement.innerHTML.trim().length > 0;
                const adHeight = adElement.offsetHeight;
                const adWidth = adElement.offsetWidth;

                // If ad has content and dimensions, show container
                if ((hasIframe || hasContent) && adHeight > 0 && adWidth > 0) {
                    container.classList.add('visible');
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                    container.style.height = 'auto';
                    container.style.overflow = 'visible';
                    container.style.margin = '';
                    container.style.padding = '';
                    clearInterval(checkInterval);
                }
            }, 500);

            // Stop checking after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                // If still no ad, keep it hidden
                const hasIframe = adElement.querySelector('iframe');
                const hasContent = adElement.innerHTML.trim().length > 0;
                const adHeight = adElement.offsetHeight;
                const adWidth = adElement.offsetWidth;

                if ((hasIframe || hasContent) && adHeight > 0 && adWidth > 0) {
                    container.classList.add('visible');
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                }
            }, 10000);

            // Alternative: Use MutationObserver to watch for changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' || mutation.type === 'attributes') {
                        const hasIframe = adElement.querySelector('iframe');
                        const hasContent = adElement.innerHTML.trim().length > 0;
                        const adHeight = adElement.offsetHeight;
                        const adWidth = adElement.offsetWidth;

                        if ((hasIframe || hasContent) && adHeight > 0 && adWidth > 0) {
                            container.classList.add('visible');
                            container.style.display = 'block';
                            container.style.visibility = 'visible';
                            container.style.height = 'auto';
                            container.style.overflow = 'visible';
                            container.style.margin = '';
                            container.style.padding = '';
                            observer.disconnect();
                        }
                    }
                });
            });

            observer.observe(adElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            });

            // Disconnect observer after 10 seconds
            setTimeout(() => {
                observer.disconnect();
            }, 10000);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            // Wait a bit for AdSense to start loading
            setTimeout(checkAdSenseVisibility, 1000);
        });
    } else {
        setTimeout(checkAdSenseVisibility, 1000);
    }

    // Also check after AdSense script loads
    window.addEventListener('load', () => {
        setTimeout(checkAdSenseVisibility, 2000);
    });
})();

