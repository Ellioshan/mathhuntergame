export type AnimalSize = 'small' | 'medium' | 'large';

export class Animal {
  private element: HTMLElement;
  private container: HTMLElement;
  private size: AnimalSize;
  private animalTypes: { [key in AnimalSize]: string[] } = {
    small: ['🐇', '🐿️', '🐁', '🦔'],
    medium: ['🦊', '🦝', '🦡', '🐖'],
    large: ['🦌', '🐗', '🦬', '🐻']
  };

  constructor(container: HTMLElement, size: AnimalSize) {
    this.container = container;
    this.size = size;
    
    // Create animal element
    this.element = document.createElement('div');
    this.element.className = `animal ${size}`;
    
    // Set random animal emoji based on size
    const animalOptions = this.animalTypes[size];
    const randomAnimal = animalOptions[Math.floor(Math.random() * animalOptions.length)];
    this.element.textContent = randomAnimal;
    this.element.style.fontSize = size === 'small' ? '30px' : (size === 'medium' ? '45px' : '60px');
    
    // Set random position
    const x = Math.random() * (window.innerWidth - 80);
    const y = Math.random() * (window.innerHeight - 80);
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    
    // Add to container
    this.container.appendChild(this.element);
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  public getSize(): AnimalSize {
    return this.size;
  }

  public remove(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
