/**
 * Quiz Tin Học Lớp 4 - Main Page
 * App with screen transitions: Welcome -> Quiz -> Result -> Review
 */

'use client';

import { useState, useCallback } from 'react';
import { quizQuestions } from '@/lib/questions';
import { useQuiz } from '@/hooks/useQuiz';
import { WelcomeScreen, QuizScreen, ResultScreen, ReviewList } from '@/components/quiz';

type ScreenType = 'welcome' | 'quiz' | 'result' | 'review';

export default function Home() {
  const [screen, setScreen] = useState<ScreenType>('welcome');
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });

  const quiz = useQuiz(quizQuestions);

  // Handlers for screen transitions
  const handleStartQuiz = useCallback(() => {
    quiz.reset();
    setScreen('quiz');
  }, [quiz]);

  const handleQuizComplete = useCallback((score: number, total: number) => {
    setFinalScore({ score, total });
    setScreen('result');
  }, []);

  const handleRestart = useCallback(() => {
    quiz.reset();
    setScreen('welcome');
  }, [quiz]);

  const handleReview = useCallback(() => {
    setScreen('review');
  }, []);

  const handleBackToResult = useCallback(() => {
    setScreen('result');
  }, []);

  // Render screens based on state
  switch (screen) {
    case 'welcome':
      return <WelcomeScreen onStart={handleStartQuiz} />;

    case 'quiz':
      return (
        <QuizScreen
          questions={quizQuestions}
          onComplete={handleQuizComplete}
          onRestart={handleRestart}
        />
      );

    case 'result':
      return (
        <ResultScreen
          score={finalScore.score}
          total={finalScore.total}
          hintsUsed={quiz.hintsUsedCount}
          onRestart={handleRestart}
          onReview={handleReview}
        />
      );

    case 'review':
      return (
        <ReviewList
          details={quiz.getResults().details}
          onBack={handleBackToResult}
          onRestart={handleRestart}
        />
      );

    default:
      return <WelcomeScreen onStart={handleStartQuiz} />;
  }
}
