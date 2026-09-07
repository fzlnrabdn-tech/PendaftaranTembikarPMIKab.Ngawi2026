/**
 * NAVIGATION & WIZARD CONTROLLER — TEMBIKAR 2026
 */
function goToStep(stepNumber) {
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach(step => step.classList.add('hidden'));

    const targetStep = document.getElementById(`step-${stepNumber}`);
    if (targetStep) {
        targetStep.classList.remove('hidden');
    }

    if (window.appState) {
        window.appState.step = stepNumber;
    }

    // Panggil render HANYA jika berada di step yang relevan
    if (stepNumber === 5 && typeof renderParticipants === 'function') {
        renderParticipants();
    }

    if (stepNumber === 7 && typeof renderReview === 'function') {
        renderReview();
    }

    const totalFormSteps = 7;
    const progressFill = document.getElementById('progress-bar-fill');
    const progressText = document.getElementById('progress-text');

    if (progressFill && progressText) {
        if (stepNumber > totalFormSteps) {
            progressFill.style.width = `100%`;
            progressText.innerText = `Selesai`;
        } else {
            const percentage = Math.round((stepNumber / totalFormSteps) * 100);
            progressFill.style.width = `${percentage}%`;
            progressText.innerText = `Langkah ${stepNumber} dari ${totalFormSteps}`;
        }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', function() {
    // Tombol Mulai
    const btnStart = document.getElementById('btn-start');
    if (btnStart) {
        btnStart.addEventListener('click', function(event) {
            event.preventDefault();
            goToStep(2);
        });
    }

    // Tombol Kartu Jenjang
    const jenjangCards = document.querySelectorAll('.jenjang-card');
    const btnJenjangNext = document.getElementById('btn-jenjang-next');

    jenjangCards.forEach(card => {
        card.addEventListener('click', function() {
            jenjangCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            const selectedJenjang = this.getAttribute('data-jenjang');
            
            // SIMPAN KE JALUR REGISTRATION
            if (window.appState && window.appState.registration) {
                window.appState.registration.jenjang = selectedJenjang;
            }

            const errJenjang = document.getElementById('error-jenjang');
            if (errJenjang) errJenjang.textContent = "";

            if (btnJenjangNext) {
                btnJenjangNext.removeAttribute('disabled');
            }

            if (typeof saveDraft === 'function') saveDraft();
        });
    });

    // Navigasi Lanjut (Dengan Validasi)
    const nextButtons = document.querySelectorAll('.btn-next');
    nextButtons.forEach((btn) => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            if (btn.hasAttribute('disabled')) return;

            const currentStepEl = btn.closest('.wizard-step');
            if (!currentStepEl) return;

            const currentStepId = currentStepEl.id;
            const currentStepNum = parseInt(currentStepId.replace('step-', ''));

            if (!isNaN(currentStepNum)) {
                // JALANKAN VALIDASI SEBELUM PINDAH
                if (typeof validateStep === 'function') {
                    if (validateStep(currentStepNum)) {
                        goToStep(currentStepNum + 1);
                    }
                } else {
                    goToStep(currentStepNum + 1);
                }
            }
        });
    });

    // Navigasi Kembali
    const prevButtons = document.querySelectorAll('.btn-prev');
    prevButtons.forEach((btn) => {
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            const currentStepEl = btn.closest('.wizard-step');
            if (!currentStepEl) return;

            const currentStepId = currentStepEl.id;
            const currentStepNum = parseInt(currentStepId.replace('step-', ''));

            if (!isNaN(currentStepNum) && currentStepNum > 1) {
                goToStep(currentStepNum - 1);
            }
        });
    });

    const btnSubmit = document.getElementById('btn-submit');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', function(event) {
            event.preventDefault();
            if (typeof submitRegistration === 'function') {
                submitRegistration();
            }
        });
    }
});