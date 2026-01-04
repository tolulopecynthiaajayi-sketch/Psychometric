export type DimensionKey = 'cognitive' | 'motivation' | 'influence' | 'leadership' | 'strengths' | 'development';

export interface Question {
    id: string;
    text: string;
    dimension: DimensionKey;
}

export interface DimensionConfig {
    key: DimensionKey;
    label: string;
    description: string;
}

export const DIMENSIONS: DimensionConfig[] = [
    { key: 'cognitive', label: 'Cognitive and Intellectual Orientation', description: 'Processes complexity and approaches problem-solving.' },
    { key: 'motivation', label: 'Motivation, Drive, and Ambition', description: 'Intrinsic drive and resilience.' },
    { key: 'influence', label: 'Influence and Interpersonal Impact', description: 'Communication style and emotional intelligence.' },
    { key: 'leadership', label: 'Leadership Style and Orientation', description: 'Authority, collaboration, and decision making.' },
    { key: 'strengths', label: 'Core Strengths and Leverage Areas', description: 'Natural talents and capabilities.' },
    { key: 'development', label: 'Developmental and Growth Areas', description: 'Awareness of habits and areas for improvement.' },
];

export const QUESTIONS: Question[] = [
    // 1. Cognitive
    { id: 'cog_1', dimension: 'cognitive', text: 'I enjoy working through complex problems that require structured thinking and analysis.' },
    { id: 'cog_2', dimension: 'cognitive', text: 'I am comfortable making decisions even when I do not have complete information.' },
    { id: 'cog_3', dimension: 'cognitive', text: 'I naturally think several steps ahead when planning work or solving problems.' },
    { id: 'cog_4', dimension: 'cognitive', text: 'I quickly understand new concepts and apply them effectively in my work.' },
    { id: 'cog_5', dimension: 'cognitive', text: 'I balance strategic thinking with attention to practical execution.' },

    // 2. Motivation
    { id: 'mot_1', dimension: 'motivation', text: 'I am strongly motivated to achieve meaningful goals beyond basic job requirements.' },
    { id: 'mot_2', dimension: 'motivation', text: 'I remain focused and driven even when faced with setbacks or slow progress.' },
    { id: 'mot_3', dimension: 'motivation', text: 'I take personal ownership of outcomes rather than waiting for direction.' },
    { id: 'mot_4', dimension: 'motivation', text: 'I set high standards for my own performance and consistently work to exceed them.' },
    { id: 'mot_5', dimension: 'motivation', text: 'I am energised by challenges that stretch my capabilities.' },

    // 3. Influence
    { id: 'inf_1', dimension: 'influence', text: 'I communicate my ideas clearly and confidently to different audiences.' },
    { id: 'inf_2', dimension: 'influence', text: 'I am able to influence others without relying on formal authority.' },
    { id: 'inf_3', dimension: 'influence', text: 'I am attentive to how my words and actions affect people around me.' },
    { id: 'inf_4', dimension: 'influence', text: 'I adapt my communication style based on the needs of others.' },
    { id: 'inf_5', dimension: 'influence', text: 'People often seek my perspective or guidance in group settings.' },

    // 4. Leadership
    { id: 'lead_1', dimension: 'leadership', text: 'I feel comfortable taking the lead when direction or clarity is needed.' },
    { id: 'lead_2', dimension: 'leadership', text: 'I balance collaboration with decisiveness when working with others.' },
    { id: 'lead_3', dimension: 'leadership', text: 'I hold myself accountable for both successes and failures.' },
    { id: 'lead_4', dimension: 'leadership', text: 'I am willing to make difficult decisions when it is in the best interest of the group.' },
    { id: 'lead_5', dimension: 'leadership', text: 'I actively support change and help others adapt to new ways of working.' },

    // 5. Strengths
    { id: 'str_1', dimension: 'strengths', text: 'I am clear about the strengths that differentiate me professionally.' },
    { id: 'str_2', dimension: 'strengths', text: 'I consistently deliver strong results in areas where I have natural capability.' },
    { id: 'str_3', dimension: 'strengths', text: 'I know how to apply my strengths to create value for teams or organisations.' },
    { id: 'str_4', dimension: 'strengths', text: 'I am recognised by others for specific capabilities or talents.' },
    { id: 'str_5', dimension: 'strengths', text: 'I intentionally position myself to work in areas where I perform best.' },

    // 6. Development
    { id: 'dev_1', dimension: 'development', text: 'I actively seek feedback to improve my performance and effectiveness.' },
    { id: 'dev_2', dimension: 'development', text: 'I am aware of habits or behaviours that may limit my professional growth.' },
    { id: 'dev_3', dimension: 'development', text: 'I am open to changing how I work when it will improve my effectiveness.' },
    { id: 'dev_4', dimension: 'development', text: 'I invest time and effort in developing skills that will support my future goals.' },
    { id: 'dev_5', dimension: 'development', text: 'I take responsibility for my personal and professional development.' },
];
