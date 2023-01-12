import { Piece } from "../models/Piece";
import { Player } from "../models/Player";
import { Position } from "../models/Position";
import { Board } from "../models/Board";
import { test } from "@jest/globals";
import { Path } from "../models/Path";

let player1 = new Player({ id: 1, username: "Player1", color: "yellow" });
let player2 = new Player({ id: 2, username: "Player2", color: "red" });

let p1 = new Position(6, 6);
let p2 = new Position(4, 6);
let p3 = new Position(3, 6);
let p4 = new Position(6, 6);
let p5 = new Position(1, 2);

let path1 = new Path({ steps: [p1, p2] }); // [6,6] [4,6]
let path2 = new Path({ steps: [p2, p4] }); // [4,6] [6,6] Should be different from Path1
let path3 = new Path({ steps: [p3, p4] }); // [3,6] [6,6]
let path4 = new Path({ steps: [p3, p5] }); // [3,6] [1,2]
let path5 = new Path({ steps: [p4, p2] }); // [6,6] [4,6]

let paths1 = [path1, path3];
let paths2 = [path3, path2];

test("Compare Position", () => {
  expect(p1.compare(p2)).toBe(false);
  expect(p1.compare(p4)).toBe(true);
  expect(p1.compare(p3)).toBe(false);
});

test("Has Piece", () => {
  let piece1 = new Piece({
    id: 1,
    player: player1,
    position: p2,
  });
  let piece2 = new Piece({
    id: 2,
    player: player2,
    position: p5,
  });
  let board = new Board({
    pieces: [piece1, piece2],
  });

  expect(Board.hasPiece(board, p2)).toBe(true);
  expect(Board.hasPiece(board, p5)).toBe(true);
  expect(Board.hasPiece(board, p1)).toBe(false);
});

test("Compare Path", () => {
  expect(path1.compare(path2)).toBe(false);
  expect(path2.compare(path1)).toBe(false);
  expect(path1.compare(path3)).toBe(false);
  expect(path3.compare(path1)).toBe(false);
  expect(path5.compare(path1)).toBe(true);
  expect(path1.compare(path5)).toBe(true);
});

test("Is included", () => {
  expect(path1.isincluded(paths1)).toBe(true);
  expect(path5.isincluded(paths1)).toBe(true);
  expect(path2.isincluded(paths1)).toBe(false);
  expect(path4.isincluded(paths2)).toBe(false);
});

test("Get eaten", () => {
  let pos0 = new Position(3, 4);
  let posAdv = new Position(2, 3);
  let pos2 = new Position(4, 3);
  let pos3 = new Position(1, 2);

  let board = new Board({
    pieces: [
      new Piece({ id: 1, player: player1, position: pos0 }),
      new Piece({ id: 2, player: player2, position: posAdv }),
    ],
    enabled: true,
  });

  let path1 = new Path({ steps: [pos0, pos3] });
  let path2 = new Path({ steps: [pos0, pos2] });

  expect(path1.getEaten(board).length).toBe(1);
  expect(path2.getEaten(board).length).toBe(0);
});

test("Check getPiece", () => {
  let pos = new Position(3, 4);
  let board = new Board({
    pieces: [
      new Piece({
        id: 1,
        player: player1,
        position: new Position(3, 4),
      }),
    ],
  });

  let piece = Board.getPiece(board, pos);
  expect(piece?.id).toBe(1);
  expect(piece?.player.id).toBe(1);
});

test("Check possible paths", () => {
  let board = Board.startBoard([player1, player2]);
  let piece = Board.getPiece(board, new Position(2, 5))!;

  let paths = Board.possiblePaths(board, piece);
  expect(paths.length).toBe(2);
  expect(paths[0].steps[1].x == paths[1].steps[1].x).toBe(false);
});

test("Check possible paths with recursion", () => {
  let piece2 = new Piece({
    id: 2,
    player: player1,
    position: new Position(3, 4),
  });
  let board = new Board({
    pieces: [
      new Piece({
        id: 1,
        player: player2,
        position: new Position(2, 3),
      }),
      piece2,
    ],
    enabled: true,
  });

  let possiblePaths = Board.possiblePaths(board, piece2);
  expect(possiblePaths.length).toBe(1);
  expect(possiblePaths[0].steps.at(-1)!.x).toBe(1);
  expect(possiblePaths[0].steps.at(-1)!.y).toBe(2);
});

test("Search with friend closeby", () => {
  let piece3 = new Piece({
    id: 3,
    player: player1,
    position: new Position(3, 6),
  });

  let board2 = new Board({
    pieces: [
      new Piece({
        id: 1,
        player: player1,
        position: new Position(4, 5),
      }),
      new Piece({
        id: 2,
        player: player1,
        position: new Position(2, 5),
      }),
      piece3,
    ],
    enabled: true,
  });

  let possiblePaths2 = Board.possiblePaths(board2, piece3);
  expect(possiblePaths2.length).toBe(0);
});

test("Check possible paths", () => {
  let piece1 = new Piece({
    id: 1,
    player: player1,
    position: new Position(1, 4),
  });
  let piece2 = new Piece({
    id: 2,
    player: player1,
    position: new Position(3, 2),
  });
  let piece3 = new Piece({
    id: 3,
    player: player2,
    position: new Position(2, 3),
  });

  let board = new Board({ pieces: [piece1, piece2, piece3] });

  let pathsPink = Board.possiblePaths(board, piece3);
  expect(pathsPink.length).toBe(1);
  expect(pathsPink[0].steps.at(-1)?.compare(new Position(0, 5)));

  let pathsYellow = Board.possiblePaths(board, piece1);
  expect(pathsYellow.length).toBe(1);
  expect(pathsYellow[0].steps.at(-1)?.compare(new Position(0, 3))).toBe(true);
});

test("Test Dama paths", () => {
  let dama = new Piece({
    id: 1,
    player: player1,
    position: new Position(4, 1),
    isdama: true,
  });

  let piece1 = new Piece({
    id: 1,
    player: player2,
    position: new Position(3, 2),
  });

  let board = new Board({ pieces: [dama, piece1] });
  let paths = Board.possiblePaths(board, dama);

  expect(paths.length).toBe(1);
  expect(paths[0].steps.at(-1)?.compare(new Position(2, 3))).toBe(true);
});

test("Test Dama paths 2", () => {
  let dama = new Piece({
    id: 1,
    player: player1,
    position: new Position(4, 1),
    isdama: true,
  });

  let piece1 = new Piece({
    id: 1,
    player: player2,
    position: new Position(3, 2),
  });

  let piece2 = new Piece({
    id: 1,
    player: player2,
    position: new Position(1, 4),
  });

  let board = new Board({ pieces: [dama, piece1, piece2] });
  let paths = Board.possiblePaths(board, dama);

  expect(paths.length).toBe(1);
  expect(paths[0].steps.at(-1)?.compare(new Position(0, 5))).toBe(true);
});

test("Test Dama paths 3", () => {
  let dama = new Piece({
    id: 1,
    player: player1,
    position: new Position(5, 2),
    isdama: true,
  });

  let piece1 = new Piece({
    id: 2,
    player: player2,
    position: new Position(6, 1),
  });

  let piece2 = new Piece({
    id: 3,
    player: player2,
    position: new Position(6, 3),
  });

  let piece3 = new Piece({
    id: 4,
    player: player2,
    position: new Position(4, 3),
  });

  let piece4 = new Piece({
    id: 5,
    player: player2,
    position: new Position(2, 5),
  });

  let board = new Board({ pieces: [dama, piece1, piece2, piece3, piece4] });
  let paths = Board.possiblePaths(board, dama);

  expect(paths.length).toBe(1);
  expect(paths[0].steps.at(-1)?.compare(new Position(1, 6))).toBe(true);
});

test("Test Dama paths 3", () => {
  let dama = new Piece({
    id: 1,
    player: player1,
    position: new Position(5, 2),
    isdama: true,
  });

  let piece1 = new Piece({
    id: 2,
    player: player2,
    position: new Position(6, 1),
  });

  let piece2 = new Piece({
    id: 3,
    player: player2,
    position: new Position(6, 3),
  });

  let piece3 = new Piece({
    id: 4,
    player: player2,
    position: new Position(4, 3),
  });

  let board = new Board({ pieces: [dama, piece1, piece2, piece3] });
  let paths = Board.possiblePaths(board, dama);

  let piece4 = new Piece({
    id: 4,
    player: player2,
    position: new Position(7, 4),
  });

  let board2 = new Board({ pieces: [dama, piece1, piece2, piece3, piece4] });
  let paths2 = Board.possiblePaths(board2, dama);
  expect(paths2.length).toBe(2);
});
