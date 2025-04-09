
document.addEventListener('DOMContentLoaded', () => {
    // Configuración de la aplicación
    const app = {
        currentTheme: localStorage.getItem('theme') || 'hoja',
        todaySteps: [],
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
                icon: 'fa-droplet',
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
                icon: 'fa-bottle-water',
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
        },
        routines: {
            0: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], // Domingo
            1: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], // Lunes
            2: ['limpieza', 'glicolico', 'hyalu', 'contorno', 'hidratante', 'protector'], // Martes
            3: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], // Miércoles
            4: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], // Jueves
            5: ['limpieza', 'glicolico', 'hyalu', 'contorno', 'hidratante', 'protector'], // Viernes
            6: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector']  // Sábado
        },
        quotes: {
            1: "Empieza la semana brillando desde adentro.",
            2: "Tu constancia es tu mejor aliada.",
            3: "Cada ritual te acerca a tu mejor versión.",
            4: "Tu piel habla de cómo te cuidás.",
            5: "Terminá la semana cuidándote con intención.",
            6: "El ritual también es descanso.",
            0: "Tu momento. Tu ritual."
        },
        weekDays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    };

    // ELEMENTOS DOM
    const elements = {
        themeIcon: document.getElementById('theme-icon'),
        themeOptions: document.querySelectorAll('.theme-option'),
        ritualSteps: document.querySelector('.ritual-steps'),
        dailyQuote: document.querySelector('.daily-quote'),
        summary: document.querySelector('.summary'),
        weeklySummary: document.getElementById('weekly-summary'),
        allDays: document.querySelectorAll('.day'),
        resetBtn: document.getElementById('reset-btn'),
        viewAllBtn: document.getElementById('view-all-btn'),
        explanationModal: document.getElementById('explanation-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalExplanation: document.getElementById('modal-explanation'),
        closeModalBtns: document.querySelectorAll('.close-modal'),
        allRoutinesModal: document.getElementById('all-routines-modal'),
        allRoutinesContent: document.querySelector('.all-routines-content')
    };

    // INICIALIZACIÓN
    function checkCompletionStatus() {
        const today = new Date().getDay();
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const isCompleted = Array.from(checkboxes).every(cb => cb.checked);
        
        if (isCompleted && checkboxes.length > 0) {
            elements.summary.style.display = 'block';
            // Marcar el día como completado en el historial
            localStorage.setItem(`day_completed_${today}`, 'true');
        } else {
            elements.summary.style.display = 'none';
        }
    }
    
    function applyTheme(theme) {
        document.documentElement.dataset.theme = theme;
        app.currentTheme = theme;
        
        // Cambiar ícono del tema
        if (theme === 'hoja') {
            elements.themeIcon.className = 'fas fa-leaf';
        } else if (theme === 'luna') {
            elements.themeIcon.className = 'fas fa-moon';
        }
    }
    
    function activateThemeOption(theme) {
        elements.themeOptions.forEach(option => {
            if (option.dataset.theme === theme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Iniciar la aplicación
    init();
}); init() {
        // Aplicar tema guardado
        applyTheme(app.currentTheme);
        activateThemeOption(app.currentTheme);

        // Obtener día actual y mostrar rutina
        const today = new Date().getDay(); // 0 (Domingo) al 6 (Sábado)
        app.todaySteps = app.routines[today];
        
        // Cargar frase diaria
        elements.dailyQuote.textContent = app.quotes[today];
        
        // Cargar pasos de hoy
        loadTodaySteps();
        
        // Mostrar resumen semanal solo los domingos
        if (today === 0) {
            loadWeeklySummary();
            elements.weeklySummary.style.display = 'block';
        }
        
        // Evento para cambio de tema
        elements.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                applyTheme(theme);
                activateThemeOption(theme);
                localStorage.setItem('theme', theme);
            });
        });
        
        // Eventos de botones
        elements.resetBtn.addEventListener('click', resetRoutine);
        elements.viewAllBtn.addEventListener('click', showAllRoutines);
        
        // Eventos para cerrar modales
        elements.closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                elements.explanationModal.style.display = 'none';
                elements.allRoutinesModal.style.display = 'none';
            });
        });
        
        // Cerrar modal al hacer clic fuera
        window.addEventListener('click', (e) => {
            if (e.target === elements.explanationModal) {
                elements.explanationModal.style.display = 'none';
            }
            if (e.target === elements.allRoutinesModal) {
                elements.allRoutinesModal.style.display = 'none';
            }
        });
        
        // Verificar si se ha completado la rutina al cargar
        checkCompletionStatus();
    }

    // FUNCIONES PRINCIPALES
    function loadTodaySteps() {
        elements.ritualSteps.innerHTML = '';
        app.todaySteps.forEach((stepKey, index) => {
            const step = app.allSteps[stepKey];
            const stepEl = createStepElement(step, stepKey, index);
            elements.ritualSteps.appendChild(stepEl);
        });
        
        // Cargar estados guardados de checkboxes
        loadSavedCheckboxStates();
    }
    
    function createStepElement(step, stepKey, index) {
        const stepItem = document.createElement('div');
        stepItem.className = 'step-item fade-in';
        stepItem.style.animationDelay = `${index * 0.1}s`;
        
        stepItem.innerHTML = `
            <div class="step-icon">
                <i class="fas ${step.icon}"></i>
            </div>
            <div class="step-text">
                <h3>${step.title}</h3>
            </div>
            <div class="info-btn" data-step="${stepKey}">
                <i class="fas fa-question"></i>
            </div>
            <label class="step-checkbox">
                <input type="checkbox" data-step="${stepKey}">
                <span class="checkmark"></span>
            </label>
        `;
        
        // Evento para mostrar explicación
        const infoBtn = stepItem.querySelector('.info-btn');
        infoBtn.addEventListener('click', () => {
            showExplanation(step);
        });
        
        // Evento para checkbox
        const checkbox = stepItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
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
        // Desmarcar todos los checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
        });
        
        // Reiniciar localStorage para el día actual
        const today = new Date().getDay();
        app.todaySteps.forEach(step => {
            localStorage.removeItem(`step_${step}_${today}`);
        });
        
        // Ocultar resumen de ritual completado
        elements.summary.style.display = 'none';
    }
    
    function showAllRoutines() {
        elements.allRoutinesContent.innerHTML = '';
        
        // Crear sección para cada día
        for (let i = 1; i <= 6; i++) { // Lunes a Domingo (1-6, 0)
            const dayIndex = i % 7; // Para que después del 6 (sábado) vuelva al 0 (domingo)
            const dayRoutine = document.createElement('div');
            dayRoutine.className = 'day-routine';
            
            let dayContent = `
                <h4>${app.weekDays[dayIndex]}</h4>
                <ul>
            `;
            
            app.routines[dayIndex].forEach(stepKey => {
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
        const today = new Date();
        const dayOfWeek = today.getDay(); // 0 (Domingo) a 6 (Sábado)
        
        // Si no es domingo, no hacemos nada
        if (dayOfWeek !== 0) return;
        
        // Para cada día de la semana
        for (let i = 1; i <= 6; i++) { // Lunes a Sábado (1-6)
            const dayElement = document.querySelector(`.day[data-day="${i}"]`);
            const routineCompleted = checkDayCompletion(i);
            
            if (routineCompleted) {
                dayElement.classList.add('completed');
                dayElement.innerHTML = '✓';
            } else {
                dayElement.classList.add('missed');
                dayElement.innerHTML = '✗';
            }
        }
        
        // El domingo actual no se marca (aún)
        const sundayElement = document.querySelector('.day[data-day="0"]');
        const sundayCompletionStatus = checkDayCompletion(0, true);
        if (sundayCompletionStatus) {
            sundayElement.classList.add('completed');
            sundayElement.innerHTML = '✓';
        }
    }
    
    function checkDayCompletion(day, isToday = false) {
        // Si es un día pasado, verificamos en el historial
        if (!isToday) {
            return localStorage.getItem(`day_completed_${day}`) === 'true';
        }
        
        // Si es hoy, verificamos todos los pasos actuales
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
            const savedState = localStorage.getItem(`step_${step}_${today}`);
            if (savedState === 'true') {
                cb.checked = true;
            }
        });
    }
    
    function