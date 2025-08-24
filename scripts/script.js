import {Seeker, Target} from "./classes.js";

const svg = document.getElementById("sim");
let terrain = null;
export let target = null;
export let seeker = null;

// === Terrain ===
function buildTerrain() {
  if (terrain) terrain.remove();
  terrain = document.createElementNS("http://www.w3.org/2000/svg", "path");
  terrain.setAttribute("fill", "#333");
  svg.appendChild(terrain);
}

// === Event Handlers ===
svg.addEventListener("click", (e) => {
  const { offsetX: x, offsetY: y } = e;

if (!target) {

  target = new Target("target", x, y, 3, "static", 0);
} else if (!seeker) {
    seeker = new Seeker("seeker", x, y, 4.5);
  }
});

document.getElementById("startBtn").onclick = () => {
  target.targetMode = document.getElementById("targetMode").value;
  target.detectionType = document.getElementById("detectionMode").value;

  if (!target || !seeker) {
    return alert("First set the target and interceptor");
  }

  loop();
};

document.getElementById("resetBtn").onclick = () => {
  if (target) target.remove();
  if (seeker) seeker.remove();

  target = seeker = null;
  clearTrails();
};

// === Simulation ===
function loop() {
  if (!seeker || !target) return;

  target.update();
  if (!seeker.update()) {
    requestAnimationFrame(loop);
  }
}

function clearTrails() {
  svg.querySelectorAll('.trail').forEach((el) => el.remove());
}

// === Init ===
buildTerrain();
