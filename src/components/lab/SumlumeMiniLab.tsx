import { useEffect, useRef, useState } from 'react';
import {
  clearPair,
  initialPuzzle,
  isValidPair,
  puzzleColumns,
  type TileValue,
} from '../../lab/sumlumeEngine';
import styles from '../../styles/lab.module.css';

type Feedback = { kind: 'idle' | 'success' | 'error'; message: string };

const idleFeedback: Feedback = {
  kind: 'idle',
  message: 'Select two neighbouring tiles with the same number or a total of 10.',
};

const arrows: Record<string, [number, number]> = {
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
};

function nextIndex(index: number, direction: [number, number], board: readonly TileValue[]) {
  const [rowStep, columnStep] = direction;
  const rows = Math.ceil(board.length / puzzleColumns);
  let row = Math.floor(index / puzzleColumns) + rowStep;
  let column = (index % puzzleColumns) + columnStep;
  while (row >= 0 && row < rows && column >= 0 && column < puzzleColumns) {
    const target = row * puzzleColumns + column;
    if (typeof board[target] === 'number') return target;
    row += rowStep;
    column += columnStep;
  }
  return index;
}

export function SumlumeMiniLab() {
  const [board, setBoard] = useState<TileValue[]>([...initialPuzzle]);
  const [selected, setSelected] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(idleFeedback);
  const [focused, setFocused] = useState(0);
  const pendingFocus = useRef<number>(null);
  const resetButton = useRef<HTMLButtonElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const target = pendingFocus.current;
    if (target === null) return;
    pendingFocus.current = null;
    if (target === -1) resetButton.current?.focus();
    else buttonRefs.current[target]?.focus();
  }, [board]);

  const chooseTile = (index: number) => {
    if (board[index] === null) return;
    if (selected === null) {
      setSelected(index);
      setFeedback({ kind: 'idle', message: `Selected ${board[index]}. Choose its match.` });
      return;
    }
    if (selected === index) {
      setSelected(null);
      setFeedback(idleFeedback);
      return;
    }

    if (isValidPair(board, selected, index)) {
      const firstValue = board[selected];
      const secondValue = board[index];
      const next = clearPair(board, selected, index);
      const successor = next.findIndex((value, position) => position > index && value !== null);
      const target = successor >= 0 ? successor : next.findIndex((value) => value !== null);
      setFocused(target);
      pendingFocus.current = target;
      setBoard(next);
      setMatches((value) => value + 1);
      setFeedback({
        kind: 'success',
        message: `${firstValue} and ${secondValue} cleared. Valid match.`,
      });
      setSelected(null);
      return;
    }

    setSelected(index);
    setFeedback({
      kind: 'error',
      message: 'That pair is not adjacent, equal or a total of 10. Try another tile.',
    });
  };

  const reset = () => {
    setBoard([...initialPuzzle]);
    setSelected(null);
    setMatches(0);
    setFeedback(idleFeedback);
    setFocused(0);
    pendingFocus.current = 0;
  };

  return (
    <section className={styles.exhibit} aria-labelledby="sumlume-lab-title">
      <div className={styles.exhibitHeader}>
        <div>
          <p className={styles.labIndex}>Sumlume rules</p>
          <h2 id="sumlume-lab-title">Play Make 10</h2>
        </div>
      </div>

      <div className={styles.puzzleLayout}>
        <div className={styles.puzzlePanel}>
          <div className={styles.puzzleTopline}>
            <span>Compact portfolio demonstration</span>
            <strong>{matches.toString().padStart(2, '0')} matches</strong>
          </div>
          <div className={styles.puzzleGrid} role="group" aria-label="Sumlume number puzzle demo">
            {board.map((value, index) => (
              <button
                // The board is deliberately stable, so the position is its identity.
                key={index}
                ref={(element) => {
                  buttonRefs.current[index] = element;
                }}
                type="button"
                className={`${styles.numberTile} ${selected === index ? styles.numberTileSelected : ''} ${value === null ? styles.numberTileCleared : ''}`}
                disabled={value === null}
                aria-label={
                  value === null
                    ? `Tile ${index + 1}, cleared`
                    : `Tile ${index + 1}, number ${value}`
                }
                aria-pressed={selected === index}
                tabIndex={focused === index ? 0 : -1}
                onFocus={() => setFocused(index)}
                onClick={() => chooseTile(index)}
                onKeyDown={(event) => {
                  const direction = arrows[event.key];
                  if (!direction) return;
                  event.preventDefault();
                  const target = nextIndex(index, direction, board);
                  buttonRefs.current[target]?.focus();
                }}
              >
                <span>{value ?? '·'}</span>
              </button>
            ))}
          </div>
          <div className={styles.puzzleFooter}>
            <p className={styles[feedback.kind]} aria-live="polite">
              {feedback.message}
            </p>
            <button ref={resetButton} type="button" className={styles.resetButton} onClick={reset}>
              Reset board
            </button>
          </div>
        </div>

        <div className={styles.exhibitNotes}>
          <p className={styles.noteLabel}>What this proves</p>
          <ol>
            <li>
              <span>01</span> Deterministic rule validation
            </li>
            <li>
              <span>02</span> State-driven visual feedback
            </li>
            <li>
              <span>03</span> Touch and keyboard interaction
            </li>
          </ol>
          <p>
            This is a small browser-built demonstration based on Sumlume’s verified equal-number and
            make-10 rule. It is not the production iOS game.
          </p>
          <a href="../projects/sumlume/">Inspect the full Sumlume case study</a>
        </div>
      </div>
    </section>
  );
}
