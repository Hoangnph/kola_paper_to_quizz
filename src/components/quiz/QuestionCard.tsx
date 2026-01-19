/**
 * QuestionCard Component
 * Displays question with options, hint button, and feedback
 */

'use client';

import { useState, useCallback } from 'react';
import type { Question } from '@/lib/types';
import { OptionButton } from './OptionButton';
import { HintBox } from './HintBox';
import { Button } from '../ui/Button';
import styles from './QuestionCard.module.css';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    userAnswer: number | null;
    hintUsed: boolean;
    onSelectAnswer: (index: number) => void;
    onUseHint: () => void;
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'] as const;

export function QuestionCard({
    question,
    questionNumber,
    userAnswer,
    hintUsed,
    onSelectAnswer,
    onUseHint,
}: QuestionCardProps) {
    const [showHint, setShowHint] = useState(false);

    const isAnswered = userAnswer !== null;
    const correctAnswer = question.answer;

    const handleUseHint = useCallback(() => {
        if (!hintUsed) {
            onUseHint();
        }
        setShowHint(true);
    }, [hintUsed, onUseHint]);

    const handleSelectAnswer = useCallback(
        (index: number) => {
            if (!isAnswered) {
                onSelectAnswer(index);
            }
        },
        [isAnswered, onSelectAnswer]
    );

    return (
        <div className={styles.card}>
            {/* Question Header */}
            <div className={styles.header}>
                <span className={styles.number}>Câu {questionNumber}</span>
                {isAnswered ? (
                    <span
                        className={`${styles.status} ${userAnswer === correctAnswer
                                ? styles.correct
                                : styles.incorrect
                            }`}
                    >
                        {userAnswer === correctAnswer ? '✓ Đúng' : '✗ Sai'}
                    </span>
                ) : null}
            </div>

            {/* Question Text */}
            <h2 className={styles.question}>{question.question}</h2>

            {/* Options Grid */}
            <div className={styles.options}>
                {question.options.map((option, index) => (
                    <OptionButton
                        key={index}
                        letter={OPTION_LETTERS[index]}
                        text={option}
                        isDisabled={isAnswered}
                        isCorrect={isAnswered && index === correctAnswer}
                        isIncorrect={
                            isAnswered &&
                            index === userAnswer &&
                            userAnswer !== correctAnswer
                        }
                        onClick={() => handleSelectAnswer(index)}
                    />
                ))}
            </div>

            {/* Hint Section */}
            <div className={styles.hintSection}>
                {!isAnswered && !showHint ? (
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={handleUseHint}
                        disabled={isAnswered}
                    >
                        💡 {hintUsed ? 'Xem gợi ý' : 'Dùng gợi ý'}
                    </Button>
                ) : null}

                <HintBox
                    hintText={question.hint}
                    imageUrl={question.image}
                    isVisible={showHint || isAnswered}
                />
            </div>

            {/* Explanation (after answering) */}
            {isAnswered ? (
                <div className={styles.explanation}>
                    <div className={styles.explanationHeader}>
                        <span className={styles.explanationIcon}>📖</span>
                        <span className={styles.explanationLabel}>
                            Giải thích
                        </span>
                    </div>
                    <p className={styles.explanationText}>
                        {question.explanation}
                    </p>
                </div>
            ) : null}
        </div>
    );
}
