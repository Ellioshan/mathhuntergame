import { AnimalSize } from './Animal';

export class QuestionGenerator {
  private readonly DIFFICULTY_LEVELS = {
    small: ['addition', 'subtraction'],
    medium: ['multiplication', 'division'],
    large: ['fractions', 'algebra']
  };

  constructor() {}

  public generateQuestion(animalSize: AnimalSize): { question: string; options: string[]; correctAnswer: string } {
    const difficultyTypes = this.DIFFICULTY_LEVELS[animalSize];
    const questionType = difficultyTypes[Math.floor(Math.random() * difficultyTypes.length)];
    
    switch (questionType) {
      case 'addition':
        return this.generateAdditionQuestion();
      case 'subtraction':
        return this.generateSubtractionQuestion();
      case 'multiplication':
        return this.generateMultiplicationQuestion();
      case 'division':
        return this.generateDivisionQuestion();
      case 'fractions':
        return this.generateFractionQuestion();
      case 'algebra':
        return this.generateAlgebraQuestion();
      default:
        return this.generateAdditionQuestion();
    }
  }

  private generateAdditionQuestion(): { question: string; options: string[]; correctAnswer: string } {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const correctAnswer = (num1 + num2).toString();
    
    const options = this.generateOptions(num1 + num2, 5);
    
    return {
      question: `What is ${num1} + ${num2}?`,
      options,
      correctAnswer
    };
  }

  private generateSubtractionQuestion(): { question: string; options: string[]; correctAnswer: string } {
    let num1 = Math.floor(Math.random() * 20) + 10;
    let num2 = Math.floor(Math.random() * num1);
    const correctAnswer = (num1 - num2).toString();
    
    const options = this.generateOptions(num1 - num2, 5);
    
    return {
      question: `What is ${num1} - ${num2}?`,
      options,
      correctAnswer
    };
  }

  private generateMultiplicationQuestion(): { question: string; options: string[]; correctAnswer: string } {
    const num1 = Math.floor(Math.random() * 10) + 2;
    const num2 = Math.floor(Math.random() * 10) + 2;
    const correctAnswer = (num1 * num2).toString();
    
    const options = this.generateOptions(num1 * num2, 10);
    
    return {
      question: `What is ${num1} × ${num2}?`,
      options,
      correctAnswer
    };
  }

  private generateDivisionQuestion(): { question: string; options: string[]; correctAnswer: string } {
    const num2 = Math.floor(Math.random() * 9) + 2;
    const num1 = num2 * (Math.floor(Math.random() * 10) + 1);
    const correctAnswer = (num1 / num2).toString();
    
    const options = this.generateOptions(num1 / num2, 3);
    
    return {
      question: `What is ${num1} ÷ ${num2}?`,
      options,
      correctAnswer
    };
  }

  private generateFractionQuestion(): { question: string; options: string[]; correctAnswer: string } {
    // Generate two fractions to add
    const denominator1 = Math.floor(Math.random() * 5) + 2;
    const numerator1 = Math.floor(Math.random() * denominator1) + 1;
    
    const denominator2 = denominator1; // Same denominator for simplicity
    const numerator2 = Math.floor(Math.random() * denominator2) + 1;
    
    const resultNumerator = numerator1 + numerator2;
    const resultDenominator = denominator1;
    
    // Simplify the fraction if possible
    const gcd = this.findGCD(resultNumerator, resultDenominator);
    const simplifiedNumerator = resultNumerator / gcd;
    const simplifiedDenominator = resultDenominator / gcd;
    
    const correctAnswer = simplifiedDenominator === 1 
      ? simplifiedNumerator.toString() 
      : `${simplifiedNumerator}/${simplifiedDenominator}`;
    
    // Generate options
    const options = this.generateFractionOptions(simplifiedNumerator, simplifiedDenominator);
    
    return {
      question: `What is ${numerator1}/${denominator1} + ${numerator2}/${denominator2}?`,
      options,
      correctAnswer
    };
  }

  private generateAlgebraQuestion(): { question: string; options: string[]; correctAnswer: string } {
    // Generate a simple linear equation: ax + b = c
    const a = Math.floor(Math.random() * 5) + 1;
    const b = Math.floor(Math.random() * 10);
    const x = Math.floor(Math.random() * 10) + 1;
    const c = a * x + b;
    
    const correctAnswer = x.toString();
    const options = this.generateOptions(x, 3);
    
    return {
      question: `If ${a}x + ${b} = ${c}, what is x?`,
      options,
      correctAnswer
    };
  }

  private generateOptions(correctAnswer: number, maxDifference: number): string[] {
    const options: string[] = [correctAnswer.toString()];
    
    // Generate 3 wrong options
    while (options.length < 4) {
      const diff = Math.floor(Math.random() * maxDifference) + 1;
      const sign = Math.random() < 0.5 ? 1 : -1;
      const wrongAnswer = correctAnswer + sign * diff;
      
      // Ensure the wrong answer is positive and not already in options
      if (wrongAnswer > 0 && !options.includes(wrongAnswer.toString())) {
        options.push(wrongAnswer.toString());
      }
    }
    
    // Shuffle options
    return this.shuffleArray(options);
  }

  private generateFractionOptions(numerator: number, denominator: number): string[] {
    const correctAnswer = denominator === 1 
      ? numerator.toString() 
      : `${numerator}/${denominator}`;
    
    const options: string[] = [correctAnswer];
    
    // Generate 3 wrong options
    while (options.length < 4) {
      const randomOption = Math.random();
      let wrongAnswer: string;
      
      if (randomOption < 0.33) {
        // Change numerator
        const newNumerator = numerator + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
        if (newNumerator > 0) {
          wrongAnswer = denominator === 1 
            ? newNumerator.toString() 
            : `${newNumerator}/${denominator}`;
        } else {
          continue;
        }
      } else if (randomOption < 0.66) {
        // Change denominator
        const newDenominator = denominator + (Math.floor(Math.random() * 3) + 1);
        wrongAnswer = `${numerator}/${newDenominator}`;
      } else {
        // Change both
        const newNumerator = numerator + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
        const newDenominator = denominator + (Math.floor(Math.random() * 2) + 1);
        if (newNumerator > 0) {
          wrongAnswer = `${newNumerator}/${newDenominator}`;
        } else {
          continue;
        }
      }
      
      // Ensure the wrong answer is not already in options
      if (!options.includes(wrongAnswer)) {
        options.push(wrongAnswer);
      }
    }
    
    // Shuffle options
    return this.shuffleArray(options);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private findGCD(a: number, b: number): number {
    return b === 0 ? a : this.findGCD(b, a % b);
  }
}
