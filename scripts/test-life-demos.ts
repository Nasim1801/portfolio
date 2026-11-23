import assert from 'node:assert/strict';
import { careReducer, initialCare, initialLife, lifeReducer } from '../src/lab/lifeDemos';

const life = lifeReducer(initialLife, { type: 'start' });
assert.equal(lifeReducer(life, { type: 'advance' }), life);
const trained = lifeReducer(life, { type: 'choose', index: 0 });
const apprentice = lifeReducer(life, { type: 'choose', index: 1 });
assert.equal(trained.savings, 800);
assert.equal(apprentice.savings, 2100);
assert.equal(lifeReducer(trained, { type: 'choose', index: 1 }), trained);
assert.equal(life.savings, 1200);

const advanceLife = (state: typeof life) => lifeReducer(state, { type: 'advance' });
const sharedFlat = lifeReducer(advanceLife(trained), { type: 'choose', index: 1 });
const overtime = lifeReducer(advanceLife(apprentice), { type: 'choose', index: 0 });
assert.match(sharedFlat.note, /Sharing rent/);
assert.equal(sharedFlat.friendship, 68);
assert.equal(overtime.friendship, 45);

const offered = lifeReducer(advanceLife(sharedFlat), { type: 'choose', index: 0 });
const rejected = lifeReducer(advanceLife(overtime), { type: 'choose', index: 0 });
assert.equal(offered.career, 'Skilled employee');
assert.equal(rejected.career, 'Junior employee');
assert.match(rejected.note, /requires the qualification/);
const completed = advanceLife(offered);
assert.equal(completed.phase, 'complete');
assert.equal(completed.year, 3);
assert.equal(completed.savings, 2800);
assert.equal(advanceLife(completed), completed);
assert.deepEqual(lifeReducer(completed, { type: 'reset' }), initialLife);

const dog = careReducer(initialCare, { type: 'start' });
assert.equal(careReducer(initialCare, { type: 'choose', index: 0 }), initialCare);
const fed = careReducer(dog, { type: 'choose', index: 0 });
const played = careReducer(dog, { type: 'choose', index: 1 });
assert.equal(fed.fullness, 78);
assert.equal(played.energy, 38);
assert.equal(dog.fullness, 38);
const longOuting = careReducer(fed, { type: 'choose', index: 0 });
const shortOuting = careReducer(played, { type: 'choose', index: 0 });
assert.match(longOuting.note, /explores/);
assert.match(shortOuting.note, /cut the visit short/);
assert.ok(longOuting.bond > shortOuting.bond);
const bonded = careReducer(longOuting, { type: 'choose', index: 0 });
const quieter = careReducer(shortOuting, { type: 'choose', index: 0 });
assert.match(bonded.note, /familiar voice/);
assert.match(quieter.note, /little time/);
assert.equal(bonded.phase, 'complete');
assert.equal(bonded.turn, 3);
assert.equal(careReducer(bonded, { type: 'choose', index: 1 }), bonded);
assert.deepEqual(careReducer(bonded, { type: 'reset' }), initialCare);
const rested = careReducer(fed, { type: 'choose', index: 1 });
const bounded = careReducer(rested, { type: 'choose', index: 1 });
assert.equal(rested.fullness, 100);
assert.equal(bounded.energy, 100);

console.log('PathLife and PawLife browser simulation rule tests passed.');
