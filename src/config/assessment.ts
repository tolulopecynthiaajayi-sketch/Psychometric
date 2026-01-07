export type DimensionKey = 'cognitive' | 'motivation' | 'influence' | 'leadership' | 'strengths' | 'development';

export interface Question {
    id: string;
    text: string;
    dimension: DimensionKey;
    isFreeTier?: boolean;
}

export interface DimensionConfig {
    key: DimensionKey;
    label: string;
    description: string;
    // New Content Fields
    narrative: string;
    workImplications: string[];
    recommendations: string[];
}

export const DIMENSIONS: DimensionConfig[] = [
    { 
        key: 'cognitive', 
        label: 'Cognitive and Intellectual Orientation', 
        description: 'Processes complexity and approaches problem-solving.',
        narrative: '[PLACEHOLDER] How this person thinks, analyzes problems, and processes information. (e.g. "You tend to approach problems with a structured mindset...")',
        workImplications: [
            '[PLACEHOLDER] Benefit: Strategic thinking in complex scenarios.',
            '[PLACEHOLDER] Watch-out: May over-analyze simple decisions.'
        ],
        recommendations: [
            '[PLACEHOLDER] Challenge yourself to make faster decisions with 80% information.',
            '[PLACEHOLDER] Use your analytical skills to mentor others.'
        ]
    },
    { 
        key: 'motivation', 
        label: 'Motivation, Drive, and Ambition', 
        description: 'Intrinsic drive and resilience.',
        narrative: '[PLACEHOLDER] What drives this person? Is it achievement, connection, or stability?',
        workImplications: [
            '[PLACEHOLDER] Highly self-driven and requires little supervision.',
            '[PLACEHOLDER] May risk burnout due to high standards.'
        ],
        recommendations: [
            '[PLACEHOLDER] Set boundaries to maintain long-term energy.',
            '[PLACEHOLDER] Celebrate small wins.'
        ]
    },
    { 
        key: 'influence', 
        label: 'Influence and Interpersonal Impact', 
        description: 'Communication style and emotional intelligence.',
        narrative: '[PLACEHOLDER] How they interact with and persuade others.',
        workImplications: [
            '[PLACEHOLDER] Natural ability to build consensus.',
            '[PLACEHOLDER] Persuasive in group settings.'
        ],
        recommendations: [
            '[PLACEHOLDER] Leverage your network to drive organizational change.',
            '[PLACEHOLDER] Practice active listening.'
        ]
    },
    { 
        key: 'leadership', 
        label: 'Leadership Style and Orientation', 
        description: 'Authority, collaboration, and decision making.',
        narrative: '[PLACEHOLDER] Their natural style of leading: authoritative, democratic, or servant-leader.',
        workImplications: [
            '[PLACEHOLDER] Creates a collaborative team environment.',
            '[PLACEHOLDER] Willing to make tough calls when needed.'
        ],
        recommendations: [
            '[PLACEHOLDER] Take on more mentorship roles.',
            '[PLACEHOLDER] Communicate the "why" behind decisions.'
        ]
    },
    { 
        key: 'strengths', 
        label: 'Core Strengths and Leverage Areas', 
        description: 'Natural talents and capabilities.',
        narrative: '[PLACEHOLDER] Summary of their unique value proposition.',
        workImplications: [
            '[PLACEHOLDER] Rapid learner in new domains.',
            '[PLACEHOLDER] Trusted by peers.'
        ],
        recommendations: [
            '[PLACEHOLDER] Position yourself in roles that utilize these strengths.',
            '[PLACEHOLDER] Teach these skills to others.'
        ]
    },
    { 
        key: 'development', 
        label: 'Developmental and Growth Areas', 
        description: 'Awareness of habits and areas for improvement.',
        narrative: '[PLACEHOLDER] Areas where focus and effort will yield high ROI.',
        workImplications: [
            '[PLACEHOLDER] May struggle with delegation.',
            '[PLACEHOLDER] Needs to improve public speaking confidence.'
        ],
        recommendations: [
            '[PLACEHOLDER] Seek feedback regularly.',
            '[PLACEHOLDER] Take a course on this specific skill.'
        ]
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
