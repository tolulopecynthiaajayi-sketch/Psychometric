import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAssessment } from '@/context/AssessmentContext';
import { UserCategory, CATEGORY_LABELS } from '@/config/assessment';

export function UserDetailsForm() {
    const router = useRouter();
    const { setUserProfile } = useAssessment();
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Save profile to context
        setUserProfile(formData);
        // Redirect to assessment (or start it)
        router.push('/assessment');
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-dark-blue)', marginBottom: '1.5rem', textAlign: 'center' }}>
                Your Professional Profile
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--color-gray-800)', marginBottom: '2rem' }}>
                Please provide your details to personalize your assessment experience.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

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

                <button type="submit" style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'var(--color-gold)',
                    color: 'var(--color-dark-blue)',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                }}>
                    Begin Assessment
                </button>

            </form>
        </div>
    );
}

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
