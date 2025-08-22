 class PoweredElement {
  constructor(svg, id, x, y, speed, color) {
    this.svg = svg;
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
      this.svg.appendChild(this.element);
    }

    this.element.setAttribute("cx", String(this.actualX));
    this.element.setAttribute("cy", String(this.actualY));
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
export class Seeker extends PoweredElement {
  lastDx = 0;
  lastDy= 0;

  constructor(svg, id, x, y, speed) {
    super(svg, id, x, y, speed, "Cyan");
  }
}

export class Target extends PoweredElement {
  detectionType;
  lastDetectedY;
  lastDetectedX;

  constructor(svg, id, x, y, speed, detectionType) {
    super(svg, id, x, y, speed, "Red");
    this.detectionType = detectionType;
    this.runUndetection();

    this.lastDetectedX = x;
    this.lastDetectedY = y;
  }

  runUndetection() {
  let isBlocked = false;
  const update = () => {
    if (!isBlocked) {
      this.lastDetectedX = this.actualX;
      this.lastDetectedY = this.actualY;
    }
    requestAnimationFrame(update);
  };
  requestAnimationFrame(update);

  setInterval(() => {
    isBlocked = true;
    setTimeout(() => {
      isBlocked = false;
    }, this.detectionType * 1000);
  }, 5000);
}
}

