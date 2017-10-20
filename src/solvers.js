/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  let solution = undefined;
  let board = new Board({n: n});
  const test = board.hasAnyRookConflictsOn;

  solution = placePieces(0, 0, 0, n, board, test);

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  let solutionCount = 0;
  let board = new Board({n: n});
  const test = board.hasAnyRookConflictsOn;

  solutionCount = placePieces(0, 0, 0, n, board, test, solutionCount, true, 'rook');

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  let solution = undefined;
  let board = new Board({n: n});
  const test = board.hasAnyQueenConflictsOn;

  solution = placePieces(0, 0, 0, n, board, test);
  if (solution === 0) {
    solution = board.rows();
  }

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  let solutionCount = n ? 0 : 1;
  let board = new Board({n: n});
  const test = board.hasAnyQueenConflictsOn;

  solutionCount = placePieces(0, 0, 0, n, board, test, solutionCount, true, 'queen');

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};

var placePieces = function(row, col, pieces, n, board, test, solution = 0, count = false, fast = false, excludes = []) {
  // Iterate over columns in current row
  for (; board._isInBounds(row, col); col++) {
    // Use symmetry of the board to extrapolate
    if (fast === 'rook' && col === row + 1) {
      return solution * (n - row);
    }
    // If even columns for queens return double solution for half the board
    if (fast === 'queen' && row === 0 && col === Math.floor(n / 2)) {
      solution *= 2;
    }
    // If odd columns for queens return double solution plus the center column
    if (fast === 'queen' && row === 0 && col === Math.ceil(n / 2)) {
      return solution;
    }

    board.togglePiece(row, col);
    // test for conflicts
    if (test.call(board, row, col)) {
      board.togglePiece(row, col);
      if (col + 1 < n) {
        // Skip columns set in previous rows
        for (; excludes[col + 1]; col++);

        solution = placePieces(row, col + 1, pieces, n, board, test, solution, count, fast, excludes);
        // return first solution
        if (solution.constructor === Array) {
          return solution;
        }
        if (board.rows()[row][col + 1]) {
          board.togglePiece(row, col + 1);
        }
        return solution;
      }
    } else { // no conflicts found
      pieces++;
      if (row + 1 < n) {
        // store columns that already have pieces on them
        excludes[col] = true;

        solution = placePieces(row + 1, 0, pieces, n, board, test, solution, count, fast, excludes);
        // return first solution
        if (solution.constructor === Array) {
          return solution;
        }
        delete excludes[col];
        // Unset pieces
        if (board.rows()[row + 1][0]) {
          board.togglePiece(row + 1, 0);
        }
        if (board.rows()[row][col]) {
          board.togglePiece(row, col);
        }
        pieces--;
      }
    }

    // Check if valid solution has been found
    if (pieces >= n) {
      // return first solution
      if (count === false) {
        return board.rows();
      }
      solution++;
      return solution;
    }
  }

  return solution;
};
