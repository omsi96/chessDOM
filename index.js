// images
const PREFIX = "merida/";
const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h"];

let matrix;
const whiteMatrix = [
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"],
  [...new Array(8).fill("wp")],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  [...new Array(8).fill("bp")],
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
];
const blackMatrix = [
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  [...new Array(8).fill("bp")],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
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
      const darkSport = (i + j) % 2 == 0;
      // base line
      const cell = `<div onclick="selectMovement('${loc(i, j)}' )" id="${loc(
        i,
        j
      )}" class='cell  ${darkSport ? "even" : "odd"}'> </div>`;
      container.innerHTML += cell;
    }
  }
}

function loc(i, j) {
  return alphabet[j] + (i + 1);
}

// give it a text, `h4` it gives you back {i:3, j:7}
function ind(currentLocation) {
  const [letter, row] = currentLocation.split("");
  const column = alphabet.findIndex((e) => e == letter);
  return { i: row - 1, j: column };
}

// This gives a digital representation for the cell (like 10, 5, etc)
// give it `h4` it gives you back 37
function decimalLocation(currentLocation) {
  const { i, j } = ind(currentLocation);
  return +`${i}${j}`;
}
// give it `33` it gives you back `d4`
function alphabaticLocationFromDecimal(decimal) {
  const [row, col] = `${decimal < 10 ? "0" + decimal : decimal}`.split("");
  console.log(
    "Converting ",
    decimal,
    "to alphabitic -> row:",
    row,
    ", col: ",
    col
  );
  return `${alphabet[col]}${+row + 1}`;
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

function updateAvailableMovesDots(availableMoves) {
  availableMoves.forEach((location) => {
    console.log("querying ", availableMoves, location);
    let cell = document.querySelector(`#${location}`);
    console.log("found cell:", cell);
    cell.innerHTML += `<div class="dot"></div>`;
  });
}

function move(currentLocation, newLocation) {
  const { i: x, j: y } = ind(newLocation);
  const piece = findPieceFromLocation(currentLocation);
  console.log(
    "UPDATING CELL: at",
    ind(newLocation),
    "it currently has value of:",
    matrix[3][3],
    "And piece: ",
    piece,
    "}}"
  );
  matrix[+ind(currentLocation).i][+ind(currentLocation).j] = "";
  matrix[+x][+y] = piece;
  console.log("RETURNED PIECE IS", piece);
  updateBoard();
}

function findPieceFromLocation(loc) {
  try {
    const cell = document.querySelector(`#${loc}`);
    let piece;
    if (cell.innerHTML.includes("img")) {
      piece = cell.children[0].id;
      return piece;
    }
  } catch (error) {
    console.log("🚨 Something wrong happened", loc);
    return null;
  }
}
let selectedPiece = null;

function selectMovement(pieceLocation) {
  console.log("I'm here", selectedPiece);
  const piece = findPieceFromLocation(pieceLocation);
  if (selectedPiece == null) {
    // SELECTION
    if (piece) {
      selectedPiece = { piece, pieceLocation };
      const availableMoves = findAvailableMoves();
      updateAvailableMovesDots(availableMoves);
      console.log("AVAILABLE MOVES", availableMoves);
    }
    console.log(selectedPiece);
  } else {
    // MOVEMENTS
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
  } else if (piece == "b") {
    // BISHOP
    console.log("BISHOP", bishopLocations(pieceLocation), pieceLocation);
    availableMoves = [...availableMoves, ...bishopLocations(pieceLocation)];
    console.log("¶¶¶¶¶", availableMoves);
    return availableMoves;
  }
  // return availableMoves;
}

function destinationForward(color, steps) {
  let factor = color == "w" ? 1 : -1;
  return factor * steps;
}
let placeHolderArray = [];

function bishopLocations(currentLocation) {
  const dl = decimalLocation(currentLocation);
  console.log("⚠️", dl);
  const result =
    diagonals(dl, 11) +
    diagonals(dl, -11) +
    diagonals(dl, 9) +
    diagonals(dl, -9);
  return result
    .split(",")
    .filter((e) => e != "")
    .map((e) => +e)
    .map((e) => alphabaticLocationFromDecimal(e))
    .filter((e) => !e.includes("undefined"));
}

function diagonals(currentLocation, step = 0) {
  const pieceLocation = alphabaticLocationFromDecimal(currentLocation + step);
  console.log("piece pieceLocation", currentLocation, pieceLocation);
  const foundPiece = findPieceFromLocation(pieceLocation);
  console.log("Found piece:", foundPiece);
  const locationOccupied = foundPiece != null;
  const { i: row, j: col } = ind(pieceLocation);
  const rowInRange = row >= 0 && row <= 7;
  const colInRange = col >= 0 && col <= 7;
  console.log("COMARE: ", pieceLocation, foundPiece);
  const isSelectedPiece = pieceLocation == foundPiece;
  console.log("row:", row, "col:", col);
  console.log(rowInRange, colInRange, locationOccupied && !isSelectedPiece);
  if ((!colInRange && !rowInRange) || (locationOccupied && !isSelectedPiece)) {
    console.log("got to the base case, location: ", pieceLocation);
    return "";
  }
  // placeHolderArray.push(currentLocation); // on hold
  return (
    `${+currentLocation + step},` + diagonals(currentLocation + step, step)
  );
}

init();
updateBoard();
