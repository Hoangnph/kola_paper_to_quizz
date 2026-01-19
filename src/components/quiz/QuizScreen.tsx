/**
 * QuizScreen Component
 * Main quiz interface with question, sidebar, and navigation
 */

'use client';

import dynamic from 'next/dynamic';
import { useMemo, useCallback, useState, useRef, useEffect } from 'react';
import type { Question } from '@/lib/types';
import { useQuiz } from '@/hooks/useQuiz';
import { ProgressBar } from '../ui/ProgressBar';
import { Button } from '../ui/Button';
import { QuestionCard } from './QuestionCard';
import { Sidebar } from './Sidebar';
import styles from './QuizScreen.module.css';

// Dynamic import for Confetti
const Confetti = dynamic(
    () => import('../ui/Confetti').then((mod) => ({ default: mod.Confetti })),
    { ssr: false }
);

interface QuizScreenProps {
    questions: Question[];
    onComplete: (score: number, total: number) => void;
    onRestart: () => void;
}

export function QuizScreen({ questions, onComplete, onRestart }: QuizScreenProps) {
    const [showConfetti, setShowConfetti] = useState(false);

    const {
        state,
        currentQuestion,
        progress,
        isHintUsed,
        correctAnswersMap,
        selectAnswer,
        useHint,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        reset,
        getResults,
    } = useQuiz(questions);

    const isFirstQuestion = state.currentIndex === 0;
    const isLastQuestion = state.currentIndex === questions.length - 1;
    const allAnswered = useMemo(
        () => state.userAnswers.every((a) => a !== null),
        [state.userAnswers]
    );

    const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout>(null);

    // Clear timeout on unmount or manual navigation
    useEffect(() => {
        return () => {
            if (autoAdvanceTimeoutRef.current) {
                clearTimeout(autoAdvanceTimeoutRef.current);
            }
        };
    }, []);

    // Clear auto-advance timer when manually navigating
    useEffect(() => {
        if (autoAdvanceTimeoutRef.current) {
            clearTimeout(autoAdvanceTimeoutRef.current);
        }
    }, [state.currentIndex]);

    const handleSelectAnswer = useCallback((index: number) => {
        selectAnswer(index);

        // Check if answer is correct
        if (questions[state.currentIndex].answer === index) {
            setShowConfetti(true);

            // Hide confetti after 3 seconds
            setTimeout(() => setShowConfetti(false), 3000);

            // Auto advance to next question after 1.5s if not last question
            if (state.currentIndex < questions.length - 1) {
                // Clear any existing timeout
                if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);

                autoAdvanceTimeoutRef.current = setTimeout(() => {
                    nextQuestion();
                }, 1500);
            }
        }
    }, [selectAnswer, state.currentIndex, questions, nextQuestion]);

    const handleShowResults = useCallback(() => {
        const results = getResults();
        onComplete(results.score, results.total);
    }, [getResults, onComplete]);

    const handleRestart = useCallback(() => {
        reset();
        onRestart();
    }, [reset, onRestart]);



    return (
        <div className={styles.screen}>
            {showConfetti && <Confetti />}

            {/* Progress Bar */}
            <div className={styles.progressSection}>
                <ProgressBar progress={progress} />
            </div>

            {/* Main Layout */}
            <div className={styles.layout}>
                {/* Main Content */}
                <main className={styles.main}>
                    <QuestionCard
                        key={currentQuestion.id}
                        question={currentQuestion}
                        questionNumber={state.currentIndex + 1}
                        userAnswer={state.userAnswers[state.currentIndex]}
                        hintUsed={isHintUsed}
                        onSelectAnswer={handleSelectAnswer}
                        onUseHint={useHint}
                    />

                    {/* Navigation Buttons */}
                    <div className={styles.navigation}>
                        <Button
                            variant="secondary"
                            onClick={prevQuestion}
                            disabled={isFirstQuestion}
                        >
                            ← Câu trước
                        </Button>

                        {isLastQuestion && allAnswered ? (
                            <Button
                                variant="success"
                                onClick={handleShowResults}
                            >
                                🏆 Xem kết quả
                            </Button>
                        ) : (
                            <Button
                                variant="primary"
                                onClick={nextQuestion}
                                disabled={isLastQuestion}
                            >
                                Câu tiếp →
                            </Button>
                        )}
                    </div>

                    {/* Restart Button */}
                    <div className={styles.restartSection}>
                        <button
                            className={styles.restartBtn}
                            onClick={handleRestart}
                        >
                            🔄 Làm lại từ đầu
                        </button>
                    </div>
                </main>

                {/* Sidebar */}
                <Sidebar
                    total={questions.length}
                    currentIndex={state.currentIndex}
                    userAnswers={state.userAnswers}
                    correctAnswers={correctAnswersMap}
                    onGoToQuestion={goToQuestion}
                    onNext={nextQuestion}
                    onPrev={prevQuestion}
                    isFirst={isFirstQuestion}
                    isLast={isLastQuestion}
                    showResultButton={!!(isLastQuestion && allAnswered)}
                    onShowResult={handleShowResults}
                />
            </div>
        </div>
    );
}
