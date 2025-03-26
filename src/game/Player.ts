export class Player {
  private element: HTMLElement;
  private container: HTMLElement;
  private x: number = 0;
  private y: number = 0;
  private speed: number = 5;
  private keys: { [key: string]: boolean } = {};

  constructor(container: HTMLElement) {
    this.container = container;
    this.element = document.createElement('div');
    this.element.className = 'player';
    this.container.appendChild(this.element);
    
    // Set initial position to center of screen
    this.x = window.innerWidth / 2 - 20;
    this.y = window.innerHeight / 2 - 20;
    this.updatePosition();
    
    // Set up keyboard controls
    this.setupControls();
  }

  private setupControls(): void {
    // Key down event
    window.addEventListener('keydown', (e) => {
      this.keys[e.key] = true;
    });
    
    // Key up event
    window.addEventListener('keyup', (e) => {
      this.keys[e.key] = false;
    });
    
    // Update position on animation frame
    const update = () => {
      this.move();
      requestAnimationFrame(update);
    };
    
    requestAnimationFrame(update);
  }

  private move(): void {
    // Move based on keys pressed
    if (this.keys['ArrowUp'] || this.keys['w']) {
      this.y -= this.speed;
    }
    if (this.keys['ArrowDown'] || this.keys['s']) {
      this.y += this.speed;
    }
    if (this.keys['ArrowLeft'] || this.keys['a']) {
      this.x -= this.speed;
    }
    if (this.keys['ArrowRight'] || this.keys['d']) {
      this.x += this.speed;
    }
    
    // Keep player within bounds
    this.x = Math.max(0, Math.min(window.innerWidth - 40, this.x));
    this.y = Math.max(0, Math.min(window.innerHeight - 40, this.y));
    
    // Update position
    this.updatePosition();
  }

  private updatePosition(): void {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getPosition(): { x: number, y: number } {
    return { x: this.x, y: this.y };
  }
}
