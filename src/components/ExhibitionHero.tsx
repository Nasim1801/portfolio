import { useRef, useState } from 'react';
import { content, findCaseStudy } from '../data/content';
import { assetUrl, pageUrl } from '../utils/links';
import { MediaImage } from './Media';
import styles from '../styles/site.module.css';

const games = ['sumlume', 'pathlife', 'pawlife'].map((slug) => findCaseStudy(slug)!);

export function ExhibitionHero() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const project = games[active];
  const { hero, links } = content;

  return (
    <section className={styles.hero} id="top" aria-labelledby="hero-title">
      <div className={styles.heroCopy}>
        <p className={styles.heroLocation}>London, United Kingdom</p>
        <h1 id="hero-title">
          Nasim <em>Mosayebi</em>
        </h1>
        <p className={styles.heroRole}>Software Engineer &amp; Creative Developer</p>
        <p className={styles.heroIntro}>{hero.intro}</p>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="#work">
            Explore my work
          </a>
          <a className={styles.secondaryButton} href={assetUrl(links.cv)} download>
            Download CV
          </a>
        </div>
        <p className={styles.heroAvailability}>Open to graduate and junior engineering roles</p>
      </div>

      <div className={styles.heroExhibition} data-project={project.slug}>
        <div className={styles.heroExhibitHeader}>
          <span>The Digital Product Exhibition</span>
          <span>Mobile games</span>
        </div>
        <div className={styles.heroTabs} role="tablist" aria-label="Featured mobile games">
          {games.map((game, index) => (
            <button
              type="button"
              role="tab"
              key={game.slug}
              id={`hero-tab-${game.slug}`}
              ref={(element) => {
                tabs.current[index] = element;
              }}
              aria-controls="hero-project-panel"
              aria-selected={index === active}
              tabIndex={index === active ? 0 : -1}
              onClick={() => setActive(index)}
              onKeyDown={(event) => {
                const direction = event.key === 'ArrowRight' ? 1 : -1;
                if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
                event.preventDefault();
                const next =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? games.length - 1
                      : (index + direction + games.length) % games.length;
                setActive(next);
                tabs.current[next]?.focus();
              }}
            >
              {game.name}
            </button>
          ))}
        </div>
        <div
          className={styles.heroStage}
          id="hero-project-panel"
          role="tabpanel"
          aria-labelledby={`hero-tab-${project.slug}`}
        >
          <div className={styles.exhibitGrid} aria-hidden="true" />
          <div className={styles.exhibitRing} aria-hidden="true" />
          <a
            key={project.slug}
            data-animate={active !== 0}
            className={styles.heroArtifact}
            href={pageUrl(`projects/${project.slug}/`)}
            aria-label={`Read the ${project.name} case study`}
          >
            <span className={styles.heroPrintBack} aria-hidden="true">
              <MediaImage
                item={project.media[1]}
                decorative
                priority={active === 0}
                sizes="230px"
              />
            </span>
            <span className={styles.heroPrintFront}>
              <MediaImage
                item={project.media[0]}
                priority={active === 0}
                sizes="(max-width: 520px) 44vw, 260px"
              />
            </span>
          </a>
          <div className={styles.heroCaption}>
            {project.icon && <MediaImage item={project.icon} decorative sizes="44px" />}
            <div>
              <strong>{project.name}</strong>
              <span>{project.slug === 'pawlife' ? 'Development build' : 'On the App Store'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
