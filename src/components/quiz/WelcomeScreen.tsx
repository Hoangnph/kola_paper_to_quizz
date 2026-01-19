/**
 * WelcomeScreen Component
 * Shows the initial welcome screen before starting the quiz
 */

import { Button } from '@/components/ui/Button';
import styles from './WelcomeScreen.module.css';

interface WelcomeScreenProps {
    onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
    return (
        <section className={styles.screen}>
            <div className={styles.card}>
                <div className={styles.icon}>🚀</div>
                <h2 className={styles.title}>Chào mừng con!</h2>
                <p className={styles.text}>
                    Cùng ôn tập <strong>15 câu hỏi</strong> về PowerPoint nhé!
                </p>
                <div className={styles.features}>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✨</span>
                        <span>Kiểu gõ Telex</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🎨</span>
                        <span>Định dạng văn bản</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>🎬</span>
                        <span>Hiệu ứng chuyển trang</span>
                    </div>
                </div>
                <Button variant="primary" size="large" icon="🎮" onClick={onStart}>
                    Bắt đầu Quiz!
                </Button>
            </div>
        </section>
    );
}
