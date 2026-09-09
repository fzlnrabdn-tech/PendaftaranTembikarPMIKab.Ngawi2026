/**
 * UPLOAD BUKTI PEMBAYARAN SYSTEM — TEMBIKAR 2026
 */
function initUpload() {
    var dropzone = document.getElementById('dropzone');
    var fileInput = document.getElementById('file-payment');
    var btnBrowse = document.getElementById('btn-browse');
    var fileInfo = document.getElementById('file-info');
    var fileNameEl = document.getElementById('file-name');
    var btnRemove = document.getElementById('btn-remove-file');
    var errFile = document.getElementById('error-file');

    if (!dropzone || !fileInput) return;

    // Pastikan objek appState aman
    window.appState = window.appState || {};
    window.appState.payment = window.appState.payment || { file: null, fileName: "", fileType: "", uploadedAt: null };

    // Buka dialog file
    if (btnBrowse) {
        btnBrowse.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
        });
    }

    // Event Drag and Drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function(eventName) {
        dropzone.addEventListener(eventName, function(e) {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(function(eventName) {
        dropzone.addEventListener(eventName, function() {
            dropzone.style.borderColor = '#2563eb';
            dropzone.style.background = '#eff6ff';
        }, false);
    });

    ['dragleave', 'drop'].forEach(function(eventName) {
        dropzone.addEventListener(eventName, function() {
            dropzone.style.borderColor = '#d1d5db';
            dropzone.style.background = '#ffffff';
        }, false);
    });

    dropzone.addEventListener('drop', function(e) {
        var dt = e.dataTransfer;
        var files = dt.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    });

    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            handleFileSelect(this.files[0]);
        }
    });

    // Hapus Berkas
    if (btnRemove) {
        btnRemove.addEventListener('click', function(e) {
            e.preventDefault();
            window.appState.payment = { file: null, fileName: "", fileType: "", uploadedAt: null };
            fileInput.value = "";
            if (fileInfo) fileInfo.classList.add('hidden');
            if (dropzone) dropzone.classList.remove('hidden');
            if (errFile) errFile.textContent = "";
            if (typeof saveDraft === 'function') saveDraft();
        });
    }

    // Tampilkan ulang jika ada data draft file
    if (window.appState.payment && window.appState.payment.fileName) {
        if (fileNameEl) fileNameEl.textContent = window.appState.payment.fileName;
        if (fileInfo) fileInfo.classList.remove('hidden');
        if (dropzone) dropzone.classList.add('hidden');
    }
}

function handleFileSelect(file) {
    var errFile = document.getElementById('error-file');
    var maxMB = 5;

    if (!file || typeof file.size !== 'number') {
        if (errFile) errFile.textContent = "Berkas tidak valid.";
        return;
    }
    
    if (file.size > maxMB * 1024 * 1024) {
        if (errFile) errFile.textContent = "Ukuran file maksimal " + maxMB + "MB.";
        return;
    }

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
        window.appState = window.appState || {};
        window.appState.payment = {
            file: reader.result,
            fileName: file.name,
            fileType: file.type || "image/jpeg",
            uploadedAt: new Date().toISOString()
        };

        var fileInfo = document.getElementById('file-info');
        var fileNameEl = document.getElementById('file-name');
        var dropzone = document.getElementById('dropzone');

        if (fileNameEl) fileNameEl.textContent = file.name;
        if (fileInfo) fileInfo.classList.remove('hidden');
        if (dropzone) dropzone.classList.add('hidden');
        if (errFile) errFile.textContent = "";

        if (typeof saveDraft === 'function') saveDraft();
    };

    reader.onerror = function() {
        if (errFile) errFile.textContent = "Gagal membaca berkas.";
    };
}

document.addEventListener('DOMContentLoaded', initUpload);
