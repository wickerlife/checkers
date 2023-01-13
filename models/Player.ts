interface PlayerInterface {
  id: number;
  username: string;
  color: string;
  wins?: number;
}

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

  rename(username: string) {
    this.username = username;
  }

  addWin() {
    this.wins = +1;
  }
}
