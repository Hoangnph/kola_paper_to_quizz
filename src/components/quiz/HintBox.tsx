/**
 * HintBox Component
 * Shows hint text and optional image
 */

import Image from 'next/image';
import styles from './HintBox.module.css';

interface HintBoxProps {
    hintText: string;
    imageUrl?: string;
    isVisible: boolean;
}

export function HintBox({ hintText, imageUrl, isVisible }: HintBoxProps) {
    if (!isVisible) return null;

    return (
        <div className={styles.box}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <span className={styles.icon}>💡</span>
                    <span className={styles.label}>Gợi ý</span>
                </div>
                <p className={styles.text}>{hintText}</p>
                {imageUrl ? (
                    <div className={styles.imageContainer}>
                        <Image
                            src={imageUrl}
                            alt="Minh họa gợi ý"
                            width={400}
                            height={300}
                            className={styles.image}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
