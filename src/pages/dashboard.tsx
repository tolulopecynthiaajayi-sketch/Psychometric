import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { isAdmin } from '@/config/admin';
import { ReportSlides } from '@/components/report/ReportSlides';

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [assessments, setAssessments] = useState<any[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);

    // PDF State
    const [pdfData, setPdfData] = useState<{ scores: any[], name: string, isPremium: boolean } | null>(null);
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchAssessments();
        }
    }, [user, loading, router]);

    const fetchAssessments = async () => {
        if (!user || !db) return;
        try {
            const q = query(
                collection(db, 'assessments'),
                where('userId', '==', user.uid)
                // orderBy('createdAt', 'desc') // Checking if Index is missing
            );
            const querySnapshot = await getDocs(q);
            const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setAssessments(results);
        } catch (error) {
            console.error("Error fetching assessments:", error);
        } finally {
            setFetchLoading(false);
        }
    };

    const handleDownloadPDF = async (assessment: any) => {
        if (isGeneratingPdf) return;
        setIsGeneratingPdf(true);

        // 1. Set data to render the hidden report
        setPdfData({
            scores: assessment.scores,
            name: user?.displayName || user?.email?.split('@')[0] || 'Valued User',
            isPremium: assessment.isPremium
        });

        // 2. Wait for render, then print
        setTimeout(async () => {
            try {
                const { generatePDFReport } = await import('@/utils/pdfGenerator');
                await generatePDFReport('user-pdf-container', user?.displayName || 'My_Report');
            } catch (error) {
                console.error("PDF Fail:", error);
                alert("Failed to generate PDF");
            } finally {
                setIsGeneratingPdf(false);
                setPdfData(null); // Clear after generation
            }
        }, 1000); // 1s buffer for React render
    };

    if (loading || (fetchLoading && user)) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-gradient-main)', padding: '2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header className="dashboard-header">
                    <h1 className="text-gradient-warm" style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', margin: 0 }}>Dashboard</h1>
                    <div className="dashboard-actions">
                        <span className="user-email" style={{ color: 'var(--color-dark-blue)', fontWeight: '500' }}>{user.email}</span>
                        {isAdmin(user.email) && (
                            <Link href="/admin" className="btn-admin">
                                Admin Panel
                            </Link>
                        )}
                        <button onClick={logout} className="btn-logout">Logout</button>
                        <Link href="/" className="btn-primary-warm" style={{ textDecoration: 'none', display: 'inline-block' }}>New Assessment</Link>
                    </div>
                </header>

                <style jsx>{`
                    .dashboard-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 3rem;
                    }
                    .dashboard-actions {
                        display: flex;
                        gap: 1rem;
                        align-items: center;
                    }
                    .btn-admin {
                        padding: 0.6rem 1.2rem;
                        background: var(--color-dark-blue);
                        color: white;
                        border-radius: 50px;
                        text-decoration: none;
                        font-weight: bold;
                        transition: transform 0.2s;
                    }
                    .btn-admin:hover {
                        transform: translateY(-2px);
                    }
                    .btn-logout {
                        padding: 0.6rem 1.2rem;
                        background: rgba(255,255,255,0.5);
                        border: 1px solid var(--color-burnt-orange);
                        color: var(--color-burnt-orange);
                        border-radius: 50px;
                        cursor: pointer;
                        font-weight: bold;
                        transition: all 0.2s;
                    }
                    .btn-logout:hover {
                        background: white;
                        color: var(--color-warm-orange);
                    }

                    @media (max-width: 768px) {
                        .dashboard-header {
                            flex-direction: column;
                            align-items: flex-start;
                            padding-top: 2rem;
                            gap: 1.5rem;
                        }
                        .dashboard-actions {
                            flex-wrap: wrap;
                            width: 100%;
                            justify-content: space-between;
                        }
                        .user-email {
                            width: 100%;
                            margin-bottom: 0.5rem;
                            font-size: 0.9rem;
                        }
                        .btn-admin, .btn-logout, .btn-primary-warm {
                            font-size: 0.9rem;
                            padding: 0.5rem 1rem;
                        }
                    }
                `}</style>

                <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.8rem', color: 'var(--color-dark-blue)', fontFamily: 'var(--font-serif)', marginRight: '1rem' }}>Your Reports</h2>
                    <div style={{ height: '2px', flexGrow: 1, background: 'linear-gradient(90deg, var(--color-gold-light), transparent)' }}></div>
                </div>

                {assessments.length === 0 ? (
                    <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-gray-800)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>You haven't completed any assessments yet.</p>
                        <Link href="/onboarding" style={{ color: 'var(--color-burnt-orange)', fontWeight: 'bold', fontSize: '1.1rem', textDecoration: 'none', borderBottom: '2px solid var(--color-warm-orange)' }}>
                            Start Your First Assessment →
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {assessments.map((assessment: any) => (
                            <div key={assessment.id} className="glass-card fade-in-up" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--color-burnt-orange)', marginBottom: '0.5rem', fontFamily: 'var(--font-serif)' }}>
                                        {assessment.archetype?.name || 'Professional Profile'}
                                    </h3>
                                    <p style={{ color: 'var(--color-gray-800)', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span>📅</span> Completed on {new Date(assessment.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                    {/* Status Badge */}
                                    {assessment.isPremium ? (
                                        <span style={{
                                            background: 'linear-gradient(135deg, #FFD700 0%, #F6AD55 100%)',
                                            color: 'white',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold',
                                            boxShadow: '0 2px 5px rgba(212, 175, 55, 0.3)'
                                        }}>
                                            Premium Report
                                        </span>
                                    ) : (
                                        <span style={{
                                            background: 'rgba(255,255,255,0.6)',
                                            color: 'var(--color-gray-800)',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '20px',
                                            fontSize: '0.9rem',
                                            border: '1px solid var(--color-gray-200)'
                                        }}>
                                            Basic Report
                                        </span>
                                    )}

                                    {assessment.isPremium && (
                                        <button
                                            onClick={() => handleDownloadPDF(assessment)}
                                            disabled={isGeneratingPdf}
                                            className="btn-primary-warm"
                                            style={{
                                                padding: '0.6rem 1.2rem',
                                                borderRadius: '50px',
                                                fontSize: '0.95rem',
                                                opacity: isGeneratingPdf ? 0.7 : 1,
                                                cursor: isGeneratingPdf ? 'wait' : 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                boxShadow: 'none' // Override specific shadow if needed
                                            }}
                                        >
                                            {isGeneratingPdf ? '⏳ Generating...' : '📥 Download PDF'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Hidden PDF Container */}
            {pdfData && (
                <div id="user-pdf-container">
                    <ReportSlides
                        scores={pdfData.scores}
                        candidateName={pdfData.name}
                        hasBookSessionAccess={true}
                    />
                </div>
            )}
        </div>
    );
}
