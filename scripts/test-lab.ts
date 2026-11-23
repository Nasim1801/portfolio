import assert from 'node:assert/strict';
import {
  clearPair,
  hasMove,
  heroBoard,
  initialPuzzle,
  isMatch,
  isNeighbour,
  isValidPair,
} from '../src/lab/sumlumeEngine';

assert.equal(isNeighbour(0, 1), true, 'horizontal neighbours should connect');
assert.equal(isNeighbour(0, 5), true, 'vertical neighbours should connect');
assert.equal(isNeighbour(0, 6), true, 'diagonal neighbours should connect');
assert.equal(isNeighbour(0, 2), false, 'separated tiles should not connect');

assert.equal(isValidPair(initialPuzzle, 0, 1), true, '4 + 6 should be valid');
assert.equal(isValidPair(initialPuzzle, 5, 6), true, 'equal 3 tiles should be valid');
assert.equal(isValidPair(initialPuzzle, 0, 5), false, '4 + 3 should be invalid');
assert.equal(isValidPair(initialPuzzle, initialPuzzle.length, initialPuzzle.length + 1), false);
assert.equal(isValidPair(initialPuzzle, -2, -1), false);
assert.equal(isValidPair(initialPuzzle, 0.5, 1.5), false);

const cleared = clearPair(initialPuzzle, 0, 1);
assert.equal(cleared[0], null);
assert.equal(cleared[1], null);
assert.equal(initialPuzzle[0], 4, 'the source board must remain immutable');
assert.equal(isValidPair(cleared, 0, 1), false, 'cleared tiles cannot be matched again');

const unchanged = clearPair(initialPuzzle, 0, 5);
assert.deepEqual(unchanged, [...initialPuzzle], 'an invalid pair must not change the board');

assert.equal(isMatch(3, 7), true, '3 + 7 should make 10');
assert.equal(isMatch(5, 5), true, 'equal numbers should match');
assert.equal(isMatch(4, 5), false, '4 and 5 should not match');

// The hero board must clear completely whatever valid order a player chooses.
// Positions do not matter on this board, so the state is the sorted list of values.
const solved = new Map<string, boolean>();
function clearsFromEveryOrder(values: number[]): boolean {
  const key = values.join(',');
  if (solved.has(key)) return solved.get(key)!;
  let result = values.length === 0 || hasMove(values);
  for (let first = 0; result && first < values.length; first += 1) {
    for (let second = first + 1; result && second < values.length; second += 1) {
      if (!isMatch(values[first], values[second])) continue;
      const rest = values.filter((_, index) => index !== first && index !== second);
      result = clearsFromEveryOrder(rest);
    }
  }
  solved.set(key, result);
  return result;
}
assert.equal(heroBoard.length, 16, 'the hero board is a 4 by 4 grid');
assert.equal(
  clearsFromEveryOrder([...heroBoard].sort((a, b) => a - b)),
  true,
  'the hero board can always be cleared',
);
const counts = new Map<number, number>();
for (const value of heroBoard) counts.set(value, (counts.get(value) ?? 0) + 1);
for (const [value, count] of counts) {
  if (value === 5) assert.equal(count % 2, 0, 'fives come in pairs');
  else assert.equal(count, counts.get(10 - value), `${value} needs a partner of ${10 - value}`);
}
assert.equal(hasMove([null, null]), false, 'an empty board has no moves');

console.log('Engineering Lab and hero board rule tests passed.');
