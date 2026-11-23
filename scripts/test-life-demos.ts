import assert from 'node:assert/strict';
import { initialLife, lifeReducer } from '../src/lab/lifeDemos';
import { careActivities, careReducer, initialCare } from '../src/lab/pawLifeDemo';

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

assert.deepEqual(trained.history, [
  { age: 18, choice: 'Enrol in training', savings: -400, happiness: 8, friendship: 0 },
]);
assert.equal(completed.history.length, 3);
assert.equal(life.history.length, 0);

const dog = careReducer(initialCare, { type: 'start' });
assert.equal(careReducer(initialCare, { type: 'care', choice: 'fetch' }), initialCare);
assert.equal(careReducer(dog, { type: 'comfort', choice: 'sit' }), dog);
const kibble = careReducer(dog, { type: 'care', choice: 'kibble' });
const meal = careReducer(dog, { type: 'care', choice: 'warm-meal' });
assert.equal(kibble.fullness, 82);
assert.equal(meal.energy, 77);
assert.ok(kibble.fullness > meal.fullness && kibble.energy < meal.energy);
assert.equal(dog.fullness, 38);
assert.equal(careReducer(meal, { type: 'care', choice: 'fetch' }), meal);

const next = (state: typeof dog) => careReducer(state, { type: 'continue' });
const readyToPlay = careReducer(next(meal), { type: 'care', choice: 'fetch' });
const tooHungry = careReducer(dog, { type: 'care', choice: 'fetch' });
assert.equal(readyToPlay.reaction, 'fetching');
assert.equal(tooHungry.reaction, 'tired');
assert.equal(readyToPlay.coat, 43);
const groomed = careReducer(next(readyToPlay), { type: 'care', choice: 'gentle-brush' });
assert.equal(groomed.coat, 71);
assert.equal(groomed.bond, 83);
const storm = next(groomed);
assert.equal(storm.reaction, 'worried');
assert.equal(storm.phase, 'storm');
const comforted = careReducer(storm, { type: 'comfort', choice: 'sit' });
assert.match(comforted.note, /comes straight to you/);
assert.equal(comforted.bond, 100);
assert.equal(comforted.phase, 'complete');
const den = careReducer(storm, { type: 'comfort', choice: 'den' });
assert.ok(den.energy > comforted.energy);
assert.equal(den.reaction, 'resting');
assert.equal(careReducer(comforted, { type: 'care', choice: 'kibble' }), comforted);
assert.deepEqual(careReducer(comforted, { type: 'reset' }), initialCare);
const lowTrust = next(
  careReducer(next(careReducer(next(tooHungry), { type: 'care', choice: 'quick-brush' })), {
    type: 'care',
    choice: 'quick-brush',
  }),
);
assert.match(careReducer(lowTrust, { type: 'comfort', choice: 'sit' }).note, /hangs back/);

const choices = careActivities.flatMap((activity) => [...activity.options].map(({ id }) => id));
for (const first of choices)
  for (const second of choices)
    for (const third of choices) {
      const evening = [first, second, third].reduce(
        (state, choice) => next(careReducer(state, { type: 'care', choice })),
        dog,
      );
      assert.equal(evening.phase, 'storm');
      assert.equal(evening.turn, 3);
      for (const choice of ['sit', 'den'] as const) {
        const final = careReducer(evening, { type: 'comfort', choice });
        assert.equal(final.phase, 'complete');
        assert.ok(
          [final.fullness, final.energy, final.bond, final.coat].every(
            (stat) => stat >= 0 && stat <= 100,
          ),
        );
      }
    }

console.log('PathLife and PawLife browser simulation rule tests passed.');
