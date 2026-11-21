import { useMemo, useRef, useState } from 'react';
import { content } from '../data/content';
import { homeUrl, pageUrl } from '../utils/links';
import styles from '../styles/site.module.css';

const categoryOrder = [
  'Frontend Engineering',
  'Mobile Application Development',
  'Backend and APIs',
  'AI and Machine Learning',
  'Databases and Data Management',
  'Testing, Tooling and Deployment',
] as const;

function evidenceHref(href: string) {
  return href.startsWith('#') ? homeUrl(href) : pageUrl(href);
}

export function SkillAtlas() {
  const categoryRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [category, setCategory] = useState<(typeof categoryOrder)[number]>('Frontend Engineering');
  const filtered = useMemo(
    () => content.skillEvidence.filter((item) => item.category === category),
    [category],
  );
  const [activeTechnology, setActiveTechnology] = useState('React');
  const selected = filtered.find((item) => item.technology === activeTechnology) ?? filtered[0];

  const chooseCategory = (next: (typeof categoryOrder)[number]) => {
    setCategory(next);
    const first = content.skillEvidence.find((item) => item.category === next);
    if (first) setActiveTechnology(first.technology);
  };

  return (
    <div className={styles.skillAtlas}>
      <div
        className={styles.skillCategories}
        role="tablist"
        aria-label="Technical skill categories"
      >
        {categoryOrder.map((item, index) => (
          <button
            type="button"
            role="tab"
            key={item}
            ref={(element) => {
              categoryRefs.current[index] = element;
            }}
            aria-selected={category === item}
            aria-controls="skill-evidence-panel"
            tabIndex={category === item ? 0 : -1}
            onClick={() => chooseCategory(item)}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
              event.preventDefault();
              const direction = event.key === 'ArrowRight' ? 1 : -1;
              const next = (index + direction + categoryOrder.length) % categoryOrder.length;
              chooseCategory(categoryOrder[next]);
              categoryRefs.current[next]?.focus();
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item}
          </button>
        ))}
      </div>

      <div className={styles.skillSignal}>
        <div className={styles.skillTechnologyList} aria-label={`${category} technologies`}>
          {filtered.map((item) => (
            <button
              type="button"
              key={item.technology}
              className={item.technology === selected.technology ? styles.skillActive : ''}
              aria-pressed={item.technology === selected.technology}
              onClick={() => setActiveTechnology(item.technology)}
            >
              {item.technology}
            </button>
          ))}
        </div>

        <div
          id="skill-evidence-panel"
          className={styles.skillEvidence}
          role="tabpanel"
          aria-live="polite"
        >
          <p>Selected technology</p>
          <h3>{selected.technology}</h3>
          <span className={styles.skillCategoryLabel}>{selected.category}</span>
          <div className={styles.evidenceConnections}>
            {selected.projects.map((project, index) => (
              <article key={`${selected.technology}-${project.name}`}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{project.name}</h4>
                  <p>{project.evidence}</p>
                  <a href={evidenceHref(project.href)}>View evidence</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
