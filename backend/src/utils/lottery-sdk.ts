import crypto from 'crypto';

export interface LotteryResult {
  winningNumbers: number[];
  drawId: string;
  timestamp: Date;
}

export interface WinnerValidation {
  isWinner: boolean;
  matchCount: number;
  prizeLevel: 'jackpot' | 'second' | 'third' | 'fourth' | 'none';
  prizeAmount: number;
}

export class LotterySDK {
  private static readonly MIN_NUMBER = 1;
  private static readonly MAX_NUMBER = 50;
  private static readonly NUMBERS_COUNT = 6;

  /**
   * Generate cryptographically secure random lottery numbers
   */
  static generateWinningNumbers(): number[] {
    const numbers: number[] = [];
    const range = this.MAX_NUMBER - this.MIN_NUMBER + 1;

    while (numbers.length < this.NUMBERS_COUNT) {
      // Use crypto.randomInt for cryptographically secure random numbers
      const randomNumber = crypto.randomInt(this.MIN_NUMBER, this.MAX_NUMBER + 1);
      
      // Ensure no duplicates
      if (!numbers.includes(randomNumber)) {
        numbers.push(randomNumber);
      }
    }

    return numbers.sort((a, b) => a - b);
  }

  /**
   * Validate if ticket numbers are valid
   */
  static validateTicketNumbers(numbers: number[]): boolean {
    if (numbers.length !== this.NUMBERS_COUNT) {
      return false;
    }

    // Check if all numbers are within valid range
    const validRange = numbers.every(
      num => num >= this.MIN_NUMBER && num <= this.MAX_NUMBER && Number.isInteger(num)
    );

    // Check for duplicates
    const uniqueNumbers = new Set(numbers);
    const noDuplicates = uniqueNumbers.size === numbers.length;

    return validRange && noDuplicates;
  }

  /**
   * Validate if a ticket is a winner and calculate prize
   */
  static validateWinner(
    ticketNumbers: number[], 
    winningNumbers: number[],
    totalPrize: number = 1000000
  ): WinnerValidation {
    if (!this.validateTicketNumbers(ticketNumbers) || !this.validateTicketNumbers(winningNumbers)) {
      return {
        isWinner: false,
        matchCount: 0,
        prizeLevel: 'none',
        prizeAmount: 0
      };
    }

    // Count matching numbers
    const matches = ticketNumbers.filter(num => winningNumbers.includes(num));
    const matchCount = matches.length;

    // Determine prize level and amount
    let prizeLevel: WinnerValidation['prizeLevel'] = 'none';
    let prizeAmount = 0;

    switch (matchCount) {
      case 6:
        prizeLevel = 'jackpot';
        prizeAmount = totalPrize * 0.6; // 60% of total prize
        break;
      case 5:
        prizeLevel = 'second';
        prizeAmount = totalPrize * 0.2; // 20% of total prize
        break;
      case 4:
        prizeLevel = 'third';
        prizeAmount = totalPrize * 0.15; // 15% of total prize
        break;
      case 3:
        prizeLevel = 'fourth';
        prizeAmount = totalPrize * 0.05; // 5% of total prize
        break;
      default:
        prizeLevel = 'none';
        prizeAmount = 0;
    }

    return {
      isWinner: matchCount >= 3,
      matchCount,
      prizeLevel,
      prizeAmount: Math.round(prizeAmount * 100) / 100 // Round to 2 decimal places
    };
  }

  /**
   * Generate a secure draw ID
   */
  static generateDrawId(): string {
    return crypto.randomUUID();
  }

  /**
   * Calculate odds of winning
   */
  static getOdds(): Record<string, string> {
    const combination = (n: number, r: number): number => {
      if (r > n) return 0;
      let result = 1;
      for (let i = 0; i < r; i++) {
        result = result * (n - i) / (i + 1);
      }
      return result;
    };

    const totalCombinations = combination(this.MAX_NUMBER, this.NUMBERS_COUNT);

    return {
      jackpot: `1 in ${totalCombinations.toLocaleString()}`,
      second: `1 in ${Math.round(totalCombinations / 6).toLocaleString()}`,
      third: `1 in ${Math.round(totalCombinations / 30).toLocaleString()}`,
      fourth: `1 in ${Math.round(totalCombinations / 200).toLocaleString()}`
    };
  }

  /**
   * Simulate a complete lottery draw
   */
  static conductDraw(drawId: string, totalPrize: number): LotteryResult {
    const winningNumbers = this.generateWinningNumbers();
    
    return {
      winningNumbers,
      drawId,
      timestamp: new Date()
    };
  }

  /**
   * Generate quick pick numbers for users
   */
  static generateQuickPick(): number[] {
    return this.generateWinningNumbers(); // Same logic, different purpose
  }

  /**
   * Validate draw parameters
   */
  static validateDrawParameters(drawDate: Date, totalPrize: number): boolean {
    const now = new Date();
    const minPrize = 1000; // Minimum prize of $1000

    return drawDate > now && totalPrize >= minPrize;
  }
}

export default LotterySDK;
