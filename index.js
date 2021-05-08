// images
const PREFIX = "merida/";

const pieces = {
  ROOK: "r",
  KNIGHT: "n",
  BISHOP: "b",
  QUEEN: "q",
  KING: "k",
  PAWN: "p",
};

const firstLineLocations = [
  "ROOK",
  "KNIGHT",
  "BISHOP",
  "QUEEN",
  "KING",
  "BISHOP",
  "KNIGHT",
  "ROOK",
];

const matrix = [];

const container = document.querySelector(".chessboard");
for (let i = 0; i < 8; i++) {
  for (let j = 0; j < 8; j++) {
    // first and last lines
    let pieceImage;
    const blackSpot = (i + j) % 2 == 0;
    // base line
    if (i == 0 || i == 7) {
      const piece = pieces[firstLineLocations[j]];
      console.log(piece);
      pieceImage = PREFIX + (i == 0 ? "w" : "b") + piece + ".svg";
    }
    // pawns
    if (i == 1 || i == 6) {
      pieceImage = PREFIX + (i == 1 ? "w" : "b") + "p.svg";
    }
    const image = `<img height="50px" src="${pieceImage}" />`;
    const imageComponent = i > 1 && i < 6 ? "" : image;
    const cell_even = `<div class='cell even'> ${imageComponent} </div>`;
    const cell_odd = `<div class='cell odd'> ${imageComponent} </div>`;
    const current_cell = blackSpot ? cell_odd : cell_even;
    container.innerHTML += current_cell;
  }
}
