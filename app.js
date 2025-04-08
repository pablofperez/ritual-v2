
const checklistData = {
  "Lunes": ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  "Martes": ["Limpieza", "Glicólico", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  "Miércoles": ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  "Jueves": ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  "Viernes": ["Limpieza", "Glicólico", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  "Sábado": ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"],
  "Domingo": ["Limpieza", "Hyalu B5", "Contorno de ojos", "Hidratante", "Protector solar"]
};

const explicaciones = {
  "Limpieza": "Cetaphil Limpiador: aplicá sobre piel húmeda, masajeá 30 segundos y enjuagá.",
  "Hyalu B5": "La Roche-Posay Hyalu B5: aplicá 2-3 gotas en todo el rostro antes del hidratante.",
  "Contorno de ojos": "The Ordinary Caffeine: 1 gota por ojo con golpecitos suaves.",
  "Hidratante": "CeraVe Loción Hidratante: aplicá una capa en rostro y cuello.",
  "Protector solar": "Avène Mat Perfect FPS 50+: 2 dedos de producto. Reaplicá si salís.",
  "Glicólico": "The Ordinary Glycolic 7%: aplicá con algodón solo de noche, 2 veces por semana."
};

const dayNames = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const today = new Date();
const dayName = dayNames[today.getDay()];
document.getElementById("day-title").textContent = "Ritual de " + dayName;

const checklist = document.getElementById("checklist");
let allItems = checklistData[dayName] || [];

function createChecklist(items) {
  checklist.innerHTML = "";
  items.forEach(item => {
    const li = document.createElement("li");
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = item;
    checkbox.checked = localStorage.getItem(item + dayName) === "true";
    checkbox.addEventListener("change", () => {
      localStorage.setItem(item + dayName, checkbox.checked);
      checkCompleted();
    });

    label.textContent = item;
    const info = document.createElement("button");
    info.textContent = "?";
    info.onclick = () => alert(explicaciones[item] || "Sin info");

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(info);
    checklist.appendChild(li);
  });
}

function checkCompleted() {
  const allChecked = allItems.every(item => localStorage.getItem(item + dayName) === "true");
  document.getElementById("message").textContent = allChecked ? "¡Ritual completado!" : "";
}

function resetChecklist() {
  allItems.forEach(item => localStorage.removeItem(item + dayName));
  createChecklist(allItems);
  document.getElementById("message").textContent = "";
}

function showAll() {
  allItems = Array.from(new Set(Object.values(checklistData).flat()));
  document.getElementById("day-title").textContent = "Ritual completo";
  createChecklist(allItems);
  document.getElementById("message").textContent = "";
}

setTimeout(() => {
  document.getElementById("splash").style.display = "none";
  document.getElementById("app").style.display = "block";
  createChecklist(allItems);
  checkCompleted();
}, 3000);
