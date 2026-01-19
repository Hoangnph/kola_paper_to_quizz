/**
 * Quiz App - Tin Học Lớp 4
 * Clean Code Principles: Single Responsibility, DRY, KISS
 * Updated: Added Hint Feature
 */

// ============================================
// QUIZ APP CLASS
// ============================================
class QuizApp {
    /**
     * Initialize the quiz with questions
     * @param {Array} questions - Array of question objects
     */
    constructor(questions) {
        this.questions = questions;
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.hintsUsed = new Array(questions.length).fill(false); // Track hints
        this.isCompleted = false;
    }

    /** Get the current question */
    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    /**
     * Select an answer for the current question
     * @param {number} optionIndex - Index of selected option (0-3)
     * @returns {Object} Result with isCorrect, correctAnswer, explanation
     */
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

    /** Use hint for current question */
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

    /** Check if hint was used for current question */
    isHintUsed() {
        return this.hintsUsed[this.currentIndex];
    }

    /** Get total hints used count */
    getHintsUsedCount() {
        return this.hintsUsed.filter(h => h === true).length;
    }

    /** Navigate to next question */
    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    }

    /** Navigate to previous question */
    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return true;
        }
        return false;
    }

    /**
     * Go to specific question
     * @param {number} index - Question index
     */
    goToQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.currentIndex = index;
            return true;
        }
        return false;
    }

    /** Get current progress stats */
    getProgress() {
        const answered = this.userAnswers.filter(a => a !== null).length;
        return {
            current: this.currentIndex + 1,
            total: this.questions.length,
            answered,
            percentage: Math.round((answered / this.questions.length) * 100)
        };
    }

    /** Get final results */
    getResults() {
        this.isCompleted = true;
        return {
            score: this.score,
            total: this.questions.length,
            percentage: Math.round((this.score / this.questions.length) * 100),
            hintsUsed: this.getHintsUsedCount(),
            details: this.questions.map((q, index) => ({
                question: q.question,
                userAnswer: this.userAnswers[index],
                correctAnswer: q.answer,
                isCorrect: this.userAnswers[index] === q.answer,
                usedHint: this.hintsUsed[index],
                options: q.options
            }))
        };
    }

    /** Reset quiz to initial state */
    reset() {
        this.currentIndex = 0;
        this.score = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.hintsUsed = new Array(this.questions.length).fill(false);
        this.isCompleted = false;
    }
}

// ============================================
// DOM MANAGER
// Handles all DOM interactions
// ============================================
class DOMManager {
    constructor() {
        this.cacheElements();
    }

    /** Cache all DOM elements for performance */
    cacheElements() {
        // Screens
        this.screens = {
            welcome: document.getElementById('welcome-screen'),
            quiz: document.getElementById('quiz-screen'),
            result: document.getElementById('result-screen')
        };

        // Buttons
        this.buttons = {
            start: document.getElementById('start-btn'),
            prev: document.getElementById('prev-btn'),
            next: document.getElementById('next-btn'),
            result: document.getElementById('result-btn'),
            review: document.getElementById('review-btn'),
            restart: document.getElementById('restart-btn'),
            hint: document.getElementById('hint-btn') // NEW
        };

        // Quiz elements
        this.quiz = {
            progressFill: document.getElementById('progress-fill'),
            progressCurrent: document.getElementById('progress-current'),
            progressTotal: document.getElementById('progress-total'),
            questionNav: document.getElementById('question-nav'),
            questionNumber: document.getElementById('question-number'),
            questionText: document.getElementById('question-text'),
            optionsContainer: document.getElementById('options-container'),
            explanationBox: document.getElementById('explanation-box'),
            explanationIcon: document.getElementById('explanation-icon'),
            explanationText: document.getElementById('explanation-text'),
            hintBox: document.getElementById('hint-box'), // NEW
            hintText: document.getElementById('hint-text'),
            imageContainer: document.getElementById('image-container'), // NEW
            questionImage: document.getElementById('question-image'), // NEW
            sidebarList: document.getElementById('sidebar-list') // Sidebar
        };

        // Result elements
        this.result = {
            icon: document.getElementById('result-icon'),
            scoreValue: document.getElementById('score-value'),
            scoreTotal: document.getElementById('score-total'),
            percentage: document.getElementById('score-percentage'),
            message: document.getElementById('result-message'),
            barFill: document.getElementById('score-bar-fill'),
            reviewSection: document.getElementById('review-section'),
            reviewList: document.getElementById('review-list'),
            hintsUsed: document.getElementById('hints-used-count') // NEW
        };

        // Confetti
        this.confettiContainer = document.getElementById('confetti-container');
    }

    /** Show a specific screen */
    showScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
        this.screens[screenName].classList.remove('hidden');
    }

    /** Update progress bar */
    updateProgress(progress) {
        const percentage = (progress.answered / progress.total) * 100;
        this.quiz.progressFill.style.width = `${percentage}%`;
        this.quiz.progressCurrent.textContent = progress.current;
        this.quiz.progressTotal.textContent = progress.total;
    }

    /** Render question navigation dots */
    renderQuestionNav(total, currentIndex, userAnswers, correctAnswers) {
        this.quiz.questionNav.innerHTML = '';

        for (let i = 0; i < total; i++) {
            const dot = document.createElement('button');
            dot.className = 'nav-dot';
            dot.textContent = i + 1;
            dot.setAttribute('aria-label', `Câu ${i + 1}`);

            if (i === currentIndex) {
                dot.classList.add('current');
            }

            if (userAnswers[i] !== null) {
                if (userAnswers[i] === correctAnswers[i]) {
                    dot.classList.add('correct');
                } else {
                    dot.classList.add('incorrect');
                }
            }

            dot.dataset.index = i;
            this.quiz.questionNav.appendChild(dot);
        }
    }

    /** Render sidebar question list */
    renderSidebar(total, currentIndex, userAnswers, correctAnswers) {
        if (!this.quiz.sidebarList) return;

        this.quiz.sidebarList.innerHTML = '';

        for (let i = 0; i < total; i++) {
            const item = document.createElement('div');
            item.className = 'sidebar-item';
            item.dataset.index = i;

            if (i === currentIndex) {
                item.classList.add('current');
            }

            let statusIcon = '';
            if (userAnswers[i] !== null) {
                if (userAnswers[i] === correctAnswers[i]) {
                    item.classList.add('correct');
                    statusIcon = '✅';
                } else {
                    item.classList.add('incorrect');
                    statusIcon = '❌';
                }
            }

            item.innerHTML = `
                <span class="sidebar-item-number">${i + 1}</span>
                <span class="sidebar-item-status">${statusIcon}</span>
            `;

            this.quiz.sidebarList.appendChild(item);
        }
    }

    /** Render current question */
    renderQuestion(question, questionNumber) {
        this.quiz.questionNumber.textContent = `Câu ${questionNumber}`;
        this.quiz.questionText.textContent = question.question;
        this.quiz.explanationBox.classList.add('hidden');
        this.quiz.hintBox.classList.add('hidden'); // Hide hint box initially

        // Hide image container (image is now inside hint-box)
        if (this.quiz.imageContainer) {
            this.quiz.imageContainer.classList.add('hidden');
        }
    }

    /** Render answer options */
    renderOptions(options, userAnswer) {
        const letters = ['A', 'B', 'C', 'D'];
        this.quiz.optionsContainer.innerHTML = '';

        options.forEach((option, index) => {
            const optionEl = document.createElement('div');
            optionEl.className = 'option';
            optionEl.dataset.index = index;
            optionEl.tabIndex = 0;
            optionEl.setAttribute('role', 'button');
            optionEl.setAttribute('aria-label', `${letters[index]}. ${option}`);

            optionEl.innerHTML = `
        <span class="option-letter">${letters[index]}</span>
        <span class="option-text">${option}</span>
        <span class="option-icon"></span>
      `;

            if (userAnswer !== null) {
                optionEl.classList.add('disabled');
            }

            this.quiz.optionsContainer.appendChild(optionEl);
        });
    }

    /** Update hint button state */
    updateHintButton(isUsed, isAnswered) {
        if (this.buttons.hint) {
            if (isUsed) {
                this.buttons.hint.disabled = true;
                this.buttons.hint.textContent = '💡 Đã dùng gợi ý';
            } else if (isAnswered) {
                this.buttons.hint.disabled = true;
                this.buttons.hint.innerHTML = '<span class="btn-icon">💡</span> Gợi ý';
            } else {
                this.buttons.hint.disabled = false;
                this.buttons.hint.innerHTML = '<span class="btn-icon">💡</span> Gợi ý';
            }
        }
    }

    /** Show hint with image */
    showHint(hintText, questionImage) {
        if (this.quiz.hintBox && this.quiz.hintText) {
            this.quiz.hintText.textContent = hintText;
            this.quiz.hintBox.classList.remove('hidden');
            this.quiz.hintBox.classList.add('hint-animate');

            // Show image inside hint if available
            if (questionImage && questionImage.trim() !== '' && this.quiz.imageContainer) {
                this.quiz.questionImage.src = questionImage;
                this.quiz.imageContainer.classList.remove('hidden');

                // Error handling
                this.quiz.questionImage.onerror = () => {
                    this.quiz.imageContainer.classList.add('hidden');
                };
            } else if (this.quiz.imageContainer) {
                this.quiz.imageContainer.classList.add('hidden');
            }
        }
    }

    /** Show answer result */
    showAnswerResult(selectedIndex, correctIndex, explanation) {
        const options = this.quiz.optionsContainer.querySelectorAll('.option');

        options.forEach((option, index) => {
            option.classList.add('disabled');
            const icon = option.querySelector('.option-icon');

            if (index === correctIndex) {
                option.classList.add('correct');
                icon.textContent = '✅';
            } else if (index === selectedIndex && selectedIndex !== correctIndex) {
                option.classList.add('incorrect');
                icon.textContent = '❌';
            }
        });

        // Show explanation
        this.quiz.explanationIcon.textContent = selectedIndex === correctIndex ? '🎉' : '💡';
        this.quiz.explanationText.textContent = explanation;
        this.quiz.explanationBox.classList.remove('hidden');
    }

    /** Update navigation buttons state */
    updateNavButtons(isFirst, isLast, allAnswered) {
        this.buttons.prev.disabled = isFirst;

        if (allAnswered) {
            this.buttons.next.classList.add('hidden');
            this.buttons.result.classList.remove('hidden');
        } else {
            this.buttons.next.classList.remove('hidden');
            this.buttons.result.classList.add('hidden');
            this.buttons.next.disabled = false;
        }
    }

    /** Render final results */
    renderResults(results) {
        const percentage = results.percentage;
        let emoji, message;

        if (percentage >= 90) {
            emoji = '🏆';
            message = 'Xuất sắc! Con giỏi quá!';
        } else if (percentage >= 70) {
            emoji = '🎉';
            message = 'Tốt lắm! Tiếp tục cố gắng nhé!';
        } else if (percentage >= 50) {
            emoji = '💪';
            message = 'Khá tốt! Ôn thêm một chút nữa nhé!';
        } else {
            emoji = '📚';
            message = 'Cần ôn tập thêm. Cố lên con nhé!';
        }

        this.result.icon.textContent = emoji;
        this.result.scoreValue.textContent = results.score;
        this.result.scoreTotal.textContent = results.total;
        this.result.percentage.textContent = `${percentage}%`;
        this.result.message.textContent = message;

        // Show hints used count
        if (this.result.hintsUsed) {
            this.result.hintsUsed.textContent = results.hintsUsed;
        }

        // Animate score bar
        setTimeout(() => {
            this.result.barFill.style.width = `${percentage}%`;
        }, 100);

        // Hide review section initially
        this.result.reviewSection.classList.add('hidden');
    }

    /** Render review list */
    renderReviewList(details) {
        const letters = ['A', 'B', 'C', 'D'];
        this.result.reviewList.innerHTML = '';

        details.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = `review-item ${item.isCorrect ? 'correct' : 'incorrect'}`;

            const userAnswerText = item.userAnswer !== null
                ? `${letters[item.userAnswer]}. ${item.options[item.userAnswer]}`
                : 'Chưa trả lời';

            const hintBadge = item.usedHint ? '<span class="hint-badge">💡 Đã dùng gợi ý</span>' : '';

            div.innerHTML = `
        <div class="review-header">
          <span class="review-number">Câu ${index + 1}</span>
          <span class="review-status">${item.isCorrect ? '✅' : '❌'}</span>
          ${hintBadge}
        </div>
        <p class="review-question">${item.question}</p>
        <div class="review-answers">
          ${!item.isCorrect ? `<span class="user-answer">Câu trả lời của con: ${userAnswerText}</span>` : ''}
          <span class="correct-answer">Đáp án đúng: ${letters[item.correctAnswer]}. ${item.options[item.correctAnswer]}</span>
        </div>
      `;

            this.result.reviewList.appendChild(div);
        });

        this.result.reviewSection.classList.remove('hidden');
    }

    /** Toggle review section visibility */
    toggleReview() {
        this.result.reviewSection.classList.toggle('hidden');
    }

    /** Create confetti effect */
    createConfetti(count = 50) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.setProperty('--confetti-drift', `${(Math.random() - 0.5) * 200}px`);
                confetti.style.animationDuration = `${2 + Math.random() * 2}s`;

                this.confettiContainer.appendChild(confetti);

                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }
    }
}

// ============================================
// QUIZ CONTROLLER
// Orchestrates App and DOM
// ============================================
class QuizController {
    constructor(questions) {
        this.app = new QuizApp(questions);
        this.dom = new DOMManager();
        this.correctAnswers = questions.map(q => q.answer);

        this.bindEvents();
    }

    /** Bind all event listeners */
    bindEvents() {
        // Start button
        this.dom.buttons.start.addEventListener('click', () => this.startQuiz());

        // Navigation buttons
        this.dom.buttons.prev.addEventListener('click', () => this.navigatePrev());
        this.dom.buttons.next.addEventListener('click', () => this.navigateNext());
        this.dom.buttons.result.addEventListener('click', () => this.showResults());

        // Result buttons
        this.dom.buttons.review.addEventListener('click', () => this.toggleReview());
        this.dom.buttons.restart.addEventListener('click', () => this.restartQuiz());

        // Hint button
        if (this.dom.buttons.hint) {
            this.dom.buttons.hint.addEventListener('click', () => this.useHint());
        }

        // Question navigation
        this.dom.quiz.questionNav.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-dot')) {
                this.goToQuestion(parseInt(e.target.dataset.index));
            }
        });

        // Sidebar navigation
        if (this.dom.quiz.sidebarList) {
            this.dom.quiz.sidebarList.addEventListener('click', (e) => {
                const item = e.target.closest('.sidebar-item');
                if (item) {
                    this.goToQuestion(parseInt(item.dataset.index));
                }
            });
        }

        // Option selection
        this.dom.quiz.optionsContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.option');
            if (option && !option.classList.contains('disabled')) {
                this.selectOption(parseInt(option.dataset.index));
            }
        });

        // Keyboard support for options
        this.dom.quiz.optionsContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const option = e.target.closest('.option');
                if (option && !option.classList.contains('disabled')) {
                    e.preventDefault();
                    this.selectOption(parseInt(option.dataset.index));
                }
            }
        });
    }

    /** Start the quiz */
    startQuiz() {
        this.dom.showScreen('quiz');
        this.renderCurrentQuestion();
    }

    /** Render the current question state */
    renderCurrentQuestion() {
        const question = this.app.getCurrentQuestion();
        const progress = this.app.getProgress();
        const userAnswer = this.app.userAnswers[this.app.currentIndex];
        const hintUsed = this.app.isHintUsed();

        this.dom.updateProgress(progress);
        this.dom.renderQuestionNav(
            this.app.questions.length,
            this.app.currentIndex,
            this.app.userAnswers,
            this.correctAnswers
        );
        this.dom.renderSidebar(
            this.app.questions.length,
            this.app.currentIndex,
            this.app.userAnswers,
            this.correctAnswers
        );
        this.dom.renderQuestion(question, progress.current);
        this.dom.renderOptions(question.options, userAnswer);
        this.dom.updateHintButton(hintUsed, userAnswer !== null);

        // If hint was used, show it
        if (hintUsed) {
            this.dom.showHint(question.hint, question.image);
        }

        // If already answered, show result
        if (userAnswer !== null) {
            this.dom.showAnswerResult(userAnswer, question.answer, question.explanation);
        }

        // Update nav buttons
        const isFirst = this.app.currentIndex === 0;
        const isLast = this.app.currentIndex === this.app.questions.length - 1;
        const allAnswered = this.app.userAnswers.every(a => a !== null);
        this.dom.updateNavButtons(isFirst, isLast, allAnswered);
    }

    /** Use hint for current question */
    useHint() {
        const result = this.app.useHint();
        const question = this.app.getCurrentQuestion();

        if (result.used) {
            this.dom.showHint(result.hint, question.image);
            this.dom.updateHintButton(true, false);
        }
    }

    /** Handle option selection */
    selectOption(optionIndex) {
        const result = this.app.selectAnswer(optionIndex);

        if (result.alreadyAnswered) return;

        // Show answer feedback
        this.dom.showAnswerResult(optionIndex, result.correctAnswer, result.explanation);

        // Update hint button
        this.dom.updateHintButton(this.app.isHintUsed(), true);

        // Confetti for correct answer
        if (result.isCorrect) {
            this.dom.createConfetti(30);
        }

        // Update navigation
        this.dom.renderQuestionNav(
            this.app.questions.length,
            this.app.currentIndex,
            this.app.userAnswers,
            this.correctAnswers
        );
        this.dom.renderSidebar(
            this.app.questions.length,
            this.app.currentIndex,
            this.app.userAnswers,
            this.correctAnswers
        );

        // Check if all answered
        const allAnswered = this.app.userAnswers.every(a => a !== null);
        const isLast = this.app.currentIndex === this.app.questions.length - 1;
        this.dom.updateNavButtons(this.app.currentIndex === 0, isLast, allAnswered);
    }

    /** Navigate to previous question */
    navigatePrev() {
        if (this.app.prevQuestion()) {
            this.renderCurrentQuestion();
        }
    }

    /** Navigate to next question */
    navigateNext() {
        if (this.app.nextQuestion()) {
            this.renderCurrentQuestion();
        }
    }

    /** Go to specific question */
    goToQuestion(index) {
        if (this.app.goToQuestion(index)) {
            this.renderCurrentQuestion();
        }
    }

    /** Show final results */
    showResults() {
        const results = this.app.getResults();
        this.dom.showScreen('result');
        this.dom.renderResults(results);

        // Confetti for good scores
        if (results.percentage >= 70) {
            this.dom.createConfetti(100);
        }
    }

    /** Toggle review section */
    toggleReview() {
        const results = this.app.getResults();

        if (this.dom.result.reviewSection.classList.contains('hidden')) {
            this.dom.renderReviewList(results.details);
        } else {
            this.dom.result.reviewSection.classList.add('hidden');
        }
    }

    /** Restart the quiz */
    restartQuiz() {
        this.app.reset();
        this.dom.result.barFill.style.width = '0%';
        this.dom.showScreen('welcome');
    }
}

// ============================================
// INITIALIZE APP
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof quizQuestions !== 'undefined') {
        new QuizController(quizQuestions);
    } else {
        console.error('Quiz questions not loaded!');
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QuizApp };
}
