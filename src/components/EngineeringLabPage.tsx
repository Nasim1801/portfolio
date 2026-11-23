import { pageUrl } from '../utils/links';
import { PathLifeLab, PawLifeLab } from './lab/LifeSimulationLabs';
import { PosePipelineLab } from './lab/PosePipelineLab';
import { SumlumeMiniLab } from './lab/SumlumeMiniLab';
import styles from '../styles/lab.module.css';

const demos = [
  { id: 'pathlife-demo', name: 'PathLife', detail: 'A three-year life simulation' },
  { id: 'sumlume-demo', name: 'Sumlume', detail: 'A number-matching puzzle' },
  { id: 'pawlife-demo', name: 'PawLife', detail: 'A day of pet care' },
  { id: 'physio-ai-demo', name: 'Physio-AI', detail: 'A pose analysis walkthrough' },
];

export function EngineeringLabPage() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.labPage}>
      <header className={styles.labHero}>
        <a className={styles.backLink} href={pageUrl()}>
          Portfolio home
        </a>
        <h1>Engineering Lab</h1>
        <div className={styles.labIntro}>
          <p>
            Play three short game demos and trace a pose through the Physio-AI pipeline. Each
            experience links to the project and the engineering behind it.
          </p>
          <dl>
            <div>
              <dt>Controls</dt>
              <dd>Pointer, touch and keyboard</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>React, TypeScript and SVG</dd>
            </div>
          </dl>
        </div>
      </header>

      <p className={styles.noScript}>
        The live controls require JavaScript. Explore the case studies for{' '}
        <a href={pageUrl('projects/pathlife/')}>PathLife</a>,{' '}
        <a href={pageUrl('projects/sumlume/#architecture')}>Sumlume</a>,{' '}
        <a href={pageUrl('projects/pawlife/')}>PawLife</a> and{' '}
        <a href={pageUrl('projects/physio-ai/#architecture')}>Physio-AI</a>.
      </p>
      <div data-enhanced>
        <nav className={styles.demoIndex} aria-label="Choose a demo">
          <ul>
            {demos.map(({ id, name, detail }) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <strong>{name}</strong>
                  <span>{detail}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <PathLifeLab />
        <SumlumeMiniLab />
        <PawLifeLab />
        <PosePipelineLab />
      </div>

      <section className={styles.labClosing}>
        <h2>How this site was built</h2>
        <a href={pageUrl('projects/portfolio/')}>Read the design and engineering case study</a>
      </section>
    </main>
  );
}
