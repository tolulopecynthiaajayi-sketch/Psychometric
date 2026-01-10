import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAssessment } from '@/context/AssessmentContext';
import { UserCategory, CATEGORY_LABELS, PRICE_TIERS } from '@/config/assessment';

export function UserDetailsForm() {
    const router = useRouter();
    const { setUserProfile, setPremium } = useAssessment();
    const [step, setStep] = useState<'form' | 'pricing'>('form');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        occupation: '',
        title: '',
        organization: '',
        email: '',
        purpose: '',
        category: 'student' as UserCategory // Default
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('pricing');
    };

    // Pricing Logic
    const price = PRICE_TIERS[formData.category] ?? 4900;
    const isFree = price === 0;

    const handleProceed = async () => {
        // 1. Save Profile
        setUserProfile(formData);

        if (isFree) {
            // Student/Job Seeker -> "Zero Checkout"
            setPremium(true); // Grant full access immediately
            router.push('/assessment');
        } else {
            // Paid Tier -> Go to Stripe
            try {
                const res = await fetch('/api/checkout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: price,
                        description: `Professional Profile (${CATEGORY_LABELS[formData.category]})`
                    })
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || 'Payment initialization failed');
                }

                if (data.url) {
                    window.location.href = data.url;
                }
            } catch (error: any) {
                console.error('Checkout failed', error);
                alert(`System Error: ${error.message}`);
            }
        }
    };

    const handleDecline = () => {
        // User explicitly chose "Free Limited Version"
        setUserProfile(formData);
        setPremium(false); // Explicitly NOT premium
        router.push('/assessment');
    };

    // --- RENDER PRICING STEP ---
    if (step === 'pricing') {
        return (
            <div style={cardStyle}>
                <h2 style={headerStyle}>Confirm Your Strategy</h2>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <p style={{ fontSize: '1.2rem', color: '#4A5568' }}>
                        Your assessment access plan:
                    </p>

                    <div style={{ margin: '2rem 0', padding: '2rem', background: '#FFFFF0', border: '2px solid var(--color-gold)', borderRadius: '12px' }}>
                        <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: '#2D3748' }}>
                            {isFree ? 'FREE' : `$${price / 100}`}
                        </span>
                        {isFree && <p style={{ color: '#744210', marginTop: '0.5rem' }}>Sponsored Access for Students & Job Seekers</p>}
                        {!isFree && <p style={{ color: '#744210', marginTop: '0.5rem' }}>Full Professional Assessment</p>}
                    </div>

                    {/* Comparison / Disclaimer */}
                    {!isFree && (
                        <div style={{ textAlign: 'left', marginBottom: '2rem', background: '#F7FAFC', padding: '1.5rem', borderRadius: '8px', fontSize: '0.95rem' }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#2D3748' }}>What's included in the Premium Report:</p>
                            <ul style={{ paddingLeft: '1.2rem', marginBottom: '1.5rem', color: '#4A5568' }}>
                                <li>✅ Complete 6-Dimension Psychometric Analysis</li>
                                <li>✅ Your Unique Professional Archetype</li>
                                <li>✅ 90-Day Strategic Career Roadmap</li>
                                <li>✅ Deep-Dive Leadership Recommendations</li>
                                {(price >= 4900) && (
                                    <li>✅ <strong>Bonus:</strong> 30min Strategy Session</li>
                                )}
                            </ul>

                            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#E53E3E' }}>limited Free Version Warning:</p>
                            <p style={{ color: '#718096', lineHeight: 1.5 }}>
                                The free version provides <strong>raw scores only</strong>.
                                It does NOT include the TRB Alchemy analysis, archetype profile, roadmap, or strategy session.
                                This is not a promo; it is a restricted preview logic.
                            </p>
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button onClick={handleProceed} style={primaryBtnStyle}>
                            {isFree ? 'Begin Assessment (Free)' : `Proceed to Payment ($${price / 100})`}
                        </button>

                        {!isFree && (
                            <button onClick={handleDecline} style={{ background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', color: '#718096', padding: '0.5rem' }}>
                                I understand, take me to the limited free version
                            </button>
                        )}

                        <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', fontSize: '0.9rem', color: '#CBD5E0', cursor: 'pointer', marginTop: '1rem' }}>
                            ← Back to details
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- RENDER FORM STEP ---
    return (
        <div style={cardStyle}>
            <h2 style={headerStyle}>Your Professional Profile</h2>
            <p style={{ textAlign: 'center', color: 'var(--color-gray-800)', marginBottom: '2rem' }}>
                Please provide your details to personalize your assessment experience.
            </p>

            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                {/* 1. Name */}
                <div className="form-group">
                    <label style={labelStyle}>Full Name</label>
                    <input required name="name" type="text" value={formData.name} onChange={handleChange} style={inputStyle} placeholder="e.g. Busayo Odeku" />
                </div>

                {/* 2. Occupation */}
                <div className="form-group">
                    <label style={labelStyle}>Occupation</label>
                    <input required name="occupation" type="text" value={formData.occupation} onChange={handleChange} style={inputStyle} placeholder="e.g. Marketing Manager" />
                </div>

                {/* 3. Title */}
                <div className="form-group">
                    <label style={labelStyle}>Job Title</label>
                    <input required name="title" type="text" value={formData.title} onChange={handleChange} style={inputStyle} placeholder="e.g. Head of Growth" />
                </div>

                {/* 4. Organization */}
                <div className="form-group">
                    <label style={labelStyle}>Organization / School</label>
                    <input required name="organization" type="text" value={formData.organization} onChange={handleChange} style={inputStyle} placeholder="Where do you work or study?" />
                </div>

                {/* 5. Email */}
                <div className="form-group">
                    <label style={labelStyle}>Email Address</label>
                    <input required name="email" type="email" value={formData.email} onChange={handleChange} style={inputStyle} placeholder="you@example.com" />
                </div>

                {/* 6. Purpose */}
                <div className="form-group">
                    <label style={labelStyle}>Purpose of Assessment</label>
                    <textarea required name="purpose" value={formData.purpose} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px' }} placeholder="What do you hope to gain?" />
                </div>

                {/* 7. Category (Crucial for Pricing) */}
                <div className="form-group">
                    <label style={labelStyle}>Which category describes you best?</label>
                    <select required name="category" value={formData.category} onChange={handleChange} style={inputStyle}>
                        {(Object.keys(CATEGORY_LABELS) as UserCategory[]).map(cat => (
                            <option key={cat} value={cat}>
                                {CATEGORY_LABELS[cat]}
                            </option>
                        ))}
                    </select>
                    <p style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.5rem' }}>
                        *Select the option that best matches your current career stage.
                    </p>
                </div>

                <button type="submit" style={primaryBtnStyle}>
                    Continue
                </button>

            </form>
        </div>
    );
}

const cardStyle = {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
};

const headerStyle = {
    fontFamily: 'var(--font-serif)',
    color: 'var(--color-dark-blue)',
    marginBottom: '1.5rem',
    textAlign: 'center' as const
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: 'var(--color-dark-blue)',
    fontSize: '0.95rem'
};

const inputStyle = {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid var(--color-gray-200)',
    borderRadius: '6px',
    fontSize: '1rem',
    fontFamily: 'inherit'
};

const primaryBtnStyle = {
    width: '100%',
    padding: '1rem',
    background: 'var(--color-gold)',
    color: 'var(--color-dark-blue)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s'
};
