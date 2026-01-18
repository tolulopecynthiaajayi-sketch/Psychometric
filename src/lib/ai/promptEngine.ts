import { UserProfile, Archetype } from '@/config/assessment';

interface ScoreData {
    label: string;
    value: number;
    band: 'strong' | 'solid' | 'developing' | 'underdeveloped';
}

export class PromptEngine {
    static build(user: UserProfile, scores: ScoreData[], archetype: Archetype): string {
        const topStrengths = scores
            .filter(s => s.band === 'strong' || s.band === 'solid')
            .map(s => s.label)
            .join(', ');

        const developmentAreas = scores
            .filter(s => s.band === 'developing' || s.band === 'underdeveloped')
            .map(s => s.label)
            .join(', ');

        return `
You are "The Alchemist", an elite executive coach and psychometric analyst.
You are writing a high-stakes, deeply personal professional development report for:

**Name**: ${user.name}
**Role**: ${user.title} (${user.category})
**Organization**: ${user.organization}
**Core Purpose/Goal**: "${user.purpose}"

---

### PSYCHOMETRIC PROFILE
**Archetype**: ${archetype.name} ("${archetype.motto}")
**Top Strengths**: ${topStrengths}
**Development Areas**: ${developmentAreas}

### DATA POINTS (0-25 Scale)
${scores.map(s => `- ${s.label}: ${s.value}/25 (${s.band})`).join('\n')}

---

### INSTRUCTIONS
Write a "Executive Summary" and "Strategic Roadmap" for this specific person.
1.  **Tone**: 
    - If Senior Mgmt/Entrepreneur: Direct, strategic, no fluff. Focus on ROI and leverage.
    - If Student/Junior: Encouraging, tactical, focus on building foundations.
    - *Current Context*: They are a ${user.category}. Adjust your language accordingly.
2.  **Narrative**:
    - Do NOT just list scores. explain the *interplay*.
    - Example: "Your high ${scores[0]?.label} combined with lower ${scores[scores.length - 1]?.label} suggests..."
3.  **Actionable**:
    - Give 3 specific, "Monday Morning" actions they can take to achieve their goal: "${user.purpose}".

### FORMAT (JSON)
Return ONLY valid JSON with this structure:
{
  "executive_summary": "2-3 powerful paragraphs...",
  "superpower_analysis": "Deep dive into their greatest strength...",
  "blindspot_warning": "Honest look at their biggest risk...",
  "immediate_actions": ["Action 1", "Action 2", "Action 3"]
}
`;
    }
}
