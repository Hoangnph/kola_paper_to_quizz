/**
 * ProgressBar Component
 * Shows quiz progress with animated fill
 */

import styles from './ProgressBar.module.css';
import type { QuizProgress } from '@/lib/types';

interface ProgressBarProps {
    progress: QuizProgress;
}

export function ProgressBar({ progress }: ProgressBarProps) {
    const percentage = (progress.answered / progress.total) * 100;

    return (
        <div className={styles.container}>
            <div className={styles.bar}>
                <div
                    className={styles.fill}
                    style={{ width: `${percentage}%` }}
                    role="progressbar"
                    aria-valuenow={progress.answered}
                    aria-valuemin={0}
                    aria-valuemax={progress.total}
                />
            </div>
            <div className={styles.text}>
                <span>{progress.current}</span> / <span>{progress.total}</span>
            </div>
        </div>
    );
}
