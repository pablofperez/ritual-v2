document.addEventListener('DOMContentLoaded', () => {
    // ... todo tu código ...
const app = { currentTheme: localStorage.getItem('theme') || 'hoja', todaySteps: [], allSteps: { 'limpieza': { icon: 'fa-shower', title: 'Limpieza', product: 'CeraVe o Cetaphil Limpiador', explanation: 'Aplicá sobre el rostro húmedo, masajeá suavemente y enjuagá con agua tibia.' }, 'glicolico': { icon: 'fa-flask', title: 'Glicólico', product: 'The Ordinary Glycolic Acid 7%', explanation: 'Aplicá con un pad de algodón por la noche, 2 veces por semana. No enjuagar. No mezclar con otros ácidos.' }, 'hyalu': { icon: 'fa-droplet', title: 'Hyalu B5', product: 'La Roche-Posay Hyalu B5 Serum', explanation: 'Aplicá 2-3 gotas sobre la piel limpia y húmeda, presionando con las palmas.' }, 'contorno': { icon: 'fa-eye', title: 'Contorno de ojos', product: 'The Ordinary Caffeine Solution 5% + EGCG', explanation: 'Aplicá una gota en la yema del dedo anular y colocá con golpecitos suaves en el contorno.' }, 'hidratante': { icon: 'fa-bottle-water', title: 'Hidratante', product: 'CeraVe Loción Hidratante o Avène Cicalfate', explanation: 'Aplicá una capa ligera en rostro y cuello.' }, 'protector': { icon: 'fa-sun', title: 'Protector solar', product: 'Avène Mat Perfect FPS 50+ con color', explanation: 'Aplicá 2 dedos de producto cada mañana como último paso. Reaplicá si estás al aire libre.' } }, routines: { 0: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], 1: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], 2: ['limpieza', 'glicolico', 'hyalu', 'contorno', 'hidratante', 'protector'], 3: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], 4: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], 5: ['limpieza', 'glicolico', 'hyalu', 'contorno', 'hidratante', 'protector'], 6: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'] }, quotes: { 1: "Empieza la semana brillando desde adentro.", 2: "Tu constancia es tu mejor aliada.", 3: "Cada ritual te acerca a tu mejor versión.", 4: "Tu piel habla de cómo te cuidás.", 5: "Terminá la semana cuidándote con intención.", 6: "El ritual también es descanso.", 0: "Tu momento. Tu ritual." }, weekDays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] }; const elements = { themeIcon: document.getElementById('theme-icon'), themeOptions: document.querySelectorAll('.theme-option'), ritualSteps: document.querySelector('.ritual-steps'), dailyQuote: document.querySelector('.daily-quote'), summary: document.querySelector('.summary'), weeklySummary: document.getElementById('weekly-summary'), allDays: document.querySelectorAll('.day'), resetBtn: document.getElementById('reset-btn'), viewAllBtn: document.getElementById('view-all-btn'), explanationModal: document.getElementById('explanation-modal'), modalTitle: document.getElementById('modal-title'), modalExplanation: document.getElementById('modal-explanation'), closeModalBtns: document.querySelectorAll('.close-modal'), allRoutinesModal: document.getElementById('all-routines-modal'), allRoutinesContent: document.querySelector('.all-routines-content') };
    function init() {
        applyTheme(app.currentTheme);
        activateThemeOption(app.currentTheme);
        const today = new Date().getDay();
        app.todaySteps = app.routines[today];
        elements.dailyQuote.textContent = app.quotes[today];
        loadTodaySteps();
        if (today === 0) {
            loadWeeklySummary();
            elements.weeklySummary.style.display = 'block';
        }
        elements.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                applyTheme(theme);
                activateThemeOption(theme);
                localStorage.setItem('theme', theme);
            });
        });
        elements.resetBtn.addEventListener('click', resetRoutine);
        elements.viewAllBtn.addEventListener('click', showAllRoutines);
        elements.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.explanationModal.style.display = 'none';
                elements.allRoutinesModal.style.display = 'none';
            });
        });
        window.addEventListener('click', (e) => {
            if (e.target === elements.explanationModal) {
                elements.explanationModal.style.display = 'none';
            }
            if (e.target === elements.allRoutinesModal) {
                elements.allRoutinesModal.style.display = 'none';
            }
        });
        checkCompletionStatus();
    }
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        app.currentTheme = theme;
        elements.themeIcon.className = theme === 'hoja' ? 'fas fa-leaf' : 'fas fa-moon';
    }
    function activateThemeOption(theme) {
        elements.themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
    }
    function loadTodaySteps() {
        elements.ritualSteps.innerHTML = '';
        app.todaySteps.forEach((stepKey, index) => {
            const step = app.allSteps[stepKey];
            const stepEl = createStepElement(step, stepKey, index);
            elements.ritualSteps.appendChild(stepEl);
        });
        loadSavedCheckboxStates();
    }
    function createStepElement(step, stepKey, index) {
        const stepItem = document.createElement('div');
        stepItem.className = 'step-item fade-in';
        stepItem.style.animationDelay = `${index * 0.1}s`;
        stepItem.innerHTML = `
            <div class="step-icon"><i class="fas ${step.icon}"></i></div>
            <div class="step-text"><h3>${step.title}</h3></div>
            <div class="info-btn" data-step="${stepKey}"><i class="fas fa-question"></i></div>
            <label class="step-checkbox">
                <input type="checkbox" data-step="${stepKey}">
                <span class="checkmark"></span>
            </label>
        `;
        stepItem.querySelector('.info-btn').addEventListener('click', () => {
            showExplanation(step);
        });
        stepItem.querySelector('input[type="checkbox"]').addEventListener('change', (e) => {
            saveCheckboxState(stepKey, e.target.checked);
            checkCompletionStatus();
        });
        return stepItem;
    }
    function showExplanation(step) {
        elements.modalTitle.textContent = step.product;
        elements.modalExplanation.textContent = step.explanation;
        elements.explanationModal.style.display = 'flex';
    }
    function resetRoutine() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        const today = new Date().getDay();
        app.todaySteps.forEach(step => {
            localStorage.removeItem(`step_${step}_${today}`);
        });
        elements.summary.style.display = 'none';
    }
    function showAllRoutines() {
        elements.allRoutinesContent.innerHTML = '';
        for (let i = 0; i <= 6; i++) {
            const dayRoutine = document.createElement('div');
            dayRoutine.className = 'day-routine';
            let dayContent = `<h4>${app.weekDays[i]}</h4><ul>`;
            app.routines[i].forEach(stepKey => {
                const step = app.allSteps[stepKey];
                dayContent += `<li>${step.title}</li>`;
            });
            dayContent += `</ul>`;
            dayRoutine.innerHTML = dayContent;
            elements.allRoutinesContent.appendChild(dayRoutine);
        }
        elements.allRoutinesModal.style.display = 'flex';
    }
    function loadWeeklySummary() {
        for (let i = 1; i <= 6; i++) {
            const dayElement = document.querySelector(`.day[data-day="${i}"]`);
            const completed = checkDayCompletion(i);
            dayElement.classList.add(completed ? 'completed' : 'missed');
            dayElement.innerHTML = completed ? '✓' : '✗';
        }
        const sundayElement = document.querySelector('.day[data-day="0"]');
        const sundayDone = checkDayCompletion(0, true);
        if (sundayDone) {
            sundayElement.classList.add('completed');
            sundayElement.innerHTML = '✓';
        }
    }
    function checkDayCompletion(day, isToday = false) {
        if (!isToday) return localStorage.getItem(`day_completed_${day}`) === 'true';
        const steps = app.routines[day];
        return steps.every(step => localStorage.getItem(`step_${step}_${day}`) === 'true');
    }
    function saveCheckboxState(stepKey, isChecked) {
        const today = new Date().getDay();
        localStorage.setItem(`step_${stepKey}_${today}`, isChecked);
    }
    function loadSavedCheckboxStates() {
        const today = new Date().getDay();
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            const step = cb.dataset.step;
            const saved = localStorage.getItem(`step_${step}_${today}`);
            if (saved === 'true') cb.checked = true;
        });
    }
    init();
});