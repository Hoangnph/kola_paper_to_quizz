/**
 * ResultScreen Component
 * Shows quiz results with score, feedback, and review option
 */

'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Button } from '../ui/Button';
import styles from './ResultScreen.module.css';

// Dynamic import for Confetti (bundle-dynamic-imports)
const Confetti = dynamic(
    () => import('../ui/Confetti').then((mod) => ({ default: mod.Confetti })),
    { ssr: false }
);

interface ResultScreenProps {
    score: number;
    total: number;
    hintsUsed: number;
    onRestart: () => void;
    onReview: () => void;
}

export function ResultScreen({
    score,
    total,
    hintsUsed,
    onRestart,
    onReview,
}: ResultScreenProps) {
    const percentage = Math.round((score / total) * 100);

    const { emoji, message, colorClass } = useMemo(() => {
        if (percentage >= 90) {
            return {
                emoji: '🏆',
                message: 'Xuất sắc! Bạn là siêu sao!',
                colorClass: styles.excellent,
            };
        } else if (percentage >= 70) {
            return {
                emoji: '🌟',
                message: 'Giỏi lắm! Tiếp tục phát huy!',
                colorClass: styles.good,
            };
        } else if (percentage >= 50) {
            return {
                emoji: '💪',
                message: 'Khá tốt! Cố gắng thêm nhé!',
                colorClass: styles.average,
            };
        } else {
            return {
                emoji: '📚',
                message: 'Cần ôn luyện thêm!',
                colorClass: styles.needsWork,
            };
        }
    }, [percentage]);

    const showConfetti = percentage >= 70;

    return (
        <div className={styles.screen}>
            {showConfetti ? <Confetti /> : null}

            <div className={styles.card}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.emoji}>{emoji}</span>
                    <h1 className={styles.title}>Kết quả</h1>
                </div>

                {/* Score Circle */}
                <div className={`${styles.scoreCircle} ${colorClass}`}>
                    <span className={styles.scoreNumber}>{score}</span>
                    <span className={styles.scoreDivider}>/</span>
                    <span className={styles.scoreTotal}>{total}</span>
                </div>

                {/* Percentage */}
                <div className={`${styles.percentage} ${colorClass}`}>
                    {percentage}%
                </div>

                {/* Message */}
                <p className={styles.message}>{message}</p>

                {/* Stats */}
                <div className={styles.stats}>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>✅</span>
                        <span className={styles.statLabel}>Đúng</span>
                        <span className={styles.statValue}>{score}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>❌</span>
                        <span className={styles.statLabel}>Sai</span>
                        <span className={styles.statValue}>{total - score}</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statIcon}>💡</span>
                        <span className={styles.statLabel}>Gợi ý</span>
                        <span className={styles.statValue}>{hintsUsed}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <Button variant="primary" size="large" onClick={onRestart}>
                        🔄 Làm lại
                    </Button>
                    <Button variant="secondary" size="large" onClick={onReview}>
                        📋 Xem lại đáp án
                    </Button>
                </div>
            </div>
        </div>
    );
}
