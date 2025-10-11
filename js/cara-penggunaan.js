// Cara Penggunaan Tabs JavaScript

// Switch Category Tabs
function switchCategory(category) {
    // Remove active from all category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active to clicked category tab
    document.querySelector(`[data-category="${category}"]`).classList.add('active');

    // Hide all sub-tabs containers
    document.querySelectorAll('.sub-tabs-container').forEach(container => {
        container.classList.remove('active');
    });

    // Show selected sub-tabs container
    document.getElementById(`tabs-${category}`).classList.add('active');

    // Get first active (non-disabled) tab in this category
    const firstActiveTab = document.querySelector(`#tabs-${category} .sub-tab:not(.disabled)`);
    if (firstActiveTab) {
        const tabId = firstActiveTab.getAttribute('data-tab');
        switchTab(tabId);
    } else {
        // If no active tabs, show placeholder
        hideAllTabContent();
        document.getElementById('content-placeholder').classList.add('active');
    }
}

// Switch Sub Tabs
function switchTab(tabId) {
    // Find parent category
    const parentContainer = document.querySelector(`[data-tab="${tabId}"]`).closest('.sub-tabs-container');
    
    // Remove active from all sub-tabs in this container
    parentContainer.querySelectorAll('.sub-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Add active to clicked sub-tab
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

    // Hide all tab content
    hideAllTabContent();

    // Show selected tab content or placeholder
    const content = document.getElementById(`content-${tabId}`);
    if (content) {
        content.classList.add('active');
    } else {
        document.getElementById('content-placeholder').classList.add('active');
    }
}

// Helper function to hide all tab content
function hideAllTabContent() {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set default category and tab
    switchCategory('fast-12');
});

