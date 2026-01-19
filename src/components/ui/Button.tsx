/**
 * Button Component
 * Reusable button with variants: primary, secondary, success
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'hint';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: 'default' | 'large';
    icon?: ReactNode;
    children: ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'default',
    icon,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const classes = [
        styles.btn,
        styles[`btn-${variant}`],
        size === 'large' ? styles['btn-large'] : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={classes} {...props}>
            {icon ? <span className={styles['btn-icon']}>{icon}</span> : null}
            {children}
        </button>
    );
}
