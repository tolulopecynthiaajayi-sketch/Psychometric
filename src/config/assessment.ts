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

export interface DimensionConfig {
    key: DimensionKey;
    label: string;
    description: string;
    // Dynamic Content Generators
    getAnalysis: (score: number) => AnalysisContent;
}

// Helper to select content based on score (Matching User Stories)
const getBand = (score: number): 'strong' | 'solid' | 'developing' | 'underdeveloped' => {
    if (score >= 21) return 'strong';       // 21-25
    if (score >= 15) return 'solid';        // 15-20
    if (score >= 10) return 'developing';   // 10-14
    return 'underdeveloped';                // 5-9
};

export const DIMENSIONS: DimensionConfig[] = [
    {
        key: 'cognitive',
        label: 'Cognitive and Intellectual Orientation',
        description: 'Processes complexity and approaches problem-solving.',
        getAnalysis: (score) => {
            const band = getBand(score);
            // High Band (Strong & Solid)
            if (band === 'strong' || band === 'solid') return {
                narrative: 'You demonstrate high intellectual acuity, characterised by sharp analytical thinking, sound legal judgement, and strong problem-solving skills. You exhibit the ability to distil complex organisational realities, interpret cultural dynamics, and recognise systemic issues that affect performance and visibility. You reason strategically, thinking not just about the present implications of work but the long-term positioning.',
                implications: [
                    'You connect operational workload with broader organisational constraints, showing strong systems thinking.',
                    'You articulate concerns with clarity, linking mental blocks to leadership readiness.'
                ],
                recommendations: [
                    'focus on "distilling" complexity for others—translate your deep analysis into simple, actionable directives.',
                    'Leap from "doing the work" to "designing the system" to reduce personal overwhelm.'
                ]
            };
            // Low Band (Developing & Underdeveloped)
            return {
                narrative: 'You approach problems with a practical mindset, focusing on getting things done. While you are capable of analysis, you may sometimes overlook broader systemic issues in favor of immediate execution. Developing a more strategic "balcony view" will enhance your leadership readiness.',
                implications: [
                    'You are reliable in execution but may miss long-term strategic opportunities.',
                    'You may find yourself "in the weeds" rather than planning ahead.'
                ],
                recommendations: [
                    'Dedicate specific time each week for "strategic thinking" away from daily tasks.',
                    'Ask "what is the root cause?" five times before solving a problem.'
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
                narrative: 'You are deeply motivated by growth, competence, and meaningful impact. Even when experiencing overwhelm, you display a strong internal drive to excel and contribute at a higher level. You likely find yourself "already doing the work" of a leader, stepping up informally during transitions despite pressure.',
                implications: [
                    'You inspire others by taking initiative during uncertain times.',
                    'You risk burnout because your standards for yourself are exceptionally high.'
                ],
                recommendations: [
                    'Shift from "doing more" to "aligning more"—focus on structure rather than raw effort.',
                    'Set clear boundaries to protect your energy for high-leverage activities.'
                ]
            };
            return {
                narrative: 'Your motivation tends to fluctuate based on the environment. You thrive when goals are clear but may disengage when faced with ambiguity or lack of recognition. Building intrinsic resilience is key to your next career stage.',
                implications: [
                    'You may wait for direction rather than taking initiative.',
                    'Setbacks can significantly impact your momentum.'
                ],
                recommendations: [
                    'Identify your "why"—what drives you beyond the paycheck?',
                    'Set small, self-directed goals to build momentum independent of external feedback.'
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
                narrative: 'Your influence is understated but powerful, rooted in competence, reliability, and the quiet authority that comes from being the stabilising force. You display self-leadership through improved reflection. You have the courage to assert your perspectives even in conservative cultures.',
                implications: [
                    'You are seen as a stabilising force during transitions.',
                    'Management likely leans on you for consistency, signalling trust.'
                ],
                recommendations: [
                    'Continue to assert your perspective in high-stakes meetings to build executive presence.',
                    'Leverage your reliability to negotiate for more resources or authority.'
                ]
            };
            return {
                narrative: 'You tend to influence through logic and facts, which is effective but may miss the emotional component of persuasion. You may be hesitant to speak up in larger groups until you are 100% sure of your answer.',
                implications: [
                    'You might be underestimated by those who value vocal confidence.',
                    'Valid ideas may die because they weren\'t championed effectively.'
                ],
                recommendations: [
                    'Practice "speaking up" within the first 10 minutes of a meeting.',
                    'Focus on the emotional impact of your message, not just the technical accuracy.'
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
                narrative: 'Your leadership capacity is evident and recognised. You tend to provide consistency and hold functions together during periods of instability. You demonstrate the capacity to operate at a higher level by stepping up when senior roles are vacant.',
                implications: [
                    'You provide continuity that prevents operational failure.',
                    'You may struggle to delegate because you are so capable of doing it yourself.'
                ],
                recommendations: [
                    'Delegate operational tasks to focus on strategic initiatives.',
                    'Formalise your leadership by proposing clear team improvement plans.'
                ]
            };
            return {
                narrative: 'You prefer a collaborative or supportive role rather than taking charge. While you are a strong team player, you may hesitate to make unpopular decisions or hold others accountable.',
                implications: [
                    'Decisions may be delayed as you seek consensus.',
                    'You may avoid conflict, leading to unresolved team issues.'
                ],
                recommendations: [
                    'Practice being "kind but clear"—direct feedback is a kindness.',
                    'Take ownership of a small project where you are the final decision maker.'
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
            // General strengths logic - usually we'd pluck top 2, but here we treat it as a dimension of "Self-Knowledge"
            if (band === 'strong' || band === 'solid') return {
                narrative: 'Your professional competence is a distinguishing quality, backed by a deep, practical understanding of your domain. You possess exceptional strategic awareness and self-awareness, allowing you to navigate challenges with composure.',
                implications: [
                    'You navigate complex issues with maturity, earning trust.',
                    'You anticipate challenges before they arise.'
                ],
                recommendations: [
                    'Position yourself in high-visibility roles where your strategic competence can be seen.',
                    'Teach your unique skills to others to scale your impact.'
                ]
            };
            return {
                narrative: 'You have solid functional skills but may not yet have fully articulated your unique value proposition. You are reliable, but may blend into the background rather than standing out as a specialist.',
                implications: [
                    'You are a "safe pair of hands" but not the first called for new opportunities.',
                    'You may undervalue your own contributions.'
                ],
                recommendations: [
                    'Conduct a "personal brand audit"—what are you known for?',
                    'Ask three colleagues to describe your superpowers.'
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
                narrative: 'To achieve your full potential, focus on professional positioning and visibility. Optimising your external profile (e.g., LinkedIn, CV) and internal presence is crucial. You effectively manage your growth but need to potentialize it.',
                implications: [
                    'You may remain the "best kept secret" if you do not actively build your brand.',
                    'Undefined career paths can lead to stagnation.'
                ],
                recommendations: [
                    'Build a personal workflow system to reduce friction.',
                    'Publish insights or speak at industry events.'
                ]
            };
            return {
                narrative: 'You are currently in a reactive mode regarding your development. You may feel overwhelmed by daily demands, leaving little time for intentional growth. Breaking this cycle is the first step to advancement.',
                implications: [
                    'Career growth is slow or stalled.',
                    'Burnout is a significant risk.'
                ],
                recommendations: [
                    'Block out 1 hour per week strictly for learning.',
                    'Identify one small habit to change this month.'
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
