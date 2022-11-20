export class Player {
  id: string;
  username: string;
  color: string;
  wins: number;

  constructor(id: string, username: string, color: string) {
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
