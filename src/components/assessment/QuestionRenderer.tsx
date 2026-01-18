import React from 'react';
import { Question } from '@/config/assessment';

interface QuestionRendererProps {
    question: Question;
    currentAnswer?: number;
    onAnswer: (value: number) => void;
}

const SCALE_LABELS = [
    'Strongly Disagree',
    'Disagree',
    'Neutral',
    'Agree',
    'Strongly Agree',
];

export function QuestionRenderer({ question, currentAnswer, onAnswer }: QuestionRendererProps) {
    return (
        <div style={{ padding: '2rem', background: 'var(--color-white)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', fontFamily: 'var(--font-serif)' }}>
                {question.text}
            </h3>

            <div className="question-grid">
                {[1, 2, 3, 4, 5].map((value, index) => (
                    <button
                        key={value}
                        onClick={() => onAnswer(value)}
                        className={`scale-btn ${currentAnswer === value ? 'active' : ''}`}
                    >
                        <span className="scale-value">{value}</span>
                        <span className="scale-label">{SCALE_LABELS[index]}</span>
                    </button>
                ))}
            </div>

            <style jsx>{`
                .scale-btn {
                    padding: 1rem;
                    border: 2px solid var(--color-gray-200);
                    background: transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100px;
                    width: 100%;
                    position: relative;
                    z-index: 20;
                }
                .scale-btn.active {
                    border-color: var(--color-gold);
                    background: var(--color-gold-light);
                }
                .scale-value {
                    fontSize: 1.5rem;
                    fontWeight: bold;
                    marginBottom: 0.5rem;
                }
                .scale-label {
                    fontSize: 0.8rem;
                    color: var(--color-gray-800);
                }

                @media (max-width: 768px) {
                    .scale-btn {
                        height: 60px; /* Reduced height */
                        padding: 0.5rem;
                        flex-direction: row; /* Stack horizontally to save vertical space? Or keep vertical but smaller? */
                        justify-content: space-between; /* If horizontal */
                        align-items: center;
                        gap: 1rem;
                    }
                    /* Let's keep flex-direction column but tighter, OR actually row is better for small height */
                     .scale-btn {
                        flex-direction: row;
                        justify-content: flex-start;
                        gap: 1rem;
                        padding: 0 1.5rem;
                    }
                    .scale-value {
                        margin-bottom: 0;
                        font-size: 1.2rem;
                    }
                    .scale-label {
                        font-size: 0.9rem;
                    }
                }
            `}</style>
        </div>
    );
}
