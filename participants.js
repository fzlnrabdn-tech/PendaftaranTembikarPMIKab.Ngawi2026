  /**
 * PARTICIPANTS FORM BUILDER — TEMBIKAR 2026
 */
// Daftar Bidang Lomba sesuai urutan spreadsheet
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

// Fungsi untuk membuat baris input peserta secara statis
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
}

// Jalankan saat dokumen selesai di-load
document.addEventListener("DOMContentLoaded", renderPesertaTable);


function updateParticipantData(index, field, value) {
    if (window.appState.participants[index]) {
        window.appState.participants[index][field] = value;
        if (typeof saveDraft === 'function') saveDraft();
    }
}

function updateParticipantGiat(index, giatName, isChecked) {
    if (!window.appState.participants[index]) return;
    if (!window.appState.participants[index].giat) {
        window.appState.participants[index].giat = [];
    }

    var list = window.appState.participants[index].giat;
    if (isChecked) {
        if (list.indexOf(giatName) === -1) list.push(giatName);
    } else {
        window.appState.participants[index].giat = list.filter(function(g) { return g !== giatName; });
    }
    if (typeof saveDraft === 'function') saveDraft();
}

function addParticipant() {
    window.appState.participants.push({ noMisNisn: "", namaPeserta: "", giat: [] });
    renderParticipants();
    if (typeof saveDraft === 'function') saveDraft();
}

function removeParticipant(index) {
    if (window.appState.participants.length > 1) {
        window.appState.participants.splice(index, 1);
        renderParticipants();
        if (typeof saveDraft === 'function') saveDraft();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderParticipants();

    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'btn-add-participant') {
            e.preventDefault();
            addParticipant();
        }
    });

    var stepTarget = document.getElementById('step-5');
    if (stepTarget) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class' && !stepTarget.classList.contains('hidden')) {
                    renderParticipants();
                }
            });
        });
        observer.observe(stepTarget, { attributes: true });
    }
});