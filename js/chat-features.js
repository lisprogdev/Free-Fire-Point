// Floating Chat Bubbles JavaScript
(function() {
    'use strict';

    // Features data
    const features = [
        {
            icon: 'fa-calculator',
            name: 'Free Fire Point',
            time: 'Sedang Dikembangkan',
            message: 'Kalkulator 4 Match, 5 Match, dan 6 Match untuk Fast Turnamen 12 Team akan segera hadir!'
        },
        {
            icon: 'fa-file-excel',
            name: 'Free Fire Point',
            time: 'Coming Soon',
            message: 'Fitur export hasil perhitungan ke format Excel dan PDF untuk dokumentasi turnamen.'
        },
        {
            icon: 'fa-chart-line',
            name: 'Free Fire Point',
            time: 'Dalam Pengembangan',
            message: 'Analisis statistik turnamen dengan grafik dan visualisasi data yang interaktif.'
        },
        {
            icon: 'fa-palette',
            name: 'Free Fire Point',
            time: 'Coming Soon',
            message: 'Template custom untuk turnamen dengan logo dan brand Event Organizer Anda.'
        },
        {
            icon: 'fa-mobile-alt',
            name: 'Free Fire Point',
            time: 'Sedang Dikembangkan',
            message: 'Aplikasi mobile untuk iOS dan Android dengan fitur lengkap kalkulator poin FF.'
        },
        {
            icon: 'fa-users',
            name: 'Free Fire Point',
            time: 'Coming Soon',
            message: 'Sistem manajemen tim dengan database lengkap untuk Event Organizer.'
        },
        {
            icon: 'fa-bell',
            name: 'Free Fire Point',
            time: 'Dalam Pengembangan',
            message: 'Notifikasi real-time untuk update turnamen dan hasil perhitungan poin.'
        },
        {
            icon: 'fa-share-alt',
            name: 'Free Fire Point',
            time: 'Coming Soon',
            message: 'Fitur share hasil turnamen ke media sosial dengan template yang menarik.'
        }
    ];

    let currentIndex = 0;
    let currentBubble = null;
    let isRunning = false;
    const showDelay = 4000; // 4 seconds between new bubbles
    const hideDelay = 3500; // 3.5 seconds before hiding current bubble (slight overlap for smooth transition)

    function createBubble(feature) {
        const container = document.getElementById('floating-chat-bubbles');
        if (!container) return null;

        const bubble = document.createElement('div');
        bubble.className = 'floating-chat-bubble';
        bubble.style.zIndex = 9999;

        bubble.innerHTML = `
            <div class="floating-chat-bubble-avatar">
                <i class="fas ${feature.icon}"></i>
            </div>
            <div class="floating-chat-bubble-content">
                <div class="floating-chat-bubble-header">
                    <span class="floating-chat-bubble-name">${feature.name}</span>
                    <span class="floating-chat-bubble-time">${feature.time}</span>
                </div>
                <div class="floating-chat-bubble-message">
                    <p>${feature.message}</p>
                </div>
            </div>
        `;

        container.appendChild(bubble);
        return bubble;
    }

    function showBubble(bubble) {
        if (!bubble) return;
        
        // Set fixed bottom position
        bubble.style.bottom = '100px';
        
        // Show bubble with slight delay for smooth animation
        setTimeout(() => {
            bubble.classList.add('show');
        }, 50);
    }

    function hideBubble(bubble, callback) {
        if (!bubble) {
            if (callback) callback();
            return;
        }
        
        bubble.classList.remove('show');
        bubble.classList.add('hide');
        
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.parentNode.removeChild(bubble);
            }
            if (callback) callback();
        }, 400);
    }

    function showNextBubble() {
        // Hide current bubble first if exists
        if (currentBubble) {
            hideBubble(currentBubble, () => {
                // After hiding, show next bubble
                displayNewBubble();
            });
        } else {
            // No current bubble, show immediately
            displayNewBubble();
        }
    }

    function displayNewBubble() {
        // Reset index if reached end
        if (currentIndex >= features.length) {
            currentIndex = 0; // Loop back to start
        }

        const feature = features[currentIndex];
        const bubble = createBubble(feature);
        
        if (bubble) {
            currentBubble = bubble;
            showBubble(bubble);

            // Schedule next bubble
            setTimeout(() => {
                showNextBubble();
            }, showDelay);

            currentIndex++;
        }
    }

    function startBubbleAnimation() {
        if (isRunning) return;
        isRunning = true;

        // Start showing bubbles
        showNextBubble();
    }

    function initFloatingChatBubbles() {
        // Wait a bit before starting to let page load
        setTimeout(() => {
            startBubbleAnimation();
        }, 2000);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingChatBubbles);
    } else {
        initFloatingChatBubbles();
    }

    // Pause on scroll to reduce distraction
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        const container = document.getElementById('floating-chat-bubbles');
        if (container) {
            container.style.opacity = '0.5';
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                container.style.opacity = '1';
            }, 500);
        }
    });
})();
