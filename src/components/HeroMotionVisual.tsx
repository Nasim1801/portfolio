import { motion, useReducedMotion } from 'framer-motion';
import { content } from '../data/content';
import styles from '../styles/site.module.css';
import { DeviceFrame } from './Media';
import { PoseTracker } from './PoseTracker';

export function HeroMotionVisual() {
  const reduceMotion = useReducedMotion();
  const { hero } = content;

  const mediaAnimation = (delay: number, x: number, rotate: number) => ({
    initial: reduceMotion ? false : { x, y: 28, rotate: rotate * 1.5, scale: 0.96 },
    animate: reduceMotion ? undefined : { x: 0, y: 0, rotate, scale: 1 },
    transition: { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <div className={styles.heroVisual} aria-label="Selected project screenshots">
      <motion.div className={styles.heroPose} {...mediaAnimation(0, 50, 2)}>
        <PoseTracker compact />
      </motion.div>
      <motion.div className={styles.heroPhoneOne} {...mediaAnimation(0.1, 30, -5)}>
        <DeviceFrame item={hero.visual.pathlife} frame="phone" compact priority />
      </motion.div>
      <motion.div className={styles.heroPhoneTwo} {...mediaAnimation(0.2, 60, 5)}>
        <DeviceFrame item={hero.visual.pawlife} frame="phone" compact priority />
      </motion.div>
      <motion.div
        className={styles.accuracyChip}
        initial={reduceMotion ? false : { y: 14, scale: 0.92 }}
        animate={reduceMotion ? undefined : { y: 0, scale: 1 }}
        transition={{ delay: 0.42, duration: 0.5 }}
      >
        <span>ML result</span>
        <strong>{hero.accuracy}</strong>
      </motion.div>
    </div>
  );
}
