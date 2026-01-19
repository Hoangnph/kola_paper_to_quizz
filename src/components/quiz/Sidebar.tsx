/**
 * Sidebar Component
 * Shows question list with status indicators
 */

import { Button } from '../ui/Button';
import styles from './Sidebar.module.css';

interface SidebarProps {
    total: number;
    currentIndex: number;
    userAnswers: (number | null)[];
    correctAnswers: Map<number, number>;
    onGoToQuestion: (index: number) => void;
    onNext: () => void;
    onPrev: () => void;
    isFirst: boolean;
    isLast: boolean;
    showResultButton: boolean;
    onShowResult: () => void;
}

export function Sidebar({
    total,
    currentIndex,
    userAnswers,
    correctAnswers,
    onGoToQuestion,
    onNext,
    onPrev,
    isFirst,
    isLast,
    showResultButton,
    onShowResult,
}: SidebarProps) {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <span className={styles.icon}>📋</span>
                <span className={styles.title}>Danh sách câu hỏi</span>
            </div>

            <div className={styles.scrollContainer}>
                <div className={styles.list}>
                    {Array.from({ length: total }, (_, i) => {
                        const userAnswer = userAnswers[i];
                        const correctAnswer = correctAnswers.get(i);
                        const isAnswered = userAnswer !== null;
                        const isCorrect = isAnswered && userAnswer === correctAnswer;
                        const isIncorrect = isAnswered && userAnswer !== correctAnswer;
                        const isCurrent = i === currentIndex;

                        const classes = [
                            styles.item,
                            isCurrent ? styles.current : '',
                            isCorrect ? styles.correct : '',
                            isIncorrect ? styles.incorrect : '',
                        ]
                            .filter(Boolean)
                            .join(' ');

                        return (
                            <div
                                key={i}
                                className={classes}
                                onClick={() => onGoToQuestion(i)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Câu ${i + 1}`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onGoToQuestion(i);
                                    }
                                }}
                            >
                                <span className={styles.number}>{i + 1}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.footer}>
                <div className={styles.navigation}>
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={onPrev}
                        disabled={isFirst}
                        className={styles.navBtn}
                        title="Câu trước"
                    >
                        ← Trước
                    </Button>

                    {showResultButton ? (
                        <Button
                            variant="success"
                            size="small"
                            onClick={onShowResult}
                            className={styles.navBtn}
                            title="Xem kết quả"
                        >
                            🏆 Kết quả
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            size="small"
                            onClick={onNext}
                            disabled={isLast}
                            className={styles.navBtn}
                            title="Câu tiếp theo"
                        >
                            Tiếp →
                        </Button>
                    )}
                </div>
            </div>
        </aside>
    );
}
