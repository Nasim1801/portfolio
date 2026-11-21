export type TileValue = number | null;

export const initialPuzzle: readonly TileValue[] = [
  4, 6, 7, 2, 8, 3, 3, 1, 9, 5, 6, 4, 8, 8, 2, 1, 9, 5, 5, 7,
];

export const puzzleColumns = 5;

export function isNeighbour(first: number, second: number, columns = puzzleColumns) {
  if (first === second) return false;
  const firstRow = Math.floor(first / columns);
  const secondRow = Math.floor(second / columns);
  const firstColumn = first % columns;
  const secondColumn = second % columns;
  return Math.abs(firstRow - secondRow) <= 1 && Math.abs(firstColumn - secondColumn) <= 1;
}

export function isValidPair(
  board: readonly TileValue[],
  first: number,
  second: number,
  columns = puzzleColumns,
) {
  const firstValue = board[first];
  const secondValue = board[second];
  if (firstValue === null || secondValue === null || !isNeighbour(first, second, columns)) {
    return false;
  }
  return firstValue === secondValue || firstValue + secondValue === 10;
}

export function clearPair(board: readonly TileValue[], first: number, second: number) {
  if (!isValidPair(board, first, second)) return [...board];
  return board.map((value, index) => (index === first || index === second ? null : value));
}
