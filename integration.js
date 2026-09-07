/**
 * BACKEND INTEGRATION — TEMBIKAR 2026
 */
const MOCK_MODE = false; 
const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx04kwaNSAKwm7Fe2Q-R9QLJ4fEgsgjkOMipLGYg8KE_cgZ1bWF6Eoo5HgLsEY5uZKA/exec";

window.appState = window.appState || {};
window.appState.registration = window.appState.registration || {};
window.appState.payment = window.appState.payment || {};

async function submitRegistration() {
    const btnSubmit = document.getElementById('btn-submit');
    let iframe;
    let form;

    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Mengirim Data...";
    }

    try {
        // 1. Kumpulkan data Pembina & Peserta dari DOM HTML
        const formExtra = collectFormData();

        // 2. Buat ID Registrasi unik
        const regNumber = "TBK-2026-" + Math.floor(100000 + Math.random() * 900000);

        // Ambil data file bukti dari appState (yang dibuat oleh upload.js)
        const paymentState = window.appState?.payment || {};

        const payload = {
            registrationNumber: regNumber,
            registration: formExtra.registration,
            participants: formExtra.peserta,
            paymentUrl: paymentState.fileName || "Uploaded",
            
            // --- INTEGRASI GOOGLE DRIVE ---
            paymentBase64: paymentState.file || "",
            paymentMimeType: paymentState.fileType || "image/jpeg"
        };

        if (MOCK_MODE) {
            setTimeout(() => {
                handlePostSubmit({ status: "SUCCESS", registrationNumber: regNumber });
            }, 1000);
            return;
        }

        // 4. Kirim data ke Apps Script via Hidden Form + iframe (Anti-Stuck/Anti-CORS)
        const iframeName = 'hidden_iframe_' + Date.now();
        iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);

        form = document.createElement('form');
        form.method = 'POST';
        form.action = GAS_WEB_APP_URL;
        form.target = iframeName;

        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'postData';
        input.value = JSON.stringify(payload);
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();

        // Jeda 3.5 detik untuk memberi waktu upload file Base64 via jaringan HP
        setTimeout(() => {
            if (form?.parentNode) form.parentNode.removeChild(form);
            if (iframe?.parentNode) iframe.parentNode.removeChild(iframe);
            handlePostSubmit({ status: "SUCCESS", registrationNumber: regNumber });
        }, 3500);

    } catch (error) {
        console.error("Gagal mengirim data:", error);
        if (form?.parentNode) form.parentNode.removeChild(form);
        if (iframe?.parentNode) iframe.parentNode.removeChild(iframe);
        alert("Terjadi kesalahan saat mengirim data. Silakan coba lagi.");
        if (btnSubmit) {
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Kirim Pendaftaran";
        }
    }
}

function handlePostSubmit(result = {}) {
    if (typeof clearDraft === 'function') {
        clearDraft();
    }

    // 1. Tampilkan Nomor Registrasi
    const regNumEl = document.getElementById('success-reg-number');
    if (regNumEl) {
        regNumEl.textContent = result?.registrationNumber || '-';
    }

    // 2. Tampilkan Tombol Link Grup WhatsApp
    const waLink = result?.groupUrl || "https://chat.whatsapp.com/IEmoiTRIGLgH4FoUCu4E7O?s=cl&p=a&mlu=4&ilr=4";
    const groupContainer = document.getElementById('group-wa-container');
    if (groupContainer) {
        groupContainer.innerHTML = `
            <div style="margin-top: 15px; padding: 15px; background-color: #e8f5e9; border: 1px solid #c8e6c9; border-radius: 8px;">
                <p style="margin-bottom: 10px; font-weight: bold; color: #2e7d32;">Silakan bergabung ke Grup WhatsApp Peserta:</p>
                <a href="${waLink}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #25D366; color: white; border-radius: 6px; text-decoration: none; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    Gabung Grup WhatsApp
                </a>
            </div>
        `;
    }

    // 3. Pindah ke Step 8 (Halaman Sukses)
    if (typeof goToStep === 'function') {
        goToStep(8);
    } else {
        alert("Pendaftaran Berhasil!\nNomor Registrasi: " + (result?.registrationNumber || '-'));
    }
}

function collectFormData() {
    const getInputValue = (...ids) => {
        for (const id of ids) {
            const value = document.getElementById(id)?.value?.trim?.();
            if (value) return value;
        }
        return "";
    };

    const unit = getInputValue("unit-name", "unit");
    const noUnit = getInputValue("unit-number", "noUnit");
    const contactName = getInputValue("contact-name", "cpNama");
    const contactPhone = getInputValue("contact-phone", "cpKontak");

    // 1. Data Pembina (dengan Safe Optional Chaining)
    const pembina1Nama = document.getElementById("pembina_nama_1")?.value?.trim() || "";
    const pembina1Nip  = document.getElementById("pembina_nip_1")?.value?.trim() || "";
    const pembina2Nama = document.getElementById("pembina_nama_2")?.value?.trim() || "";
    const pembina2Nip  = document.getElementById("pembina_nip_2")?.value?.trim() || "";

    const pembina = [];
    if (pembina1Nama) {
        pembina.push({ ket: "Pembina 1", nama: pembina1Nama, nip: pembina1Nip });
    }
    if (pembina2Nama) {
        pembina.push({ ket: "Pembina 2", nama: pembina2Nama, nip: pembina2Nip });
    }

    // 2. Data Peserta (Pengaman jika dibuka via HP/Browser Mobile)
    const peserta = [];
    const tableBody = document.getElementById("table-peserta-body");
    if (tableBody) {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row) => {
            if (!row) return;

            const bidang = row?.cells?.[0]?.innerText?.trim?.() || "";
            const namaInput = row?.querySelector?.(".peserta-nama");
            const nisnInput = row?.querySelector?.(".peserta-nisn");

            const namaVal = namaInput?.value?.trim?.() || "";
            const nisnVal = nisnInput?.value?.trim?.() || "";

            if (namaVal !== "") {
                peserta.push({
                    namaPeserta: namaVal,
                    noMisNisn: nisnVal,
                    giat: [bidang]
                });
            }
        });
    }

    return {
        registration: {
            unit: unit,
            noUnit: noUnit,
            contactName: contactName,
            contactPhone: contactPhone,
            contactPerson: contactName,
            kontakPerson: contactName ? `${contactName} (${contactPhone})` : contactPhone,
            jenjang: window.appState?.registration?.jenjang || window.appState?.jenjang || "MULA",
            pembina: pembina
        },
        pembina: pembina,
        peserta: peserta,
        kontakPerson: contactName ? `${contactName} (${contactPhone})` : contactPhone
    };
}