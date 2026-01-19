/**
 * Quiz Application Types
 * TypeScript definitions for the Quiz Tin Hoc application
 */

// ============================================
// DATA TYPES
// ============================================

/**
 * Represents a single quiz question
 */
export interface Question {
    id: number;
    question: string;
    options: [string, string, string, string]; // Exactly 4 options
    answer: 0 | 1 | 2 | 3; // Index of correct answer
    explanation: string;
    hint: string;
    image?: string;
}

// ============================================
// STATE TYPES
// ============================================

/**
 * Quiz state managed by useQuiz hook
 */
export interface QuizState {
    currentIndex: number;
    score: number;
    userAnswers: (number | null)[];
    hintsUsed: boolean[];
    isCompleted: boolean;
}

/**
 * Progress information for the progress bar
 */
export interface QuizProgress {
    current: number;
    total: number;
    answered: number;
    percentage: number;
}

/**
 * Result of selecting an answer
 */
export interface AnswerResult {
    isCorrect: boolean;
    correctAnswer: number;
    explanation: string;
}

/**
 * Result when answer was already selected
 */
export interface AlreadyAnsweredResult {
    alreadyAnswered: true;
}

/**
 * Result of using a hint
 */
export interface HintResult {
    hint: string;
    used: true;
}

/**
 * Result when hint was already used
 */
export interface AlreadyUsedHintResult {
    alreadyUsed: true;
}

/**
 * Result when trying to use hint after answering
 */
export interface AlreadyAnsweredHintResult {
    alreadyAnswered: true;
}

/**
 * Detail for each question in final results
 */
export interface QuestionDetail {
    question: string;
    userAnswer: number | null;
    correctAnswer: number;
    isCorrect: boolean;
    usedHint: boolean;
    options: string[];
}

/**
 * Final quiz results
 */
export interface QuizResults {
    score: number;
    total: number;
    percentage: number;
    hintsUsed: number;
    details: QuestionDetail[];
}

// ============================================
// ACTION TYPES
// ============================================

export type QuizAction =
    | { type: 'SELECT_ANSWER'; payload: number }
    | { type: 'USE_HINT' }
    | { type: 'NEXT' }
    | { type: 'PREV' }
    | { type: 'GO_TO'; payload: number }
    | { type: 'RESET' };

// ============================================
// COMPONENT PROPS
// ============================================

export interface QuizScreenProps {
    questions: Question[];
}

export interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    userAnswer: number | null;
    hintUsed: boolean;
    onSelectAnswer: (index: number) => void;
    onUseHint: () => void;
}

export interface OptionButtonProps {
    letter: string;
    text: string;
    index: number;
    isSelected: boolean;
    isCorrect: boolean;
    isIncorrect: boolean;
    isDisabled: boolean;
    onClick: () => void;
}

export interface ProgressBarProps {
    progress: QuizProgress;
}

export interface SidebarProps {
    total: number;
    currentIndex: number;
    userAnswers: (number | null)[];
    correctAnswers: number[];
    onGoToQuestion: (index: number) => void;
}

export interface ResultScreenProps {
    results: QuizResults;
    onRestart: () => void;
    onReview: () => void;
}

export interface HintBoxProps {
    hintText: string;
    imageUrl?: string;
}
