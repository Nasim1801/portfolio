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

      <SumlumeMiniLab />
      <PosePipelineLab />

      <section className={styles.labClosing}>
        <h2>How this site was built</h2>
        <a href={pageUrl('projects/portfolio/')}>Read the design and engineering case study</a>
      </section>
    </main>
  );
}
