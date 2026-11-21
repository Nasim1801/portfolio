import { useEffect } from 'react';
import { pageUrl } from '../utils/links';
import { PosePipelineLab } from './lab/PosePipelineLab';
import { SumlumeMiniLab } from './lab/SumlumeMiniLab';
import styles from '../styles/lab.module.css';

export function EngineeringLabPage() {
  useEffect(() => {
    const title = 'Engineering Lab | Nasim Mosayebi';
    const description =
      'Playable React and interactive system demonstrations by London software engineer Nasim Mosayebi.';
    const url = 'https://nasim1801.github.io/portfolio/lab/';
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
  }, []);

  return (
    <main id="main-content" className={styles.labPage}>
      <header className={styles.labHero}>
        <a className={styles.backLink} href={pageUrl()}>
          ← Portfolio home
        </a>
        <p className={styles.labEyebrow}>Built in the browser · 02 live exhibits</p>
        <h1>
          Engineering <em>you can touch.</em>
        </h1>
        <div className={styles.labIntro}>
          <p>
            Two working demonstrations translate real project logic into accessible browser
            interactions. No video, no static mock-up and no claim of production inference.
          </p>
          <dl>
            <div>
              <dt>Input</dt>
              <dd>Pointer · touch · keyboard</dd>
            </div>
            <div>
              <dt>Runtime</dt>
              <dd>React · TypeScript · SVG</dd>
            </div>
          </dl>
        </div>
      </header>

      <div className={styles.labRail} aria-hidden="true">
        <span>LAB / NM / 2026</span>
        <span>SCROLL TO EXPERIMENT</span>
      </div>
      <SumlumeMiniLab />
      <PosePipelineLab />

      <section className={styles.labClosing}>
        <p>Want the implementation story?</p>
        <h2>The portfolio itself is documented as an engineering project.</h2>
        <a href={pageUrl('projects/portfolio/')}>Read the design and engineering case study</a>
      </section>
    </main>
  );
}
