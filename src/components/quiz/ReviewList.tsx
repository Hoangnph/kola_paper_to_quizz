/**
 * ReviewList Component
 * Shows all questions with user's answers for review
 */

'use client';

import type { QuestionDetail } from '@/lib/types';
import { Button } from '../ui/Button';
import styles from './ReviewList.module.css';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

interface ReviewListProps {
    details: QuestionDetail[];
    onBack: () => void;
    onRestart: () => void;
}

export function ReviewList({ details, onBack, onRestart }: ReviewListProps) {
    return (
        <div className={styles.screen}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>📋 Xem lại đáp án</h1>
                    <p className={styles.subtitle}>
                        {details.filter((d) => d.isCorrect).length}/{details.length} câu đúng
                    </p>
                </div>

                {/* Questions List */}
                <div className={styles.list}>
                    {details.map((detail, index) => (
                        <div
                            key={index}
                            className={`${styles.item} ${detail.isCorrect ? styles.correct : styles.incorrect
                                }`}
                        >
                            {/* Question Number & Status */}
                            <div className={styles.itemHeader}>
                                <span className={styles.number}>Câu {index + 1}</span>
                                <span className={styles.status}>
                                    {detail.isCorrect ? '✅ Đúng' : '❌ Sai'}
                                    {detail.usedHint ? ' 💡' : ''}
                                </span>
                            </div>

                            {/* Question Text */}
                            <p className={styles.question}>{detail.question}</p>

                            {/* Options */}
                            <div className={styles.options}>
                                {detail.options.map((option, optIdx) => {
                                    const isUserAnswer = detail.userAnswer === optIdx;
                                    const isCorrectAnswer = detail.correctAnswer === optIdx;

                                    return (
                                        <div
                                            key={optIdx}
                                            className={`${styles.option} ${isCorrectAnswer ? styles.optionCorrect : ''
                                                } ${isUserAnswer && !isCorrectAnswer
                                                    ? styles.optionIncorrect
                                                    : ''
                                                }`}
                                        >
                                            <span className={styles.letter}>
                                                {OPTION_LETTERS[optIdx]}
                                            </span>
                                            <span className={styles.text}>{option}</span>
                                            {isCorrectAnswer ? (
                                                <span className={styles.icon}>✓</span>
                                            ) : isUserAnswer ? (
                                                <span className={styles.icon}>✗</span>
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <Button variant="secondary" onClick={onBack}>
                        ← Quay lại kết quả
                    </Button>
                    <Button variant="primary" onClick={onRestart}>
                        🔄 Làm lại
                    </Button>
                </div>
            </div>
        </div>
    );
}
