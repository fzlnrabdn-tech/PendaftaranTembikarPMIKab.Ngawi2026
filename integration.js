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
    let iframe, form;

    if (btnSubmit) {
        btnSubmit.disabled = true;
        btnSubmit.innerText = "Mengirim Data...";
    }

    try {
        const formData = collectFormData();
        const regNumber = "TBK-2026-" + Math.floor(100000 + Math.random() * 900000);
        const paymentState = window.appState?.payment || {};

        const payload = {
            registrationNumber: regNumber,
            registration: formData.registration,
            participants: formData.participants,
            paymentUrl: paymentState.fileName || "Uploaded",
            paymentBase64: paymentState.file || "",
            paymentMimeType: paymentState.fileType || "image/jpeg"
        };

        if (MOCK_MODE) {
            setTimeout(() => {
                handlePostSubmit({ status: "SUCCESS", registrationNumber: regNumber });
            }, 1000);
            return;
        }

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

        setTimeout(() => {
            if (form?.parentNode) form.parentNode.removeChild(form);
            if (iframe?.parentNode) iframe.parentNode.removeChild(iframe);
            handlePostSubmit({ status: "SUCCESS", registrationNumber: regNumber });
        }, 4000);

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

    const regNumEl = document.getElementById('success-reg-number');
    if (regNumEl) {
        regNumEl.textContent = result?.registrationNumber || '-';
    }

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

    if (typeof goToStep === 'function') {
        goToStep(8);
    } else {
        alert("Pendaftaran Berhasil!\nNomor Registrasi: " + (result?.registrationNumber || '-'));
    }
}

function collectFormData() {
    const getInputValue = (...ids) => {
        for (const id of ids) {
            const el = document.getElementById(id);
            const value = el?.value?.trim?.();
            if (value) return value;
        }
        return "";
    };

    const unit = getInputValue("unit");
    const noUnit = getInputValue("noUnit");
    const contactName = getInputValue("cpNama");
    const contactPhone = getInputValue("cpKontak");

    // 1. AMBIL JENJANG
    const selectedCard = document.querySelector('.jenjang-card.selected');
    let rawJenjang = selectedCard?.getAttribute('data-jenjang') || 
                     window.appState?.registration?.jenjang || 
                     "MULA";
    let jenjangVal = String(rawJenjang).toUpperCase().trim();

    // 2. AMBIL DATA PEMBINA
    const pembinaList = [];
    const p1Nama = getInputValue("pembina_nama_1");
    const p1Nip = getInputValue("pembina_nip_1");
    if (p1Nama) {
        pembinaList.push({ nama: p1Nama, nip: p1Nip || "-", ket: "Pembina 1" });
    }

    const p2Nama = getInputValue("pembina_nama_2");
    const p2Nip = getInputValue("pembina_nip_2");
    if (p2Nama) {
        pembinaList.push({ nama: p2Nama, nip: p2Nip || "-", ket: "Pembina 2" });
    }

    // 3. AMBIL DATA PESERTA
    const participants = [];
    const tableBody = document.getElementById("table-peserta-body");
    if (tableBody) {
        const rows = tableBody.querySelectorAll("tr");
        rows.forEach((row) => {
            const namaInput = row.querySelector(".peserta-nama");
            const nisnInput = row.querySelector(".peserta-nisn");
            const bidangCell = row.cells[0]?.innerText?.trim() || "-";

            const namaVal = namaInput?.value?.trim() || "";
            const nisnVal = nisnInput?.value?.trim() || "";

            if (namaVal !== "") {
                participants.push({
                    namaPeserta: namaVal,
                    noMisNisn: nisnVal || "-",
                    giat: bidangCell
                });
            }
        });
    }

    const registrationData = {
        unit: unit || "-",
        noUnit: noUnit || "-",
        contactName: contactName || "-",
        contactPhone: contactPhone || "-",
        jenjang: jenjangVal,
        pembina: pembinaList
    };

    window.appState.registration = registrationData;
    window.appState.participants = participants;

    return {
        registration: registrationData,
        participants: participants
    };
} 
