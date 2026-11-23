import { useEffect, useReducer, useRef, useState, type ReactNode } from 'react';
import { gameIcons, pathLifeScreens, pawLifeScreens } from '../../data/screens';
import { initialLife, lifeChapters, lifeReducer } from '../../lab/lifeDemos';
import { careActivities, careMoments, careReducer, initialCare } from '../../lab/pawLifeDemo';
import { assetUrl, pageUrl } from '../../utils/links';
import { MediaImage } from '../Media';
import lab from '../../styles/lab.module.css';
import game from '../../styles/lifeGames.module.css';

const money = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});
const signed = (value: number) => (value < 0 ? '−' : '+');
const art = (filename: string) => assetUrl(`assets/lab-v2/${filename}.webp`);

type Project = 'pathlife' | 'pawlife';
type Stat = { label: string; value: number; icon: string };

function GameExhibit({
  project,
  title,
  description,
  engineering,
  children,
}: {
  project: Project;
  title: string;
  description: string;
  engineering: string;
  children: ReactNode;
}) {
  const reference = project === 'pathlife' ? pathLifeScreens[0] : pawLifeScreens[0];
  return (
    <section
      id={`${project}-demo`}
      tabIndex={-1}
      className={`${lab.exhibit} ${game.exhibit}`}
      aria-labelledby={`${project}-lab-title`}
    >
      <header className={game.exhibitIntro}>
        <h2 id={`${project}-lab-title`}>{title}</h2>
        <p>{description}</p>
      </header>
      {children}
      <details className={game.engineering}>
        <summary>How the {title} demo works</summary>
        <div>
          <MediaImage item={reference} sizes="106px" />
          <div>
            <p>{engineering}</p>
            <p>
              {project === 'pathlife'
                ? 'Reference: PathLife App Store artwork.'
                : 'Reference: PawLife iOS development capture.'}
            </p>
            <a href={pageUrl(`projects/${project}/`)}>Read the {title} case study</a>
          </div>
        </div>
      </details>
    </section>
  );
}

function StatLine({ name, stats }: { name: string; stats: readonly Stat[] }) {
  return (
    <dl className={game.stats} aria-label={name}>
      {stats.map(({ label, value, icon }) => (
        <div key={label}>
          <dt>
            <span aria-hidden="true">{icon}</span>
            {label}
          </dt>
          <dd>{value}%</dd>
        </div>
      ))}
    </dl>
  );
}

function usePromptFocus(scene: string) {
  const heading = useRef<HTMLHeadingElement>(null);
  const requested = useRef(false);
  useEffect(() => {
    if (!requested.current) return;
    requested.current = false;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: 'nearest' });
  }, [scene]);
  return {
    heading,
    perform(action: () => void) {
      requested.current = true;
      action();
    },
  };
}

const eventVisuals = [
  { label: 'Education & work', icon: '🎓', actions: ['📚', '💼'] },
  { label: 'Relationships & money', icon: '🏡', actions: ['💷', '🤝'] },
  { label: 'Career', icon: '💼', actions: ['✉️', '📈'] },
];

export function PathLifeLab() {
  const [life, dispatch] = useReducer(lifeReducer, initialLife);
  const chapter = lifeChapters[life.year];
  const visual = eventVisuals[life.year];
  const age = 18 + life.year;
  const record = life.history.at(-1);
  const { heading, perform } = usePromptFocus(`${life.year}:${life.phase}`);
  const ready = life.phase === 'ready';
  const choosing = life.phase === 'choice';
  const resolved = life.phase === 'outcome';
  const finished = life.phase === 'complete';
  const title = ready
    ? 'Your life starts here'
    : choosing
      ? chapter.title
      : finished
        ? 'Three years complete'
        : 'Choice made';
  const context = ready ? 'A new life' : finished ? 'Your life so far' : visual.label;
  const prompt = ready
    ? 'Start at age 18. Choose a path after school, then age up to see where it leads.'
    : choosing
      ? chapter.situation
      : finished
        ? 'The choices you made are recorded in your life log. Restart to explore a different path.'
        : life.note;

  return (
    <GameExhibit
      project="pathlife"
      title="PathLife"
      description="Shape a life from age 18 through work, money and relationships."
      engineering="This browser edition uses an original three-year scenario and hand-authored outcomes. A deterministic TypeScript reducer carries training, choices and finances forward. The native rules and save system are separate. The portrait and sky are crops of published App Store artwork."
    >
      <div className={`${game.playground} ${game.pathGround}`}>
        <div className={`${game.playScreen} ${game.pathScreen}`}>
          <header className={game.pathHeader}>
            <div className={game.gameBar}>
              <div className={game.wordmark}>
                <MediaImage item={gameIcons.pathlife} decorative sizes="30px" />{' '}
                <strong>PathLife</strong>
              </div>
              <span className={game.browserLabel}>Browser demo</span>
              {life.phase !== 'ready' && (
                <button
                  className={game.restart}
                  type="button"
                  aria-label="Restart PathLife"
                  onClick={() => perform(() => dispatch({ type: 'reset' }))}
                >
                  Restart
                </button>
              )}
            </div>
            <div className={game.characterBar}>
              <img src={art('grace')} width="105" height="108" alt="" loading="lazy" />
              <div className={game.characterName}>
                <strong>Grace Miller</strong>
                <span>
                  {life.career} · Age {age}
                </span>
              </div>
              <div className={game.bank}>
                <strong>{money.format(life.savings)}</strong>
                <span>Bank balance</span>
              </div>
            </div>
          </header>
          <StatLine
            name="PathLife wellbeing"
            stats={[
              { label: 'Happiness', value: life.happiness, icon: '😊' },
              { label: 'Friendship', value: life.friendship, icon: '💞' },
            ]}
          />
          <div className={game.pathStage}>
            <div key={`${life.year}:${life.phase}`} className={game.lifeEvent}>
              <div className={game.eventHeading}>
                <span className={game.eventIcon} aria-hidden="true">
                  {finished ? '🏆' : ready ? '✨' : visual.icon}
                </span>
                <div>
                  <p>{context}</p>
                  <h3 ref={heading} tabIndex={-1} aria-describedby="pathlife-event-description">
                    {title}
                  </h3>
                </div>
              </div>
              <p
                id="pathlife-event-description"
                className={game.eventPrompt}
                role={resolved ? 'status' : undefined}
              >
                {prompt}
              </p>
              {resolved && record && (
                <ul className={game.deltas} aria-label="Consequences">
                  {record.savings !== 0 && (
                    <li>
                      {signed(record.savings)}
                      {money.format(Math.abs(record.savings))} savings
                    </li>
                  )}
                  {record.happiness !== 0 && (
                    <li>
                      {signed(record.happiness)}
                      {Math.abs(record.happiness)} happiness
                    </li>
                  )}
                  {record.friendship !== 0 && (
                    <li>
                      {signed(record.friendship)}
                      {Math.abs(record.friendship)} friendship
                    </li>
                  )}
                </ul>
              )}
              {choosing && (
                <div className={game.lifeChoices} aria-label="Life choices" role="group">
                  {([0, 1] as const).map((index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => perform(() => dispatch({ type: 'choose', index }))}
                    >
                      <span aria-hidden="true">{visual.actions[index]}</span>
                      {chapter.choices[index].label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className={game.pathFooter}>
            <details className={game.journal}>
              <summary>
                <span aria-hidden="true">📖</span> Life log
              </summary>
              {life.history.length ? (
                <ol>
                  {life.history.map((entry) => (
                    <li key={entry.age}>
                      <strong>Age {entry.age}</strong> {entry.choice}
                    </li>
                  ))}
                </ol>
              ) : (
                <p>Your decisions will appear here.</p>
              )}
            </details>
            {ready && (
              <button
                type="button"
                className={game.ageUp}
                onClick={() => perform(() => dispatch({ type: 'start' }))}
              >
                Start life
              </button>
            )}
            {resolved && (
              <button
                type="button"
                className={game.ageUp}
                onClick={() => perform(() => dispatch({ type: 'advance' }))}
              >
                <span aria-hidden="true">⬆</span> Age Up <small>+1 year</small>
              </button>
            )}
            {choosing && <span className={game.nextHint}>Choose an option to age up</span>}
          </div>
        </div>
      </div>
    </GameExhibit>
  );
}

const reactionLabels = {
  eating: { prop: '🥣', label: 'Eating' },
  fetching: { prop: '🎾', label: 'Playing fetch' },
  tired: { prop: '🎾', label: 'Tired' },
  groomed: { prop: '✨', label: 'Freshly groomed' },
  worried: { prop: '☁️', label: 'Startled by thunder' },
  settled: { prop: '💛', label: 'Settled' },
  resting: { prop: '🌙', label: 'Resting' },
} as const;

type Activity = (typeof careActivities)[number];

export function PawLifeLab() {
  const [dog, dispatch] = useReducer(careReducer, initialCare);
  const [activity, setActivity] = useState<Activity | null>(null);
  const { heading, perform } = usePromptFocus(`${dog.turn}:${dog.phase}:${activity?.id}`);
  const ready = dog.phase === 'ready';
  const caring = dog.phase === 'care';
  const result = dog.phase === 'result';
  const storm = dog.phase === 'storm';
  const complete = dog.phase === 'complete';
  const room = ready || (caring && !activity);
  const reaction = dog.reaction && reactionLabels[dog.reaction];
  const moment =
    storm || complete ? 'Evening' : careMoments[Math.max(0, dog.turn - Number(result))];
  const title = ready
    ? 'Meet Bella'
    : storm
      ? 'A sudden thunderstorm'
      : complete
        ? 'Time to settle in'
        : result
          ? 'Bella’s response'
          : (activity?.prompt ?? `${moment} care`);
  const prompt = ready
    ? 'Spend three moments with Bella, then see how she responds when a storm rolls in.'
    : storm
      ? 'Thunder rattles the windows. Sit with Bella or give her a quiet place to settle.'
      : result || complete
        ? dog.note
        : (activity?.detail ??
          'Pick an activity. Bella’s food, energy and trust will influence what happens next.');

  function reset() {
    setActivity(null);
    dispatch({ type: 'reset' });
  }

  return (
    <GameExhibit
      project="pawlife"
      title="PawLife"
      description="Care for Bella and see how her day changes with your choices."
      engineering="This is a simplified day in Bella’s life. Food and energy gate fetch, grooming changes her coat and bond, and trust affects the storm response. The TypeScript rules, counts and CSS motion belong to this browser demo. The room and Bella artwork come from previously published PawLife iOS development captures."
    >
      <div className={`${game.playground} ${game.pawGround}`}>
        <div className={`${game.playScreen} ${game.pawScreen}`}>
          <header className={game.gameBar}>
            <div className={game.wordmark}>
              <MediaImage item={gameIcons.pawlife} decorative sizes="34px" />{' '}
              <strong>PawLife</strong>
            </div>
            <span className={game.browserLabel}>Browser demo</span>
            {!ready && (
              <button
                className={game.restart}
                type="button"
                aria-label="Restart PawLife"
                onClick={() => perform(reset)}
              >
                Restart
              </button>
            )}
          </header>
          <div className={game.companionBar}>
            <strong>Bella</strong>
            <span>Year 4 · {moment}</span>
          </div>
          <div className={game.petStage} data-room={room} data-reaction={dog.reaction || undefined}>
            {room ? (
              <img
                className={game.roomArt}
                src={art('bella-room')}
                width="880"
                height="523"
                alt="Bella on the rug in her living room"
                loading="lazy"
              />
            ) : (
              <div className={game.petFigure}>
                <img
                  src={art('bella')}
                  width="300"
                  height="295"
                  alt="Bella, a brown-and-cream dog"
                />
                {(reaction || activity) && (
                  <span className={game.petProp} aria-hidden="true">
                    {reaction ? reaction.prop : activity?.icon}
                  </span>
                )}
              </div>
            )}
            <div className={game.sceneStatus} aria-live="polite">
              <span>{reaction ? reaction.label : room ? 'At home' : activity?.label}</span>
              <span>
                {complete
                  ? 'Day complete'
                  : storm
                    ? 'Story event'
                    : `${dog.turn} / ${careMoments.length} moments`}
              </span>
            </div>
          </div>
          <StatLine
            name="Bella’s wellbeing"
            stats={[
              { label: 'Fullness', value: dog.fullness, icon: '🥣' },
              { label: 'Energy', value: dog.energy, icon: '⚡' },
              { label: 'Bond', value: dog.bond, icon: '💚' },
              { label: 'Coat', value: dog.coat, icon: '✨' },
            ]}
          />
          <div className={game.careSheet}>
            <p className={game.sheetLabel}>
              {storm || complete
                ? 'Life story'
                : caring && activity
                  ? 'With Bella'
                  : 'A day at home'}
            </p>
            <h3 ref={heading} tabIndex={-1} aria-describedby="pawlife-event-description">
              {title}
            </h3>
            <p
              id="pawlife-event-description"
              className={game.eventPrompt}
              role={result || complete ? 'status' : undefined}
            >
              {prompt}
            </p>
            <div className={game.careActions}>
              {ready && (
                <button
                  type="button"
                  className={game.carePrimary}
                  onClick={() => perform(() => dispatch({ type: 'start' }))}
                >
                  Start care
                </button>
              )}
              {caring &&
                !activity &&
                careActivities.map((item) => (
                  <button
                    type="button"
                    className={game.activityButton}
                    key={item.id}
                    onClick={() => perform(() => setActivity(item))}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              {caring && activity && (
                <>
                  {activity.options.map((option) => (
                    <button
                      type="button"
                      className={game.carePrimary}
                      key={option.id}
                      onClick={() =>
                        perform(() => {
                          setActivity(null);
                          dispatch({ type: 'care', choice: option.id });
                        })
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={game.careBack}
                    onClick={() => perform(() => setActivity(null))}
                  >
                    Back to care
                  </button>
                </>
              )}
              {result && (
                <button
                  type="button"
                  className={game.carePrimary}
                  onClick={() => perform(() => dispatch({ type: 'continue' }))}
                >
                  {dog.turn === careMoments.length ? 'See the evening event' : 'Next moment'}
                </button>
              )}
              {storm && (
                <>
                  <button
                    type="button"
                    className={game.carePrimary}
                    onClick={() => perform(() => dispatch({ type: 'comfort', choice: 'sit' }))}
                  >
                    Sit with Bella
                  </button>
                  <button
                    type="button"
                    className={game.activityButton}
                    onClick={() => perform(() => dispatch({ type: 'comfort', choice: 'den' }))}
                  >
                    Make a quiet den
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </GameExhibit>
  );
}
