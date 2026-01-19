/**
 * OptionButton Component
 * Individual answer option with visual states
 */

import styles from './OptionButton.module.css';

interface OptionButtonProps {
    letter: string;
    text: string;
    isDisabled: boolean;
    isCorrect: boolean;
    isIncorrect: boolean;
    onClick: () => void;
}

export function OptionButton({
    letter,
    text,
    isDisabled,
    isCorrect,
    isIncorrect,
    onClick,
}: OptionButtonProps) {
    const classes = [
        styles.option,
        isDisabled ? styles.disabled : '',
        isCorrect ? styles.correct : '',
        isIncorrect ? styles.incorrect : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={classes}
            onClick={isDisabled ? undefined : onClick}
            onKeyDown={(e) => {
                if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
            tabIndex={isDisabled ? -1 : 0}
            role="button"
            aria-label={`${letter}. ${text}`}
            aria-disabled={isDisabled}
        >
            <span className={styles.letter}>{letter}</span>
            <span className={styles.text}>{text}</span>
            <span className={styles.icon}>
                {isCorrect ? '✅' : isIncorrect ? '❌' : ''}
            </span>
        </div>
    );
}
