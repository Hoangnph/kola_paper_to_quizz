/**
 * Unit Tests for QuizApp - TDD Approach
 * Run with: node tests/app.test.js
 * Updated: Added tests for Hint feature
 */

const { quizQuestions } = require('../src/data/questions.js');

// Simple test runner
let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        testsPassed++;
    } catch (error) {
        console.log(`❌ ${name}`);
        console.log(`   Error: ${error.message}`);
        testsFailed++;
    }
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}

function assertEqual(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
}

// ============================================
// TESTS FOR DATA
// ============================================

console.log('\n📚 Testing Questions Data...\n');

test('Should have 15 questions', () => {
    assertEqual(quizQuestions.length, 15);
});

test('Each question should have required fields', () => {
    quizQuestions.forEach((q, index) => {
        assert(q.id !== undefined, `Question ${index + 1} missing id`);
        assert(q.question !== undefined, `Question ${index + 1} missing question`);
        assert(Array.isArray(q.options), `Question ${index + 1} options should be array`);
        assertEqual(q.options.length, 4, `Question ${index + 1} should have 4 options`);
        assert(q.answer >= 0 && q.answer <= 3, `Question ${index + 1} answer should be 0-3`);
        assert(q.explanation !== undefined, `Question ${index + 1} missing explanation`);
    });
});

test('Question IDs should be unique', () => {
    const ids = quizQuestions.map(q => q.id);
    const uniqueIds = [...new Set(ids)];
    assertEqual(ids.length, uniqueIds.length, 'Question IDs should be unique');
});

// NEW: Test for hint field
test('Each question should have hint field', () => {
    quizQuestions.forEach((q, index) => {
        assert(q.hint !== undefined, `Question ${index + 1} missing hint`);
        assert(typeof q.hint === 'string', `Question ${index + 1} hint should be string`);
        assert(q.hint.length > 0, `Question ${index + 1} hint should not be empty`);
    });
});

// ============================================
// TESTS FOR QuizApp CLASS
// ============================================

console.log('\n🎮 Testing QuizApp Class...\n');

// QuizApp with Hint Support
class QuizApp {
    constructor(questions) {
        this.questions = questions;
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.hintsUsed = new Array(questions.length).fill(false); // NEW: Track hints
        this.isCompleted = false;
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    selectAnswer(optionIndex) {
        if (this.userAnswers[this.currentIndex] !== null) {
            return { alreadyAnswered: true };
        }

        this.userAnswers[this.currentIndex] = optionIndex;
        const currentQuestion = this.getCurrentQuestion();
        const isCorrect = optionIndex === currentQuestion.answer;

        if (isCorrect) {
            this.score++;
        }

        return {
            isCorrect,
            correctAnswer: currentQuestion.answer,
            explanation: currentQuestion.explanation
        };
    }

    // NEW: Use hint for current question
    useHint() {
        if (this.hintsUsed[this.currentIndex]) {
            return { alreadyUsed: true };
        }

        if (this.userAnswers[this.currentIndex] !== null) {
            return { alreadyAnswered: true };
        }

        this.hintsUsed[this.currentIndex] = true;
        return {
            hint: this.getCurrentQuestion().hint,
            used: true
        };
    }

    // NEW: Check if hint was used for current question
    isHintUsed() {
        return this.hintsUsed[this.currentIndex];
    }

    // NEW: Get total hints used count
    getHintsUsedCount() {
        return this.hintsUsed.filter(h => h === true).length;
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    }

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return true;
        }
        return false;
    }

    goToQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.currentIndex = index;
            return true;
        }
        return false;
    }

    getProgress() {
        const answered = this.userAnswers.filter(a => a !== null).length;
        return {
            current: this.currentIndex + 1,
            total: this.questions.length,
            answered,
            percentage: Math.round((answered / this.questions.length) * 100)
        };
    }

    getResults() {
        this.isCompleted = true;
        return {
            score: this.score,
            total: this.questions.length,
            percentage: Math.round((this.score / this.questions.length) * 100),
            hintsUsed: this.getHintsUsedCount(), // NEW: Include hints count
            details: this.questions.map((q, index) => ({
                question: q.question,
                userAnswer: this.userAnswers[index],
                correctAnswer: q.answer,
                isCorrect: this.userAnswers[index] === q.answer,
                usedHint: this.hintsUsed[index] // NEW: Track per question
            }))
        };
    }

    reset() {
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.hintsUsed = new Array(this.questions.length).fill(false); // NEW: Reset hints
        this.isCompleted = false;
    }
}

// Existing tests
test('QuizApp should initialize correctly', () => {
    const app = new QuizApp(quizQuestions);
    assertEqual(app.currentIndex, 0);
    assertEqual(app.score, 0);
    assertEqual(app.userAnswers.length, 15);
    assertEqual(app.isCompleted, false);
});

test('getCurrentQuestion should return first question initially', () => {
    const app = new QuizApp(quizQuestions);
    const question = app.getCurrentQuestion();
    assertEqual(question.id, 1);
});

test('selectAnswer should track correct answers', () => {
    const app = new QuizApp(quizQuestions);
    const result = app.selectAnswer(1);
    assertEqual(result.isCorrect, true);
    assertEqual(app.score, 1);
});

test('selectAnswer should track incorrect answers', () => {
    const app = new QuizApp(quizQuestions);
    const result = app.selectAnswer(0);
    assertEqual(result.isCorrect, false);
    assertEqual(app.score, 0);
});

test('selectAnswer should prevent re-answering', () => {
    const app = new QuizApp(quizQuestions);
    app.selectAnswer(1);
    const result = app.selectAnswer(2);
    assertEqual(result.alreadyAnswered, true);
});

test('nextQuestion should advance index', () => {
    const app = new QuizApp(quizQuestions);
    app.nextQuestion();
    assertEqual(app.currentIndex, 1);
});

test('nextQuestion should return false at end', () => {
    const app = new QuizApp(quizQuestions);
    app.currentIndex = 14;
    const result = app.nextQuestion();
    assertEqual(result, false);
    assertEqual(app.currentIndex, 14);
});

test('prevQuestion should go back', () => {
    const app = new QuizApp(quizQuestions);
    app.currentIndex = 5;
    app.prevQuestion();
    assertEqual(app.currentIndex, 4);
});

test('prevQuestion should return false at start', () => {
    const app = new QuizApp(quizQuestions);
    const result = app.prevQuestion();
    assertEqual(result, false);
    assertEqual(app.currentIndex, 0);
});

test('goToQuestion should navigate to specific index', () => {
    const app = new QuizApp(quizQuestions);
    app.goToQuestion(10);
    assertEqual(app.currentIndex, 10);
});

test('getProgress should return correct stats', () => {
    const app = new QuizApp(quizQuestions);
    app.selectAnswer(1);
    app.nextQuestion();
    app.selectAnswer(0);
    const progress = app.getProgress();
    assertEqual(progress.current, 2);
    assertEqual(progress.total, 15);
    assertEqual(progress.answered, 2);
});

test('getResults should calculate final score', () => {
    const app = new QuizApp(quizQuestions);
    quizQuestions.forEach((q, index) => {
        app.goToQuestion(index);
        app.selectAnswer(q.answer);
    });
    const results = app.getResults();
    assertEqual(results.score, 15);
    assertEqual(results.percentage, 100);
    assertEqual(app.isCompleted, true);
});

test('reset should clear all state', () => {
    const app = new QuizApp(quizQuestions);
    app.selectAnswer(1);
    app.nextQuestion();
    app.reset();
    assertEqual(app.currentIndex, 0);
    assertEqual(app.score, 0);
    assertEqual(app.userAnswers[0], null);
});

// ============================================
// NEW: TESTS FOR HINT FEATURE
// ============================================

console.log('\n💡 Testing Hint Feature...\n');

test('QuizApp should initialize with empty hintsUsed array', () => {
    const app = new QuizApp(quizQuestions);
    assertEqual(app.hintsUsed.length, 15);
    assertEqual(app.hintsUsed[0], false);
    assertEqual(app.getHintsUsedCount(), 0);
});

test('useHint should return hint and mark as used', () => {
    const app = new QuizApp(quizQuestions);
    const result = app.useHint();
    assertEqual(result.used, true);
    assert(result.hint !== undefined, 'Hint should be returned');
    assertEqual(app.isHintUsed(), true);
    assertEqual(app.getHintsUsedCount(), 1);
});

test('useHint should only work once per question', () => {
    const app = new QuizApp(quizQuestions);
    app.useHint(); // First use
    const result = app.useHint(); // Second use
    assertEqual(result.alreadyUsed, true);
    assertEqual(app.getHintsUsedCount(), 1); // Still 1
});

test('useHint should not work after answer is selected', () => {
    const app = new QuizApp(quizQuestions);
    app.selectAnswer(1); // Answer first
    const result = app.useHint(); // Try to use hint
    assertEqual(result.alreadyAnswered, true);
});

test('Hints should be tracked per question independently', () => {
    const app = new QuizApp(quizQuestions);

    // Use hint on question 1
    app.useHint();
    assertEqual(app.getHintsUsedCount(), 1);

    // Move to question 2, use hint
    app.nextQuestion();
    assertEqual(app.isHintUsed(), false); // Not used on Q2 yet
    app.useHint();
    assertEqual(app.getHintsUsedCount(), 2);

    // Move to question 3, don't use hint
    app.nextQuestion();
    assertEqual(app.isHintUsed(), false);
    assertEqual(app.getHintsUsedCount(), 2); // Still 2
});

test('getResults should include hints usage stats', () => {
    const app = new QuizApp(quizQuestions);

    // Use hint on first 3 questions
    app.useHint();
    app.selectAnswer(1);

    app.nextQuestion();
    app.useHint();
    app.selectAnswer(1);

    app.nextQuestion();
    app.useHint();
    app.selectAnswer(0);

    // Answer rest without hints
    for (let i = 3; i < 15; i++) {
        app.goToQuestion(i);
        app.selectAnswer(quizQuestions[i].answer);
    }

    const results = app.getResults();
    assertEqual(results.hintsUsed, 3);
    assertEqual(results.details[0].usedHint, true);
    assertEqual(results.details[3].usedHint, false);
});

test('reset should clear hints used', () => {
    const app = new QuizApp(quizQuestions);
    app.useHint();
    app.nextQuestion();
    app.useHint();
    assertEqual(app.getHintsUsedCount(), 2);

    app.reset();
    assertEqual(app.getHintsUsedCount(), 0);
    assertEqual(app.hintsUsed[0], false);
});

// ============================================
// SUMMARY
// ============================================

console.log('\n' + '='.repeat(40));
console.log(`📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);
console.log('='.repeat(40) + '\n');

process.exit(testsFailed > 0 ? 1 : 0);
