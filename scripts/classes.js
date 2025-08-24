
import {seeker, target} from "./script.js"
const svg = document.getElementById("sim");
const w = svg.clientWidth;
const h = svg.clientHeight;

class PoweredElement {
  constructor(id, x, y, speed, color) {
    this.id = id;
    this.actualX = x;
    this.actualY = y;
    this.initialY = y;
    this.speed = speed;
    this.color = color;
    this.element = null;

    this.draw();
  }

  draw() {
    if (!this.element) {
      this.element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      this.element.setAttribute("r", "6");
      this.element.setAttribute("fill", this.color);
      svg.appendChild(this.element);
    }

    this.element.setAttribute("cx", String(this.actualX));
    this.element.setAttribute("cy", String(this.actualY));
    this.leavetrail();

  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  leavetrail() {
    const element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    element.setAttribute("r", "1");
    element.setAttribute("fill", this.color);
    element.setAttribute("cx", String(this.actualX));
    element.setAttribute("cy", String(this.actualY));
    element.classList.add("trail");
    svg.appendChild(element);
  }

  keepInBounds() {
    if(this.actualX < 9 || this.actualX > w-9){
      this.actualX = w - this.actualX; 
    }

    if(this.actualY < 9 || this.actualY > h-9) { 
      this.actualY = h - this.actualY; 
    } 
  }
}

export class Seeker extends PoweredElement {
  lastDx = 0;
  lastDy= 0;
  startTime = performance.now();
  distance = 0;

  constructor(id, x, y, speed) {
    super(id, x, y, speed, "Cyan");
  }

  update() {
    if (!target.hidden) {
      this.lastDx = target.lastDetectedX - this.actualX;
      this.lastDy = target.lastDetectedY - this.actualY;
    }

    const dist = Math.hypot(this.lastDx, this.lastDy);

    if (dist > 0) {
      this.actualX += (this.speed * this.lastDx) / dist;
      this.actualY += (this.speed * this.lastDy) / dist;
    }

    if (Math.abs(target.actualX - this.actualX) < 10 &&
        Math.abs(target.actualY - this.actualY) < 10) {
      updateStats(this.startTime, this.distance);
      this.startTime = 0;
      this.distance = 0;
      return true;
    }

    this.keepInBounds();
    this.draw();
    this.distance += this.speed;

    return false;
  }

}

export class Target extends PoweredElement {
  lastDetectedY;
  lastDetectedX;
  hidden;

  constructor(id, x, y, speed, targetMode, detectionType) {
    super(id, x, y, speed, "Red");
    this.detectionType = detectionType;
    this.runUndetection();

    this.lastDetectedX = x;
    this.lastDetectedY = y;
    this.targetMode = targetMode;
  }

  update() {
    switch (this.targetMode) {
      case "linear":
        this.actualX += this.speed;
        break;
      case "sine":
        this.actualX += this.speed;
        this.actualY = this.initialY + 40 * Math.sin(this.actualX / 40);
        break;
      case "random":
        this.actualX += this.speed * (Math.random() / 2 + 1);
        this.actualY += this.speed * (Math.random() / 2 + 1);
        break;
    }

    this.actualX += 1;
    this.keepInBounds();
    this.draw();
  }

  runUndetection() {
    let isBlocked = false;

    const update = () => {
      if (this.element) {
        if (!isBlocked) {
          this.lastDetectedX = this.actualX;
          this.lastDetectedY = this.actualY;
          this.element.setAttribute("fill", "red");
          this.hidden = false;
        } else {
          this.hidden = true;
          this.element.setAttribute("fill", "black");
        }
      }
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);

    setInterval(() => {
      isBlocked = true;
      setTimeout(() => {
        isBlocked = false;
      }, this.detectionType *1000);
    }, 5000);
  }

}



function updateStats(startTime, distance) {
  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
  document.getElementById("stats").innerHTML =
    `<br>⏱ Time: ${elapsed}s | 📏 Distance: ${distance.toFixed(1)}`;
}
