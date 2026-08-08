/**
 * ==============================================================================
 * BELTAR PORTAL - GOOGLE APPS SCRIPT BACKEND CODE
 * ==============================================================================
 * INSTRUCTIONS:
 * 1. Open your Google Sheet containing the data.
 * 2. Go to "Extensions" menu -> Click "Apps Script".
 * 3. Delete any existing code in Code.gs and paste all of this code.
 * 4. Click "Save" icon.
 * 5. Click "Deploy" button (top right) -> "New deployment".
 * 6. Select type: "Web app".
 * 7. Description: "Beltar Portal API"
 * 8. Execute as: "Me (your email)"
 * 9. Who has access: "Anyone" (CRITICAL for web access without login).
 * 10. Click "Deploy", authorize permissions, and COPY the Web App URL.
 * 11. Paste that Web App URL in your BELTAR PORTAL frontend settings!
 * ==============================================================================
 */

// Handle HTTP GET requests from BELTAR PORTAL frontend
function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return createJsonResponse({ status: "error", message: "No data found in Google Sheet" });
    }

    // Get headers from Row 1
    var headers = data[0].map(function(h) {
      return String(h).trim();
    });

    // Map rows into objects
    var records = [];
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var record = {};
      var isEmpty = true;

      for (var j = 0; j < headers.length; j++) {
        var val = row[j] !== undefined && row[j] !== null ? String(row[j]).trim() : "";
        record[headers[j]] = val;
        if (val !== "") isEmpty = false;
      }

      if (!isEmpty) {
        records.push(record);
      }
    }

    // Check search query parameter (e.g. ?query=743295710 or ?query=HCL3045382)
    var query = e && e.parameter && e.parameter.query ? String(e.parameter.query).trim().toLowerCase() : "";

    if (query !== "") {
      // Filter records matching Mobile, EPIC No, or Application No (exact or partial match)
      var filtered = records.filter(function(item) {
        var mobile = (item["Mobile"] || item["Mobile No."] || item["Mobile Number"] || "").toLowerCase();
        var epic = (item["EPIC No."] || item["EPIC No"] || item["EPIC Number"] || "").toLowerCase();
        var appNo = (item["Application No."] || item["Application No"] || item["Application Number"] || "").toLowerCase();

        // Clean digits for phone search
        var cleanQuery = query.replace(/\D/g, "");
        var cleanMobile = mobile.replace(/\D/g, "");

        // Match mobile number (full or last 4/10 digits), EPIC number, or Application No
        var matchMobile = (cleanQuery !== "" && cleanMobile.includes(cleanQuery)) || mobile.includes(query);
        var matchEpic = epic.includes(query);
        var matchApp = appNo.includes(query);

        return matchMobile || matchEpic || matchApp;
      });

      return createJsonResponse({
        status: "success",
        total: filtered.length,
        data: filtered
      });
    }

    // Return all records if no query provided
    return createJsonResponse({
      status: "success",
      total: records.length,
      data: records
    });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

// Helper to return CORS-enabled JSON response
function createJsonResponse(obj) {
  var output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
