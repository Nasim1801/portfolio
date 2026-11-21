import assert from 'node:assert/strict';
import { clearPair, initialPuzzle, isNeighbour, isValidPair } from '../src/lab/sumlumeEngine';

assert.equal(isNeighbour(0, 1), true, 'horizontal neighbours should connect');
assert.equal(isNeighbour(0, 5), true, 'vertical neighbours should connect');
assert.equal(isNeighbour(0, 6), true, 'diagonal neighbours should connect');
assert.equal(isNeighbour(0, 2), false, 'separated tiles should not connect');

assert.equal(isValidPair(initialPuzzle, 0, 1), true, '4 + 6 should be valid');
assert.equal(isValidPair(initialPuzzle, 5, 6), true, 'equal 3 tiles should be valid');
assert.equal(isValidPair(initialPuzzle, 0, 5), false, '4 + 3 should be invalid');

const cleared = clearPair(initialPuzzle, 0, 1);
assert.equal(cleared[0], null);
assert.equal(cleared[1], null);
assert.equal(initialPuzzle[0], 4, 'the source board must remain immutable');

const unchanged = clearPair(initialPuzzle, 0, 5);
assert.deepEqual(unchanged, [...initialPuzzle], 'an invalid pair must not change the board');

console.log('Engineering Lab rule tests passed.');
