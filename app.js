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
  "Limpieza": "CeraVe o Cetaphil: aplicar sobre piel húmeda, masajear y enjuagar.",
  "Glicólico": "The Ordinary Glycolic 7%: usar solo de noche 2x/semana con algodón.",
  "Hyalu B5": "La Roche-Posay Hyalu B5: aplicar 2-3 gotas y presionar suavemente.",
  "Contorno de ojos": "The Ordinary Cafeína: 1 gota por ojo, con golpecitos suaves.",
  "Hidratante": "CeraVe o Avène: aplicar en rostro y cuello.",
  "Protector solar": "Avène Mat Perfect FPS 50+: 2 dedos de producto cada mañana."
};

const checklist = document.getElementById("checklist");
const day = new Date().toLocaleDateString("es-AR", { weekday: "long" });
const capitalized = day.charAt(0).toUpperCase() + day.slice(1);
const pasos = rutina[capitalized];
document.getElementById("title").textContent = "Ritual de " + capitalized;

function buildChecklist(items) {
  checklist.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = localStorage.getItem(item) === "true";
    checkbox.onchange = () => {
      localStorage.setItem(item, checkbox.checked);
      checkComplete();
    };
    label.textContent = item;
    const help = document.createElement("button");
    help.textContent = "?";
    help.onclick = () => alert(explicaciones[item] || "Sin explicación.");
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(help);
    checklist.appendChild(li);
  });
}

function resetChecklist() {
  pasos.forEach(item => localStorage.removeItem(item));
  buildChecklist(pasos);
  document.getElementById("message").textContent = "";
}

function showAll() {
  const allSteps = [...new Set(Object.values(rutina).flat())];
  buildChecklist(allSteps);
}

function checkComplete() {
  const allChecked = pasos.every(p => localStorage.getItem(p) === "true");
  document.getElementById("message").textContent = allChecked ? "¡Ritual completado! Tu piel te lo agradece." : "";
}

buildChecklist(pasos);
checkComplete();