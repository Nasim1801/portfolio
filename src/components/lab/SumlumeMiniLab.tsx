import { useRef, useState } from 'react';
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

function nextIndex(index: number, key: string, boardLength: number) {
  const row = Math.floor(index / puzzleColumns);
  const column = index % puzzleColumns;
  if (key === 'ArrowLeft') return row * puzzleColumns + Math.max(0, column - 1);
  if (key === 'ArrowRight') return row * puzzleColumns + Math.min(puzzleColumns - 1, column + 1);
  if (key === 'ArrowUp') return Math.max(0, row - 1) * puzzleColumns + column;
  if (key === 'ArrowDown') {
    return (
      Math.min(Math.floor((boardLength - 1) / puzzleColumns), row + 1) * puzzleColumns + column
    );
  }
  return index;
}

export function SumlumeMiniLab() {
  const [board, setBoard] = useState<TileValue[]>([...initialPuzzle]);
  const [selected, setSelected] = useState<number | null>(null);
  const [matches, setMatches] = useState(0);
  const [feedback, setFeedback] = useState<Feedback>(idleFeedback);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

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
      setBoard(clearPair(board, selected, index));
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
    buttonRefs.current[0]?.focus();
  };

  return (
    <section className={styles.exhibit} aria-labelledby="sumlume-lab-title">
      <div className={styles.exhibitHeader}>
        <div>
          <p className={styles.labIndex}>Exhibit 01 · React state</p>
          <h2 id="sumlume-lab-title">The make-10 machine</h2>
        </div>
        <span className={styles.liveChip}>Playable</span>
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
                onClick={() => chooseTile(index)}
                onKeyDown={(event) => {
                  if (!event.key.startsWith('Arrow')) return;
                  event.preventDefault();
                  const target = nextIndex(index, event.key, board.length);
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
            <button type="button" className={styles.resetButton} onClick={reset}>
              Reset board
            </button>
          </div>
        </div>

        <aside className={styles.exhibitNotes}>
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
        </aside>
      </div>
    </section>
  );
}
