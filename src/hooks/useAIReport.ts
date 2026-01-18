import { useState, useCallback } from 'react';
import { UserProfile, Archetype, getBand } from '@/config/assessment';

interface AIReportData {
    executive_summary: string;
    superpower_analysis: string;
    blindspot_warning: string;
    immediate_actions: string[];
}

export function useAIReport() {
    const [report, setReport] = useState<AIReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateReport = useCallback(async (userProfile: UserProfile, scores: { label: string; value: number }[], archetype: Archetype) => {
        setLoading(true);
        setError(null);

        try {
            // Check LocalStorage Cache first (save cost/time)
            const cacheKey = `trb_ai_report_${userProfile.email}`;
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                console.log("Using Cached AI Report");
                setReport(JSON.parse(cached));
                setLoading(false);
                return;
            }

            // Prepare Data with Bands
            const enrichedScores = scores.map(s => ({
                ...s,
                band: getBand(s.value)
            }));

            const response = await fetch('/api/generate-report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userProfile,
                    scores: enrichedScores,
                    archetype
                })
            });

            if (!response.ok) throw new Error("Failed to generate report");

            const data = await response.json();
            setReport(data);

            // Save to Cache
            localStorage.setItem(cacheKey, JSON.stringify(data));

        } catch (err: any) {
            console.error("AI Report Error:", err);
            setError(err.message || "Failed to generate report");
        } finally {
            setLoading(false);
        }
    }, []);

    return { report, loading, error, generateReport };
}
