export type DimensionKey = 'cognitive' | 'motivation' | 'influence' | 'leadership' | 'strengths' | 'development';

export interface Question {
    id: string;
    text: string;
    dimension: DimensionKey;
    isFreeTier?: boolean;
}

export interface AnalysisContent {
    narrative: string;
    implications: string[];
    recommendations: string[];
}

// --- User Profile & Work-Context Logic ---

export type UserCategory =
    | 'student'
    | 'job_seeker'
    | 'junior_mgmt'
    | 'middle_mgmt'
    | 'senior_mgmt'
    | 'entrepreneur';

export const PRICE_TIERS: Record<UserCategory, number> = {
    'student': 0,
    'job_seeker': 0,
    'junior_mgmt': 1500,  // $15.00
    'middle_mgmt': 2500,  // $25.00
    'senior_mgmt': 4900,  // $49.00
    'entrepreneur': 2500, // $25.00
};

export const CATEGORY_LABELS: Record<UserCategory, string> = {
    'student': 'Student',
    'job_seeker': 'Job Seeker',
    'junior_mgmt': 'Junior Management (3-5 years)',
    'middle_mgmt': 'Middle Management (6-9 years)',
    'senior_mgmt': 'Senior Management (10+ years)',
    'entrepreneur': 'Entrepreneur'
};

export interface UserProfile {
    name: string;
    occupation: string;
    title: string;
    organization: string;
    email: string;
    purpose: string;
    category: UserCategory;
}

export interface DimensionConfig {
    key: DimensionKey;
    label: string;
    description: string;
    // Dynamic Content Generators
    getAnalysis: (score: number) => AnalysisContent;
}

// --- AI ENGINE & ARCHETYPES ---

export interface Archetype {
    name: string;
    description: string;
    motto: string;
}

const getBand = (score: number): 'strong' | 'solid' | 'developing' | 'underdeveloped' => {
    if (score >= 21) return 'strong';       // 21-25
    if (score >= 15) return 'solid';        // 15-20
    if (score >= 10) return 'developing';   // 10-14
    return 'underdeveloped';                // 5-9
};

// Calculate Archetype based on top 2 dimensions
export const getArchetype = (scores: { label: string; value: number }[]): Archetype => {
    // Sort scores descending
    const sorted = [...scores].sort((a, b) => b.value - a.value);

    // Safety check for empty or insufficient scores (e.g. initial load)
    if (sorted.length < 2) {
        return { name: 'The Balanced Professional', description: 'You possess a well-rounded skillset ready for specialization.', motto: 'Balance is key.' };
    }

    const top1 = sorted[0].label;
    const top2 = sorted[1].label;

    if (top1.includes('Cognitive') && top2.includes('Leadership')) return { name: 'The Strategic Architect', description: 'You lead with intellect and vision.', motto: 'Design the future.' };
    if (top1.includes('Influence') && top2.includes('Leadership')) return { name: 'The Diplomatic Commander', description: 'You move mountains through people.', motto: 'Influence is power.' };
    if (top1.includes('Motivation') && top2.includes('Strengths')) return { name: 'The Relentless Operator', description: 'You are an unstoppable force of execution.', motto: 'Results matter most.' };
    if (top1.includes('Cognitive') && top2.includes('Motivation')) return { name: 'The Visionary Driver', description: 'You see the path and run towards it.', motto: 'Speed and clarity.' };

    // Default fallback
    return { name: 'The Balanced Professional', description: 'You possess a well-rounded skillset ready for specialization.', motto: 'Balance is key.' };
};

// Generate Dynamic 90-Day Roadmap
export const generateDynamicRoadmap = (scores: { label: string; value: number }[]) => {
    // Find development areas (lowest scores)
    const sorted = [...scores].sort((a, b) => a.value - b.value);
    const lowest = sorted[0];
    const secondLowest = sorted[1];

    // Logic for Month 1 (Deepest Gap)
    const getMonth1Focus = (label: string) => {
        if (label.includes('Cognitive')) return { title: 'Month 1: Strategic Rewiring', points: ['Stop "doing" and start "designing"—devote 4 hours/week to pure strategy.', 'Audit your decision-making process: Are you reactive or predictive?', 'Read one key text on Systems Thinking.'] };
        if (label.includes('Influence')) return { title: 'Month 1: Radical Visibility', points: ['Speak first in every high-stakes meeting this month.', 'Map your stakeholders: Identify the 3 people who control your career.', 'Schedule "coffee chats" with zero agenda other than connection.'] };
        return { title: 'Month 1: Foundation Building', points: ['Conduct a personal time audit: Where is your energy leaking?', 'Establish a non-negotiable morning routine.', 'Delegating your lowest-value task immediately.'] };
    };

    return [
        getMonth1Focus(lowest.label),
        { title: 'Month 2: Momentum & Leverage', points: [`Apply your "${sorted[sorted.length - 1].label}" strength to solve a team crisis.`, `Address your secondary gap in ${secondLowest.label} through mentorship.`, 'Launch a pilot project where you are the sole owner.'] },
        { title: 'Month 3: Authority & Scale', points: ['Present your 90-day wins to senior leadership.', 'Mentor a junior colleague to solidify your own learning.', 'Write your "Personal Leadership Manifesto".'] },
        { title: 'Daily Habits for Success', points: ['The "Sunday Review": Plan your strategic blocks.', 'The "No" List: Define what you will decline this week.', 'Journaling: "What did I lead today?"'] }
    ];
};

export const DIMENSIONS: DimensionConfig[] = [
    {
        key: 'cognitive',
        label: 'Cognitive and Intellectual Orientation',
        description: 'Processes complexity and approaches problem-solving.',
        getAnalysis: (score) => {
            const band = getBand(score);
            if (band === 'strong' || band === 'solid') return {
                narrative: 'You possess a lethal intellectual edge. You don’t just solve problems; you deconstruct them. In a room full of noise, you provide the signal. However, the danger for you is "Intellectual Isolation"—being so far ahead that you leave your team behind. Your challenge is not to think smarter, but to translate your brilliance into language that mobilises others.',
                implications: [
                    'You see the "chess moves" while others are playing checkers.',
                    'Risk: You may be perceived as arrogant or disconnected if you don\'t bridge the gap.'
                ],
                recommendations: [
                    'Simplify your output: Can you explain your strategy to a 10-year-old?',
                    'Stop solving problems for people—teach them your mental models instead.'
                ]
            };
            return {
                narrative: 'You are currently operating as a Tactician, not a Strategist. You are excellent at executing the "What" and "How", but you often miss the "Why" and "What If". In senior roles, execution is a commodity; strategy is the currency. You must lift your gaze from the daily grind to the horizon.',
                implications: [
                    'You are reliably delivering output, but not value.',
                    'Risk: Getting stuck in middle-management because you are "too useful" in the weeds.'
                ],
                recommendations: [
                    'Block 2 hours/week for "Deep Work"—no emails, no slack, just future planning.',
                    'Ask "What is the 2nd order consequence of this?" before every decision.'
                ]
            };
        }
    },
    {
        key: 'motivation',
        label: 'Motivation, Drive, and Ambition',
        description: 'Intrinsic drive and resilience.',
        getAnalysis: (score) => {
            const band = getBand(score);
            if (band === 'strong' || band === 'solid') return {
                narrative: 'You run on nuclear fuel. Your drive is internal, relentless, and largely independent of external validation. You are the person they call when the building is on fire. But be warned: Your high tolerance for pain allows you to endure toxic situations far longer than you should. High drive without boundaries is just high-speed burnout.',
                implications: [
                    'You are a natural pace-setter for the organisation.',
                    'Risk: You intimidate peers who cannot match your velocity.'
                ],
                recommendations: [
                    'Audit your energy, not just your time. What gives you fuel?',
                    'Learn the power of the "Strategic Pause"—speed kills if the direction is wrong.'
                ]
            };
            return {
                narrative: 'Your engine is sputtering. You are likely waiting for permission, inspiration, or a "perfect moment" that will never arrive. This isn\'t a capability issue; it\'s an ignition issue. You are letting external circumstances dictate your internal velocity. Leadership is about moving forward when you don\'t feel like it.',
                implications: [
                    'You drift when supervision is removed.',
                    'Risk: Being labelled as "Low Potential" despite having high skill.'
                ],
                recommendations: [
                    'Gamify your week: Set 3 "Must-Win" battles and track them relentlessly.',
                    'Find a "Running Mate"—a peer who pushes you to sprint.'
                ]
            };
        }
    },
    {
        key: 'influence',
        label: 'Influence and Interpersonal Impact',
        description: 'Communication style and emotional intelligence.',
        getAnalysis: (score) => {
            const band = getBand(score);
            if (band === 'strong' || band === 'solid') return {
                narrative: 'You are a political heavyweight in the making. You understand that organisations are human networks, not just org charts. You trade in social capital. Your ability to read the room is your superpower. Use it to protect your team and advance your agenda, but beware of being seen as "calculating" rather than authentic.',
                implications: [
                    'You can get things done where others hit brick walls.',
                    'Risk: You might prioritize harmony over hard truths.'
                ],
                recommendations: [
                    'Spend your political capital: Take a controversial stand for something you believe in.',
                    'Mentor a "high-performer" who lacks your social grace.'
                ]
            };
            return {
                narrative: 'You are shouting into the void. You may be right, but nobody is listening. You rely on logic, data, and "being right" to persuade people, but humans are emotional creatures. You are currently fighting battles with one hand tied behind your back because you are ignoring the human element of corporate warfare.',
                implications: [
                    'Your best ideas die in the meeting room.',
                    'Risk: Invisibility. If you can\'t sell it, you didn\'t do it.'
                ],
                recommendations: [
                    'The "First 5 Minutes" rule: Engage personally before diving into business.',
                    'Stop arguing facts; start telling stories. Stories move people; data just confuses them.'
                ]
            };
        }
    },
    {
        key: 'leadership',
        label: 'Leadership Style and Orientation',
        description: 'Authority, collaboration, and decision making.',
        getAnalysis: (score) => {
            const band = getBand(score);
            if (band === 'strong' || band === 'solid') return {
                narrative: 'You have "Commander Energy". People naturally look to you when the path is unclear. You are comfortable with the burden of decision-making. Your next evolution is to shift from "heroic leadership" (saving the day) to "systemic leadership" (building a machine that doesn\'t need saving).',
                implications: [
                    'You create safety and clarity for your team.',
                    'Risk: Creating dependency—the team collapses when you are away.'
                ],
                recommendations: [
                    'Practice "Lazy Leadership": Force your team to answer their own questions.',
                    'Delegate authority, not just tasks.'
                ]
            };
            return {
                narrative: 'You are a Manager, not a Leader. You manage tasks, timelines, and resources, but you do not lead people. You avoid conflict, seek consensus too often, and hesitate to make the call. The team needs a Captain, not a best friend. It is time to step into the discomfort of authority.',
                implications: [
                    'The team lacks direction and drifts during crises.',
                    'Risk: Being bypassed for promotion in favor of more decisive characters.'
                ],
                recommendations: [
                    'Make one unilateral decision this week and own the consequences.',
                    'Deliver bad news face-to-face, without apologizing for the reality.'
                ]
            };
        }
    },
    {
        key: 'strengths',
        label: 'Core Strengths and Leverage Areas',
        description: 'Natural talents and capabilities.',
        getAnalysis: (score) => {
            const band = getBand(score);
            if (band === 'strong' || band === 'solid') return {
                narrative: 'You are operating in your Zone of Genius. You know what you are good at, and you double down on it. This clarity gives you confidence and velocity. Now, the question is: Are these strengths scalable? Or are they traps that keep you doing the same work forever?',
                implications: [
                    'You deliver high-quality work effortlessly.',
                    'Risk: The "Competence Trap"—staying in a role too long because it\'s easy.'
                ],
                recommendations: [
                    'Train your replacement. It is the only way to move up.',
                    'Audit your calendar: Delete anything that doesn\'t leverage your superpowers.'
                ]
            };
            return {
                narrative: 'You are a Generalist in a world that rewards Specialists. You are "good enough" at many things but Great at nothing. This makes you replaceable. You must ruthlessly identify your unique value proposition and sharpen it into a spearpoint. Stop trying to fix your weaknesses; ignore them and explode your strengths.',
                implications: [
                    'You are a utility player—useful, but not vital.',
                    'Risk: Stagnation. Average is the enemy of Excellent.'
                ],
                recommendations: [
                    'Brand yourself. Pick ONE thing to be the "Go-To" person for.',
                    'Ask your boss: "What is the one thing I do better than anyone else?" If they can\'t answer, you have work to do.'
                ]
            };
        }
    },
    {
        key: 'development',
        label: 'Developmental and Growth Areas',
        description: 'Awareness of habits and areas for improvement.',
        getAnalysis: (score) => {
            const band = getBand(score);
            if (band === 'strong' || band === 'solid') return {
                narrative: 'You are a Growth Machine. You treat your career as a product to be iterated. You seek feedback, you kill bad habits, and you invest in yourself. This trajectory guarantees success over time. Keep feeding the machine.',
                implications: [
                    'You adapt faster than your peers.',
                    'Risk: "Optimization Fatigue"—don\'t forget to actually do the work.'
                ],
                recommendations: [
                    'Teach what you learn. It solidifies the knowledge.',
                    'Find a "Stretch Role"—a project you are only 60% qualified for.'
                ]
            };
            return {
                narrative: 'You are coasting. You rely on past glory and natural talent, but you stopped growing years ago. The world is moving faster than you are. If you aren\'t uncomfortable, you aren\'t learning. It is time to wake up and get back in the gym.',
                implications: [
                    'Your skills are slowly becoming obsolete.',
                    'Risk: Irrelevance. The market punishes stagnation.'
                ],
                recommendations: [
                    'Read one book a month. Non-negotiable.',
                    'Seek "Brutal Feedback"—ask a peer to tell you your blindspots, and don\'t argue.'
                ]
            };
        }
    },
];

export const QUESTIONS: Question[] = [
    // 1. Cognitive
    { id: 'cog_1', dimension: 'cognitive', text: 'I enjoy working through complex problems that require structured thinking and analysis.', isFreeTier: true },
    { id: 'cog_2', dimension: 'cognitive', text: 'I am comfortable making decisions even when I do not have complete information.', isFreeTier: true },
    { id: 'cog_3', dimension: 'cognitive', text: 'I naturally think several steps ahead when planning work or solving problems.' },
    { id: 'cog_4', dimension: 'cognitive', text: 'I quickly understand new concepts and apply them effectively in my work.' },
    { id: 'cog_5', dimension: 'cognitive', text: 'I balance strategic thinking with attention to practical execution.' },

    // 2. Motivation
    { id: 'mot_1', dimension: 'motivation', text: 'I am strongly motivated to achieve meaningful goals beyond basic job requirements.', isFreeTier: true },
    { id: 'mot_2', dimension: 'motivation', text: 'I remain focused and driven even when faced with setbacks or slow progress.', isFreeTier: true },
    { id: 'mot_3', dimension: 'motivation', text: 'I take personal ownership of outcomes rather than waiting for direction.' },
    { id: 'mot_4', dimension: 'motivation', text: 'I set high standards for my own performance and consistently work to exceed them.' },
    { id: 'mot_5', dimension: 'motivation', text: 'I am energised by challenges that stretch my capabilities.' },

    // 3. Influence
    { id: 'inf_1', dimension: 'influence', text: 'I communicate my ideas clearly and confidently to different audiences.', isFreeTier: true },
    { id: 'inf_2', dimension: 'influence', text: 'I am able to influence others without relying on formal authority.', isFreeTier: true },
    { id: 'inf_3', dimension: 'influence', text: 'I am attentive to how my words and actions affect people around me.' },
    { id: 'inf_4', dimension: 'influence', text: 'I adapt my communication style based on the needs of others.' },
    { id: 'inf_5', dimension: 'influence', text: 'People often seek my perspective or guidance in group settings.' },

    // 4. Leadership
    { id: 'lead_1', dimension: 'leadership', text: 'I feel comfortable taking the lead when direction or clarity is needed.', isFreeTier: true },
    { id: 'lead_2', dimension: 'leadership', text: 'I balance collaboration with decisiveness when working with others.', isFreeTier: true },
    { id: 'lead_3', dimension: 'leadership', text: 'I hold myself accountable for both successes and failures.' },
    { id: 'lead_4', dimension: 'leadership', text: 'I am willing to make difficult decisions when it is in the best interest of the group.' },
    { id: 'lead_5', dimension: 'leadership', text: 'I actively support change and help others adapt to new ways of working.' },

    // 5. Strengths
    { id: 'str_1', dimension: 'strengths', text: 'I am clear about the strengths that differentiate me professionally.', isFreeTier: true },
    { id: 'str_2', dimension: 'strengths', text: 'I consistently deliver strong results in areas where I have natural capability.' },
    { id: 'str_3', dimension: 'strengths', text: 'I know how to apply my strengths to create value for teams or organisations.' },
    { id: 'str_4', dimension: 'strengths', text: 'I am recognised by others for specific capabilities or talents.' },
    { id: 'str_5', dimension: 'strengths', text: 'I intentionally position myself to work in areas where I perform best.' },

    // 6. Development
    { id: 'dev_1', dimension: 'development', text: 'I actively seek feedback to improve my performance and effectiveness.', isFreeTier: true },
    { id: 'dev_2', dimension: 'development', text: 'I am aware of habits or behaviours that may limit my professional growth.' },
    { id: 'dev_3', dimension: 'development', text: 'I am open to changing how I work when it will improve my effectiveness.' },
    { id: 'dev_4', dimension: 'development', text: 'I invest time and effort in developing skills that will support my future goals.' },
    { id: 'dev_5', dimension: 'development', text: 'I take responsibility for my personal and professional development.' },
];
