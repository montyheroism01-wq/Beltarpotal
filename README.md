# 🛡️ BELTAR PORTAL - Application Status Verification System

An ultra-modern, responsive web application for citizens to check their Application Status securely using their **Mobile Number** or **EPIC Voter ID No.**. Features real-time **Google Sheets API integration**, **Privacy Masking** (only last 4 digits visible for sensitive identifiers), and **Printable Official Slips**.

---

## 🌟 Key Features

- **📱 Dual Search Modes**: Search using 10-digit Mobile Number or EPIC Voter ID.
- **🔒 Privacy Protection**: Automatic masking of sensitive identifiers showing only the **last 4 digits** (e.g. `******5710`, `******5382`).
- **📊 Real-time Google Sheets Backend**: Turn any Google Sheet into a live REST API using the included `google-apps-script.js` script.
- **⚡ Status Highlight Cards**: Visually prominent status cards (`Approved`, `Verified - Approval Pending`, `Under Process`, `Rejected`) with progress timeline indicators.
- **🖨️ Printable Status Slip**: Generate and print official verification receipts with auto-generated QR codes.
- **💻📱 Responsive Design**: Optimized for Laptops, Tablets, and Mobile screens with smooth animations and dark/light modes.

---

## 📂 Repository File Structure

```text
beltar-portal/
├── index.html              # Main Portal UI & Layout
├── style.css               # Modern Glassmorphism CSS Design System
├── app.js                  # Search logic, privacy masking, & API handling
├── google-apps-script.js   # Copy-paste backend script for Google Sheets (Code.gs)
└── README.md               # Documentation & Setup Guide
```

---

## 🚀 How to Connect Your Google Sheet Data

Follow these simple steps to make your Google Sheet serve real-time status data to **BELTAR PORTAL**:

1. **Prepare Your Google Sheet**:
   Ensure row 1 contains the exact column headers shown below:
   | Sl. No. | Application No. | Applicant Name | Mobile | EPIC No. | Application Status | Address |
   |---|---|---|---|---|---|---|
   | 88577 | 303100000064 | MITA SADHUKHAN | 743295710 | HCL3045382 | Approved | VILL & POST BHANDARKOLA... |

2. **Open Apps Script**:
   - In your Google Sheet, click **Extensions** > **Apps Script**.
   - Delete any sample code in `Code.gs`.
   - Copy all code from [`google-apps-script.js`](file:///C:/Users/123/.gemini/antigravity/scratch/beltar-portal/google-apps-script.js) and paste it into `Code.gs`.
   - Click the 💾 **Save** icon.

3. **Deploy as Web App**:
   - Click the blue **Deploy** button (top right) > **New deployment**.
   - Click the gear icon ⚙️ next to "Select type" and select **Web app**.
   - Set **Description**: `Beltar Portal API`.
   - Set **Execute as**: `Me (your email)`.
   - Set **Who has access**: `Anyone` *(CRITICAL so the web portal can fetch data without login!)*.
   - Click **Deploy** and authorize permissions if prompted.
   - Copy the generated **Web App URL** (e.g. `https://script.google.com/macros/s/.../exec`).

4. **Connect to BELTAR PORTAL**:
   - Open **BELTAR PORTAL** in your browser.
   - Click the **Gear Icon ⚙️ (Settings)** in the navbar.
   - Uncheck "Use Sample Local Demo Data", paste your **Web App URL**, and click **Save Connection**.

---

## 🌐 Free GitHub Pages Hosting Guide

To host this website online for free on GitHub Pages:

1. Create a new GitHub repository named `beltar-portal`.
2. Upload `index.html`, `style.css`, `app.js`, and `README.md` to the main branch.
3. Go to **Settings** > **Pages**.
4. Under **Build and deployment** > **Branch**, select `main` and `/ (root)`.
5. Click **Save**. Your site will be live at `https://yourusername.github.io/beltar-portal/`!

---

## 📄 License & Credits

Built for citizen public service verification. Designed with modern web standards, HTML5, CSS3, and JavaScript.
