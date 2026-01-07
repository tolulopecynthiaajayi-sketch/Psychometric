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
        narrative: 'You demonstrate high intellectual acuity, characterised by sharp analytical thinking, sound legal judgement, and strong problem-solving skills. You exhibit the ability to distil complex organisational realities, interpret cultural dynamics, and recognise systemic issues that affect performance and visibility. You reason strategically, thinking not just about the present implications of work but the long-term positioning. Your reflections illustrate a holistic and intellectually mature approach to career planning. Overall, you are a high-capacity professional with the cognitive range to thrive in senior leadership.',
        workImplications: [
            'You connect operational workload with broader organisational constraints, showing strong systems thinking.',
            'You articulate concerns with clarity, linking mental blocks to leadership readiness.',
            'You may feel overwhelmed by the depth of your analysis, needing structure to potentialize your insights.'
        ],
        recommendations: [
            'Continue to cultivate your strategic lens to anticipate challenges before they arise.',
            'Focus on "distilling" complexity for others—translate your deep analysis into simple, actionable directives for your team.',
            'Leap from "doing the work" to "designing the system" to reduce personal overwhelm.'
        ]
    },
    {
        key: 'motivation',
        label: 'Motivation, Drive, and Ambition',
        description: 'Intrinsic drive and resilience.',
        narrative: 'You are deeply motivated by growth, competence, and meaningful impact. Even when experiencing overwhelm, you display a strong internal drive to excel and contribute at a higher level. You likely find yourself "already doing the work" of a leader, stepping up informally during transitions despite pressure. Your motivation is fueled by a desire for professional visibility and strategic positioning. You are willing to self-reflect and address mental blocks, showing a commitment to finding strategic clarity for the next decade of your career.',
        workImplications: [
            'You inspire others by taking initiative during uncertain times.',
            'You risk burnout because your standards for yourself are exceptionally high.',
            'You may feel frustrated if your informal leadership contributions are not formally recognized.'
        ],
        recommendations: [
            'Shift from "doing more" to "aligning more"—focus on structure rather than raw effort.',
            'Set clear boundaries to protect your energy for high-leverage activities.',
            'Document your informal leadership contributions to build a case for formal advancement.'
        ]
    },
    {
        key: 'influence',
        label: 'Influence and Interpersonal Impact',
        description: 'Communication style and emotional intelligence.',
        narrative: 'Your influence is understated but powerful, rooted in competence, reliability, and the quiet authority that comes from being the stabilising force in a pressured environment. You display self-leadership through improved reflection and goal clarity. You have developed the courage to speak more confidently, raise issues, and assert your perspectives even when the organisational culture is conservative or resistant.',
        workImplications: [
            'You are seen as a stabilising force during transitions.',
            'Management likely leans on you for consistency, signalling trust.',
            'Your quiet style may sometimes be overlooked if you do not intentionally advocate for your views.'
        ],
        recommendations: [
            'Continue to assert your perspective in high-stakes meetings to build executive presence.',
            'Leverage your reliability to negotiate for more resources or authority.',
            'Practice "speaking up" early in discussions to frame the narrative.'
        ]
    },
    {
        key: 'leadership',
        label: 'Leadership Style and Orientation',
        description: 'Authority, collaboration, and decision making.',
        narrative: 'Your leadership capacity is evident and recognised. You tend to provide consistency and hold functions together during periods of instability. You demonstrate the capacity to operate at a higher level by stepping up when senior roles are vacant. However, you may need to focus on transitioning from "execution" to "strategy" to fully embody the senior leader role.',
        workImplications: [
            'You provide continuity that prevents operational failure during changes.',
            'You may struggle to delegate because you are so capable of doing it yourself.',
            'Others look to you for guidance even without a formal title.'
        ],
        recommendations: [
            'Delegate operational tasks to focus on strategic initiatives.',
            'Formalise your leadership by proposing clear team improvement plans.',
            'Mentor junior colleagues to take over your execution responsibilities.'
        ]
    },
    {
        key: 'strengths',
        label: 'Core Strengths and Leverage Areas',
        description: 'Natural talents and capabilities.',
        narrative: 'Your professional competence is a distinguishing quality, backed by a deep, practical understanding of corporate governance, regulatory frameworks, and organisational dynamics. You possess exceptional strategic awareness, seeing beyond day-to-day tasks to grasp broader implications. Your self-awareness and emotional intelligence allow you to recognise emotional blocks and navigate challenges with composure. Initiative and ownership are your hallmarks; you consistently seek solutions rather than waiting for direction.',
        workImplications: [
            'You navigate complex issues with maturity, earning trust from stakeholders.',
            'You anticipate challenges before they arise, making you a proactive asset.',
            'Your commitment to continuous growth ensures you remain adaptable and ahead of emerging opportunities.'
        ],
        recommendations: [
            'Position yourself in high-visibility roles where your strategic competence can be seen.',
            'Use your self-awareness to manage conflicting priorities without losing composure.',
            'Continue to take ownership of cross-functional projects to expand your influence.'
        ]
    },
    {
        key: 'development',
        label: 'Developmental and Growth Areas',
        description: 'Awareness of habits and areas for improvement.',
        narrative: 'To achieve your full potential, focus on professional positioning and visibility. Optimising your external profile (e.g., LinkedIn, CV) and internal presence is crucial. You may need to manage overwhelm by building personal workflow systems and delegating where possible. Increasing your thought leadership presence—through speaking or writing—will help transition you from a "doer" to a recognised "expert".',
        workImplications: [
            'You may remain the "best kept secret" if you do not actively build your brand.',
            'Overwhelm can stifle your strategic thinking if not managed with better systems.',
            'Undefined career paths can lead to stagnation; you need a clear 3-year plan.'
        ],
        recommendations: [
            'Build a personal workflow system (weekly planning, priority mapping) to reduce friction.',
            'Identify an accountability partner for regular check-ins on your goals.',
            'Publish insights or speak at industry events to establish thought leadership.'
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
