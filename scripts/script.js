import {Seeker, Target } from "./classes.js";

const svg = document.getElementById("sim");
const w = svg.clientWidth;
const h = svg.clientHeight;

let terrain = null;
let target = null;
let seeker = null;
let targetMode = "static";
let trailTarget = [];
let trailSeeker = [];
let startTime = null;
let distance = 0;

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
  const targetDetection = document.getElementById("detectionMode").value;

  target = new Target(svg, "target", x, y, 3, targetDetection);
} else if (!seeker) {
    seeker = new Seeker(svg, "seeker", x, y, 4.5);
  }
});

document.getElementById("startBtn").onclick = () => {
  if (!target || !seeker) {
    return alert("First set the target and interceptor");
  }

  targetMode = document.getElementById("targetMode").value;
  trailTarget = [];
  trailSeeker = [];
  distance = 0;
  startTime = null;

  loop();
};

document.getElementById("resetBtn").onclick = () => {
  if (target) target.remove();
  if (seeker) seeker.remove();

  clearTrails();
  target = seeker = null;
};

document.getElementById("replayBtn").onclick = () => {
  if (trailTarget.length === 0) return;

  clearTrails();
  drawTrail(trailTarget, "red");
  drawTrail(trailSeeker, "cyan");
};

// === Simulation ===
function loop() {
  if (!startTime) startTime = performance.now();

  updateTarget();
  if (!updateSeeker()) {
    requestAnimationFrame(loop);
  }
}

function updateTarget() {
  if (!target) return;

  switch (targetMode) {
    case "linear":
      target.actualX += target.speed;
      break;
    case "sine":
      target.actualX += target.speed;
      target.actualY = target.initialY + 40 * Math.sin(target.actualX / 40);
      break;
    case "random":
      target.actualX += target.speed * (Math.random() / 2 + 1);
      target.actualY += target.speed * (Math.random() / 2 + 1);
      break;
  }

  keepInBounds(target);
  target.draw();
  trailTarget.push([target.actualX, target.actualY]);
}

function updateSeeker() {
  if (!seeker || !target) return false;

  const dx = target.lastDetectedX - seeker.actualX;
  const dy = target.lastDetectedY - seeker.actualY;
  const dist = Math.hypot(dx, dy);

  if (Math.abs(target.actualX - seeker.actualX) < 10 &&
     Math.abs(target.actualY - seeker.actualY) < 10) {
    updateStats();
    return true;
  }

  seeker.actualX += (seeker.speed * dx) / dist;
  seeker.actualY += (seeker.speed * dy) / dist;

  keepInBounds(seeker);
  seeker.draw();
  trailSeeker.push([seeker.actualX, seeker.actualY]);
  distance += seeker.speed;

  return false;
}

// === Helpers ===
function keepInBounds(element) {
  if(element.actualX < 7 || element.actualX > w-7){
    target.actualX = w - target.actualX; 
  }

  if(element.actualY < 7 || element.actualY > h-7) { target.actualY = h - target.actualY; } 
}

function drawTrail(points, color) {
  const poly = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  poly.setAttribute("points", points.map((p) => p.join(",")));
  poly.setAttribute("fill", "none");
  poly.setAttribute("stroke", color);
  svg.appendChild(poly);
}

function clearTrails() {
  svg.querySelectorAll("polyline").forEach((el) => el.remove());
}

function updateStats() {
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  document.getElementById("stats").innerHTML =
    `<br>⏱ Time: ${elapsed}s | 📏 Distance: ${distance.toFixed(1)}`;
}

// === Init ===
buildTerrain();
