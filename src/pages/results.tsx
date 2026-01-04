import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAssessment } from '@/context/AssessmentContext';
import { DIMENSIONS, QUESTIONS } from '@/config/assessment';
import { RadarChart } from '@/components/charts/RadarChart';
import { generatePDFReport } from '@/utils/pdfGenerator';
import { ReportSlides } from '@/components/report/ReportSlides';

export default function ResultsPage() {
    const router = useRouter();
    const { answers, isComplete } = useAssessment();
    const [scores, setScores] = useState<{ label: string; value: number; fullMark: number }[]>([]);

    useEffect(() => {
        // Calculate scores
        const calculatedScores = DIMENSIONS.map(dim => {
            const dimQuestions = QUESTIONS.filter(q => q.dimension === dim.key);
            const sum = dimQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
            return {
                label: dim.label,
                value: sum, // Should be valid even if incomplete (0 for skipped)
                fullMark: 25 // 5 questions * 5 points
            };
        });
        setScores(calculatedScores);
    }, [answers]);

    return (
        <>
            <Head>
                <title>Your Profile | TRB Alchemy™️</title>
            </Head>
            <main style={{ padding: '4rem 0' }}>
                <div id="report-content" className="container" style={{ maxWidth: '900px', background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark-blue)' }}>
                            Your Alchemy Profile
                        </h1>
                        <p style={{ color: 'var(--color-gray-800)' }}>
                            A visual representation of your professional essence.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                        <RadarChart data={scores} size={400} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        {scores.map((score, i) => (
                            <div key={i} style={{ padding: '1.5rem', background: 'var(--color-gray-100)', borderRadius: '8px' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>{score.label}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ flex: 1, height: '8px', background: 'var(--color-gray-200)', borderRadius: '4px' }}>
                                        <div style={{ width: `${(score.value / 25) * 100}%`, height: '100%', background: 'var(--color-gold)', borderRadius: '4px' }} />
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{score.value}/25</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '4rem', textAlign: 'center' }}>
                        <button
                            onClick={() => generatePDFReport('pdf-report-container')}
                            style={{
                                padding: '1rem 2rem',
                                background: 'var(--color-dark-blue)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                marginRight: '1rem'
                            }}
                        >
                            Download PDF Report
                        </button>

                        <button
                            style={{
                                padding: '1rem 2rem',
                                background: 'var(--color-gold)',
                                color: 'var(--color-black)',
                                border: 'none',
                                borderRadius: '4px',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Book Strategy Session
                        </button>
                    </div>

                    {/* Hidden Slides for PDF Generation */}
                    <ReportSlides scores={scores} />

                </div>
            </main>
        </>
    );
}
