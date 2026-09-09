// ID Folder Google Drive Tempat Menyimpan Foto Bukti Pembayaran
var DRIVE_FOLDER_ID = "1xcJenGGAUs-ueacdamHjEynwLsGJT1F6";

function doGet(e) {
  return ContentService.createTextOutput("API Pendaftaran TEMBIKAR 2026 Aktif!")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(e) {
  try {
    // 1. Parsing Data Masuk (Handling Multi-format Payload)
    var data;
    if (e && e.parameter && e.parameter.postData) {
      data = JSON.parse(e.parameter.postData);
    } else if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("Payload tidak ditemukan");
    }

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var reg = data.registration || {};
    var participants = Array.isArray(data.participants) ? data.participants : [];
    var pembinaList = Array.isArray(reg.pembina) ? reg.pembina : [];
    var jenjangStr = String(reg.jenjang || "MULA").toUpperCase().trim(); // MULA, MADYA, atau WIRA

    // Format Tanggal Waktu WIB
    var timeStampStr = Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");

    // Link Grup WhatsApp Peserta
    var waGroupLink = "https://chat.whatsapp.com/IEmoiTRIGLgH4FoUCu4E7O?s=cl&p=a&mlu=4&ilr=4";

    // 2. Upload Bukti Pembayaran ke Google Drive
    var finalPaymentUrl = data.paymentUrl || "-";
    if (data.paymentBase64 && data.paymentBase64.length > 50) {
      var fileName = "BUKTI_" + (data.registrationNumber || "REG") + "_" + String(reg.unit || "UNIT").replace(/[^a-zA-Z0-9]/g, "_");
      finalPaymentUrl = uploadFileToDrive(data.paymentBase64, fileName, data.paymentMimeType);
    }

    // Contact Person & Pembina
    var namaCP = reg.contactName || reg.contactPerson || reg.kontakPerson || "-";
    var noWA = reg.contactPhone || reg.noWa || reg.kontak || "-";

    // 3. Tulis Data ke Sheet 'ADMINISTRASI'
    var sheetAdmin = ss.getSheetByName("ADMINISTRASI") || ss.getSheets()[0];
    if (sheetAdmin) {
      sheetAdmin.appendRow([
        data.registrationNumber || "-", // Kolom A: No. Registrasi
        timeStampStr,                    // Kolom B: Waktu Pendaftaran
        reg.unit || "-",                 // Kolom C: Unit / Sekolah
        reg.noUnit || "-",               // Kolom D: No Unit
        namaCP,                          // Kolom E: Nama Contact Person
        "'" + noWA,                      // Kolom F: No. WhatsApp
        jenjangStr,                      // Kolom G: Tingkat / Jenjang
        finalPaymentUrl                  // Kolom H: Bukti Pembayaran Link
      ]);
    }

    // 4. Tulis Data Pembina ke Sheet 'PEMBINA [JENJANG]'
    var sheetPembina = getSheetFlexible(ss, ["PEMBINA " + jenjangStr, "PEMBINA_" + jenjangStr, "PEMBINA"]);
    if (sheetPembina) {
      pembinaList.forEach(function(pem) {
        pem = pem || {};
        sheetPembina.appendRow([
          data.registrationNumber || "-",
          reg.unit || "-",
          reg.noUnit || "-",
          "'" + (pem.nip || "-"), // NIP / MIS
          pem.nama || "-",
          pem.ket || "Pembina"
        ]);
      });
    }

    // 5. Tulis Data Peserta ke Sheet 'PESERTA [JENJANG]'
    var sheetPeserta = getSheetFlexible(ss, ["PESERTA " + jenjangStr, "PESERTA_" + jenjangStr, "PESERTA"]);
    if (sheetPeserta) {
      participants.forEach(function(p) {
        p = p || {};
        var giatStr = Array.isArray(p.giat) ? p.giat.join(", ") : (p.giat || "-");
        sheetPeserta.appendRow([
          data.registrationNumber || "-",
          reg.unit || "-",
          reg.noUnit || "-",
          "'" + (p.noMisNisn || "-"), // NISN / MIS
          p.namaPeserta || "-",
          giatStr                    // Bidang Giat / Keterangan
        ]);
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "SUCCESS",
      message: "Data berhasil disimpan",
      registrationNumber: data.registrationNumber,
      groupUrl: waGroupLink
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "ERROR",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper untuk memilih Sheet secara fleksibel
function getSheetFlexible(ss, possibleNames) {
  for (var i = 0; i < possibleNames.length; i++) {
    var sh = ss.getSheetByName(possibleNames[i]);
    if (sh) return sh;
  }
  return null;
}

// Upload File ke Google Drive
function uploadFileToDrive(base64Data, fileName, mimeType) {
  try {
    var base64Clean = base64Data;
    var type = mimeType || "image/jpeg";

    if (base64Data.indexOf(",") !== -1) {
      var parts = base64Data.split(",");
      base64Clean = parts[1];
      var metaMatch = parts[0].match(/data:(.*);base64/);
      if (metaMatch && metaMatch[1]) {
        type = metaMatch[1];
      }
    }

    var ext = "";
    if (type.indexOf("pdf") !== -1) ext = ".pdf";
    else if (type.indexOf("png") !== -1) ext = ".png";
    else if (type.indexOf("jpeg") !== -1 || type.indexOf("jpg") !== -1) ext = ".jpg";
    else if (type.indexOf("webp") !== -1) ext = ".webp";

    var fullFileName = fileName + ext;
    var bytes = Utilities.base64Decode(base64Clean);
    var blob = Utilities.newBlob(bytes, type, fullFileName);

    if (typeof Drive !== "undefined" && Drive.Files) {
      if (typeof Drive.Files.create === "function") {
        var fileV3 = Drive.Files.create({
          name: fullFileName,
          mimeType: type,
          parents: [DRIVE_FOLDER_ID]
        }, blob);
        return "https://drive.google.com/file/d/" + fileV3.id + "/view";
      } else if (typeof Drive.Files.insert === "function") {
        var fileV2 = Drive.Files.insert({
          title: fullFileName,
          mimeType: type,
          parents: [{ id: DRIVE_FOLDER_ID }]
        }, blob);
        return fileV2.alternateLink || fileV2.webViewLink || ("https://drive.google.com/file/d/" + fileV2.id + "/view");
      }
    }

    var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var fileFallback = folder.createFile(blob);
    fileFallback.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return fileFallback.getUrl();

  } catch (err) {
    return "Error Upload: " + err.toString();
  }
}
