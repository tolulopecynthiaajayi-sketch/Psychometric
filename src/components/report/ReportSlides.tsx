import { DIMENSIONS, generateDynamicRoadmap, getArchetype } from '@/config/assessment';
import { RadarChart } from '@/components/charts/RadarChart';

interface ReportSlidesProps {
    scores: { label: string; value: number; fullMark: number }[];
    candidateName?: string;
    hasBookSessionAccess?: boolean;
}

export function ReportSlides({ scores, candidateName = 'Candidate', hasBookSessionAccess = false }: ReportSlidesProps) {
    // 1. Calculate Archetype & Roadmap
    const archetype = getArchetype(scores);
    const roadmap = generateDynamicRoadmap(scores);

    // Vibrant, Colourful, Gold/Orange Theme
    const slideStyle: React.CSSProperties = {
        width: '1123px', // A4 Landscape
        height: '794px',
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFFFF 100%)', // Warm background
        padding: '40px', // Reduced from 60px to lift content up
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans)',
        color: '#2D3748',
    };

    // Decorative shape for corners
    const cornerShape: React.CSSProperties = {
        position: 'absolute',
        top: '-120px', // Pulled up slightly
        right: '-120px',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 165, 0, 0.1)', // Orange tint
        borderRadius: '50%',
        zIndex: 0
    };

    const headerStyle: React.CSSProperties = {
        fontFamily: 'var(--font-serif)',
        fontSize: '36px',
        color: '#C05621', // Dark Orange / Rust
        marginBottom: '20px', // Reduced from 30px
        borderBottom: '3px solid #F6AD55', // Light Orange
        paddingBottom: '10px', // Reduced from 15px
        position: 'relative',
        zIndex: 1
    };

    return (
        <div id="pdf-report-container" style={{ position: 'absolute', top: -10000, left: -10000 }}>

            {/* SLIDE 1: Title Slide (High Impact, Orange/Gold) */}
            <div className="pdf-slide" style={{
                ...slideStyle,
                background: 'linear-gradient(135deg, #DD6B20 0%, #C05621 100%)', // Deep Orange Gradient
                color: 'white',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{
                    position: 'absolute', top: '50px', left: '50px',
                    width: '150px', height: '150px',
                    border: '10px solid rgba(255,255,255,0.2)', borderRadius: '50%'
                }} />

                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '72px', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>
                    TRB Alchemy™️
                </h1>
                <h2 style={{ fontSize: '32px', fontWeight: '300', opacity: 0.9, letterSpacing: '2px' }}>
                    PROFESSIONAL PROFILING REPORT
                </h2>
                <div style={{ width: '120px', height: '6px', background: '#FBD38D', margin: '40px 0' }} />
                <p style={{ fontSize: '28px', fontWeight: 'bold' }}>Prepared for {candidateName}</p>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '20px', marginTop: '20px' }}>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>Archetype: {archetype.name}</p>
                </div>
                <p style={{ marginTop: 'auto', fontSize: '18px', opacity: 0.8 }}>{new Date().toLocaleDateString()}</p>
            </div>

            {/* SLIDE 2: Executive Summary */}
            <div className="pdf-slide" style={slideStyle}>
                <div style={cornerShape} />
                <h2 style={headerStyle}>Executive Assessment Summary</h2>

                <div style={{ marginBottom: '20px', background: '#FFFAF0', padding: '15px', borderRadius: '10px', borderLeft: '5px solid #DD6B20' }}>
                    <h3 style={{ margin: 0, fontSize: '22px', color: '#C05621' }}>{archetype.name}</h3>
                    <p style={{ margin: '5px 0 0 0', fontStyle: 'italic', color: '#4A5568' }}>"{archetype.motto}"</p>
                    <p style={{ marginTop: '5px', color: '#2D3748' }}>{archetype.description}</p>
                </div>

                <div style={{ display: 'flex', height: '100%', gap: '40px', position: 'relative', zIndex: 1 }}> {/* Reduced gap */}
                    <div style={{ flex: '0 0 450px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Fixed width for chart col */}
                        {/* Radar Chart Container with shadow */}
                        <div style={{ padding: '20px 0', background: 'white', borderRadius: '20px', boxShadow: '0 10px 25px rgba(221, 107, 32, 0.1)', width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <RadarChart data={scores} size={380} /> {/* Reduced size due to overflow */}
                        </div>
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ fontSize: '24px', color: '#2C5282', marginBottom: '15px' }}>Performance Snapshot</h3> {/* Reduced margin */}
                        <ul style={{ fontSize: '16px', lineHeight: 1.6, listStyle: 'none', padding: 0 }}> {/* Smaller font/line-height to fit */}
                            {scores.map((s, i) => (
                                <li key={i} style={{ marginBottom: '15px', padding: '15px', background: '#FFF5F5', borderRadius: '8px', borderLeft: '5px solid #ED8936' }}>
                                    <strong style={{ color: '#2D3748', fontSize: '20px' }}>{s.label}</strong>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '16px', color: '#718096' }}>
                                        <span>Score: {s.value}/25</span>
                                        <span style={{ fontWeight: 'bold', color: s.value >= 21 ? '#38A169' : s.value >= 15 ? '#3182CE' : s.value >= 10 ? '#D69E2E' : '#E53E3E' }}>
                                            {s.value >= 21 ? 'Strong' : s.value >= 15 ? 'Solid' : s.value >= 10 ? 'Developing' : 'Underdeveloped'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* SLIDE 3+: Detailed Analysis (Dynamic AI Logic) */}
            {scores.map((s, i) => {
                const dimConfig = DIMENSIONS.find(d => d.label === s.label);
                if (!dimConfig) return null;

                // --- AI LOGIC: Get dynamic content based on score ---
                const analysis = dimConfig.getAnalysis(s.value);

                return (
                    <div key={i} className="pdf-slide" style={slideStyle}>
                        <div style={{ ...cornerShape, left: '-100px', right: 'auto', background: 'rgba(49, 130, 206, 0.05)' }} /> {/* Blue tint for variety */}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '3px solid #ED8936', paddingBottom: '15px', position: 'relative', zIndex: 1 }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: '#2A4365', margin: 0 }}>{s.label}</h2>
                            <div style={{ padding: '8px 20px', background: '#ED8936', color: 'white', borderRadius: '20px', fontWeight: 'bold', fontSize: '20px' }}>
                                Score: {s.value} ({s.value >= 21 ? 'Strong' : s.value >= 15 ? 'Solid' : s.value >= 10 ? 'Developing' : 'Underdeveloped'})
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '50px', flex: 1, position: 'relative', zIndex: 1 }}>
                            {/* Left: Narrative */}
                            <div style={{ flex: 1.2 }}>
                                <div style={{ marginBottom: '30px' }}>
                                    <h3 style={{ fontSize: '20px', color: '#DD6B20', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>TRB Insight</h3>
                                    <p style={{ fontSize: '17px', lineHeight: 1.7, textAlign: 'justify', color: '#4A5568' }}>
                                        {analysis.narrative}
                                    </p>
                                </div>

                                <div>
                                    <h3 style={{ fontSize: '18px', color: '#C05621', marginBottom: '10px', fontWeight: 'bold' }}>Workplace Implications</h3>
                                    <ul style={{ fontSize: '16px', lineHeight: 1.6, paddingLeft: '20px', color: '#4A5568' }}>
                                        {analysis.implications.map((imp, idx) => (
                                            <li key={idx} style={{ marginBottom: '10px' }}>{imp}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Right: Recommendations Card */}
                            <div style={{ flex: 0.8, background: '#FFFAF0', padding: '30px', borderRadius: '15px', border: '1px solid #FEEBC8', boxShadow: '0 5px 15px rgba(0,0,0,0.03)' }}>
                                <h3 style={{ fontSize: '20px', color: '#C05621', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '10px', fontSize: '24px' }}>💡</span> Recommendations
                                </h3>
                                <ul style={{ fontSize: '16px', lineHeight: 1.6, paddingLeft: '0', listStyle: 'none' }}>
                                    {analysis.recommendations.map((rec, idx) => (
                                        <li key={idx} style={{ marginBottom: '15px', display: 'flex', alignItems: 'flex-start' }}>
                                            <span style={{ color: '#ED8936', marginRight: '10px', fontWeight: 'bold' }}>→</span>
                                            {rec}
                                        </li>
                                    ))}
                                </ul>

                                <div style={{ marginTop: '50px', padding: '20px', background: 'white', borderRadius: '10px' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#A0AEC0', marginBottom: '5px' }}>Dimension Strength</p>
                                    <div style={{ height: '12px', background: '#EDF2F7', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${(s.value / 25) * 100}%`, background: 'linear-gradient(90deg, #ED8936 0%, #C05621 100%)', borderRadius: '6px' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}

            {/* SLIDE: 90-DAY ACTION ROADMAP (Dynamic) */}
            <div className="pdf-slide" style={slideStyle}>
                <div style={cornerShape} />
                <h2 style={headerStyle}>90-Day Strategic Roadmap</h2>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <p style={{ fontSize: '18px', color: '#718096', maxWidth: '70%' }}>
                        A hyper-personalized action plan derived from your unique Archetype: <strong>{archetype.name}</strong>.
                    </p>
                </div>


                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', zIndex: 1, position: 'relative' }}>
                    {roadmap.map((phase, idx) => (
                        <div key={idx} style={{ background: 'white', padding: '25px', borderRadius: '12px', borderLeft: `6px solid ${['#4299E1', '#48BB78', '#ED8936', '#9F7AEA'][idx]}`, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#2D3748', marginBottom: '15px' }}>{phase.title}</h3>
                            <ul style={{ paddingLeft: '20px', color: '#4A5568', lineHeight: 1.6 }}>
                                {phase.points.map((pt, pIdx) => <li key={pIdx} style={{ marginBottom: '5px' }}>{pt}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* SLIDE: Closing */}
            <div className="pdf-slide" style={{ ...slideStyle, background: '#2D3748', color: 'white', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                <div style={{
                    position: 'absolute', bottom: '-100px', left: '-150px',
                    width: '400px', height: '400px',
                    background: '#ED8936', borderRadius: '50%', opacity: 0.1
                }} />

                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '48px', marginBottom: '20px', color: '#FBD38D' }}>Unlock Your Potential</h2>
                <p style={{ fontSize: '22px', maxWidth: '700px', marginBottom: '60px', lineHeight: 1.6 }}>
                    This report consists of TRB Alchemy insights and a strategic roadmap.
                    <br />Execute the plan. Track your progress.
                </p>
                {hasBookSessionAccess && (
                    <div style={{ padding: '25px 50px', background: 'linear-gradient(90deg, #ED8936 0%, #C05621 100%)', color: 'white', fontSize: '24px', fontWeight: 'bold', borderRadius: '50px', boxShadow: '0 10px 20px rgba(237, 137, 54, 0.4)' }}>
                        Book Your Strategy Session
                    </div>
                )}
            </div>

        </div>
    );
}

