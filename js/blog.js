// ========================================
// BLOG PAGE - ADSENSE MODAL FUNCTIONS
// ========================================

// Initialize AOS
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// AdSense Modal Functions
function showAdModal() {
    const adModal = document.getElementById('adModal');
    const adModalContent = document.getElementById('adModalContent');
    
    if (adModal && adModalContent) {
        adModal.classList.remove('hidden');
        adModal.classList.add('show');
        
        // Trigger animation
        setTimeout(() => {
            adModalContent.classList.add('show');
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
document.addEventListener('click', function(e) {
    const adModal = document.getElementById('adModal');
    
    if (e.target === adModal) {
        closeAdModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAdModal();
    }
});

