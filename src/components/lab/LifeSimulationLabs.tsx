import { useEffect, useReducer, useRef } from 'react';
import {
  careChapters,
  careReducer,
  initialCare,
  initialLife,
  lifeChapters,
  lifeReducer,
} from '../../lab/lifeDemos';
import {
  gameIcons,
  pathLifeScreens,
  pawLifeScreens,
  type ScreenshotAsset,
} from '../../data/screens';
import { pageUrl } from '../../utils/links';
import { MediaImage } from '../Media';
import styles from '../../styles/lab.module.css';

type Metric = { label: string; value: string; level?: number };
type Control = { label: string; run: () => void };

type SimulationProps = {
  project: 'pathlife' | 'pawlife';
  name: string;
  title: string;
  description: string;
  label: string;
  step: string;
  prompt: string;
  detail: string;
  note?: string;
  metrics: Metric[];
  controls: Control[];
  restart?: () => void;
  engineering: string;
  screenshot: ScreenshotAsset;
  screenshotLabel: string;
};

function SimulationLab({
  project,
  name,
  title,
  description,
  label,
  step,
  prompt,
  detail,
  note,
  metrics,
  controls,
  restart,
  engineering,
  screenshot,
  screenshotLabel,
}: SimulationProps) {
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    heading.current?.focus();
  }, [prompt]);

  function run(action: () => void) {
    moveFocus.current = true;
    action();
  }

  return (
    <section
      id={`${project}-demo`}
      tabIndex={-1}
      className={`${styles.exhibit} ${styles.simulation}`}
      data-project={project}
      aria-labelledby={`${project}-lab-title`}
    >
      <div className={styles.simulationHeading}>
        <MediaImage item={gameIcons[project]} decorative sizes="56px" />
        <div>
          <p className={styles.labIndex}>
            {name} · {label}
          </p>
          <h2 id={`${project}-lab-title`}>{title}</h2>
        </div>
      </div>
      <p className={styles.simulationLead}>{description}</p>
      <div className={styles.simulationLayout}>
        <div className={styles.simulationPanel}>
          <div className={styles.simulationTopline}>
            <p>{step}</p>
            {restart && (
              <button type="button" className={styles.resetButton} onClick={() => run(restart)}>
                Restart {name}
              </button>
            )}
          </div>
          <dl className={styles.simulationMetrics} aria-label={`${name} stats`}>
            {metrics.map(({ label: metric, value, level }) => (
              <div key={metric}>
                <dt>{metric}</dt>
                <dd>{value}</dd>
                {level !== undefined && (
                  <div className={styles.simulationMeter} aria-hidden="true">
                    <span style={{ width: `${level}%` }} />
                  </div>
                )}
              </div>
            ))}
          </dl>
          <div className={styles.simulationPrompt}>
            <p role="status" className={styles.simulationNotice}>
              {note}
            </p>
            <h3 ref={heading} tabIndex={-1}>
              {prompt}
            </h3>
            <p>{detail}</p>
            <div className={styles.simulationActions}>
              {controls.map(({ label: control, run: action }) => (
                <button type="button" key={control} onClick={() => run(action)}>
                  {control}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.simulationEvidence}>
          <h3>Engineering in this demo</h3>
          <p>{engineering}</p>
          <figure>
            <MediaImage item={screenshot} sizes="92px" />
            <figcaption>{screenshotLabel}</figcaption>
          </figure>
          <a href={pageUrl(`projects/${project}/`)}>Read the {name} case study</a>
        </div>
      </div>
    </section>
  );
}

const pounds = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});
const percent = (value: number) => `${value}%`;

export function PathLifeLab() {
  const [life, dispatch] = useReducer(lifeReducer, initialLife);
  const chapter = lifeChapters[life.year];
  let prompt = 'Ready to leave school?';
  let detail =
    'Start at age 18. Make one decision each year, check what changed, then advance to the next year.';
  let controls: Control[] = [{ label: 'Start life', run: () => dispatch({ type: 'start' }) }];
  if (life.phase === 'choice') {
    prompt = chapter.title;
    detail = chapter.situation;
    controls = ([0, 1] as const).map((index) => ({
      label: chapter.choices[index].label,
      run: () => dispatch({ type: 'choose', index }),
    }));
  } else if (life.phase === 'outcome') {
    prompt = 'See what changed';
    detail = 'Your savings, relationships and career carry forward to the next year.';
    controls = [{ label: 'Advance one year', run: () => dispatch({ type: 'advance' }) }];
  } else if (life.phase === 'complete') {
    prompt = 'Three years complete';
    detail =
      'Your final savings, career, happiness and friendship reflect the choices you made. Restart to try another path.';
    controls = [];
  }
  return (
    <SimulationLab
      project="pathlife"
      name="PathLife"
      title="Make three years count"
      label="Browser demo"
      description="An original three-year sample inspired by PathLife’s annual choices about work, money and relationships. The story and numbers were written for this demo."
      step={
        life.phase === 'complete'
          ? 'Age 21 · Final results'
          : `Age ${18 + life.year} · Year ${life.year + 1} of 3`
      }
      prompt={prompt}
      detail={detail}
      note={life.phase === 'outcome' || life.phase === 'complete' ? life.note : undefined}
      metrics={[
        { label: 'Savings', value: pounds.format(life.savings) },
        { label: 'Career', value: life.career },
        { label: 'Happiness', value: percent(life.happiness), level: life.happiness },
        { label: 'Friendship', value: percent(life.friendship), level: life.friendship },
      ]}
      controls={controls}
      restart={life.phase !== 'ready' ? () => dispatch({ type: 'reset' }) : undefined}
      engineering="A TypeScript reducer handles decisions and year advances. The training choice is retained in state and changes the outcome of a later job application."
      screenshot={pathLifeScreens[0]}
      screenshotLabel="Official App Store artwork"
    />
  );
}

export function PawLifeLab() {
  const [dog, dispatch] = useReducer(careReducer, initialCare);
  const chapter = careChapters[dog.turn];
  const finished = dog.phase === 'complete';
  const playing = dog.phase === 'playing';
  return (
    <SimulationLab
      project="pawlife"
      name="PawLife"
      title="Spend a day with Bella"
      label="Browser demo · Native game in development"
      description="Meet a curious dog and choose how to feed, play with and comfort her. This one-day story uses simplified care and bonding rules written for the demo."
      step={finished ? 'Day complete' : `Moment ${dog.turn + 1} of 3`}
      prompt={finished ? 'Time to settle in' : playing ? chapter.title : 'Meet Bella'}
      detail={
        finished
          ? 'Fullness, energy and bond tell the story of your day. Restart to try a different routine.'
          : playing
            ? chapter.situation
            : 'Spend three moments with Bella. Each care choice changes how she feels and how she responds later.'
      }
      note={dog.note}
      metrics={[
        { label: 'Fullness', value: percent(dog.fullness), level: dog.fullness },
        { label: 'Energy', value: percent(dog.energy), level: dog.energy },
        { label: 'Bond', value: percent(dog.bond), level: dog.bond },
      ]}
      controls={
        playing
          ? ([0, 1] as const).map((index) => ({
              label: chapter.choices[index].label,
              run: () => dispatch({ type: 'choose', index }),
            }))
          : finished
            ? []
            : [{ label: 'Start care', run: () => dispatch({ type: 'start' }) }]
      }
      restart={dog.phase !== 'ready' ? () => dispatch({ type: 'reset' }) : undefined}
      engineering="Care actions update the same three stats. Earlier choices affect how long Bella can play and how she responds to a later story event."
      screenshot={pawLifeScreens[0]}
      screenshotLabel="PawLife iOS development screenshot"
    />
  );
}
