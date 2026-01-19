/**
 * Tests for useQuiz Hook - TDD Approach
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useQuiz } from '../useQuiz';
import type { Question } from '@/lib/types';

// Mock questions for testing
const mockQuestions: Question[] = [
    {
        id: 1,
        question: "Test Question 1",
        options: ["A", "B", "C", "D"],
        answer: 1,
        explanation: "B is correct",
        hint: "Hint for Q1",
        image: "/images/q1.png"
    },
    {
        id: 2,
        question: "Test Question 2",
        options: ["W", "X", "Y", "Z"],
        answer: 0,
        explanation: "W is correct",
        hint: "Hint for Q2",
        image: "/images/q2.png"
    },
    {
        id: 3,
        question: "Test Question 3",
        options: ["1", "2", "3", "4"],
        answer: 2,
        explanation: "3 is correct",
        hint: "Hint for Q3"
    }
];

describe('useQuiz Hook', () => {
    describe('Initialization', () => {
        it('should initialize with correct default state', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            expect(result.current.state.currentIndex).toBe(0);
            expect(result.current.state.score).toBe(0);
            expect(result.current.state.userAnswers).toHaveLength(3);
            expect(result.current.state.userAnswers.every((a) => a === null)).toBe(true);
            expect(result.current.state.hintsUsed.every((h) => h === false)).toBe(true);
            expect(result.current.state.isCompleted).toBe(false);
        });

        it('should return current question', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            expect(result.current.currentQuestion.id).toBe(1);
            expect(result.current.currentQuestion.question).toBe("Test Question 1");
        });

        it('should return correct progress', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            expect(result.current.progress).toEqual({
                current: 1,
                total: 3,
                answered: 0,
                percentage: 0
            });
        });
    });

    describe('Answer Selection', () => {
        it('should track correct answers and update score', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.selectAnswer(1); // Correct answer
            });

            expect(result.current.state.userAnswers[0]).toBe(1);
            expect(result.current.state.score).toBe(1);
        });

        it('should track incorrect answers without updating score', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.selectAnswer(0); // Wrong answer
            });

            expect(result.current.state.userAnswers[0]).toBe(0);
            expect(result.current.state.score).toBe(0);
        });

        it('should prevent re-answering the same question', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.selectAnswer(1);
            });

            act(() => {
                result.current.selectAnswer(0); // Try to change answer
            });

            expect(result.current.state.userAnswers[0]).toBe(1); // Still the first answer
            expect(result.current.state.score).toBe(1);
        });

        it('should update progress after answering', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.selectAnswer(1);
            });

            expect(result.current.progress.answered).toBe(1);
            expect(result.current.progress.percentage).toBe(33);
        });
    });

    describe('Navigation', () => {
        it('should navigate to next question', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.nextQuestion();
            });

            expect(result.current.state.currentIndex).toBe(1);
            expect(result.current.currentQuestion.id).toBe(2);
        });

        it('should navigate to previous question', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.nextQuestion();
                result.current.prevQuestion();
            });

            expect(result.current.state.currentIndex).toBe(0);
        });

        it('should not go before first question', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.prevQuestion();
            });

            expect(result.current.state.currentIndex).toBe(0);
        });

        it('should not go past last question', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.goToQuestion(2);
                result.current.nextQuestion();
            });

            expect(result.current.state.currentIndex).toBe(2);
        });

        it('should go to specific question', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.goToQuestion(2);
            });

            expect(result.current.state.currentIndex).toBe(2);
            expect(result.current.currentQuestion.id).toBe(3);
        });
    });

    describe('Hints', () => {
        it('should use hint and mark as used', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.useHint();
            });

            expect(result.current.state.hintsUsed[0]).toBe(true);
            expect(result.current.isHintUsed).toBe(true);
        });

        it('should not allow using hint twice', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.useHint();
                result.current.useHint();
            });

            expect(result.current.state.hintsUsed.filter(h => h).length).toBe(1);
        });

        it('should track hints per question independently', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.useHint();
                result.current.nextQuestion();
            });

            expect(result.current.isHintUsed).toBe(false);

            act(() => {
                result.current.useHint();
            });

            expect(result.current.state.hintsUsed[0]).toBe(true);
            expect(result.current.state.hintsUsed[1]).toBe(true);
            expect(result.current.hintsUsedCount).toBe(2);
        });
    });

    describe('Results', () => {
        it('should calculate final results correctly', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.selectAnswer(1); // Correct
                result.current.nextQuestion();
                result.current.selectAnswer(0); // Correct
                result.current.nextQuestion();
                result.current.selectAnswer(0); // Wrong (should be 2)
            });

            const results = result.current.getResults();

            expect(results.score).toBe(2);
            expect(results.total).toBe(3);
            expect(results.percentage).toBe(67);
            expect(results.details).toHaveLength(3);
            expect(results.details[0].isCorrect).toBe(true);
            expect(results.details[2].isCorrect).toBe(false);
        });

        it('should include hints used in results', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.useHint();
                result.current.selectAnswer(1);
                result.current.nextQuestion();
                result.current.selectAnswer(0);
            });

            const results = result.current.getResults();

            expect(results.hintsUsed).toBe(1);
            expect(results.details[0].usedHint).toBe(true);
            expect(results.details[1].usedHint).toBe(false);
        });
    });

    describe('Reset', () => {
        it('should reset all state', () => {
            const { result } = renderHook(() => useQuiz(mockQuestions));

            act(() => {
                result.current.selectAnswer(1);
                result.current.nextQuestion();
                result.current.useHint();
                result.current.reset();
            });

            expect(result.current.state.currentIndex).toBe(0);
            expect(result.current.state.score).toBe(0);
            expect(result.current.state.userAnswers.every(a => a === null)).toBe(true);
            expect(result.current.state.hintsUsed.every(h => !h)).toBe(true);
            expect(result.current.state.isCompleted).toBe(false);
        });
    });
});
