export enum Direction {
  TopLeft,
  TopRight,
  BottomRight,
  BottomLeft,
}

export class Position {
  x: number;
  y: number;
  z?: number;

  constructor(x: number, y: number, z: number = 0.15) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  static isValidPosition(x: number, y: number): boolean {
    if (x < 0 || x > 7 || y < 0 || y > 7) return false;

    if (x % 2 == 0 && y % 2 !== 0) {
      return true;
    } else if (x % 2 !== 0 && y % 2 == 0) {
      return true;
    }
    return false;
  }

  getNeighbour(direction: Direction): Position | undefined {
    switch (direction) {
      case Direction.TopLeft:
        if (Position.isValidPosition(this.x - 1, this.y - 1) == true) {
          return new Position(this.x - 1, this.y - 1);
        }
        break;

      case Direction.TopRight:
        if (Position.isValidPosition(this.x + 1, this.y - 1) == true) {
          return new Position(this.x + 1, this.y - 1);
        }
        break;

      case Direction.BottomRight:
        if (Position.isValidPosition(this.x + 1, this.y + 1) == true) {
          return new Position(this.x + 1, this.y + 1);
        }
        break;

      case Direction.BottomLeft:
        if (Position.isValidPosition(this.x - 1, this.y + 1) == true) {
          return new Position(this.x - 1, this.y + 1);
        }
        break;
    }
    return undefined;
  }
}
