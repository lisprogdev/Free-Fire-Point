/**
 * Welcome Modal - Donasi & Bergabung Channel/Komunitas
 * UX: Hanya di Beranda, sekali per 7 hari, delay 10 detik. Tidak mengganggu di kalkulator.
 */
(function() {
    'use strict';
    var modal = document.getElementById('welcomeModal');
    if (!modal) return;

    var KEY = 'welcomeModalLastSeen';
    var backdrop = document.getElementById('welcomeModalBackdrop');
    var closeBtn = document.getElementById('welcomeModalCloseBtn');
    var closeX = document.getElementById('welcomeModalCloseX');
    var hideToday = document.getElementById('welcomeModalHideToday');
    var DAYS_COOLDOWN = 7;
    var DELAY_MS = 10000;

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

    function closeModal() {
        modal.classList.remove('show');
        if (localStorage) localStorage.setItem(KEY, new Date().toISOString());
        if (hideToday && hideToday.checked) {
            var d = new Date();
            d.setDate(d.getDate() + DAYS_COOLDOWN);
            if (localStorage) localStorage.setItem(KEY, d.toISOString());
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeX) closeX.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    function tryOpen() {
        if (shouldShow()) setTimeout(function() { modal.classList.add('show'); }, DELAY_MS);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryOpen);
    } else {
        tryOpen();
    }
})();
