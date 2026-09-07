  /**
 * STATE MANAGEMENT & DRAFT SYSTEM — TEMBIKAR 2026
 */
var STORAGE_KEY = 'tembikar_2026_draft';

var GIAT_LIST = [
    "YS Gerakan Kepalangmerahan",
    "YS Donor Darah Sukarela",
    "YS Kesiapsiagaan Bencana",
    "YS Kesehatan Remaja",
    "YS Sanitasi & Kesehatan",
    "YS Pertolongan Pertama",
    "YS Kepemimpinan",
    "Simulasi Pertolongan Pertama",
    "Jurnalistik"
];

var INITIAL_STATE = {
    step: 1,
    registration: {
        unit: "",
        noUnit: "",
        namaPembina: "",
        kontakPerson: "",
        jenjang: ""
    },
    participants: [
        { noMisNisn: "", namaPeserta: "", giat: [] }
    ],
    payment: {
        file: null,      // Data string Base64
        fileName: "",
        fileType: "",
        uploadedAt: null
    }
};

function initStore() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            window.appState = JSON.parse(saved);
        } catch (e) {
            window.appState = JSON.parse(JSON.stringify(INITIAL_STATE));
        }
    } else {
        window.appState = JSON.parse(JSON.stringify(INITIAL_STATE));
    }
}

function saveDraft() {
    if (window.appState) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(window.appState));
    }
}

function clearDraft() {
    localStorage.removeItem(STORAGE_KEY);
    window.appState = JSON.parse(JSON.stringify(INITIAL_STATE));
}

// Inisialisasi state awal
initStore();