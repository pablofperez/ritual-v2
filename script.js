
document.addEventListener('DOMContentLoaded', () => {
    const app = {
        currentTheme: localStorage.getItem('theme') || 'hoja',
        allSteps: {
            'limpieza': {
                icon: 'fa-shower',
                title: 'Limpieza',
                product: 'CeraVe o Cetaphil Limpiador',
                explanation: 'Aplicá sobre el rostro húmedo, masajeá suavemente y enjuagá con agua tibia.'
            },
            'glicolico': {
                icon: 'fa-flask',
                title: 'Glicólico',
                product: 'The Ordinary Glycolic Acid 7%',
                explanation: 'Aplicá con un pad de algodón por la noche, 2 veces por semana. No enjuagar. No mezclar con otros ácidos.'
            },
            'hyalu': {
                icon: 'fa-tint',
                title: 'Hyalu B5',
                product: 'La Roche-Posay Hyalu B5 Serum',
                explanation: 'Aplicá 2-3 gotas sobre la piel limpia y húmeda, presionando con las palmas.'
            },
            'contorno': {
                icon: 'fa-eye',
                title: 'Contorno de ojos',
                product: 'The Ordinary Caffeine Solution 5% + EGCG',
                explanation: 'Aplicá una gota en la yema del dedo anular y colocá con golpecitos suaves en el contorno.'
            },
            'hidratante': {
                icon: 'fa-pump-soap',
                title: 'Hidratante',
                product: 'CeraVe Loción Hidratante o Avène Cicalfate',
                explanation: 'Aplicá una capa ligera en rostro y cuello.'
            },
            'protector': {
                icon: 'fa-sun',
                title: 'Protector solar',
                product: 'Avène Mat Perfect FPS 50+ con color',
                explanation: 'Aplicá 2 dedos de producto cada mañana como último paso. Reaplicá si estás al aire libre.'
            }
        }
    };

    const elements = {
        themeIcon: document.getElementById('theme-icon'),
        themeOptions: document.querySelectorAll('.theme-option'),
        ritualSteps: document.querySelector('.ritual-steps'),
        resetBtn: document.getElementById('reset-btn'),
        explanationModal: document.getElementById('explanation-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalExplanation: document.getElementById('modal-explanation'),
        closeModalBtns: document.querySelectorAll('.close-modal')
    };

    function getRoutine(theme) {
        const day = new Date().getDay();
        const isGlycolicDay = (day === 2 || day === 5);
        if (theme === 'hoja') {
            return isGlycolicDay
                ? ['limpieza', 'glicolico', 'hyalu', 'contorno', 'hidratante', 'protector']
                : ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'];
        } else {
            return isGlycolicDay
                ? ['limpieza', 'glicolico', 'hidratante']
                : ['limpieza', 'hidratante'];
        }
    }

    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        app.currentTheme = theme;
        localStorage.setItem('theme', theme);
        elements.themeIcon.className = theme === 'hoja' ? 'fas fa-leaf' : 'fas fa-moon';
        activateThemeOption(theme);
        loadRoutine();
    }

    function activateThemeOption(theme) {
        elements.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
    }

    function loadRoutine() {
        const today = new Date().getDay();
        const isGlycolicDay = (today === 2 || today === 5);

        elements.ritualSteps.innerHTML = '';
        if (isGlycolicDay) {
            const notice = document.createElement('div');
            notice.className = 'daily-quote';
            notice.style.color = 'var(--accent-color)';
            notice.textContent = 'Hoy es día de exfoliación';
            elements.ritualSteps.appendChild(notice);
        }

        const steps = getRoutine(app.currentTheme);
        steps.forEach((key, index) => {
            const step = app.allSteps[key];
            const stepEl = document.createElement('div');
            stepEl.className = 'step-item';
            stepEl.innerHTML = `
                <div class="step-icon"><i class="fas ${step.icon}"></i></div>
                <div class="step-text"><h3>${step.title}</h3></div>
                <div class="info-btn" data-step="${key}"><i class="fas fa-question"></i></div>
                <label class="step-checkbox">
                    <input type="checkbox" data-step="${key}">
                    <span class="checkmark"></span>
                </label>
            `;

            stepEl.querySelector('.info-btn').addEventListener('click', () => {
                showExplanation(step);
            });

            stepEl.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
                saveCheckboxState(key, e.target.checked);
            });

            elements.ritualSteps.appendChild(stepEl);
        });

        loadSavedCheckboxStates();
    }

    function showExplanation(step) {
        elements.modalTitle.textContent = step.product;
        elements.modalExplanation.textContent = step.explanation;
        elements.explanationModal.style.display = 'flex';
    }

    function resetRoutine() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
            localStorage.removeItem(`step_${cb.dataset.step}_${app.currentTheme}`);
        });
    }

    function saveCheckboxState(stepKey, isChecked) {
        localStorage.setItem(`step_${stepKey}_${app.currentTheme}`, isChecked);
    }

    function loadSavedCheckboxStates() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const saved = localStorage.getItem(`step_${cb.dataset.step}_${app.currentTheme}`);
            if (saved === 'true') cb.checked = true;
        });
    }

    elements.themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            applyTheme(option.dataset.theme);
        });
    });

    elements.resetBtn.addEventListener('click', resetRoutine);

    elements.closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.explanationModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target === elements.explanationModal) {
            elements.explanationModal.style.display = 'none';
        }
    });

    applyTheme(app.currentTheme);
});
