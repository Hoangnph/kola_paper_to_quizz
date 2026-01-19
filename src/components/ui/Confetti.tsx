/**
 * Confetti Component
 * Celebration effect for correct answers and good scores
 * Following: bundle-dynamic-imports (will be dynamically imported)
 */

'use client';

import { useEffect, useRef } from 'react';
import styles from './Confetti.module.css';

interface ConfettiProps {
    count?: number;
    trigger?: boolean;
}

const COLORS = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];

export function Confetti({ count = 50, trigger = true }: ConfettiProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!trigger || !containerRef.current) return;

        const container = containerRef.current;
        const confettiElements: HTMLDivElement[] = [];

        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.className = styles.confetti;
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.background = COLORS[Math.floor(Math.random() * COLORS.length)];
                confetti.style.setProperty('--confetti-drift', `${(Math.random() - 0.5) * 200}px`);
                confetti.style.animationDuration = `${2 + Math.random() * 2}s`;

                container.appendChild(confetti);
                confettiElements.push(confetti);

                setTimeout(() => confetti.remove(), 4000);
            }, i * 30);
        }

        return () => {
            confettiElements.forEach((el) => el.remove());
        };
    }, [trigger, count]);

    return <div ref={containerRef} className={styles.container} />;
}
