/**
 * Tutorial Modal - Tonton video tutorial
 * UX: Hanya tampil sekali per 7 hari, delay 8 detik. Tidak tampil di halaman kalkulator (user fokus hitung).
 */
(function() {
    'use strict';
    var KEY = 'tutorialModalLastSeen';
    var modal = document.getElementById('tutorialModal');
    if (!modal) return;

    var backdrop = document.getElementById('tutorialModalBackdrop');
    var closeBtn = document.getElementById('tutorialModalCloseBtn');
    var closeX = document.getElementById('tutorialModalCloseX');
    var hideToday = document.getElementById('tutorialModalHideToday');
    var DAYS_COOLDOWN = 7;
    var DELAY_MS = 8000;

    function daysSince(str) {
        if (!str) return 999;
        var then = new Date(str);
        var now = new Date();
        return (now - then) / (24 * 60 * 60 * 1000);
    }

    function shouldShow() {
        if (document.getElementById('resetAllData')) return false;
        var stored = localStorage && localStorage.getItem(KEY);
        return daysSince(stored) >= DAYS_COOLDOWN;
    }

    function closeTutorialModal() {
        modal.classList.remove('show');
        if (localStorage) localStorage.setItem(KEY, new Date().toISOString());
        if (hideToday && hideToday.checked) {
            var d = new Date();
            d.setDate(d.getDate() + DAYS_COOLDOWN);
            if (localStorage) localStorage.setItem(KEY, d.toISOString());
        }
    }

    function loadIframeLazy() {
        var wrap = modal.querySelector('.tutorial-modal-video-wrap');
        var iframe = wrap && wrap.querySelector('iframe');
        if (iframe && iframe.dataset.src && !iframe.src) {
            iframe.src = iframe.dataset.src;
        }
    }

    function init() {
        if (closeBtn) closeBtn.addEventListener('click', closeTutorialModal);
        if (closeX) closeX.addEventListener('click', closeTutorialModal);
        if (backdrop) backdrop.addEventListener('click', closeTutorialModal);
        if (shouldShow()) {
            setTimeout(function() {
                loadIframeLazy();
                modal.classList.add('show');
            }, DELAY_MS);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
