const rutina = {
  Lunes: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  Martes: ["Limpieza", "Glicólico", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  Miércoles: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  Jueves: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  Viernes: ["Limpieza", "Glicólico", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  Sábado: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  Domingo: ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"]
};

const explicaciones = {
  "Limpieza": "Cetaphil o CeraVe Limpiador: aplicar sobre piel húmeda, masajear suavemente y enjuagar con agua tibia.",
  "Glicólico": "The Ordinary Glycolic Acid 7%: aplicar solo por la noche, 2 veces por semana con un algodón. No enjuagar.",
  "Hyalu B5": "La Roche-Posay Hyalu B5 Serum: aplicar 2-3 gotas sobre rostro limpio y presionar suavemente.",
  "Contorno de ojos": "The Ordinary Caffeine Solution: una gota por ojo, aplicando con golpecitos suaves.",
  "Hidratante": "CeraVe Loción Hidratante o Avène Cicalfate: aplicar una capa ligera en rostro y cuello.",
  "Protector solar": "Avène Mat Perfect FPS 50+: aplicar por la mañana, último paso. Usar dos dedos de producto."
};

const checklist = document.getElementById("checklist");
const title = document.getElementById("title");
const day = new Date().toLocaleDateString("es-AR", { weekday: "long" });
const capitalized = day.charAt(0).toUpperCase() + day.slice(1);
let pasos = rutina[capitalized];
title.textContent = "Ritual de " + capitalized;

function buildChecklist(items) {
  checklist.innerHTML = "";
  items.forEach(paso => {
    const li = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = localStorage.getItem(paso) === "true";
    checkbox.onchange = () => {
      localStorage.setItem(paso, checkbox.checked);
      checkComplete(items);
    };
    const label = document.createElement("label");
    label.textContent = paso;
    const info = document.createElement("button");
    info.textContent = "?";
    info.onclick = () => alert(explicaciones[paso] || "Sin explicación.");
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(info);
    checklist.appendChild(li);
  });
}

function resetChecklist() {
  pasos.forEach(p => localStorage.removeItem(p));
  buildChecklist(pasos);
  document.getElementById("message").textContent = "";
}

function showAll() {
  const allSteps = [...new Set(Object.values(rutina).flat())];
  title.textContent = "Ritual completo";
  buildChecklist(allSteps);
}

function checkComplete(items) {
  const allChecked = items.every(p => localStorage.getItem(p) === "true");
  document.getElementById("message").textContent = allChecked ? "¡Ritual completado! Tu piel te lo agradece." : "";
}

buildChecklist(pasos);
checkComplete(pasos);