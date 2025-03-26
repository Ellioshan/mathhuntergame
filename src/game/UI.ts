import { Game } from './Game';

export class UI {
  private container: HTMLElement;
  private game: Game;
  private gameContainer: HTMLElement | null = null;
  private scoreDisplay: HTMLElement | null = null;
  private questionModal: HTMLElement | null = null;
  private gameOverScreen: HTMLElement | null = null;

  constructor(container: HTMLElement, game: Game) {
    this.container = container;
    this.game = game;
  }

  public createStartScreen(): void {
    const startScreen = document.createElement('div');
    startScreen.className = 'start-screen';
    
    const title = document.createElement('h1');
    title.className = 'game-title';
    title.textContent = 'Math Hunter';
    
    const description = document.createElement('p');
    description.className = 'game-description';
    description.innerHTML = 'Hunt animals by solving math problems! Catch small animals with simple arithmetic, medium animals with multiplication and division, and large animals with fractions and algebra. Be careful - one wrong answer and it\'s game over!';
    
    const startButton = document.createElement('button');
    startButton.className = 'start-button';
    startButton.textContent = 'Start Hunting';
    
    startScreen.appendChild(title);
    startScreen.appendChild(description);
    startScreen.appendChild(startButton);
    
    this.container.appendChild(startScreen);
  }

  public createGameUI(): void {
    // Clear container
    this.container.innerHTML = '';
    
    // Create game container
    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'game-container';
    
    // Create UI elements
    const gameUI = document.createElement('div');
    gameUI.className = 'game-ui';
    
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.className = 'score-display';
    this.scoreDisplay.textContent = 'Score: 0';
    
    gameUI.appendChild(this.scoreDisplay);
    this.gameContainer.appendChild(gameUI);
    
    // Add to container
    this.container.appendChild(this.gameContainer);
  }

  public updateScore(score: number): void {
    if (this.scoreDisplay) {
      this.scoreDisplay.textContent = `Score: ${score}`;
    }
  }

  public showQuestionModal(
    question: string,
    options: string[],
    onOptionSelected: (option: string) => void
  ): void {
    // Create modal if it doesn't exist
    if (!this.questionModal) {
      this.questionModal = document.createElement('div');
      this.questionModal.className = 'question-modal';
      this.container.appendChild(this.questionModal);
    }
    
    // Clear previous content
    this.questionModal.innerHTML = '';
    
    // Add question text
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = question;
    this.questionModal.appendChild(questionText);
    
    // Add options
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    
    options.forEach(option => {
      const optionButton = document.createElement('button');
      optionButton.className = 'option-button';
      optionButton.textContent = option;
      optionButton.addEventListener('click', () => onOptionSelected(option));
      optionsContainer.appendChild(optionButton);
    });
    
    this.questionModal.appendChild(optionsContainer);
    
    // Show the modal
    this.questionModal.classList.remove('hidden');
  }

  public hideQuestionModal(): void {
    if (this.questionModal) {
      this.questionModal.classList.add('hidden');
    }
  }

  public showGameOverScreen(finalScore: number): void {
    // Create game over screen
    this.gameOverScreen = document.createElement('div');
    this.gameOverScreen.className = 'game-over-screen';
    
    const gameOverTitle = document.createElement('h1');
    gameOverTitle.className = 'game-over-title';
    gameOverTitle.textContent = 'Game Over!';
    
    const finalScoreDisplay = document.createElement('div');
    finalScoreDisplay.className = 'final-score';
    finalScoreDisplay.textContent = `Final Score: ${finalScore}`;
    
    const restartButton = document.createElement('button');
    restartButton.className = 'restart-button';
    restartButton.textContent = 'Play Again';
    restartButton.addEventListener('click', () => this.game.restartGame());
    
    this.gameOverScreen.appendChild(gameOverTitle);
    this.gameOverScreen.appendChild(finalScoreDisplay);
    this.gameOverScreen.appendChild(restartButton);
    
    this.container.appendChild(this.gameOverScreen);
  }
}
