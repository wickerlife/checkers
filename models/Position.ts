export class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static isValidPosition(x: number, y: number): boolean {
    if (x % 2 == 0 && y % 2 !== 0) {
      return true;
    } else if (x % 2 !== 0 && y % 2 == 0) {
      return true;
    }
    return false;
  }
}
