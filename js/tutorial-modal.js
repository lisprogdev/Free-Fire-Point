/**
 * Tutorial Modal - Tonton video tutorial (muncul setiap buka halaman)
 * Dipakai di: index, 2/3/4 Match, disclaimer, privacy-policy, terms-of-service, cara-penggunaan, tentang-kami
 */
(function() {
    'use strict';
    var KEY = 'tutorialModalHiddenDate';
    var modal = document.getElementById('tutorialModal');
    if (!modal) return;

    var backdrop = document.getElementById('tutorialModalBackdrop');
    var closeBtn = document.getElementById('tutorialModalCloseBtn');
    var closeX = document.getElementById('tutorialModalCloseX');
    var hideToday = document.getElementById('tutorialModalHideToday');

    function todayStr() {
        var d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    }

    function shouldShow() {
        if (!hideToday || !hideToday.checked) return true;
        var stored = typeof sessionStorage !== 'undefined' && sessionStorage.getItem(KEY);
        return stored !== todayStr();
    }

    function closeTutorialModal() {
        modal.classList.remove('show');
        if (hideToday && hideToday.checked && typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(KEY, todayStr());
        }
    }

    function init() {
        if (closeBtn) closeBtn.addEventListener('click', closeTutorialModal);
        if (closeX) closeX.addEventListener('click', closeTutorialModal);
        if (backdrop) backdrop.addEventListener('click', closeTutorialModal);
        if (shouldShow()) {
            setTimeout(function() {
                modal.classList.add('show');
            }, 600);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
