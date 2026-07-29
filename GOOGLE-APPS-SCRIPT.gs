const SPREADSHEET_ID = "1s7I5yePRyIIRF8hM4GafSVDioBIJGDjg_HOk6Ybr72s";
const SHEET_NAME = "RSVP";

function doPost(e) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Sheet tab "' + SHEET_NAME + '" not found.');
    }

    const data = JSON.parse(e.postData.contents);
    const response = data.response || data.message || "";
    sheet.appendRow([new Date(), data.name || "", response]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, message: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
