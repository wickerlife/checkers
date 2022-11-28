interface PlayerInterface {
  id: number;
  username: string;
  color: string;
}

export class Player {
  id: number;
  username: string;
  color: string;
  wins: number;

  constructor({ id, username, color }: PlayerInterface) {
    this.id = id;
    this.username = username;
    this.color = color;
    this.wins = 0;
  }

  rename(username: string) {
    this.username = username;
  }

  addWin() {
    this.wins = +1;
  }
}
