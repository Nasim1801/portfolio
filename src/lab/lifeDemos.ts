type ChoiceIndex = 0 | 1;
type Choice<State> = {
  label: string;
  apply: (state: State) => Partial<State> & { note: string };
};
type Chapter<State> = {
  title: string;
  situation: string;
  choices: readonly [Choice<State>, Choice<State>];
};

function percent(value: number) {
  return Math.min(100, Math.max(0, value));
}

type LifeState = {
  phase: 'ready' | 'choice' | 'outcome' | 'complete';
  year: number;
  savings: number;
  happiness: number;
  friendship: number;
  career: string;
  studied: boolean;
  note: string;
};

export const initialLife: LifeState = {
  phase: 'ready',
  year: 0,
  savings: 1200,
  happiness: 60,
  friendship: 55,
  career: 'Leaving school',
  studied: false,
  note: '',
};

export const lifeChapters: readonly Chapter<LifeState>[] = [
  {
    title: 'Your first step',
    situation:
      'You’ve finished school. A training course costs money now, while an apprenticeship pays from day one.',
    choices: [
      {
        label: 'Enrol in training',
        apply: (life) => ({
          savings: life.savings - 400,
          happiness: life.happiness + 8,
          career: 'Trainee',
          studied: true,
          note: 'You pay £400 for training. The course is rewarding and opens up a skilled role later.',
        }),
      },
      {
        label: 'Take the apprenticeship',
        apply: (life) => ({
          savings: life.savings + 900,
          happiness: life.happiness + 3,
          career: 'Apprentice',
          note: 'You build experience and add £900 to your savings this year.',
        }),
      },
    ],
  },
  {
    title: 'The rent goes up',
    situation:
      'An unexpected rent rise changes your plans. You can work more hours or share a flat with a friend.',
    choices: [
      {
        label: 'Work extra shifts',
        apply: (life) => ({
          savings: life.savings + 650,
          happiness: life.happiness - 8,
          friendship: life.friendship - 10,
          note: 'Extra shifts leave you £650 ahead after rent, with less time to rest and see your friend.',
        }),
      },
      {
        label: 'Move in with a friend',
        apply: (life) => ({
          savings: life.savings + 200,
          happiness: life.happiness + 5,
          friendship: life.friendship + 13,
          note: 'Sharing rent leaves £200 in savings and gives you more time together.',
        }),
      },
    ],
  },
  {
    title: 'A role opens up',
    situation:
      'A skilled job is advertised. It requires the training qualification. You can apply or build on your current experience.',
    choices: [
      {
        label: 'Apply for the skilled role',
        apply: (life) =>
          life.studied
            ? {
                savings: life.savings + 1800,
                happiness: life.happiness + 10,
                career: 'Skilled employee',
                note: 'Your qualification gets you an interview and then the job. You save £1,800 this year.',
              }
            : {
                savings: life.savings + 400,
                happiness: life.happiness - 6,
                career: 'Junior employee',
                note: 'The role requires the qualification. You stay with your employer as a junior and save £400 this year.',
              },
      },
      {
        label: 'Build on your experience',
        apply: (life) => ({
          savings: life.savings + 850,
          happiness: life.happiness + 4,
          career: life.studied ? 'Junior employee' : 'Promoted apprentice',
          note: 'Steady work adds £850 to your savings and gives you time to build experience.',
        }),
      },
    ],
  },
];

type LifeAction = { type: 'start' | 'reset' | 'advance' } | { type: 'choose'; index: ChoiceIndex };

export function lifeReducer(life: LifeState, action: LifeAction): LifeState {
  if (action.type === 'reset') return initialLife;
  if (action.type === 'start' && life.phase === 'ready') return { ...life, phase: 'choice' };
  if (action.type === 'choose' && life.phase === 'choice') {
    const next = { ...life, ...lifeChapters[life.year].choices[action.index].apply(life) };
    return {
      ...next,
      happiness: percent(next.happiness),
      friendship: percent(next.friendship),
      phase: 'outcome',
    };
  }
  if (action.type === 'advance' && life.phase === 'outcome') {
    const year = life.year + 1;
    return { ...life, year, phase: year === lifeChapters.length ? 'complete' : 'choice' };
  }
  return life;
}

type CareState = {
  phase: 'ready' | 'playing' | 'complete';
  turn: number;
  fullness: number;
  energy: number;
  bond: number;
  note: string;
};

export const initialCare: CareState = {
  phase: 'ready',
  turn: 0,
  fullness: 38,
  energy: 60,
  bond: 42,
  note: '',
};

export const careChapters: readonly Chapter<CareState>[] = [
  {
    title: 'Morning with Bella',
    situation: 'Bella is curious and ready to play, but her breakfast bowl is empty.',
    choices: [
      {
        label: 'Serve breakfast',
        apply: (dog) => ({
          fullness: dog.fullness + 40,
          energy: dog.energy + 14,
          bond: dog.bond + 7,
          note: 'Bella finishes breakfast and has more energy for her afternoon.',
        }),
      },
      {
        label: 'Play fetch',
        apply: (dog) => ({
          fullness: dog.fullness - 11,
          energy: dog.energy - 22,
          bond: dog.bond + 15,
          note: 'Bella loves the attention. Fetch brings you closer, but she’s tired and still hungry.',
        }),
      },
    ],
  },
  {
    title: 'An afternoon together',
    situation: 'A neighbour invites you to the park. Check Bella’s energy before you decide.',
    choices: [
      {
        label: 'Visit the park',
        apply: (dog) =>
          dog.energy >= 55
            ? {
                fullness: dog.fullness - 15,
                energy: dog.energy - 18,
                bond: dog.bond + 19,
                note: 'Bella has energy for the outing. She explores and keeps coming back to check in with you.',
              }
            : {
                fullness: dog.fullness - 8,
                energy: dog.energy - 12,
                bond: dog.bond + 3,
                note: 'Bella tires quickly, so you cut the visit short and head home together.',
              },
      },
      {
        label: 'Offer a snack and rest',
        apply: (dog) => ({
          fullness: dog.fullness + 28,
          energy: dog.energy + 24,
          bond: dog.bond + 6,
          note: 'A snack and a nap help Bella recover. She settles near you.',
        }),
      },
    ],
  },
  {
    title: 'A sudden thunderstorm',
    situation: 'The first clap of thunder startles Bella. How will you help her settle?',
    choices: [
      {
        label: 'Sit with Bella',
        apply: (dog) =>
          dog.bond >= 65
            ? {
                energy: dog.energy - 6,
                bond: dog.bond + 18,
                note: 'Bella hears your familiar voice and settles beside you as the storm passes.',
              }
            : {
                energy: dog.energy - 10,
                bond: dog.bond + 8,
                note: 'Bella needs a little time to relax. She eventually settles near you.',
              },
      },
      {
        label: 'Make a quiet den',
        apply: (dog) => ({
          energy: dog.energy + 10,
          bond: dog.bond + 10,
          note: 'Bella finds a place to rest while the thunder passes. She emerges calmer and more rested.',
        }),
      },
    ],
  },
];

type CareAction = { type: 'start' | 'reset' } | { type: 'choose'; index: ChoiceIndex };

export function careReducer(dog: CareState, action: CareAction): CareState {
  if (action.type === 'reset') return initialCare;
  if (action.type === 'start' && dog.phase === 'ready') return { ...dog, phase: 'playing' };
  if (action.type !== 'choose' || dog.phase !== 'playing') return dog;

  const next = { ...dog, ...careChapters[dog.turn].choices[action.index].apply(dog) };
  const turn = dog.turn + 1;
  return {
    ...next,
    turn,
    phase: turn === careChapters.length ? 'complete' : 'playing',
    fullness: percent(next.fullness),
    energy: percent(next.energy),
    bond: percent(next.bond),
  };
}
