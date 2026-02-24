/**
 * Welcome Modal - Donasi & Bergabung Channel/Komunitas
 * Index: tampil otomatis setiap kunjungan (bisa "jangan tampilkan lagi hari ini")
 * Halaman 2/3/4 Match: tampil saat klik Reset, Simpan Semua, Hitung, Download JPG
 */
(function() {
    'use strict';
    var modal = document.getElementById('welcomeModal');
    if (!modal) return;

    var KEY = 'welcomeModalHiddenDate';
    var backdrop = document.getElementById('welcomeModalBackdrop');
    var closeBtn = document.getElementById('welcomeModalCloseBtn');
    var closeX = document.getElementById('welcomeModalCloseX');
    var hideToday = document.getElementById('welcomeModalHideToday');

    function todayStr() {
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    function shouldShow() {
        if (!hideToday || !hideToday.checked) return true;
        var stored = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(KEY);
        return stored !== todayStr();
    }

    function closeModal() {
        modal.classList.remove('show');
        if (hideToday && hideToday.checked && typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(KEY, todayStr());
        }
    }

    function openModal() {
        modal.classList.add('show');
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeX) closeX.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    var isCalculatorPage = document.getElementById('resetAllData') !== null;

    if (isCalculatorPage) {
        ['resetAllData', 'saveAllData', 'calculateResults', 'downloadJPG'].forEach(function(id) {
            var btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', function() {
                    setTimeout(openModal, 100);
                });
            }
        });
    } else {
        function tryOpen() {
            if (shouldShow()) {
                setTimeout(openModal, 700);
            }
        }
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryOpen);
        } else {
            tryOpen();
        }
    }
})();
