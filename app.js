/**
 * ==============================================================================
 * BELTAR PORTAL - APPLICATION LOGIC & SEARCH ENGINE
 * ==============================================================================
 */

// Sample Demo Data (Loaded directly from user provided dataset)
const DEMO_DATA = [
    {
        "Sl. No.": "88577",
        "Application No.": "303100000064",
        "Applicant Name": "MITA SADHUKHAN",
        "Mobile": "743295710",
        "EPIC No.": "HCL3045382",
        "Application Status": "Approved",
        "Address": "VILL & POST BHANDARKOLA P.S GOPALNAGAR DIST NORTH 24 PARGANAS PIN743701, P.S: Gopalnagar PS, P.O: Bhandarkola BO"
    },
    {
        "Sl. No.": "88578",
        "Application No.": "303100001760",
        "Applicant Name": "Tripti Biswas",
        "Mobile": "8972511055",
        "EPIC No.": "HCL2774859",
        "Application Status": "Approved",
        "Address": "Raghunathpur, P.S: Gopalnagar PS, P.O: Ram Shankarpur BO"
    },
    {
        "Sl. No.": "88579",
        "Application No.": "303100004476",
        "Applicant Name": "NAMITA SARKAR",
        "Mobile": "9733934817",
        "EPIC No.": "WB/13/085/249034",
        "Application Status": "Approved",
        "Address": "VILL- HARISHPUR, PO- BELTA, PS- GOPALNAGAR, DIST- 24 PARGANAS NORTH, PIN- 743701, P.S: Gopalnagar PS, P.O: Belta BO"
    },
    {
        "Sl. No.": "88580",
        "Application No.": "303100005887",
        "Applicant Name": "DIPA DEBNATH PAUL",
        "Mobile": "7872749273",
        "EPIC No.": "NRC1383892",
        "Application Status": "Approved",
        "Address": "VILL-BHANDARKOLA, P.S: Gopalnagar PS, P.O: Nahata SO"
    },
    {
        "Sl. No.": "88581",
        "Application No.": "303100005908",
        "Applicant Name": "Kabita Biswas",
        "Mobile": "8670533917",
        "EPIC No.": "NRC1605591",
        "Application Status": "Approved",
        "Address": "Raghunathpur, P.S: Gopalnagar PS, P.O: Ram Shankarpur BO"
    },
    {
        "Sl. No.": "88582",
        "Application No.": "303100009236",
        "Applicant Name": "LIPIKA SARKAR",
        "Mobile": "8001225224",
        "EPIC No.": "HCL3183225",
        "Application Status": "Verified - Approval Pending",
        "Address": "VILL- HARISHPUR, P.O - BELTA, P.S - GOPALNAGER, DIST - 24 PARGANAS NORTH, PIN- 743701, P.S: Gopalnagar PS, P.O: Belta BO"
    },
    {
        "Sl. No.": "88583",
        "Application No.": "303100011221",
        "Applicant Name": "SANCHITA KARMAKAR DAS",
        "Mobile": "9932044035",
        "EPIC No.": "NRC0139535",
        "Application Status": "Approved",
        "Address": "SHUKLADURGAPUR, NORTH 24 PARGANAS, SULKA DURGAPUR, WEST BENGAL, 743701, P.S: Gopalnagar PS, P.O: Sulka Durgapur BO"
    },
    {
        "Sl. No.": "88584",
        "Application No.": "303100011945",
        "Applicant Name": "BAISHAKHI HAZRA",
        "Mobile": "7602393030",
        "EPIC No.": "NEY1717198",
        "Application Status": "Approved",
        "Address": "VILLAGE - BELTA, POST - BELTA, P.S - GOPALNAGAR, P.S: Gopalnagar PS, P.O: Belta BO"
    },
    {
        "Sl. No.": "88585",
        "Application No.": "303100014287",
        "Applicant Name": "SHYAMALI SARKAR",
        "Mobile": "9832558057",
        "EPIC No.": "NRC1267756",
        "Application Status": "Approved",
        "Address": "VILL-RAGHUNATHPUR, P.S: Gopalnagar PS, P.O: Ram Shankarpur BO"
    },
    {
        "Sl. No.": "88586",
        "Application No.": "303100015868",
        "Applicant Name": "PRIYA DAS",
        "Mobile": "8759485427",
        "EPIC No.": "NNR1891662",
        "Application Status": "Approved",
        "Address": "VILL- HARISHPUR, P.O-BELTA, P.S- GOPALNAGAR, DIST - PARGANAS NORTH 24, PIN- 743701, P.S: Gopalnagar PS, P.O: Belta BO"
    },
    {
        "Sl. No.": "88587",
        "Application No.": "303100016211",
        "Applicant Name": "BANDANA DUTTA",
        "Mobile": "7872918548",
        "EPIC No.": "NRC1506443",
        "Application Status": "Approved",
        "Address": "VILL RASULPUR PO BHANDER KOLA PS GOPALNAGAR DIST NORTH 24 PARGANAS PIN 743701, P.S: Gopalnagar PS, P.O: Bhander Kola BO"
    }
];

// Google Apps Script Code String (For easy copy modal)
const GOOGLE_SCRIPT_CODE = `/**
 * BELTAR PORTAL - GOOGLE APPS SCRIPT BACKEND (Code.gs)
 */
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return createJsonResponse({ status: "error", message: "No data found" });
    }

    var headers = data[0].map(function(h) { return String(h).trim(); });
    var records = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var record = {};
      for (var j = 0; j < headers.length; j++) {
        record[headers[j]] = row[j] !== undefined && row[j] !== null ? String(row[j]).trim() : "";
      }
      records.push(record);
    }

    var query = e && e.parameter && e.parameter.query ? String(e.parameter.query).trim().toLowerCase() : "";

    if (query !== "") {
      var filtered = records.filter(function(item) {
        var mobile = (item["Mobile"] || item["Mobile No."] || "").toLowerCase();
        var epic = (item["EPIC No."] || item["EPIC No"] || "").toLowerCase();
        var appNo = (item["Application No."] || "").toLowerCase();
        
        var cleanQuery = query.replace(/\\D/g, "");
        var cleanMobile = mobile.replace(/\\D/g, "");

        return (cleanQuery !== "" && cleanMobile.includes(cleanQuery)) || mobile.includes(query) || epic.includes(query) || appNo.includes(query);
      });

      return createJsonResponse({ status: "success", total: filtered.length, data: filtered });
    }

    return createJsonResponse({ status: "success", total: records.length, data: records });

  } catch (err) {
    return createJsonResponse({ status: "error", message: err.toString() });
  }
}

function createJsonResponse(obj) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}`;

// Application State
let currentSearchType = 'mobile';
let currentRecord = null;
let customApiUrl = localStorage.getItem('beltar_api_url') || '';
let useDemoData = localStorage.getItem('beltar_use_demo') !== 'false';

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    setupTabSwitchers();
    setupFormHandlers();
    setupModalHandlers();
    setupThemeToggle();
    setupQuickSamples();
    updateApiStatusBanner();

    // Populate code in modal
    document.getElementById('codeText').textContent = GOOGLE_SCRIPT_CODE;
}

// Search Mode Switcher (Mobile vs EPIC)
function setupTabSwitchers() {
    const tabMobile = document.getElementById('tabMobile');
    const tabEpic = document.getElementById('tabEpic');
    const searchInput = document.getElementById('searchInput');
    const prefixIcon = document.getElementById('searchPrefixIcon');

    tabMobile.addEventListener('click', () => {
        currentSearchType = 'mobile';
        tabMobile.classList.add('active');
        tabEpic.classList.remove('active');
        tabMobile.setAttribute('aria-selected', 'true');
        tabEpic.setAttribute('aria-selected', 'false');

        searchInput.placeholder = "Enter Mobile Number (e.g., 743295710)";
        searchInput.type = "tel";
        prefixIcon.innerHTML = '<i class="fa-solid fa-phone"></i>';
        searchInput.focus();
    });

    tabEpic.addEventListener('click', () => {
        currentSearchType = 'epic';
        tabEpic.classList.add('active');
        tabMobile.classList.remove('active');
        tabEpic.setAttribute('aria-selected', 'true');
        tabMobile.setAttribute('aria-selected', 'false');

        searchInput.placeholder = "Enter EPIC Voter ID No. (e.g., HCL3045382)";
        searchInput.type = "text";
        prefixIcon.innerHTML = '<i class="fa-solid fa-id-card"></i>';
        searchInput.focus();
    });
}

// Form Handlers & Input Events
function setupFormHandlers() {
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const btnClearSearch = document.getElementById('btnClearSearch');

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

// Perform Search Execution
async function performSearch(query) {
    showLoading(true);
    hideResults();

    let records = [];

    if (!useDemoData && customApiUrl) {
        // Fetch from custom Google Apps Script Web App
        try {
            const apiUrl = `${customApiUrl}?query=${encodeURIComponent(query)}`;
            const response = await fetch(apiUrl);
            const json = await response.json();
            if (json.status === 'success' && json.data && json.data.length > 0) {
                records = json.data;
            }
        } catch (err) {
            console.warn("API Fetch failed, falling back to local demo dataset", err);
            records = searchLocalDemoData(query);
        }
    } else {
        // Search in local demo data
        await new Promise(r => setTimeout(r, 450)); // smooth realistic loading state
        records = searchLocalDemoData(query);
    }

    showLoading(false);

    if (records.length > 0) {
        currentRecord = records[0]; // Display top match
        renderSearchResult(currentRecord);
    } else {
        showNotFound(query);
    }
}

// Search Logic inside Local Demo Dataset
function searchLocalDemoData(query) {
    const qLower = query.toLowerCase().trim();
    const cleanQuery = qLower.replace(/\D/g, "");

    return DEMO_DATA.filter(item => {
        const mobile = (item["Mobile"] || "").toLowerCase();
        const epic = (item["EPIC No."] || "").toLowerCase();
        const appNo = (item["Application No."] || "").toLowerCase();
        const cleanMobile = mobile.replace(/\D/g, "");

        // Match exact or contains for mobile, EPIC, or application no
        const matchMobile = (cleanQuery !== "" && cleanMobile.includes(cleanQuery)) || mobile.includes(qLower);
        const matchEpic = epic.includes(qLower);
        const matchApp = appNo.includes(qLower);

        return matchMobile || matchEpic || matchApp;
    });
}

// Render Result Card
function renderSearchResult(record) {
    const resultSection = document.getElementById('resultSection');
    const notFoundSection = document.getElementById('notFoundSection');
    
    notFoundSection.classList.add('hidden');
    resultSection.classList.remove('hidden');

    // Status Values & Badges
    const status = record["Application Status"] || record["Status"] || "Approved";
    const statusBadge = document.getElementById('statusBadge');
    const statusBadgeText = document.getElementById('statusBadgeText');
    const statusSummaryText = document.getElementById('statusSummaryText');

    // Step Elements
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');

    // Reset status classes
    statusBadge.className = 'status-badge';

    const sLower = status.toLowerCase();

    if (sLower.includes('approved') && !sLower.includes('pending')) {
        statusBadge.classList.add('approved');
        statusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span id="statusBadgeText">APPROVED</span>';
        statusSummaryText.textContent = "Your application has been successfully verified and APPROVED by the authority.";
        
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

    // Scroll smoothly to results
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
}

// UI Loading state
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

// Quick Sample Pills
function setupQuickSamples() {
    const samplePills = document.querySelectorAll('.sample-pill');
    samplePills.forEach(pill => {
        pill.addEventListener('click', () => {
            const val = pill.getAttribute('data-value');
            const type = pill.getAttribute('data-type');

            if (type === 'mobile') {
                document.getElementById('tabMobile').click();
            } else {
                document.getElementById('tabEpic').click();
            }

            const searchInput = document.getElementById('searchInput');
            searchInput.value = val;
            document.getElementById('btnClearSearch').classList.remove('hidden');
            performSearch(val);
        });
    });
}

// Modal Setup
function setupModalHandlers() {
    // Sheet Code Modal
    const modalSheetCode = document.getElementById('modalSheetCode');
    const btnSheetCode = document.getElementById('btnSheetCode');
    const btnCloseSheetModal = document.getElementById('btnCloseSheetModal');
    const btnCloseSheetModal2 = document.getElementById('btnCloseSheetModal2');
    const linkFooterSheetCode = document.getElementById('linkFooterSheetCode');

    const openSheetModal = () => modalSheetCode.classList.remove('hidden');
    const closeSheetModal = () => modalSheetCode.classList.add('hidden');

    btnSheetCode.addEventListener('click', openSheetModal);
    linkFooterSheetCode.addEventListener('click', (e) => { e.preventDefault(); openSheetModal(); });
    btnCloseSheetModal.addEventListener('click', closeSheetModal);
    btnCloseSheetModal2.addEventListener('click', closeSheetModal);

    // Settings Modal
    const modalSettings = document.getElementById('modalSettings');
    const btnSettings = document.getElementById('btnSettings');
    const btnCloseSettingsModal = document.getElementById('btnCloseSettingsModal');
    const linkConfigApi = document.getElementById('linkConfigApi');
    const btnOpenConfigFromModal = document.getElementById('btnOpenConfigFromModal');

    const openSettingsModal = () => {
        document.getElementById('inputApiUrl').value = customApiUrl;
        document.getElementById('chkUseDemoData').checked = useDemoData;
        modalSettings.classList.remove('hidden');
    };
    const closeSettingsModal = () => modalSettings.classList.add('hidden');

    btnSettings.addEventListener('click', openSettingsModal);
    linkConfigApi.addEventListener('click', (e) => { e.preventDefault(); openSettingsModal(); });
    btnOpenConfigFromModal.addEventListener('click', () => { closeSheetModal(); openSettingsModal(); });
    btnCloseSettingsModal.addEventListener('click', closeSettingsModal);

    // Copy Code Button
    document.getElementById('btnCopyCode').addEventListener('click', () => {
        navigator.clipboard.writeText(GOOGLE_SCRIPT_CODE);
        const btn = document.getElementById('btnCopyCode');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy Code';
        }, 2000);
    });

    // Save Settings
    document.getElementById('btnSaveSettings').addEventListener('click', () => {
        customApiUrl = document.getElementById('inputApiUrl').value.trim();
        useDemoData = document.getElementById('chkUseDemoData').checked;

        localStorage.setItem('beltar_api_url', customApiUrl);
        localStorage.setItem('beltar_use_demo', useDemoData ? 'true' : 'false');

        updateApiStatusBanner();
        closeSettingsModal();
    });

    // Reset Settings
    document.getElementById('btnResetApiUrl').addEventListener('click', () => {
        customApiUrl = '';
        useDemoData = true;
        document.getElementById('inputApiUrl').value = '';
        document.getElementById('chkUseDemoData').checked = true;
        localStorage.removeItem('beltar_api_url');
        localStorage.setItem('beltar_use_demo', 'true');
        updateApiStatusBanner();
        closeSettingsModal();
    });
}

function updateApiStatusBanner() {
    const textEl = document.getElementById('apiStatusText');
    if (!useDemoData && customApiUrl) {
        textEl.textContent = "Connected to Live Google Sheet API";
    } else {
        textEl.textContent = "Using Built-in Live Demo Dataset";
    }
}

// Dark / Light Theme Toggle
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

// Print Status Slip Generator
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
    document.getElementById('slipSlNo').textContent = record["Sl. No."] || "88582";
    document.getElementById('slipAddress').textContent = record["Address"] || "N/A";

    const status = record["Application Status"] || "APPROVED";
    document.getElementById('slipStatusBadgeText').textContent = status.toUpperCase();

    // Generate Verification QR Code URL using QuickChart API
    const qrData = `BELTAR PORTAL VERIFIED\nName: ${record["Applicant Name"]}\nStatus: ${status}\nRef: ${record["Sl. No."]}`;
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(qrData)}&size=150`;
    document.getElementById('slipQrCode').src = qrUrl;

    // Trigger Print
    window.print();
}
