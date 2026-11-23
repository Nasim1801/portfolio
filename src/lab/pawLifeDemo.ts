export const careMoments = ['Morning', 'Afternoon', 'Before dusk'] as const;

export const careActivities = [
  {
    id: 'feed',
    label: 'Feed',
    icon: '🥣',
    prompt: 'Pick Bella’s meal',
    detail:
      'Both meals help. A warm meal gives Bella more energy, while regular kibble gives her a little more fullness.',
    options: [
      { id: 'kibble', label: 'Serve kibble' },
      { id: 'warm-meal', label: 'Serve a warm meal' },
    ],
  },
  {
    id: 'play',
    label: 'Play',
    icon: '🎾',
    prompt: 'A round of fetch',
    detail:
      'Bella will chase the ball if she has enough food and energy. A short game still counts as time together.',
    options: [{ id: 'fetch', label: 'Throw the ball' }],
  },
  {
    id: 'groom',
    label: 'Groom',
    icon: '🫧',
    prompt: 'Tidy Bella’s coat',
    detail: 'A brush cleans up the loose fur. Taking your time helps build trust.',
    options: [
      { id: 'quick-brush', label: 'Quick brush' },
      { id: 'gentle-brush', label: 'Gentle brush' },
    ],
  },
] as const;

type CareChoice = (typeof careActivities)[number]['options'][number]['id'];
type Reaction = 'eating' | 'fetching' | 'tired' | 'groomed' | 'worried' | 'settled' | 'resting';

type CareState = {
  phase: 'ready' | 'care' | 'result' | 'storm' | 'complete';
  turn: number;
  fullness: number;
  energy: number;
  bond: number;
  coat: number;
  reaction: Reaction | null;
  note: string;
};

export const initialCare: CareState = {
  phase: 'ready',
  turn: 0,
  fullness: 38,
  energy: 60,
  bond: 42,
  coat: 54,
  reaction: null,
  note: '',
};

type CareEffect = {
  fullness?: number;
  energy?: number;
  bond?: number;
  coat?: number;
  reaction: Reaction;
  note: string;
};

function careEffect(dog: CareState, choice: CareChoice): CareEffect {
  switch (choice) {
    case 'kibble':
      return {
        fullness: 44,
        energy: 7,
        bond: 5,
        reaction: 'eating',
        note: 'Bella tucks into her kibble. She’s full enough for an outing.',
      };
    case 'warm-meal':
      return {
        fullness: 36,
        energy: 17,
        bond: 9,
        reaction: 'eating',
        note: 'Bella finishes her warm meal, then noses the bowl. She has energy for a good game.',
      };
    case 'fetch':
      return dog.fullness >= 45 && dog.energy >= 55
        ? {
            fullness: -15,
            energy: -18,
            bond: 19,
            coat: -11,
            reaction: 'fetching',
            note: 'Bella bounds after the ball and brings it straight back. She’s tired, muddy and pleased with herself.',
          }
        : {
            fullness: -8,
            energy: -10,
            bond: 3,
            coat: -3,
            reaction: 'tired',
            note: 'Bella takes a few steps after the ball, then leaves it. She needs food or rest before a longer game.',
          };
    case 'quick-brush':
      return {
        fullness: -3,
        coat: 37,
        bond: 4,
        reaction: 'groomed',
        note: 'A quick brush clears the loose fur. Bella shakes out her newly tidy coat.',
      };
    case 'gentle-brush':
      return {
        fullness: -5,
        energy: -4,
        coat: 28,
        bond: 13,
        reaction: 'groomed',
        note: 'You pause when Bella fidgets. She relaxes into the brush and stays beside you.',
      };
  }
}

function applyEffect(dog: CareState, effect: CareEffect) {
  const bounded = (value: number) => Math.max(0, Math.min(100, value));
  return {
    ...dog,
    fullness: bounded(dog.fullness + (effect.fullness ?? 0)),
    energy: bounded(dog.energy + (effect.energy ?? 0)),
    bond: bounded(dog.bond + (effect.bond ?? 0)),
    coat: bounded(dog.coat + (effect.coat ?? 0)),
    reaction: effect.reaction,
    note: effect.note,
  };
}

type CareAction =
  | { type: 'start' | 'reset' | 'continue' }
  | { type: 'care'; choice: CareChoice }
  | { type: 'comfort'; choice: 'sit' | 'den' };

export function careReducer(dog: CareState, action: CareAction): CareState {
  if (action.type === 'reset') return initialCare;
  if (action.type === 'start' && dog.phase === 'ready') return { ...dog, phase: 'care' };
  if (action.type === 'care' && dog.phase === 'care') {
    return {
      ...applyEffect(dog, careEffect(dog, action.choice)),
      turn: dog.turn + 1,
      phase: 'result',
    };
  }
  if (action.type === 'continue' && dog.phase === 'result') {
    return dog.turn === careMoments.length
      ? { ...dog, phase: 'storm', reaction: 'worried', note: '' }
      : { ...dog, phase: 'care', reaction: null, note: '' };
  }
  if (action.type !== 'comfort' || dog.phase !== 'storm') return dog;

  const trusting = dog.bond >= 65 && dog.fullness >= 35;
  const effect: CareEffect =
    action.choice === 'den'
      ? {
          energy: 14,
          bond: 8,
          reaction: 'resting',
          note: 'Bella finds the quiet den and rests while the thunder passes.',
        }
      : trusting
        ? {
            energy: -5,
            bond: 18,
            reaction: 'settled',
            note: 'Bella recognises your voice and comes straight to you. She settles beside you until the storm passes.',
          }
        : {
            energy: -11,
            bond: 7,
            reaction: 'settled',
            note: 'Bella hangs back through the loudest thunder. Given space and time, she eventually settles near you.',
          };
  return { ...applyEffect(dog, effect), phase: 'complete' };
}
