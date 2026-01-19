/**
 * useQuiz Hook - Quiz State Management
 * Converted from QuizApp class to React hook with useReducer
 * Following vercel-react-best-practices: rerender-functional-setstate
 */

import { useReducer, useCallback, useMemo } from 'react';
import type {
    Question,
    QuizState,
    QuizAction,
    QuizProgress,
    QuizResults,
    QuestionDetail
} from '@/lib/types';

// ============================================
// INITIAL STATE
// ============================================

const createInitialState = (questionsLength: number): QuizState => ({
    currentIndex: 0,
    score: 0,
    userAnswers: new Array(questionsLength).fill(null),
    hintsUsed: new Array(questionsLength).fill(false),
    isCompleted: false,
});

// ============================================
// REDUCER
// ============================================

type QuizReducerAction = QuizAction & { questions: Question[] };

function quizReducer(state: QuizState, action: QuizReducerAction): QuizState {
    switch (action.type) {
        case 'SELECT_ANSWER': {
            // Prevent re-answering
            if (state.userAnswers[state.currentIndex] !== null) {
                return state;
            }

            const isCorrect = action.payload === action.questions[state.currentIndex].answer;
            const newUserAnswers = [...state.userAnswers];
            newUserAnswers[state.currentIndex] = action.payload;

            return {
                ...state,
                userAnswers: newUserAnswers,
                score: isCorrect ? state.score + 1 : state.score,
            };
        }

        case 'USE_HINT': {
            // Prevent using hint twice or after answering
            if (
                state.hintsUsed[state.currentIndex] ||
                state.userAnswers[state.currentIndex] !== null
            ) {
                return state;
            }

            const newHintsUsed = [...state.hintsUsed];
            newHintsUsed[state.currentIndex] = true;

            return {
                ...state,
                hintsUsed: newHintsUsed,
            };
        }

        case 'NEXT': {
            if (state.currentIndex >= action.questions.length - 1) {
                return state;
            }
            return {
                ...state,
                currentIndex: state.currentIndex + 1,
            };
        }

        case 'PREV': {
            if (state.currentIndex <= 0) {
                return state;
            }
            return {
                ...state,
                currentIndex: state.currentIndex - 1,
            };
        }

        case 'GO_TO': {
            if (action.payload < 0 || action.payload >= action.questions.length) {
                return state;
            }
            return {
                ...state,
                currentIndex: action.payload,
            };
        }

        case 'RESET': {
            return createInitialState(action.questions.length);
        }

        default:
            return state;
    }
}

// ============================================
// HOOK
// ============================================

export function useQuiz(questions: Question[]) {
    // Using lazy initialization for expensive initial state
    // Following: rerender-lazy-state-init
    const [state, dispatch] = useReducer(
        quizReducer,
        questions.length,
        createInitialState
    );

    // Memoized dispatch wrapper that includes questions
    const dispatchWithQuestions = useCallback(
        (action: QuizAction) => {
            dispatch({ ...action, questions } as QuizReducerAction);
        },
        [questions]
    );

    // ============================================
    // DERIVED STATE
    // ============================================

    const currentQuestion = questions[state.currentIndex];

    const isHintUsed = state.hintsUsed[state.currentIndex];

    const hintsUsedCount = useMemo(
        () => state.hintsUsed.filter(Boolean).length,
        [state.hintsUsed]
    );

    const progress: QuizProgress = useMemo(() => {
        const answered = state.userAnswers.filter((a) => a !== null).length;
        return {
            current: state.currentIndex + 1,
            total: questions.length,
            answered,
            percentage: Math.round((answered / questions.length) * 100),
        };
    }, [state.currentIndex, state.userAnswers, questions.length]);

    // Map for O(1) correctAnswer lookup
    // Following: js-set-map-lookups
    const correctAnswersMap = useMemo(
        () => new Map(questions.map((q, i) => [i, q.answer])),
        [questions]
    );

    // ============================================
    // ACTIONS
    // ============================================

    const selectAnswer = useCallback(
        (index: number) => {
            dispatchWithQuestions({ type: 'SELECT_ANSWER', payload: index });
        },
        [dispatchWithQuestions]
    );

    const useHint = useCallback(() => {
        dispatchWithQuestions({ type: 'USE_HINT' });
    }, [dispatchWithQuestions]);

    const nextQuestion = useCallback(() => {
        dispatchWithQuestions({ type: 'NEXT' });
    }, [dispatchWithQuestions]);

    const prevQuestion = useCallback(() => {
        dispatchWithQuestions({ type: 'PREV' });
    }, [dispatchWithQuestions]);

    const goToQuestion = useCallback(
        (index: number) => {
            dispatchWithQuestions({ type: 'GO_TO', payload: index });
        },
        [dispatchWithQuestions]
    );

    const reset = useCallback(() => {
        dispatchWithQuestions({ type: 'RESET' });
    }, [dispatchWithQuestions]);

    const getResults = useCallback((): QuizResults => {
        const details: QuestionDetail[] = questions.map((q, index) => ({
            question: q.question,
            userAnswer: state.userAnswers[index],
            correctAnswer: q.answer,
            isCorrect: state.userAnswers[index] === q.answer,
            usedHint: state.hintsUsed[index],
            options: q.options,
        }));

        return {
            score: state.score,
            total: questions.length,
            percentage: Math.round((state.score / questions.length) * 100),
            hintsUsed: hintsUsedCount,
            details,
        };
    }, [questions, state, hintsUsedCount]);

    // ============================================
    // RETURN
    // ============================================

    return {
        // State
        state,
        currentQuestion,
        progress,
        isHintUsed,
        hintsUsedCount,
        correctAnswersMap,

        // Actions
        selectAnswer,
        useHint,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        reset,
        getResults,
    };
}
