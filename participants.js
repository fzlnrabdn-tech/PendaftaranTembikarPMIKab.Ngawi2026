/**
 * PARTICIPANTS FORM BUILDER — TEMBIKAR 2026
 */
const listBidangLomba = [
  "YS Gerakan Kepalangmerahan",
  "YS Donor Darah Sukarela",
  "YS Sanitasi & Kesehatan",
  "YS Kesehatan Remaja",
  "YS Kesiapsiagaan Bencana",
  "YS Pertolongan Pertama",
  "YS Kepemimpinan",
  "Simulasi Pertolongan Pertama",
  "Simulasi Pertolongan Pertama",
  "Simulasi Pertolongan Pertama",
  "Jurnalistik - LRC",
  "Jurnalistik - LRC"
];

// 1. Fungsi Membuat Tabel Peserta
function renderPesertaTable() {
  const tbody = document.getElementById("table-peserta-body");
  if (!tbody) return;

  tbody.innerHTML = "";

  listBidangLomba.forEach((bidang, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${bidang}</strong></td>
      <td>
        <input type="text" class="peserta-nama" data-index="${index}" placeholder="Nama Peserta">
      </td>
      <td>
        <input type="text" class="peserta-nisn" data-index="${index}" placeholder="NISN/MIS">
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Pasang event listener agar setiap kali disetik langsung masuk appState
  attachInputListeners();
}

// 2. Fungsi Mengambil Data Input & Menyimpan ke appState
function collectParticipantData() {
  if (!window.appState) return;

  const namaInputs = document.querySelectorAll('.peserta-nama');
  const nisnInputs = document.querySelectorAll('.peserta-nisn');
  
  const participants = [];

  namaInputs.forEach((input, index) => {
    const nama = input.value.trim();
    const nisn = nisnInputs[index] ? nisnInputs[index].value.trim() : "";
    const bidang = listBidangLomba[index];

    // Hanya simpan baris yang diisi nama pesertanya
    if (nama !== "") {
      participants.push({
        namaPeserta: nama,
        noMisNisn: nisn,
        giat: bidang
      });
    }
  });

  window.appState.participants = participants;

  // Tarik juga data Pembina & Contact Person dari DOM jika ada
  if (window.appState.registration) {
    const pembinaEl = document.getElementById('pembinaNama') || document.querySelector('input[name="pembina"]');
    const cpEl = document.getElementById('cpNama') || document.querySelector('input[name="contactPerson"]');
    
    if (pembinaEl && pembinaEl.value) window.appState.registration.namaPembina = pembinaEl.value.trim();
    if (cpEl && cpEl.value) window.appState.registration.kontakPerson = cpEl.value.trim();
  }

  if (typeof saveDraft === 'function') saveDraft();
}

function attachInputListeners() {
  const inputs = document.querySelectorAll('.peserta-nama, .peserta-nisn');
  inputs.forEach(input => {
    input.addEventListener('input', collectParticipantData);
  });
}

// 3. Pasang Event Listener saat Halaman di-load & Navigasi
document.addEventListener("DOMContentLoaded", function() {
  renderPesertaTable();

  // Dengarkan klik tombol navigasi Lanjut/Berikutnya untuk paksa sync data sebelum pindah Step
  document.addEventListener('click', function(e) {
    if (e.target && (e.target.classList.contains('btn-next') || e.target.id === 'btn-submit')) {
      collectParticipantData();
      if (typeof window.renderReview === 'function') {
        window.renderReview();
      }
    }
  });
});
