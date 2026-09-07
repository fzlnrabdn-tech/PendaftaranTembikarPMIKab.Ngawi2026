/**
 * VALIDATION SYSTEM — TEMBIKAR 2026
 */
function validateStep(stepNumber) {
    var isValid = true;

    // Helper reset error
    function setError(id, message) {
        var el = document.getElementById(id);
        if (el) el.textContent = message || '';
    }

    if (stepNumber === 2) {
        // Validasi Jenjang
        var jenjang = window.appState && window.appState.registration ? window.appState.registration.jenjang : null;
        if (!jenjang) {
            setError('error-jenjang', 'Silakan pilih jenjang lomba terlebih dahulu.');
            isValid = false;
        } else {
            setError('error-jenjang', '');
        }
    } 
    else if (stepNumber === 3) {
        // Validasi Data Unit
        var unitInput = document.getElementById('unit');
        var noUnitInput = document.getElementById('noUnit');
        var cpNamaInput = document.getElementById('cpNama');
        var cpKontakInput = document.getElementById('cpKontak');

        var unitVal = unitInput ? unitInput.value.trim() : '';
        var noUnitVal = noUnitInput ? noUnitInput.value.trim() : '';
        var cpNamaVal = cpNamaInput ? cpNamaInput.value.trim() : '';
        var cpKontakVal = cpKontakInput ? cpKontakInput.value.trim() : '';

        if (!unitVal) {
            setError('error-unit', 'Nama Sekolah / Unit wajib diisi.');
            isValid = false;
        } else {
            setError('error-unit', '');
        }

        if (!noUnitVal) {
            setError('error-noUnit', 'Nomor Unit wajib diisi.');
            isValid = false;
        } else {
            setError('error-noUnit', '');
        }

        if (!cpNamaVal) {
            setError('error-cpNama', 'Nama Contact Person wajib diisi.');
            isValid = false;
        } else {
            setError('error-cpNama', '');
        }

        if (!cpKontakVal) {
            setError('error-cpKontak', 'Nomor Kontak / WhatsApp wajib diisi.');
            isValid = false;
        } else {
            setError('error-cpKontak', '');
        }

        if (isValid && window.appState && window.appState.registration) {
            window.appState.registration.unit = unitVal;
            window.appState.registration.noUnit = noUnitVal;
            window.appState.registration.cpNama = cpNamaVal;
            window.appState.registration.cpKontak = cpKontakVal;
        }
    } 
    else if (stepNumber === 4) {
        // Validasi Data Pembina
        var p1Nama = document.getElementById('pembina_nama_1') ? document.getElementById('pembina_nama_1').value.trim() : '';
        
        if (!p1Nama) {
            alert('Harap isi Nama Pembina 1.');
            isValid = false;
        }
    } 
    else if (stepNumber === 5) {
        // Validasi Data Peserta Tabel Statis
        var namaInputs = document.querySelectorAll('.peserta-nama');
        var nisnInputs = document.querySelectorAll('.peserta-nisn');
        var adaPesertaDiisi = false;

        for (var i = 0; i < namaInputs.length; i++) {
            var namaVal = namaInputs[i].value.trim();
            var nisnVal = nisnInputs[i] ? nisnInputs[i].value.trim() : '';

            // Jika nama diisi tetapi NISN kosong
            if (namaVal !== '' && nisnVal === '') {
                alert('Peringatan: Peserta pada baris ke-' + (i + 1) + ' (' + namaVal + ') belum mengisi No. MIS / NISN.');
                isValid = false;
                break;
            }

            if (namaVal !== '') {
                adaPesertaDiisi = true;
            }
        }

        if (isValid && !adaPesertaDiisi) {
            alert('Harap isi minimal 1 nama peserta.');
            isValid = false;
        }
    } 
    else if (stepNumber === 6) {
        // Validasi Upload Bukti Bayar
        var payment = window.appState ? window.appState.payment : null;
        if (!payment || !payment.fileName) {
            setError('error-file', 'Silakan unggah berkas bukti pembayaran.');
            isValid = false;
        } else {
            setError('error-file', '');
        }
    }

    if (isValid && typeof saveDraft === 'function') {
        saveDraft();
    }

    return isValid;
}