
document.addEventListener('DOMContentLoaded', () => {
    // ... todo tu código ...
const app = { currentTheme: localStorage.getItem('theme') || 'hoja', todaySteps: [], allSteps: { 'limpieza': { icon: 'fa-shower', title: 'Limpieza', product: 'CeraVe o Cetaphil Limpiador', explanation: 'Aplicá sobre el rostro húmedo, masajeá suavemente y enjuagá con agua tibia.' }, 'glicolico': { icon: 'fa-flask', title: 'Glicólico', product: 'The Ordinary Glycolic Acid 7%', explanation: 'Aplicá con un pad de algodón por la noche, 2 veces por semana. No enjuagar. No mezclar con otros ácidos.' }, 'hyalu': { icon: 'fa-droplet', title: 'Hyalu B5', product: 'La Roche-Posay Hyalu B5 Serum', explanation: 'Aplicá 2-3 gotas sobre la piel limpia y húmeda, presionando con las palmas.' }, 'contorno': { icon: 'fa-eye', title: 'Contorno de ojos', product: 'The Ordinary Caffeine Solution 5% + EGCG', explanation: 'Aplicá una gota en la yema del dedo anular y colocá con golpecitos suaves en el contorno.' }, 'hidratante': { icon: 'fa-bottle-water', title: 'Hidratante', product: 'CeraVe Loción Hidratante o Avène Cicalfate', explanation: 'Aplicá una capa ligera en rostro y cuello.' }, 'protector': { icon: 'fa-sun', title: 'Protector solar', product: 'Avène Mat Perfect FPS 50+ con color', explanation: 'Aplicá 2 dedos de producto cada mañana como último paso. Reaplicá si estás al aire libre.' } }, routines: { 0: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], // Domingo 1: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], // Lunes 2: ['limpieza', 'glicolico', 'hyalu', 'contorno', 'hidratante', 'protector'], // Martes 3: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], // Miércoles 4: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'], // Jueves 5: ['limpieza', 'glicolico', 'hyalu', 'contorno', 'hidratante', 'protector'], // Viernes 6: ['limpieza', 'hyalu', 'contorno', 'hidratante', 'protector'] // Sábado }, quotes: { 1: "Empieza la semana brillando desde adentro.", 2: "Tu constancia es tu mejor aliada.", 3: "Cada ritual te acerca a tu mejor versión.", 4: "Tu piel habla de cómo te cuidás.", 5: "Terminá la semana cuidándote con intención.", 6: "El ritual también es descanso.", 0: "Tu momento. Tu ritual." }, weekDays: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'] }; // ELEMENTOS DOM const elements = { themeIcon: document.getElementById('theme-icon'), themeOptions: document.querySelectorAll('.theme-option'), ritualSteps: document.querySelector('.ritual-steps'), dailyQuote: document.querySelector('.daily-quote'), summary: document.querySelector('.summary'), weeklySummary: document.getElementById('weekly-summary'), allDays: document.querySelectorAll('.day'), resetBtn: document.getElementById('reset-btn'), viewAllBtn: document.getElementById('view-all-btn'), explanationModal: document.getElementById('explanation-modal'), modalTitle: document.getElementById('modal-title'), modalExplanation: document.getElementById('modal-explanation'), closeModalBtns: document.querySelectorAll('.close-modal'), allRoutinesModal: document.getElementById('all-routines-modal'), allRoutinesContent: document.querySelector('.all-routines-content') };
    function init() {
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

    init(); // Ejecutar después de definirla
});
