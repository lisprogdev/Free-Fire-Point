/**
 * Floating Visitor Counter
 * Menampilkan total pengunjung; klik untuk breakdown: Hari ini, Minggu ini, Bulan ini, Tahun ini, Semua.
 *
 * Data dari API (backend Anda). GA4 tidak mengizinkan baca data dari browser.
 * Untuk data real dari Google Analytics, buat endpoint (Cloud Function / server) yang memanggil
 * Google Analytics Data API dengan property ID: 502893344 (GA4 property ID).
 *
 * Format response API: { "today": n, "week": n, "month": n, "year": n, "total": n }
 */
(function () {
    'use strict';

    var GA_PROPERTY_ID = '502893344';
    var STORAGE_KEY = 'ffp_visitors_cache';
    var CACHE_MINUTES = 10;

    var apiUrl = typeof window.FFP_VISITOR_API_URL !== 'undefined'
        ? window.FFP_VISITOR_API_URL
        : (window.location.origin + '/api/visitors.json');

    function getCached() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            if (data && data.ts && (Date.now() - data.ts) < CACHE_MINUTES * 60 * 1000) {
                return data.data;
            }
        } catch (e) {}
        return null;
    }

    function setCached(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                data: data,
                ts: Date.now()
            }));
        } catch (e) {}
    }

    function formatNum(n) {
        if (typeof n !== 'number' || isNaN(n)) return '0';
        if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'jt';
        if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(Math.round(n));
    }

    function buildPanelHtml(data, loading) {
        var rows = [
            { key: 'today', label: 'Hari ini' },
            { key: 'week', label: 'Minggu ini' },
            { key: 'month', label: 'Bulan ini' },
            { key: 'year', label: 'Tahun ini' },
            { key: 'total', label: 'Semua' }
        ];
        var html = '<div class="floating-visitors-panel-title">Pengunjung</div>';
        rows.forEach(function (r) {
            var val = data && data[r.key];
            var display = val != null ? formatNum(val) : '0';
            var cls = loading ? ' loading' : '';
            html += '<div class="floating-visitors-row">' +
                '<span class="floating-visitors-row-label">' + r.label + '</span>' +
                '<span class="floating-visitors-row-value' + cls + '">' + display + '</span></div>';
        });
        return html;
    }

    function renderWidget(data) {
        data = data || {};
        var total = data.total != null ? data.total : (data.today != null ? data.today : 0);
        var wrap = document.getElementById('floating-visitors-wrap');
        if (!wrap) return;

        var totalEl = wrap.querySelector('.floating-visitors-total');
        if (totalEl) totalEl.textContent = formatNum(total);

        var panel = wrap.querySelector('.floating-visitors-panel');
        if (!panel) return;

        panel.classList.remove('floating-visitors-loading');
        panel.innerHTML = buildPanelHtml(data, false);
    }

    function setLoading(wrap) {
        var panel = wrap.querySelector('.floating-visitors-panel');
        if (panel) {
            panel.classList.add('floating-visitors-loading');
            panel.innerHTML = buildPanelHtml(null, true);
        }
    }

    function fetchData(callback) {
        var wrap = document.getElementById('floating-visitors-wrap');
        if (wrap) setLoading(wrap);

        var cached = getCached();
        if (cached) {
            renderWidget(cached);
            if (callback) callback(cached);
        }

        var xhr = new XMLHttpRequest();
        xhr.open('GET', apiUrl, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== 4) return;
            var data = null;
            if (xhr.status === 200) {
                try {
                    data = JSON.parse(xhr.responseText || '{}');
                    setCached(data);
                } catch (e) {}
            }
            if (!data) data = getCached() || { today: 0, week: 0, month: 0, year: 0, total: 0 };
            renderWidget(data);
            if (callback) callback(data);
        };
        xhr.onerror = function () {
            var data = getCached() || { today: 0, week: 0, month: 0, year: 0, total: 0 };
            renderWidget(data);
            if (callback) callback(data);
        };
        xhr.send();
    }

    function init() {
        var wrap = document.getElementById('floating-visitors-wrap');
        if (!wrap) return;

        var trigger = wrap.querySelector('.floating-visitors-trigger');
        if (trigger) {
            trigger.addEventListener('click', function (e) {
                e.stopPropagation();
                wrap.classList.toggle('is-open');
            });
        }

        document.addEventListener('click', function (e) {
            if (wrap && !wrap.contains(e.target)) {
                wrap.classList.remove('is-open');
            }
        });

        fetchData();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
