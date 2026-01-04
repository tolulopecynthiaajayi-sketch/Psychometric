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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', alignItems: 'center' }}>
                {[1, 2, 3, 4, 5].map((value, index) => (
                    <button
                        key={value}
                        onClick={() => onAnswer(value)}
                        style={{
                            padding: '1rem',
                            border: `2px solid ${currentAnswer === value ? 'var(--color-gold)' : 'var(--color-gray-200)'}`,
                            background: currentAnswer === value ? 'var(--color-gold-light)' : 'transparent',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100px'
                        }}
                    >
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{value}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gray-800)' }}>{SCALE_LABELS[index]}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
