import React from 'react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
}

export function PricingModal({ isOpen, onClose, onUpgrade }: PricingModalProps) {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '90%',
                textAlign: 'center'
            }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>
                    Unlock Full Profile
                </h2>
                <p style={{ color: 'var(--color-gray-800)', marginBottom: '2rem' }}>
                    You have reached the end of the free preview. Upgrade now to complete the full 30-question assessment and receive your detailed PDF analysis.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button
                        onClick={onUpgrade}
                        style={{
                            padding: '1rem',
                            background: 'var(--color-gold)',
                            color: 'var(--color-black)',
                            border: 'none',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                        }}
                    >
                        Upgrade for $49
                    </button>

                    <button
                        onClick={onClose}
                        style={{
                            padding: '1rem',
                            background: 'transparent',
                            color: 'var(--color-gray-800)',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Review my answers so far
                    </button>
                </div>
            </div>
        </div>
    );
}
