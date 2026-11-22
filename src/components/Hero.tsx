import { useCallback, useState, type CSSProperties } from 'react';
import { content } from '../data/content';
import { AmbientTiles } from '../fx/AmbientTiles';
import type { AmbientSet } from '../fx/glyphs';
import { assetUrl } from '../utils/links';
import { LevelSelect } from './LevelSelect';
import styles from '../styles/site.module.css';

function AnimatedName({ name }: { name: string }) {
  let index = 0;
  return (
    <h1 id="hero-title" className={styles.heroName} aria-label={name} data-no-tiles>
      {name.split(' ').map((word) => (
        <span key={word} className={styles.heroWord} aria-hidden="true">
          {[...word].map((letter) => {
            const i = index++;
            return (
              <span key={i} className={styles.heroLetter} style={{ '--i': i } as CSSProperties}>
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const { identity, hero, links, achievements } = content;
  // The drifting objects behind the hero belong to the project on the stage.
  const [level, setLevel] = useState<AmbientSet>('pathlife');
  const onLevel = useCallback((slug: string) => setLevel(slug as AmbientSet), []);
  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <AmbientTiles
        className={styles.heroCanvas}
        density={2.3}
        avoid="[data-no-tiles]"
        set={level}
      />
      <div className={styles.heroInner}>
        <div className={styles.heroCopy}>
          <AnimatedName name={identity.name} />
          <p className={styles.heroRole} data-no-tiles style={{ '--i': 0 } as CSSProperties}>
            {identity.role}
          </p>
          <p className={styles.heroValue} data-no-tiles style={{ '--i': 1 } as CSSProperties}>
            {hero.value}
          </p>
          <div className={styles.heroActions} data-no-tiles style={{ '--i': 2 } as CSSProperties}>
            <a className={styles.buttonPrimary} href="#work">
              View work
            </a>
            <a className={styles.buttonSecondary} href={assetUrl(links.cv)} download>
              Download CV <span className={styles.buttonNote}>PDF</span>
            </a>
            <a className={styles.buttonQuiet} href="#contact">
              Contact
            </a>
          </div>
          <ul
            className={styles.heroMeta}
            data-no-tiles
            aria-label="Location and availability"
            style={{ '--i': 3 } as CSSProperties}
          >
            <li>
              <span className={styles.dot} data-tone="2" aria-hidden="true" />
              Based in {identity.location}
            </li>
            <li>
              <span className={styles.dot} data-tone="1" aria-hidden="true" />
              {hero.availability}
            </li>
          </ul>
          <ul className={styles.badges} data-no-tiles aria-label="Highlights">
            {achievements.map((badge, index) => (
              <li key={badge.title} style={{ '--i': index } as CSSProperties}>
                <span className={styles.badgeIcon} data-tone={index + 1} aria-hidden="true">
                  {badge.mark}
                </span>
                <span>
                  <strong>{badge.title}</strong>
                  <span>{badge.detail}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <LevelSelect onLevel={onLevel} />
      </div>
      <a className={styles.scrollCue} href="#work" aria-hidden="true" tabIndex={-1}>
        <span />
      </a>
    </section>
  );
}
