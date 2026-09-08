/**
 * REVIEW & SUMMARY DISPLAY — TEMBIKAR 2026
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderReview() {
  // Cek ID container di HTML (mencakup review-content atau review-container)
  var container = document.getElementById("review-content") || document.getElementById("review-container");
  if (!container) return;

  var state = window.appState || {};
  var reg = state.registration || {};
  var participants = state.participants || [];
  var payment = state.payment || {}; // Mengambil data dari upload.js

  // Ambil data Contact Person & Pembina dari input HTML jika di state belum terisi
  var cpNama = (document.getElementById('cpNama')?.value.trim()) || reg.contactName || reg.contactPerson || '-';
  var cpKontak = (document.getElementById('cpKontak')?.value.trim()) || reg.contactPhone || reg.noWa || '-';

  // 1. Tabel Data Unit / Sekolah & Pembina
  var html = `
    <div style="margin-bottom: 20px;">
      <h4 style="margin-bottom: 8px; color: #dc3545; font-size: 15px; font-weight: bold;">Data Pendaftaran</h4>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; border: 1px solid #dee2e6;">
        <tbody>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <th style="padding: 8px; background: #f8f9fa; width: 35%; text-align: left; color: #495057;">Tingkat / Jenjang</th>
            <td style="padding: 8px; font-weight: bold; color: #212529;">${escapeHtml(reg.jenjang || "-")}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <th style="padding: 8px; background: #f8f9fa; text-align: left; color: #495057;">Unit / Sekolah</th>
            <td style="padding: 8px; color: #212529;">${escapeHtml(reg.unit || "-")} ${reg.noUnit ? '(No. Unit: ' + escapeHtml(reg.noUnit) + ')' : ''}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <th style="padding: 8px; background: #f8f9fa; text-align: left; color: #495057;">Contact Person</th>
            <td style="padding: 8px; color: #212529;">${escapeHtml(cpNama)} (${escapeHtml(cpKontak)})</td>
          </tr>
          <tr style="border-bottom: 1px solid #dee2e6;">
            <th style="padding: 8px; background: #f8f9fa; text-align: left; color: #495057;">Pembina</th>
            <td style="padding: 8px; color: #212529;">${(reg.pembina || []).map(p => escapeHtml(p.nama)).filter(Boolean).join(" / ") || "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // 2. Tabel Daftar Peserta
  html += `
    <div style="margin-bottom: 20px;">
      <h4 style="margin-bottom: 8px; color: #dc3545; font-size: 15px; font-weight: bold;">Daftar Peserta (${participants.length} Orang)</h4>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 12px; border: 1px solid #dee2e6;">
          <thead>
            <tr style="background-color: #dc3545; color: white; text-align: left;">
              <th style="padding: 6px; width: 30px; text-align: center;">No</th>
              <th style="padding: 6px;">Nama Peserta</th>
              <th style="padding: 6px;">NISN / MIS</th>
              <th style="padding: 6px;">Bidang Giat</th>
            </tr>
          </thead>
          <tbody>
  `;

  if (participants.length === 0) {
    html += `<tr><td colspan="4" style="padding: 10px; text-align: center; color: #6c757d;">Belum ada data peserta.</td></tr>`;
  } else {
    participants.forEach((p, index) => {
      var giatStr = Array.isArray(p.giat) ? p.giat.join(", ") : (p.giat || "-");
      html += `
        <tr style="border-bottom: 1px solid #dee2e6; background-color: ${index % 2 === 0 ? '#ffffff' : '#f8f9fa'};">
          <td style="padding: 6px; text-align: center; font-weight: bold;">${index + 1}</td>
          <td style="padding: 6px; font-weight: bold; color: #212529;">${escapeHtml(p.namaPeserta || "-")}</td>
          <td style="padding: 6px; color: #495057;">${escapeHtml(p.noMisNisn || "-")}</td>
          <td style="padding: 6px; color: #495057;">${escapeHtml(giatStr)}</td>
        </tr>
      `;
    });
  }

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;

  // 3. Status File Bukti Pembayaran (Membaca payment.fileName dari upload.js)
  var fileName = payment.fileName || 
                 state.paymentFileName || 
                 (document.getElementById('file-name')?.innerText) || 
                 (payment.file ? "Bukti_Pembayaran_Terunggah.jpg" : "Belum ada file diunggah");

  html += `
    <div style="margin-bottom: 10px;">
      <h4 style="margin-bottom: 8px; color: #dc3545; font-size: 15px; font-weight: bold;">Bukti Pembayaran</h4>
      <div style="padding: 10px; background: #e9ecef; border-radius: 6px; font-size: 12px; border: 1px solid #ced4da; color: #212529;">
        📎 <strong>File Terpilih:</strong> ${escapeHtml(fileName)}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

// Ekspor fungsi agar bisa dipanggil saat navigasi step
window.renderReview = renderReview;
