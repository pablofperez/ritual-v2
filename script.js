
document.addEventListener('DOMContentLoaded', () => {
    // ... todo tu código ...

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
