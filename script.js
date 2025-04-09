// script.js

const rutinaPorDia = {
  lunes: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  martes: ["Limpieza", "Glicólico", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  miércoles: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  jueves: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  viernes: ["Limpieza", "Glicólico", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  sábado: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  domingo: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"]
};

const explicaciones = {
  "Limpieza": {
    producto: "CeraVe o Cetaphil Limpiador",
    detalle: "Aplicá sobre el rostro húmedo, masajeá suavemente y enjuagá con agua tibia."
  },
  "Glicólico": {
    producto: "The Ordinary Glycolic Acid 7%",
    detalle: "Aplicá con un pad de algodón por la noche, 2 veces por semana. No enjuagar. No mezclar con otros ácidos."
  },
  "Hyalu B5": {
    producto: "La Roche-Posay Hyalu B5 Serum",
    detalle: "Aplicá 2-3 gotas sobre la piel limpia y húmeda, presionando con las palmas."
  },
  "Contorno de ojos": {
    producto: "The Ordinary Caffeine Solution 5% + EGCG",
    detalle: "Aplicá una gota en la yema del dedo anular y colocá con golpecitos suaves en el contorno."
  },
  "Hidratante": {
    producto: "CeraVe Loción Hidratante o Avène Cicalfate",
    detalle: "Aplicá una capa ligera en rostro y cuello."
  },
  "Protector solar": {
    producto: "Avène Mat Perfect FPS 50+ con color",
    detalle: "Aplicá 2 dedos de producto cada mañana como último paso. Reaplicá si estás al aire libre."
  }
};

const frases = {
  lunes: "Empieza la semana brillando desde adentro.",
  martes: "Tu constancia es tu mejor aliada.",
  miércoles: "Cada ritual te acerca a tu mejor versión.",
  jueves: "Tu piel habla de cómo te cuidás.",
  viernes: "Terminá la semana cuidándote con intención.",
  sábado: "El ritual también es descanso.",
  domingo: "Tu momento. Tu ritual."
};

let modo = 'hoja';
const dias = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const diaActual = dias[new Date().getDay()];
const checklistEl = document.getElementById('checklist');
const motivacionEl = document.getElementById('motivacion');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modalContent');
const mensajeCompletado = document.getElementById('mensajeCompletado');
const grafico = document.getElementById('grafico');

function guardarEstado(nombre, valor) {
  localStorage.setItem(`${modo}_${diaActual}_${nombre}`, valor);
}

function obtenerEstado(nombre) {
  return localStorage.getItem(`${modo}_${diaActual}_${nombre}`) === 'true';
}

function generarChecklist(pasos) {
  checklistEl.innerHTML = '';
  pasos.forEach(paso => {
    const checked = obtenerEstado(paso);
    const div = document.createElement('div');
    div.className = 'step';
    div.innerHTML = `
      <label>
        <input type="checkbox" ${checked ? 'checked' : ''} onchange="guardarEstado('${paso}', this.checked); revisarCompletado()"> ${paso}
      </label>
      <span class="icono" onclick="mostrarInfo('${paso}')">ℹ️</span>
    `;
    checklistEl.appendChild(div);
  });
  revisarCompletado();
}

function mostrarInfo(paso) {
  const info = explicaciones[paso];
  modalContent.innerHTML = `<h3>${paso}</h3><p><strong>Producto:</strong> ${info.producto}</p><p>${info.detalle}</p><br><button onclick="cerrarModal()">Cerrar</button>`;
  modal.style.display = 'flex';
}

function cerrarModal() {
  modal.style.display = 'none';
}

function mostrarMotivacion() {
  motivacionEl.textContent = frases[diaActual] || '';
}

function reiniciarDia() {
  rutinaPorDia[diaActual].forEach(paso => guardarEstado(paso, false));
  generarChecklist(rutinaPorDia[diaActual]);
}

function mostrarCompleta() {
  const todosPasos = [...new Set(Object.values(rutinaPorDia).flat())];
  generarChecklist(todosPasos);
}

function revisarCompletado() {
  const pasos = rutinaPorDia[diaActual];
  if (!pasos) return;
  const completos = pasos.every(paso => obtenerEstado(paso));
  mensajeCompletado.textContent = completos ? 'Ritual completado' : '';
}

function cambiarModo(nuevoModo) {
  modo = nuevoModo;
  document.getElementById('tab-hoja').classList.toggle('active', modo === 'hoja');
  document.getElementById('tab-luna').classList.toggle('active', modo === 'luna');
  generarChecklist(rutinaPorDia[diaActual]);
  mostrarMotivacion();
  mostrarGraficoSemanal();
}

function mostrarGraficoSemanal() {
  if (diaActual !== 'domingo') {
    grafico.innerHTML = '';
    return;
  }
  let html = '<h3>Resumen semanal</h3>';
  Object.keys(rutinaPorDia).forEach(dia => {
    const pasos = rutinaPorDia[dia];
    const completos = pasos.every(p => localStorage.getItem(`${modo}_${dia}_${p}`) === 'true');
    html += `<p>${dia.charAt(0).toUpperCase() + dia.slice(1)}: ${completos ? '✔️' : '❌'}</p>`;
  });
  grafico.innerHTML = html;
}

cambiarModo('hoja');
