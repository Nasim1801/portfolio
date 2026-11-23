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

type LifeRecord = {
  age: number;
  choice: string;
  savings: number;
  happiness: number;
  friendship: number;
};

type LifeState = {
  phase: 'ready' | 'choice' | 'outcome' | 'complete';
  year: number;
  savings: number;
  happiness: number;
  friendship: number;
  career: string;
  studied: boolean;
  note: string;
  history: readonly LifeRecord[];
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
  history: [],
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
    const choice = lifeChapters[life.year].choices[action.index];
    const next = { ...life, ...choice.apply(life) };
    const happiness = percent(next.happiness);
    const friendship = percent(next.friendship);
    const record = {
      age: 18 + life.year,
      choice: choice.label,
      savings: next.savings - life.savings,
      happiness: happiness - life.happiness,
      friendship: friendship - life.friendship,
    };
    return {
      ...next,
      happiness,
      friendship,
      phase: 'outcome',
      history: [...life.history, record],
    };
  }
  if (action.type === 'advance' && life.phase === 'outcome') {
    const year = life.year + 1;
    return { ...life, year, phase: year === lifeChapters.length ? 'complete' : 'choice' };
  }
  return life;
}
