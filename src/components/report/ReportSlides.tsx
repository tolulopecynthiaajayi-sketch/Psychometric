import React from 'react';
import { RadarChart } from '@/components/charts/RadarChart';
import { DIMENSIONS } from '@/config/assessment';

interface ReportSlidesProps {
    scores: { label: string; value: number; fullMark: number }[];
    candidateName?: string;
}

export function ReportSlides({ scores, candidateName = 'Candidate' }: ReportSlidesProps) {
    const slideStyle: React.CSSProperties = {
        width: '1123px', // A4 Landscape pixel width (approx)
        height: '794px', // A4 Landscape pixel height
        background: 'white',
        padding: '60px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        // Global typography for PDF
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-black)'
    };

    const headerStyle: React.CSSProperties = {
        fontFamily: 'var(--font-serif)',
        fontSize: '36px',
        color: 'var(--color-dark-blue)',
        marginBottom: '40px',
        borderBottom: '2px solid var(--color-gold)',
        paddingBottom: '20px'
    };

    return (
        <div id="pdf-report-container" style={{ position: 'absolute', top: -10000, left: -10000 }}>
            {/* SLIDE 1: Title Slide */}
            <div className="pdf-slide" style={{ ...slideStyle, justifyContent: 'center', alignItems: 'center', background: 'var(--color-dark-blue)', color: 'white' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '64px', marginBottom: '20px' }}>TRB Alchemy™️</h1>
                <h2 style={{ fontSize: '32px', fontWeight: 'normal', opacity: 0.9 }}>Professional Profiling Report</h2>
                <div style={{ width: '100px', height: '4px', background: 'var(--color-gold)', margin: '40px 0' }} />
                <p style={{ fontSize: '24px' }}>Prepared for {candidateName}</p>
                <p style={{ marginTop: 'auto', fontSize: '16px', opacity: 0.7 }}>{new Date().toLocaleDateString()}</p>
            </div>

            {/* SLIDE 2: Executive Summary (Radar Chart) */}
            <div className="pdf-slide" style={slideStyle}>
                <h2 style={headerStyle}>Executive Summary</h2>
                <div style={{ display: 'flex', height: '100%', gap: '40px' }}>
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <RadarChart data={scores} size={500} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Key Insights</h3>
                        <ul style={{ fontSize: '18px', lineHeight: 1.6 }}>
                            {scores.map((s, i) => (
                                <li key={i} style={{ marginBottom: '10px' }}>
                                    <strong>{s.label}:</strong> {s.value >= 20 ? 'Strong Area' : s.value >= 15 ? 'Solid Competence' : 'Development Area'}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* SLIDE 3+ : Detailed Dimension Breakdown (One Slide Per Dimension) */}
            {scores.map((s, i) => {
                // Find full config to get narrative/implications
                const dimConfig = DIMENSIONS.find(d => d.label === s.label);
                if (!dimConfig) return null;

                return (
                    <div key={i} className="pdf-slide" style={slideStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid var(--color-gold)', paddingBottom: '15px' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--color-dark-blue)', margin: 0 }}>{s.label}</h2>
                            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Score: {s.value} / 25</div>
                        </div>

                        <div style={{ display: 'flex', gap: '40px', flex: 1 }}>
                            {/* Left Column: Narrative & Implication */}
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '20px', color: 'var(--color-dark-blue)', marginBottom: '10px' }}>What this means</h3>
                                <p style={{ fontSize: '16px', lineHeight: 1.6, marginBottom: '30px', textAlign: 'justify' }}>
                                    {dimConfig.narrative}
                                </p>

                                <h3 style={{ fontSize: '20px', color: 'var(--color-dark-blue)', marginBottom: '10px' }}>Work Implications</h3>
                                <ul style={{ fontSize: '16px', lineHeight: 1.6, paddingLeft: '20px' }}>
                                    {dimConfig.workImplications.map((imp, idx) => (
                                        <li key={idx} style={{ marginBottom: '8px' }}>{imp}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Column: Recommendations & Visual */}
                            <div style={{ flex: 1, background: 'var(--color-gray-100)', padding: '30px', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '20px', color: 'var(--color-dark-blue)', marginBottom: '15px' }}>Recommendations</h3>
                                <ul style={{ fontSize: '16px', lineHeight: 1.6, paddingLeft: '20px' }}>
                                    {dimConfig.recommendations.map((rec, idx) => (
                                        <li key={idx} style={{ marginBottom: '12px' }}>{rec}</li>
                                    ))}
                                </ul>

                                <div style={{ marginTop: '40px' }}>
                                    <p style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>Score Visualization</p>
                                    <div style={{ height: '20px', background: 'white', borderRadius: '10px', border: '1px solid #ddd' }}>
                                        <div style={{ height: '100%', width: `${(s.value / 25) * 100}%`, background: 'var(--color-gold)', borderRadius: '10px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* SLIDE 4: Closing / CTA */}
            <div className="pdf-slide" style={{ ...slideStyle, justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <h2 style={{ ...headerStyle, borderBottom: 'none' }}>Ready to Accelerate Your Growth?</h2>
                <p style={{ fontSize: '24px', maxWidth: '800px', marginBottom: '60px' }}>
                    Use these insights to leverage your strengths and address your development areas. Our executive coaching team handles the rest.
                </p>
                <div style={{ padding: '20px 40px', background: 'var(--color-gold)', color: 'black', fontSize: '24px', fontWeight: 'bold', borderRadius: '8px' }}>
                    Book Your Strategy Session
                </div>
                <p style={{ marginTop: '40px', color: 'var(--color-dark-blue)' }}>www.trbalchemy.com</p>
            </div>

        </div>
    );
}
