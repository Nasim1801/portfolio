import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { content } from '../data/content';
import { burst, confettiRain } from '../fx/effects';
import { hasMove, heroBoard, isMatch, type TileValue } from '../lab/sumlumeEngine';
import { assetUrl, pageUrl } from '../utils/links';
import styles from '../styles/site.module.css';

/**
 * The playable Make 10 demo shown inside the Sumlume project on the home page.
 * Rules live in src/lab/sumlumeEngine.ts and are tested by scripts/test-lab.ts.
 */
const columns = 4;
const pairsTotal = heroBoard.length / 2;

/** Tiles that make 10 together share a colour family, which helps first-time players. */
function tileTone(value: number) {
  return value === 5 ? 5 : Math.min(value, 10 - value);
}

function centre(element: HTMLElement | null) {
  const rect = element?.getBoundingClientRect();
  return rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null;
}

export function MakeTenBoard() {
  const [board, setBoard] = useState<TileValue[]>(() => [...heroBoard]);
  const [selected, setSelected] = useState<number | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);
  const [moves, setMoves] = useState(0);
  const [status, setStatus] = useState('');
  const [shake, setShake] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const cleared = board.every((value) => value === null);
  const remaining = board.filter((value) => value !== null).length / 2;

  const reset = () => {
    setBoard([...heroBoard]);
    setSelected(null);
    setMoves(0);
    setFocusIndex(0);
    setRound((value) => value + 1);
    setStatus('New board.');
    window.requestAnimationFrame(() => tiles.current[0]?.focus());
  };

  const choose = (index: number) => {
    const value = board[index];
    if (value === null) return;
    if (selected === null) {
      setSelected(index);
      setStatus(`${value} selected. Choose a tile that matches it or makes 10.`);
      return;
    }
    if (selected === index) {
      setSelected(null);
      setStatus('Selection cleared.');
      return;
    }
    const first = board[selected]!;
    if (isMatch(first, value)) {
      const next = board.map((tile, i) => (i === index || i === selected ? null : tile));
      const from = centre(tiles.current[selected]);
      const to = centre(tiles.current[index]);
      if (from) burst(from.x, from.y, 10);
      if (to) burst(to.x, to.y, 10);
      setBoard(next);
      setSelected(null);
      setMoves((count) => count + 1);
      const left = next.filter((tile) => tile !== null).length / 2;
      setStatus(
        left === 0
          ? 'Board cleared.'
          : `${first} and ${value} cleared. ${left} ${left === 1 ? 'pair' : 'pairs'} left.`,
      );
      if (left === 0) confettiRain();
      // Keep keyboard focus on a tile that still exists.
      const nextFocus = next.findIndex((tile) => tile !== null);
      if (nextFocus >= 0) {
        setFocusIndex(nextFocus);
        tiles.current[nextFocus]?.focus();
      }
      if (!hasMove(next) && left > 0) setStatus('No pairs left. Start a new board.');
    } else {
      setShake(index);
      window.setTimeout(() => setShake(null), 320);
      setSelected(index);
      setStatus(`${first} and ${value} don’t match. ${value} is now selected.`);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -columns,
      ArrowDown: columns,
    };
    let next = index;
    if (event.key in steps) next = index + steps[event.key];
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = board.length - 1;
    else return;
    event.preventDefault();
    next = Math.max(0, Math.min(board.length - 1, next));
    setFocusIndex(next);
    tiles.current[next]?.focus();
  };

  return (
    <div className={styles.board} aria-labelledby="board-title" data-cleared={cleared || undefined}>
      <div className={styles.boardHeader}>
        <div>
          <h4 id="board-title">Play it here</h4>
          <p>Sumlume’s core rule in miniature: clear two tiles that match or add up to 10.</p>
        </div>
      </div>
      <div
        className={styles.boardPips}
        role="img"
        aria-label={`${pairsTotal - remaining} of ${pairsTotal} pairs cleared`}
      >
        {Array.from({ length: pairsTotal }, (_, index) => (
          <i key={index} data-on={index < pairsTotal - remaining || undefined} />
        ))}
      </div>
      <div className={styles.boardStageWrap}>
        <div className={styles.boardGrid} role="group" aria-label="Make 10 tiles" key={round}>
          {board.map((value, index) => (
            <button
              key={index}
              type="button"
              ref={(element) => {
                tiles.current[index] = element;
              }}
              className={styles.tile}
              data-tone={tileTone(heroBoard[index])}
              data-cleared={value === null || undefined}
              data-shake={shake === index || undefined}
              style={{ '--i': index } as CSSProperties}
              aria-pressed={value === null ? undefined : selected === index}
              aria-label={
                value === null ? `Tile ${index + 1}, cleared` : `Tile ${index + 1}, number ${value}`
              }
              aria-disabled={value === null || undefined}
              tabIndex={index === focusIndex ? 0 : -1}
              onFocus={() => setFocusIndex(index)}
              onClick={() => choose(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span aria-hidden="true">{value ?? ''}</span>
            </button>
          ))}
        </div>
        {cleared && (
          <div className={styles.boardWin}>
            <p className={styles.boardWinTitle}>Board cleared</p>
            <p>{moves} moves. That is the rule the whole game is built on.</p>
            <div className={styles.boardWinActions}>
              <a className={styles.buttonPrimary} href={pageUrl('projects/sumlume/')}>
                More about Sumlume
              </a>
              <a className={styles.buttonSecondary} href={assetUrl(content.links.cv)} download>
                Download CV
              </a>
            </div>
            <a className={styles.boardWinLab} href={pageUrl('lab/')}>
              Try the harder version in the Lab
            </a>
          </div>
        )}
      </div>
      <div className={styles.boardFooter}>
        <p aria-live="polite" className={styles.boardStatus}>
          {status || `${remaining} of ${pairsTotal} pairs left. Arrow keys move between tiles.`}
        </p>
        <button type="button" className={styles.textButton} onClick={reset}>
          {cleared ? 'Play again' : 'New board'}
        </button>
      </div>
    </div>
  );
}
