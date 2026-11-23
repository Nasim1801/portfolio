import { pageUrl } from '../utils/links';
import { PosePipelineLab } from './lab/PosePipelineLab';
import { SumlumeMiniLab } from './lab/SumlumeMiniLab';
import styles from '../styles/lab.module.css';

export function EngineeringLabPage() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.labPage}>
      <header className={styles.labHero}>
        <a className={styles.backLink} href={pageUrl()}>
          Portfolio home
        </a>
        <p className={styles.labEyebrow}>Interactive demonstrations</p>
        <h1>Engineering Lab</h1>
        <div className={styles.labIntro}>
          <p>
            Play a number puzzle built around Sumlume’s matching rules, then follow an interactive
            model of the Physio-AI pose pipeline.
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
        The live controls require JavaScript. Read the project case studies for the{' '}
        <a href={pageUrl('projects/sumlume/#architecture')}>number-matching rules</a> and the{' '}
        <a href={pageUrl('projects/physio-ai/#architecture')}>pose pipeline</a>.
      </p>
      <div data-enhanced>
        <SumlumeMiniLab />
        <PosePipelineLab />
      </div>

      <section className={styles.labClosing}>
        <h2>How this site was built</h2>
        <a href={pageUrl('projects/portfolio/')}>Read the design and engineering case study</a>
      </section>
    </main>
  );
}
