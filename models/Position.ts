export enum Direction {
  TopLeft,
  TopRight,
  BottomRight,
  BottomLeft,
}

/**
 * @property {number} x The x coordinate
 * @property {number} y The Y coordinate
 * @property {number} [z] The Z coordinate, [Z]=0.15
 */
export class Position {
  x: number;
  y: number;
  z?: number;

  constructor(x: number, y: number, z: number = 0.15) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Checks if given coordinates correspond to a valid Position.
   *
   * @param {number} x
   * @param {number} y
   * @returns {boolean}
   */
  static isValidPosition(x: number, y: number): boolean {
    if (x < 0 || x > 7 || y < 0 || y > 7) return false;

    if (x % 2 == 0 && y % 2 !== 0) {
      return true;
    } else if (x % 2 !== 0 && y % 2 == 0) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether the given Position has reached the opposite player's side
   *
   * @param {Position} position The Position to check
   * @param {number} playerId Unique identifier of the player
   * @returns {boolean}
   */
  static isEnemySide(position: Position, playerId: number) {
    if (position.y == 0 && playerId == 1) {
      return true;
    }

    if (position.y == 7 && playerId == 2) {
      return true;
    }
    return false;
  }

  /**
   * Retuns the opposite Direction from the argument
   *
   * @param {Direction} direction Direction to examine
   * @returns {Direction}
   */
  static getOppositeDirection(direction: Direction): Direction {
    switch (direction) {
      case Direction.TopLeft:
        return Direction.BottomRight;
      case Direction.TopRight:
        return Direction.BottomLeft;
      case Direction.BottomRight:
        return Direction.TopLeft;
      case Direction.BottomLeft:
        return Direction.TopRight;
    }
  }

  /**
   * Returns the neighbouring position based on a given Direction.
   *
   * @param {Direction} direction
   * @returns {Position | undefined}
   */
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

  /**
   * Compares the current Position with a given position.
   *
   * @param {Position} npos Position to compare
   * @returns
   */
  compare(npos: Position): boolean {
    return npos.x == this.x && npos.y == this.y;
  }
}
