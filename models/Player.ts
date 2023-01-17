interface PlayerInterface {
  id: number;
  username: string;
  color: string;
  wins?: number;
}

/**
 * Class wrapper of a Player state
 *
 * @property {number} id Unique identifier of the Player during a game.
 * @property {string} username Player's username to display during the game.
 * @property {string} color The color that the Player's pieces will display.
 * @property {number} wins Number of games a player has won against the same player.
 */
export class Player {
  id: number;
  username: string;
  color: string;
  wins: number;

  constructor({ id, username, color, wins = 0 }: PlayerInterface) {
    this.id = id;
    this.username = username;
    this.color = color;
    this.wins = wins;
  }

  /**
   * Rename the current player
   * @param {string} username
   */
  rename(username: string) {
    this.username = username;
  }

  /**
   * Adds a win to the current player state.
   */
  addWin() {
    this.wins = +1;
  }
}
