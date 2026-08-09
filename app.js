/**
 * ==============================================================================
 * BELTAR PORTAL - GOVERNMENT OF WEST BENGAL ONLINE SERVICE ENGINE
 * ==============================================================================
 */

// Live Production API Endpoint
const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwZuCg_r1bQpvCihEjtnJzHiQSuVfi5iIW_5kMeJLVl3UITEl0nEpxnmWHc2-fi68PUrA/exec';

// Application State
let currentRecord = null;

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    
    // Prevent pinch-to-zoom gesture on touch devices
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
});

function initApp() {
    setupFormHandlers();
    setupThemeToggle();
    setupFontSizeSizer();
}

// Form Handlers
function setupFormHandlers() {
    const searchForm = document.getElementById('searchForm');
    const btnClearSearch = document.getElementById('btnClearSearch');
    const searchInput = document.getElementById('searchInput');

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() !== '') {
            btnClearSearch.classList.remove('hidden');
        } else {
            btnClearSearch.classList.add('hidden');
        }
    });

    btnClearSearch.addEventListener('click', () => {
        searchInput.value = '';
        btnClearSearch.classList.add('hidden');
        searchInput.focus();
    });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (query) {
            performSearch(query);
        }
    });

    document.getElementById('btnPrintSlip').addEventListener('click', printStatusSlip);
}

// Execute Live Status Query
async function performSearch(query) {
    showLoading(true);
    hideResults();

    try {
        const url = `${API_ENDPOINT}?query=${encodeURIComponent(query)}`;
        const response = await fetch(url);
        const json = await response.json();

        showLoading(false);

        if (json.status === 'success' && json.data && json.data.length > 0) {
            const match = findBestMatch(json.data, query);
            currentRecord = match;
            renderSearchResult(match);
        } else {
            showNotFound(query);
        }

    } catch (err) {
        console.error("API Error:", err);
        showLoading(false);
        showNotFound(query);
    }
}

// Helper to select best match
function findBestMatch(records, query) {
    const cleanQuery = query.toLowerCase().replace(/\D/g, "");
    const qLower = query.toLowerCase().trim();

    for (let r of records) {
        const mob = String(r["Mobile"] || r["Mobile No."] || "").replace(/\D/g, "");
        if (cleanQuery !== "" && mob === cleanQuery) return r;
    }

    for (let r of records) {
        const epic = String(r["EPIC No."] || r["EPIC No"] || "").toLowerCase().trim();
        if (epic === qLower) return r;
    }

    return records[0];
}

// Render Result Card in Bengali
function renderSearchResult(record) {
    const resultSection = document.getElementById('resultSection');
    const notFoundSection = document.getElementById('notFoundSection');
    
    notFoundSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    const status = record["Application Status"] || record["Status"] || "Approved";
    const statusBadge = document.getElementById('statusBadge');
    const statusSummaryText = document.getElementById('statusSummaryText');

    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');

    statusBadge.className = 'status-badge';
    const sLower = status.toLowerCase();

    if (sLower.includes('approved') && !sLower.includes('pending')) {
        statusBadge.classList.add('approved');
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span id="statusBadgeText">অনুমোদিত (APPROVED)</span>';
        statusSummaryText.textContent = "আপনার আবেদনপত্রটি সফলভাবে যাচাই করা হয়েছে এবং সংশ্লিষ্ট কর্তৃপক্ষ দ্বারা অনুমোদিত হয়েছে।";
        
        step1.className = "timeline-step step-done";
        line1.className = "timeline-line line-done";
        step2.className = "timeline-step step-done";
        line2.className = "timeline-line line-done";
        step3.className = "timeline-step step-done";
        step3.querySelector('.step-icon').innerHTML = '<i class="fa-solid fa-award"></i>';
    } else if (sLower.includes('pending') || sLower.includes('verified')) {
        statusBadge.classList.add('pending');
        statusBadge.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> <span id="statusBadgeText">যাচাইকৃত - অনুমোদন অপেক্ষমান</span>';
        statusSummaryText.textContent = "আপনার নথিগুলি ক্ষেত্রপর্যায়ে সফলভাবে যাচাই করা হয়েছে এবং চূড়ান্ত অনুমোদনের জন্য প্রক্রিয়াধীন রয়েছে।";
        
        step1.className = "timeline-step step-done";
        line1.className = "timeline-line line-done";
        step2.className = "timeline-step step-done";
        line2.className = "timeline-line";
        step3.className = "timeline-step";
        step3.querySelector('.step-icon').innerHTML = '<i class="fa-solid fa-hourglass-half"></i>';
    } else if (sLower.includes('process') || sLower.includes('under')) {
        statusBadge.classList.add('process');
        statusBadge.innerHTML = '<i class="fa-solid fa-gear fa-spin"></i> <span id="statusBadgeText">প্রক্রিয়াধীন (UNDER PROCESS)</span>';
        statusSummaryText.textContent = "আপনার আবেদনটি ক্ষেত্র যাচাইকরণ এবং সক্রিয় প্রক্রিয়াকরণ পর্যায়ে রয়েছে।";
        
        step1.className = "timeline-step step-done";
        line1.className = "timeline-line line-done";
        step2.className = "timeline-step";
        line2.className = "timeline-line";
        step3.className = "timeline-step";
    } else {
        statusBadge.classList.add('rejected');
        statusBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span id="statusBadgeText">প্রত্যাখ্যাত (REJECTED)</span>';
        statusSummaryText.textContent = "আপনার আবেদনে সংশোধনের প্রয়োজন রয়েছে। অনুগ্রহ করে আপনার নিকটস্থ আঞ্চলিক কার্যালয়ে যোগাযোগ করুন।";
    }

    // Applicant Information
    document.getElementById('valApplicantName').textContent = record["Applicant Name"] || record["Name"] || "N/A";
    document.getElementById('valSlNo').textContent = record["Sl. No."] || record["Sl No"] || "Ref #" + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('valAddress').textContent = record["Address"] || record["Full Address"] || "N/A";
    
    // Privacy Masking (Last 4 Digits Visible)
    const rawAppNo = record["Application No."] || record["Application No"] || "303100000000";
    const rawMobile = record["Mobile"] || record["Mobile No."] || "0000000000";
    const rawEpic = record["EPIC No."] || record["EPIC No"] || "XXXXXXXXXX";

    document.getElementById('valAppNoDigits').textContent = getLastNDigits(rawAppNo, 4);
    document.getElementById('valMobileDigits').textContent = getLastNDigits(rawMobile, 4);
    document.getElementById('valEpicDigits').textContent = getLastNDigits(rawEpic, 4);

    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getLastNDigits(str, n) {
    if (!str) return '----';
    const s = String(str).trim();
    if (s.length <= n) return s;
    return s.slice(-n);
}

function showNotFound(query) {
    const resultSection = document.getElementById('resultSection');
    const notFoundSection = document.getElementById('notFoundSection');
    
    resultSection.classList.add('hidden');
    notFoundSection.classList.remove('hidden');
    document.getElementById('querySearchVal').textContent = query;
    
    notFoundSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetSearch() {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('notFoundSection').classList.add('hidden');
    const input = document.getElementById('searchInput');
    input.value = '';
    input.focus();
}

function showLoading(isLoading) {
    const btnSearch = document.getElementById('btnSearch');
    const btnText = btnSearch.querySelector('.btn-text');
    const btnSpinner = btnSearch.querySelector('.btn-spinner');

    if (isLoading) {
        btnSearch.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
    } else {
        btnSearch.disabled = false;
        btnText.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
    }
}

function hideResults() {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('notFoundSection').classList.add('hidden');
}

// 100% Guaranteed Light/Dark Mode Switcher
function setupThemeToggle() {
    const btnTheme = document.getElementById('btnThemeToggle');
    const textEl = document.getElementById('themeToggleText');
    const savedTheme = localStorage.getItem('beltar_theme') || 'light';

    applyTheme(savedTheme);

    btnTheme.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
    });

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            document.body.className = 'dark-mode';
            btnTheme.innerHTML = '<i class="fa-solid fa-sun"></i> <span class="hide-mobile" id="themeToggleText">লাইট মোড</span>';
            localStorage.setItem('beltar_theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            document.body.className = 'light-mode';
            btnTheme.innerHTML = '<i class="fa-solid fa-moon"></i> <span class="hide-mobile" id="themeToggleText">ডার্ক মোড</span>';
            localStorage.setItem('beltar_theme', 'light');
        }
    }
}

// Accessibility Text Size Adjuster
function setupFontSizeSizer() {
    const btnDec = document.getElementById('btnDecreaseFont');
    const btnNorm = document.getElementById('btnNormalFont');
    const btnInc = document.getElementById('btnIncreaseFont');

    btnDec.addEventListener('click', () => {
        document.body.classList.remove('font-lg');
        document.body.classList.add('font-sm');
        setActiveBtn(btnDec);
    });

    btnNorm.addEventListener('click', () => {
        document.body.classList.remove('font-sm', 'font-lg');
        setActiveBtn(btnNorm);
    });

    btnInc.addEventListener('click', () => {
        document.body.classList.remove('font-sm');
        document.body.classList.add('font-lg');
        setActiveBtn(btnInc);
    });

    function setActiveBtn(activeBtn) {
        [btnDec, btnNorm, btnInc].forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
    }
}

// Printable Slip Generator
function printStatusSlip() {
    if (!currentRecord) return;

    const record = currentRecord;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('bn-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById('slipDate').textContent = "তারিখ: " + formattedDate;
    document.getElementById('slipName').textContent = record["Applicant Name"] || "N/A";
    document.getElementById('slipAppNo').textContent = "********" + getLastNDigits(record["Application No."], 4);
    document.getElementById('slipMobile').textContent = "******" + getLastNDigits(record["Mobile"], 4);
    document.getElementById('slipEpic').textContent = "******" + getLastNDigits(record["EPIC No."], 4);
    document.getElementById('slipSlNo').textContent = record["Sl. No."] || "Ref #" + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('slipAddress').textContent = record["Address"] || "N/A";

    const status = record["Application Status"] || "APPROVED";
    document.getElementById('slipStatusBadgeText').textContent = status.toUpperCase() === "APPROVED" ? "অনুমোদিত (APPROVED)" : status;

    const qrData = `BELTAR PORTAL VERIFIED\nGovt of West Bengal\nName: ${record["Applicant Name"]}\nStatus: ${status}\nRef: ${record["Sl. No."]}`;
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=150`;
    document.getElementById('slipQrCode').src = qrUrl;

    window.print();
}
