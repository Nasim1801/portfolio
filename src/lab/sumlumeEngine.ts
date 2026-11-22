export type TileValue = number | null;

export const initialPuzzle: readonly TileValue[] = [
  4, 6, 7, 2, 8, 3, 3, 1, 9, 5, 6, 4, 8, 8, 2, 1, 9, 5, 5, 7,
];

export const puzzleColumns = 5;

/** Sumlume's core rule: two numbers match when they are equal or add up to 10. */
export function isMatch(first: number, second: number) {
  return first === second || first + second === 10;
}

/**
 * The home-page demo board (shown in the Sumlume project; the name is historical).
 * Any two tiles may be paired, regardless of position.
 * It is built from eight complementary pairs, so it can always be cleared.
 */
export const heroBoard: readonly number[] = [7, 2, 5, 9, 4, 8, 1, 6, 3, 6, 5, 2, 8, 4, 7, 3];

/** True when at least one valid pair remains among the uncleared tiles. */
export function hasMove(board: readonly TileValue[]) {
  const values = board.filter((value): value is number => value !== null);
  return values.some((value, index) =>
    values.some((other, otherIndex) => otherIndex > index && isMatch(value, other)),
  );
}

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
  return isMatch(firstValue, secondValue);
}

export function clearPair(board: readonly TileValue[], first: number, second: number) {
  if (!isValidPair(board, first, second)) return [...board];
  return board.map((value, index) => (index === first || index === second ? null : value));
}
