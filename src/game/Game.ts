import { Player } from './Player';
import { Animal, AnimalSize } from './Animal';
import { QuestionGenerator } from './QuestionGenerator';
import { UI } from './UI';
import { SoundManager } from './SoundManager';

export class Game {
  private container: HTMLElement;
  private player: Player;
  private animals: Animal[] = [];
  private questionGenerator: QuestionGenerator;
  private ui: UI;
  private soundManager: SoundManager;
  private score: number = 0;
  private isGameOver: boolean = false;
  private isGameActive: boolean = false;
  private animalSpawnInterval: number | null = null;
  private currentQuestion: { question: string; options: string[]; correctAnswer: string } | null = null;
  private currentAnimal: Animal | null = null;
  private consecutiveCorrectAnswers: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.player = new Player(container);
    this.questionGenerator = new QuestionGenerator();
    this.ui = new UI(container, this);
    this.soundManager = new SoundManager();
  }

  public init(): void {
    // Set up the game container
    this.container.innerHTML = '';
    this.ui.createStartScreen();
    
    // Set up event listeners
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Listen for start game button click
    const startButton = document.querySelector('.start-button');
    if (startButton) {
      startButton.addEventListener('click', () => this.startGame());
    }
  }

  public startGame(): void {
    this.isGameActive = true;
    this.isGameOver = false;
    this.score = 0;
    this.consecutiveCorrectAnswers = 0;
    this.animals = [];
    
    // Clear any existing intervals
    if (this.animalSpawnInterval !== null) {
      clearInterval(this.animalSpawnInterval);
    }
    
    // Set up the game UI
    this.ui.createGameUI();
    this.ui.updateScore(this.score);
    
    // Create the player
    this.player = new Player(this.container);
    
    // Start spawning animals
    this.animalSpawnInterval = setInterval(() => this.spawnAnimal(), 2000);
  }

  private spawnAnimal(): void {
    if (this.isGameOver || !this.isGameActive) return;
    
    // Determine animal size based on score
    let size: AnimalSize;
    const rand = Math.random();
    
    if (this.score < 50) {
      // Early game: mostly small animals
      size = rand < 0.7 ? 'small' : (rand < 0.9 ? 'medium' : 'large');
    } else if (this.score < 150) {
      // Mid game: more medium animals
      size = rand < 0.3 ? 'small' : (rand < 0.8 ? 'medium' : 'large');
    } else {
      // Late game: more large animals
      size = rand < 0.2 ? 'small' : (rand < 0.5 ? 'medium' : 'large');
    }
    
    // Create and add the animal
    const animal = new Animal(this.container, size);
    this.animals.push(animal);
    
    // Set up click event for the animal
    animal.getElement().addEventListener('click', () => this.handleAnimalClick(animal));
    
    // Remove animal after some time if not clicked
    setTimeout(() => {
      if (this.animals.includes(animal)) {
        this.removeAnimal(animal);
      }
    }, 8000);
  }

  private handleAnimalClick(animal: Animal): void {
    if (this.isGameOver || !this.isGameActive) return;
    
    // Store the current animal
    this.currentAnimal = animal;
    
    // Generate a question based on animal size
    this.currentQuestion = this.questionGenerator.generateQuestion(animal.getSize());
    
    // Show the question modal
    this.ui.showQuestionModal(
      this.currentQuestion.question,
      this.currentQuestion.options,
      (selectedAnswer: string) => this.checkAnswer(selectedAnswer)
    );
  }

  private checkAnswer(selectedAnswer: string): void {
    if (!this.currentQuestion || !this.currentAnimal) return;
    
    const isCorrect = selectedAnswer === this.currentQuestion.correctAnswer;
    
    if (isCorrect) {
      // Correct answer
      this.consecutiveCorrectAnswers++;
      
      // Calculate points based on animal size and consecutive correct answers
      let points = 0;
      switch (this.currentAnimal.getSize()) {
        case 'small':
          points = 10;
          break;
        case 'medium':
          points = 25;
          break;
        case 'large':
          points = 50;
          break;
      }
      
      // Apply multiplier for consecutive correct answers
      const multiplier = Math.min(3, 1 + (this.consecutiveCorrectAnswers - 1) * 0.5);
      points = Math.floor(points * multiplier);
      
      // Update score
      this.score += points;
      this.ui.updateScore(this.score);
      
      // Remove the animal
      this.removeAnimal(this.currentAnimal);
      
      // Hide the question modal
      this.ui.hideQuestionModal();
    } else {
      // Incorrect answer - game over
      this.gameOver();
    }
    
    // Reset current question and animal
    this.currentQuestion = null;
    this.currentAnimal = null;
  }

  private removeAnimal(animal: Animal): void {
    // Remove the animal from the DOM
    animal.remove();
    
    // Remove from the animals array
    const index = this.animals.indexOf(animal);
    if (index !== -1) {
      this.animals.splice(index, 1);
    }
  }

  private gameOver(): void {
    this.isGameOver = true;
    this.isGameActive = false;
    
    // Stop spawning animals
    if (this.animalSpawnInterval !== null) {
      clearInterval(this.animalSpawnInterval);
      this.animalSpawnInterval = null;
    }
    
    // Show game over screen
    this.ui.showGameOverScreen(this.score);
  }

  public restartGame(): void {
    // Clean up
    this.animals.forEach(animal => animal.remove());
    this.animals = [];
    
    // Start a new game
    this.startGame();
  }

  public getScore(): number {
    return this.score;
  }
}
