import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

export default function Dashboard() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [assessments, setAssessments] = useState<any[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        } else if (user) {
            fetchAssessments();
        }
    }, [user, loading, router]);

    const fetchAssessments = async () => {
        if (!user) return;
        try {
            const q = query(
                collection(db, 'assessments'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
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

    if (loading || (fetchLoading && user)) {
        return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', background: '#F7FAFC', padding: '2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontFamily: 'serif', fontSize: '2rem', color: '#2D3748' }}>Dashboard</h1>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: '#718096' }}>{user.email}</span>
                        <button onClick={logout} style={{ padding: '0.5rem 1rem', background: 'white', border: '1px solid #CBD5E0', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
                        <Link href="/" style={{ padding: '0.5rem 1rem', background: '#DD6B20', color: 'white', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold' }}>New Assessment</Link>
                    </div>
                </header>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: '#4A5568' }}>Your Reports</h2>

                {assessments.length === 0 ? (
                    <div style={{ background: 'white', padding: '3rem', borderRadius: '12px', textAlign: 'center', color: '#718096' }}>
                        <p>You haven't completed any assessments yet.</p>
                        <Link href="/onboarding" style={{ display: 'inline-block', marginTop: '1rem', color: '#DD6B20', fontWeight: 'bold' }}>Start Your First Assessment →</Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {assessments.map((assessment: any) => (
                            <div key={assessment.id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2D3748', marginBottom: '0.5rem' }}>
                                        {assessment.archetype?.name || 'Professional Profile'}
                                    </h3>
                                    <p style={{ color: '#718096', fontSize: '0.9rem' }}>
                                        Completed on {new Date(assessment.createdAt?.seconds * 1000).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    {/* In a real app, this would open the detailed view or regenerate PDF */}
                                    <span style={{ background: '#EBF8FF', color: '#3182CE', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                        {assessment.isPremium ? 'Premium Report' : 'Free Report'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
