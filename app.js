/**
 * ==============================================================================
 * BELTAR PORTAL - OFFICIAL APPLICATION STATUS ENGINE
 * ==============================================================================
 */

// Production API Endpoint (Hardcoded)
const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwZuCg_r1bQpvCihEjtnJzHiQSuVfi5iIW_5kMeJLVl3UITEl0nEpxnmWHc2-fi68PUrA/exec';

// State
let currentRecord = null;
let detectedType = 'auto'; // 'mobile', 'epic', 'app', or 'auto'

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupAutoDetector();
    setupFormHandlers();
    setupThemeToggle();
    setupQuickSamples();
}

// Real-time Auto Detection (Mobile Number vs EPIC Voter ID vs Application No)
function setupAutoDetector() {
    const searchInput = document.getElementById('searchInput');
    const detectBadge = document.getElementById('detectBadge');
    const detectBadgeText = document.getElementById('detectBadgeText');
    const prefixIcon = document.getElementById('searchPrefixIcon');
    const btnClearSearch = document.getElementById('btnClearSearch');

    searchInput.addEventListener('input', () => {
        const val = searchInput.value.trim();

        if (val === '') {
            btnClearSearch.classList.add('hidden');
            resetBadge();
            return;
        }

        btnClearSearch.classList.remove('hidden');

        // Check if value is pure numbers or contains letters/slashes
        const isPureDigits = /^\d+$/.test(val);
        const hasLetters = /[a-zA-Z]/.test(val);
        const hasSlash = val.includes('/');

        detectBadge.className = 'detect-badge';

        if (hasLetters || hasSlash || (val.length <= 12 && !isPureDigits)) {
            // EPIC Voter ID Mode (e.g. HCL3045382, WB/13/085/249034)
            detectedType = 'epic';
            detectBadge.classList.add('epic-mode');
            detectBadgeText.innerHTML = '<i class="fa-solid fa-id-card"></i> 🪪 EPIC Voter ID Detected';
            prefixIcon.innerHTML = '<i class="fa-solid fa-id-card"></i>';
        } else if (isPureDigits && (val.length === 10 || val.length === 9 || val.length === 8)) {
            // Mobile Number Mode (e.g. 7432957510, 8972511055)
            detectedType = 'mobile';
            detectBadge.classList.add('mobile-mode');
            detectBadgeText.innerHTML = '<i class="fa-solid fa-mobile-screen"></i> 📱 Mobile Number Detected';
            prefixIcon.innerHTML = '<i class="fa-solid fa-phone"></i>';
        } else if (isPureDigits && val.length >= 11) {
            // Application Number Mode (e.g. 303100000064)
            detectedType = 'app';
            detectBadge.classList.add('app-mode');
            detectBadgeText.innerHTML = '<i class="fa-solid fa-hashtag"></i> 📄 Application Number Detected';
            prefixIcon.innerHTML = '<i class="fa-solid fa-hashtag"></i>';
        } else {
            // General Auto-Detect
            detectedType = 'auto';
            detectBadgeText.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Detecting Format...';
            prefixIcon.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
        }
    });

    function resetBadge() {
        detectedType = 'auto';
        detectBadge.className = 'detect-badge';
        detectBadgeText.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Detect Mode Active';
        prefixIcon.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    }
}

// Form Handlers
function setupFormHandlers() {
    const searchForm = document.getElementById('searchForm');
    const btnClearSearch = document.getElementById('btnClearSearch');
    const searchInput = document.getElementById('searchInput');

    btnClearSearch.addEventListener('click', () => {
        searchInput.value = '';
        btnClearSearch.classList.add('hidden');
        searchInput.focus();
        searchInput.dispatchEvent(new Event('input'));
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
            // Pick match (exact match preference)
            const match = findBestMatch(json.data, query);
            currentRecord = match;
            renderSearchResult(match);
        } else {
            showNotFound(query);
        }

    } catch (err) {
        console.error("API query error:", err);
        showLoading(false);
        showNotFound(query);
    }
}

// Helper to select best matching record
function findBestMatch(records, query) {
    const cleanQuery = query.toLowerCase().replace(/\D/g, "");
    const qLower = query.toLowerCase().trim();

    // 1. Try exact Mobile match
    for (let r of records) {
        const mob = String(r["Mobile"] || r["Mobile No."] || "").replace(/\D/g, "");
        if (cleanQuery !== "" && mob === cleanQuery) return r;
    }

    // 2. Try exact EPIC match
    for (let r of records) {
        const epic = String(r["EPIC No."] || r["EPIC No"] || "").toLowerCase().trim();
        if (epic === qLower) return r;
    }

    // 3. Fallback to first record in list
    return records[0];
}

// Render Search Result Card
function renderSearchResult(record) {
    const resultSection = document.getElementById('resultSection');
    const notFoundSection = document.getElementById('notFoundSection');
    
    notFoundSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    // Status Badges & Progress Line
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
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span id="statusBadgeText">APPROVED</span>';
        statusSummaryText.textContent = "Your application has been officially verified and APPROVED by the competent authority.";
        
        step1.className = "timeline-step step-done";
        line1.className = "timeline-line line-done";
        step2.className = "timeline-step step-done";
        line2.className = "timeline-line line-done";
        step3.className = "timeline-step step-done";
        step3.querySelector('.step-icon').innerHTML = '<i class="fa-solid fa-award"></i>';
    } else if (sLower.includes('pending') || sLower.includes('verified')) {
        statusBadge.classList.add('pending');
        statusBadge.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> <span id="statusBadgeText">VERIFIED - APPROVAL PENDING</span>';
        statusSummaryText.textContent = "Your documents are field verified and currently pending final approval from higher authorities.";
        
        step1.className = "timeline-step step-done";
        line1.className = "timeline-line line-done";
        step2.className = "timeline-step step-done";
        line2.className = "timeline-line";
        step3.className = "timeline-step";
        step3.querySelector('.step-icon').innerHTML = '<i class="fa-solid fa-hourglass-half"></i>';
    } else if (sLower.includes('process') || sLower.includes('under')) {
        statusBadge.classList.add('process');
        statusBadge.innerHTML = '<i class="fa-solid fa-gear fa-spin"></i> <span id="statusBadgeText">UNDER PROCESS</span>';
        statusSummaryText.textContent = "Your application is under active processing and field verification stage.";
        
        step1.className = "timeline-step step-done";
        line1.className = "timeline-line line-done";
        step2.className = "timeline-step";
        line2.className = "timeline-line";
        step3.className = "timeline-step";
    } else {
        statusBadge.classList.add('rejected');
        statusBadge.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> <span id="statusBadgeText">REJECTED</span>';
        statusSummaryText.textContent = "Your application requires resubmission or correction. Please contact your local center.";
    }

    // Applicant Information Details
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

// Utility to extract last N digits for privacy masking
function getLastNDigits(str, n) {
    if (!str) return '----';
    const s = String(str).trim();
    if (s.length <= n) return s;
    return s.slice(-n);
}

// Show Not Found State
function showNotFound(query) {
    const resultSection = document.getElementById('resultSection');
    const notFoundSection = document.getElementById('notFoundSection');
    
    resultSection.classList.add('hidden');
    notFoundSection.classList.remove('hidden');
    document.getElementById('querySearchVal').textContent = query;
    
    notFoundSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Reset Search View
function resetSearch() {
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('notFoundSection').classList.add('hidden');
    const input = document.getElementById('searchInput');
    input.value = '';
    input.focus();
    input.dispatchEvent(new Event('input'));
}

// UI Loading State
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

// Quick Sample Example Pills
function setupQuickSamples() {
    const samplePills = document.querySelectorAll('.sample-pill');
    samplePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const val = pill.getAttribute('data-value');
            const searchInput = document.getElementById('searchInput');
            searchInput.value = val;
            searchInput.dispatchEvent(new Event('input'));
            performSearch(val);
        });
    });
}

// Theme Toggle
function setupThemeToggle() {
    const btnTheme = document.getElementById('btnThemeToggle');
    const currentTheme = localStorage.getItem('beltar_theme') || 'dark';

    if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        btnTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    btnTheme.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'light') {
            document.documentElement.removeAttribute('data-theme');
            btnTheme.innerHTML = '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('beltar_theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            btnTheme.innerHTML = '<i class="fa-solid fa-sun"></i>';
            localStorage.setItem('beltar_theme', 'light');
        }
    });
}

// Printable Slip Generator
function printStatusSlip() {
    if (!currentRecord) return;

    const record = currentRecord;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    document.getElementById('slipDate').textContent = "Date: " + formattedDate;
    document.getElementById('slipName').textContent = record["Applicant Name"] || "N/A";
    document.getElementById('slipAppNo').textContent = "********" + getLastNDigits(record["Application No."], 4);
    document.getElementById('slipMobile').textContent = "******" + getLastNDigits(record["Mobile"], 4);
    document.getElementById('slipEpic').textContent = "******" + getLastNDigits(record["EPIC No."], 4);
    document.getElementById('slipSlNo').textContent = record["Sl. No."] || "Ref #" + Math.floor(10000 + Math.random() * 90000);
    document.getElementById('slipAddress').textContent = record["Address"] || "N/A";

    const status = record["Application Status"] || "APPROVED";
    document.getElementById('slipStatusBadgeText').textContent = status.toUpperCase();

    // QR Code Generator URL
    const qrData = `BELTAR PORTAL VERIFIED\nName: ${record["Applicant Name"]}\nStatus: ${status}\nRef: ${record["Sl. No."]}`;
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=150`;
    document.getElementById('slipQrCode').src = qrUrl;

    // Trigger Browser Print
    window.print();
}
