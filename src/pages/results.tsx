import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAssessment } from '@/context/AssessmentContext';
import { DIMENSIONS, QUESTIONS, PRICE_TIERS, CATEGORY_LABELS } from '@/config/assessment';
import { RadarChart } from '@/components/charts/RadarChart';
import { generatePDFReport } from '@/utils/pdfGenerator';
import { ReportSlides } from '@/components/report/ReportSlides';

export default function ResultsPage() {
    const router = useRouter();
    const { answers, isPremium, userProfile, setPremium } = useAssessment();
    const [scores, setScores] = useState<{ label: string; value: number; fullMark: number }[]>([]);
    const [price, setPrice] = useState(4900); // Default

    // Determine Status Logic: 'Student'/'JobSeeker' should be Premium by now if flow worked, 
    // but we can double check exemption here just in case.
    const isExempt = userProfile?.category === 'student' || userProfile?.category === 'job_seeker';
    const showFullReport = isPremium || isExempt;

    useEffect(() => {
        // Set dynamic price based on category
        if (userProfile?.category) {
            setPrice(PRICE_TIERS[userProfile.category]);
        }
    }, [userProfile]);

    useEffect(() => {
        // Calculate scores
        const calculatedScores = DIMENSIONS.map(dim => {
            const dimQuestions = QUESTIONS.filter(q => q.dimension === dim.key);
            // If viewing limited report, we might not have all answers, but that's fine (score will be lower/partial)
            // But we display score out of 25 regardless? Or maybe normalize?
            // User story: "free version that covers only 12 questions, 2 from each dimension"
            // Start (0-25) is fine, just will be low if unresolved.
            const sum = dimQuestions.reduce((acc, q) => acc + (answers[q.id] || 0), 0);
            return {
                label: dim.label,
                value: sum,
                fullMark: 25
            };
        });
        setScores(calculatedScores);
    }, [answers]);

    const handleUnlock = async () => {
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: price,
                    description: `Professional Profile (${CATEGORY_LABELS[userProfile?.category || 'senior_mgmt']})`
                })
            });
            const data = await res.json();

            // Handle Mock Success immediately for dev/demo if needed
            if (data.mock) {
                setPremium(true);
                // Redirect to assessment to finish questions? 
                router.push('/assessment');
            } else if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Checkout failed', error);
        }
    };

    return (
        <>
            <Head>
                <title>Your Profile | TRB Alchemy™️</title>
            </Head>
            <main style={{ padding: '4rem 0', minHeight: '100vh', background: '#f7fafc' }}>
                <div id="report-content" className="container" style={{ maxWidth: '900px', background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', position: 'relative' }}>

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', color: 'var(--color-dark-blue)' }}>
                            {showFullReport ? 'Your Alchemy Profile' : 'Preliminary Profile'}
                        </h1>
                        <p style={{ color: 'var(--color-gray-800)' }}>
                            {showFullReport ? 'A visual representation of your professional essence.' : 'A limited snapshot of your potential. Upgrade for full analysis.'}
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3rem' }}>
                        <RadarChart data={scores} size={400} />
                        {!showFullReport && (
                            <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--color-gray-800)' }}>
                                *Scores are based on a partial 12-question assessment.
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', filter: showFullReport ? 'none' : 'blur(4px)', pointerEvents: showFullReport ? 'auto' : 'none', userSelect: showFullReport ? 'auto' : 'none' }}>
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

                    {!showFullReport && (
                        <div style={{ marginTop: '-150px', position: 'relative', zIndex: 10, textAlign: 'center', background: 'rgba(255,255,255,0.9)', padding: '2rem', border: '1px solid var(--color-gold)', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Unlock Your Full Potential</h3>
                            <p style={{ marginBottom: '1.5rem' }}>Get the complete 30-question analysis, detailed breakdown, and PDF Report.</p>
                            <button
                                onClick={handleUnlock}
                                style={{
                                    padding: '1rem 2rem',
                                    background: 'var(--color-gold)',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '4px',
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Upgrade for ${price / 100}
                            </button>
                        </div>
                    )}

                    {showFullReport && (
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
                                Book 30min Strategy Call (Free)
                            </button>
                        </div>
                    )}

                    {/* Hidden Slides for PDF Generation */}
                    {showFullReport && <ReportSlides scores={scores} />}

                </div>
            </main>
        </>
    );
}
