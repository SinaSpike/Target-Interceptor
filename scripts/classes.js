export class Element {
  constructor(svg, id, x, y, speed, color) {
    this.svg = svg;
    this.id = id;
    this.x = x;
    this.y = y;
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

    this.element.setAttribute("cx", String(this.x));
    this.element.setAttribute("cy", String(this.y));
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
