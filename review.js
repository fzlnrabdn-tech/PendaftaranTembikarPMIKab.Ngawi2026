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
    var container = document.getElementById('review-content');
    if (!container) return;

    var state = window.appState || {};
    var reg = state.registration || {};
    var payment = state.payment || {};

    // Ambil data Contact Person dari HTML
    var cpNama = document.getElementById('cpNama')?.value.trim() || '-';
    var cpKontak = document.getElementById('cpKontak')?.value.trim() || '-';

    // Ambil data Pembina dari HTML
    var p1Nama = document.getElementById('pembina_nama_1')?.value.trim() || '-';
    var p1Nip  = document.getElementById('pembina_nip_1')?.value.trim() || '-';
    var p2Nama = document.getElementById('pembina_nama_2')?.value.trim() || '-';
    var p2Nip  = document.getElementById('pembina_nip_2')?.value.trim() || '-';

    // Ambil data Peserta dari HTML
    var pesertaList = [];
    var tableBody = document.getElementById('table-peserta-body');
    if (tableBody) {
        var rows = tableBody.querySelectorAll('tr');
        rows.forEach(function(row) {
            var bidang = row.cells[0]?.innerText.trim() || '';
            var nama = row.querySelector('.peserta-nama')?.value.trim() || '';
            var nisn = row.querySelector('.peserta-nisn')?.value.trim() || '';

            if (nama !== '') {
                pesertaList.push({ bidang: bidang, nama: nama, nisn: nisn });
            }
        });
    }

    var participantsHtml = pesertaList.map(function(p, idx) {
        return '<div style="margin-bottom: 8px; padding-bottom: 8px; border-bottom: 1px dashed #e5e7eb;">' +
            '<strong>#' + (idx + 1) + ' ' + escapeHtml(p.nama) + '</strong> (' + escapeHtml(p.nisn || '-') + ')<br>' +
            '<small style="color: #6b7280;">Bidang: ' + escapeHtml(p.bidang) + '</small>' +
        '</div>';
    }).join('');

    container.innerHTML = 
        '<div style="font-size: 13px; line-height: 1.6; text-align: left;">' +
            '<p><strong>Jenjang:</strong> ' + escapeHtml(reg.jenjang || '-') + '</p>' +
            '<p><strong>Unit / Sekolah:</strong> ' + escapeHtml(document.getElementById('unit')?.value || '-') + ' (No. Unit: ' + escapeHtml(document.getElementById('noUnit')?.value || '-') + ')</p>' +
            '<p><strong>Contact Person:</strong> ' + escapeHtml(cpNama) + ' (' + escapeHtml(cpKontak) + ')</p>' +
            '<p><strong>Pembina 1:</strong> ' + escapeHtml(p1Nama) + ' (' + escapeHtml(p1Nip) + ')</p>' +
            (p2Nama !== '-' ? '<p><strong>Pembina 2:</strong> ' + escapeHtml(p2Nama) + ' (' + escapeHtml(p2Nip) + ')</p>' : '') +
            '<hr style="margin: 12px 0; border: none; border-top: 1px solid #e5e7eb;">' +
            '<p><strong>Daftar Peserta Terisi (' + pesertaList.length + ' orang):</strong></p>' +
            (participantsHtml || '<p style="color:red;">Belum ada peserta yang diisi.</p>') +
            '<p style="margin-top:12px;"><strong>Bukti Pembayaran:</strong> ' + escapeHtml(payment.fileName || 'Belum diunggah') + '</p>' +
        '</div>';
}

document.addEventListener('DOMContentLoaded', function() {
    var stepTarget = document.getElementById('step-7');
    if (stepTarget) {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class' && (stepTarget.classList.contains('active') || !stepTarget.classList.contains('hidden'))) {
                    renderReview();
                }
            });
        });
        observer.observe(stepTarget, { attributes: true });
    }
});