import { useEffect, useRef, useState } from 'react';
import { content } from '../data/content';
import styles from '../styles/site.module.css';

/**
 * The journey down the home page as a game element: an XP bar under the header
 * and, on wide screens, a level map of numbered tiles. Both are decorative
 * duplicates of the main navigation, so they are hidden from assistive technology.
 */
export function ScrollMap() {
  const bar = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.current?.style.setProperty('--p', progress.toFixed(4));
      let current = 0;
      content.levels.forEach((item, index) => {
        const top = document.getElementById(item.id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= window.innerHeight * 0.45) current = index;
      });
      if (progress > 0.995) current = content.levels.length - 1;
      setLevel(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <div ref={bar} className={styles.xp} aria-hidden="true">
        <i />
        <span key={level}>
          Level {level + 1} <b>{content.levels[level].label}</b>
        </span>
      </div>
      <div className={styles.levelMap} aria-hidden="true">
        {content.levels.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            tabIndex={-1}
            data-done={index < level || undefined}
            data-current={index === level || undefined}
          >
            <i>{index + 1}</i>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}
