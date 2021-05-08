// images
const PREFIX = "merida/";
const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h"];

let matrix;
const whiteMatrix = [
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
  [...new Array(8).fill("wp")],
  ...new Array(4).fill([...new Array(8).fill("")]),
  [...new Array(8).fill("bp")],
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
];
const blackMatrix = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  [...new Array(8).fill("bp")],

  ...new Array(4).fill([...new Array(8).fill("")]),
  [...new Array(8).fill("wp")],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
];

const turn = "w";
matrix = turn == "w" ? whiteMatrix : blackMatrix;

console.log(matrix);
const container = document.querySelector(".chessboard");

function init() {
  for (let i = 7; i >= 0; i--) {
    for (let j = 0; j < 8; j++) {
      // first and last lines
      const blackSpot = (i + j) % 2 == 0;
      // base line
      const cell = `<div onclick="selectMovement('${loc(i, j)}' )" id="${loc(
        i,
        j
      )}" class='cell ${blackSpot ? "even" : "odd"}'> </div>`;
      container.innerHTML += cell;
    }
  }
}

function loc(i, j) {
  return alphabet[j] + (i + 1);
}

function ind(currentLocation) {
  const [letter, row] = currentLocation.split("");
  const column = alphabet.findIndex((e) => e == letter);
  return { i: row - 1, j: column };
}

function updateBoard() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      // first and last lines
      const piece = matrix[i][j];
      const pieceLocation = loc(i, j);
      updateImage(pieceLocation, piece);
    }
  }
}

function updateImage(pieceLocation, piece) {
  const image = `<img id="${piece}"height="50px" src="${PREFIX}/${piece}.svg" />`;
  const imageComponent = piece == "" ? "" : image;
  const cell = document.querySelector(`#${pieceLocation}`);
  cell.innerHTML = imageComponent;
}

function move(currentLocation, newLocation) {
  const piece = findPieceFromLocation(currentLocation);
  updateImage(currentLocation, "");
  updateImage(newLocation, piece);
}

function findPieceFromLocation(loc) {
  const cell = document.querySelector(`#${loc}`);
  let piece;
  if (cell.innerHTML.includes("img")) {
    piece = cell.children[0].id;
    return piece;
  }
}
let selectedPiece = null;

function selectMovement(pieceLocation) {
  console.log("I'm here", selectedPiece);
  const piece = findPieceFromLocation(pieceLocation);
  if (selectedPiece == null) {
    // selection
    if (piece) {
      selectedPiece = { piece, pieceLocation };
      const availableMoves = findAvailableMoves();
      console.log("AVAILABLE MOVES", availableMoves);
    }
    console.log(selectedPiece);
  } else {
    console.log("i'm at line 90, my selected piece is ", selectedPiece);
    if (validateMovement(pieceLocation)) {
      move(selectedPiece.pieceLocation, pieceLocation);
      selectedPiece = null;
    }
  }
}

function validateMovement(destination) {
  // color
  if (!selectedPiece) {
    return false;
  }
  const [color, piece] = selectedPiece.piece.split("");
  const foundDestinationPiece = findPieceFromLocation(destination);

  console.log("VALIDATING ", color, piece);
  // if tapping itself
  if (destination == selectedPiece.pieceLocation) {
    return false;
  }
  // eating self
  else if (foundDestinationPiece) {
    const [destinationColor, destinationPiece] = foundDestinationPiece?.split(
      ""
    );
    console.log("EATING!", destinationColor, color);
    if (destinationColor == color) {
      console.log("EATING SELF?");
      selectedPiece = { piece: destinationPiece, pieceLocation: destination };
      // eating self?
      return false;
    }
  }
  // VALIDATING MOVEMENTS
  const availableMoves = findAvailableMoves();
  console.log("DESTINATION: ", destination);
  if (availableMoves?.includes(destination)) {
    return true;
  }

  return false;
}

function findAvailableMoves() {
  // PAWN
  const { piece: pieceAndColor, pieceLocation } = selectedPiece;
  const [color, piece] = pieceAndColor.split("");
  const axis = ind(pieceLocation);
  console.log("Piece location", pieceLocation, "Has axis of:", axis);
  let availableMoves = [];
  if (piece == "p") {
    // PAWN
    console.log("PAWN");
    if (+axis.i == 1 || +axis.i == 6) {
      // special case (move 2 steps only for the second row)
      availableMoves.push({
        i: +axis.i + destinationForward(color, 2),
        j: +axis.j,
      });
    }
    availableMoves.push({
      i: +axis.i + destinationForward(color, 1),
      j: +axis.j,
    });

    return availableMoves.map((e) => loc(e.i, e.j));
  }
}

function destinationForward(color, steps) {
  let factor = color == "w" ? 1 : -1;
  return factor * steps;
}

init();
updateBoard();
