import { UserProfile, Archetype, QUESTIONS, Question } from '@/config/assessment';

interface ScoreData {
    label: string;
    value: number;
    band: 'strong' | 'solid' | 'developing' | 'underdeveloped';
}

export class PromptEngine {
    static build(user: UserProfile, scores: ScoreData[], archetype: Archetype, answers?: Record<string, number>): string {
        const topStrengths = scores
            .filter(s => s.band === 'strong' || s.band === 'solid')
            .map(s => s.label)
            .join(', ');

        const developmentAreas = scores
            .filter(s => s.band === 'developing' || s.band === 'underdeveloped')
            .map(s => s.label)
            .join(', ');

        // --- INTELLIGENCE UPGRADE: BEHAVIORAL MAPPING ---
        let behavioralContext = "";
        if (answers) {
            const definingMoments: string[] = [];

            // Find extreme answers (1 or 5)
            Object.entries(answers).forEach(([qId, score]) => {
                if (score === 5 || score === 1) {
                    const question = QUESTIONS.find(q => q.id === qId);
                    if (question) {
                        const type = score === 5 ? "Strongly Identifies with" : "Strongly Rejects";
                        definingMoments.push(`- User ${type}: "${question.text}"`);
                    }
                }
            });

            // Limit to top 5 signals to avoid token overload
            behavioralContext = definingMoments.slice(0, 10).join('\n');
        }

        return `
You are "The Alchemist", a world-class Industrial Psychologist and Executive Coach with 20+ years of experience advising Fortune 500 leaders. 
Your style is: **Ruthlessly Insightful, Direct, and Strategic.** You do not give generic advice. You find the hidden patterns in the data.

You are writing a confidential, high-stakes development profile for:
**Name**: ${user.name}
**Role**: ${user.title} (${user.category})
**Organization**: ${user.organization}
**Core Goal**: "${user.purpose}"

---

### 1. PSYCHOMETRIC DATA
**Archetype**: ${archetype.name} ("${archetype.motto}")
**Top Strengths**: ${topStrengths}
**Development Areas**: ${developmentAreas}

### 2. QUANTITATIVE SCORES (0-25)
${scores.map(s => `- ${s.label}: ${s.value}/25 (${s.band})`).join('\n')}

### 3. BEHAVIORAL SIGNATURES (The "Why" behind the scores)
The user explicitly confirmed the following behaviors. USE THESE to ground your analysis in reality:
${behavioralContext || "No specific behavioral data available."}

---

### INSTRUCTIONS
Write a "Executive Summary" and "Strategic Roadmap".

**CRITICAL RULES:**
1.  **Stop being generic.** Do not say "You are a good leader." Say "You lead through consensus, which slows you down in crises." 
2.  **Reference the Behaviors.** If they scored low on 'Influence' and rejected "I speak up in meetings", explicitly mention that specific fear.
3.  **Tone Calibration**:
    - Current User is: **${user.category}**
    - IF Entrepreneur/Senior: Be peer-to-peer. Focus on leverage, capital, and team dynamics.
    - IF Junior/Student: Be mentorship-focused. Focus on habits and skill acquisition.
4.  **The "Monday Morning" Test**: Every recommendation must be actionable *immediately*. No "improve communication". Give specific tactics (e.g. "Use the Pyramid Principle in emails").

### OUTPUT FORMAT (JSON ONLY)
Return raw JSON. No markdown.
{
  "executive_summary": "3-4 sentences. The 'Hook'. Who are they at their core? What is their fatal flaw?",
  "superpower_analysis": "Deep analysis of their highest trait. How does it help them? How does it hurt them (the shadow side)?",
  "blindspot_warning": "The most dangerous risk in their profile. Be direct.",
  "immediate_actions": [
    "Action 1 (Tactic)",
    "Action 2 (Tactic)",
    "Action 3 (Tactic)"
  ]
}
`;
    }
}
