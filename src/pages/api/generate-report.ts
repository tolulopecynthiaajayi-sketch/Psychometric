import type { NextApiRequest, NextApiResponse } from 'next';
import { PromptEngine } from '@/lib/ai/promptEngine';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Simulation content for fallback/demo
const SIMULATION_RESPONSES = {
    'The Strategic Architect': {
        executive_summary: "You operate with a rare combination of high-level vision and structural discipline. Your psychometric profile suggests you are not just a participant in your organization, you are a designer of it. You see systems where others see chaos. However, your challenge lies in translation—ensuring that your complex architectural vision is understood by valid executioners.",
        superpower_analysis: "Your Cognitive Orientation is your greatest weapon. You deconstruct complexity faster than anyone in the room. This isn't just 'being smart'; it's a structural advantage. You anticipate bottlenecks before they exist.",
        blindspot_warning: "The 'Ivory Tower' effect. Your preference for strategy over emotional influence means you risk losing the 'hearts' of your team while capturing their 'minds'. A perfectly designed strategy fails if no one wants to follow it.",
        immediate_actions: [
            "Translate your 3-month strategy into a 1-page visual map for the team.",
            "Schedule 'human connection' time that has zero strategic agenda.",
            "Delegate the 'how' completely—focus entirely on the 'what' and 'why'."
        ]
    },
    'The Diplomatic Commander': {
        executive_summary: "You are a master of soft power. Your profile indicates that you don't just lead through authority; you lead through consensus and influence. You understand that in modern organizations, getting things done requires navigating political currents and aligning diverse stakeholders.",
        superpower_analysis: "Stellar Influence. You can walk into a room of conflicting interests and leave with a unified plan. Your ability to read emotional undercurrents gives you a tactical edge in negotiations.",
        blindspot_warning: "The 'Peacekeeper's Paralysis'. In your drive to maintain harmony and buy-in, you may delay critical decisions that require conflict. Sometimes, being a commander means disappointing people to save the mission.",
        immediate_actions: [
            "Identify one decision you've delayed to avoid conflict and make it today.",
            "Practice 'benevolent friction'—disagreeing openly without being disagreeable.",
            "Audit your time: Are you spending too much time smoothing feathers instead of flying?"
        ]
    },
    'The Relentless Operator': {
        executive_summary: "You are the engine of execution. When others are paralyzed by analysis, you are already moving. Your profile suggests a high drive for results and an allergy to inefficiency. You are the person stakeholders call when the building is on fire.",
        superpower_analysis: "Unstoppable Momentum. Your bias for action creates a gravitational pull that drags projects forward. You don't just complete tasks; you demolish obstacles.",
        blindspot_warning: "The 'Bulldozer' effect. Your speed can leave your team breathless or bruised. You risk leaving a trail of exhausted colleagues in your wake, burning out your best people in the pursuit of the objective.",
        immediate_actions: [
            "Implement a 'mandatory pause' before starting new initiatives to check team capacity.",
            "Celebrate the 'process' specifically, not just the result, to encourage your team.",
            "Delegate a critical task and force yourself NOT to intervene for 48 hours."
        ]
    },
    'The Visionary Driver': {
        executive_summary: "You see the destination before anyone else has even packed their bags. Your profile blends high cognitive scope with intense motivation. You are a catalyst for change, often frustrated by the pace of 'business as usual'.",
        superpower_analysis: "Infectious Ambition. You don't just have goals; you have a reality distortion field. You can make the impossible seem inevitable to those around you.",
        blindspot_warning: "The 'Gap of Despair'. The distance between your vision and current reality is obvious to you, but terrifying to others. If you don't bridge that gap with concrete steps, your team will see you as a dreamer rather than a leader.",
        immediate_actions: [
            "Break your 5-year vision into a boring, linear 2-week checklist.",
            "Find an 'Integrator'—someone who loves details—and partner with them closely.",
            "Stop selling the 'dream' to operations people; sell them the 'plan'."
        ]
    },
    'default': {
        executive_summary: "You possess a balanced and adaptable professional profile. You are capable of shifting between execution and strategy as the situation demands. Your core challenge is now distinctiveness—moving from being 'good at everything' to being 'exceptional at one thing'.",
        superpower_analysis: "Versatility. You are the ultimate utility player. You can plug into almost any gap in an organization and add value immediately.",
        blindspot_warning: "The 'Commodity Trap'. By doing everything well, you risk becoming indispensable in operations but overlooked for transformational leadership roles.",
        immediate_actions: [
            "Audit your calendar: Identify the 20% of work that drives 80% of your impact.",
            "Choose one domain to master deeply over the next 90 days.",
            "Ask for feedback specifically on your 'leadership presence', not just your output."
        ]
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userProfile, scores, archetype } = req.body;

        if (!userProfile || !scores) {
            return res.status(400).json({ message: 'Missing user profile or scores' });
        }

        // 1. Build the Prompt
        const prompt = PromptEngine.build(userProfile, scores, archetype);

        // 2. CHECK FOR API KEY (Gemini)
        const apiKey = process.env.GEMINI_API_KEY;

        // 3. IF NO KEY -> USE SIMULATION MODE
        if (!apiKey) {
            console.log("No GEMINI_API_KEY found. Using 'The Alchemist' Simulation Mode.");

            // Artificial delay to simulate "thinking"
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Select simulation based on Archetype Name
            const sim = (SIMULATION_RESPONSES as any)[archetype.name] || SIMULATION_RESPONSES['default'];

            // Personalize the simulation deeply
            const context = {
                name: userProfile.name,
                role: userProfile.title || 'Professional',
                org: userProfile.organization || 'your organization',
                category: userProfile.category === 'entrepreneur' ? 'business' : 'career'
            };

            const personalizedSim = {
                ...sim,
                executive_summary: sim.executive_summary
                    .replace("You operate", `${context.name}, as a ${context.role} at ${context.org}, you operate`)
                    .replace("You are a master", `${context.name}, in your role as ${context.role}, you are a master`)
                    .replace("You are the engine", `${context.name}, at ${context.org}, you are the engine`)
                    .replace("You see the destination", `${context.name}, as a visionary ${context.role}, you see the destination`)
                    .replace("You possess", `${context.name}, you possess`)
                    .replace("your organization", context.org),

                superpower_analysis: sim.superpower_analysis
                    .replace("Your", `For a ${context.role}, your`)
                    .replace("Versatility", `As a ${context.role}, your Versatility`),

                immediate_actions: sim.immediate_actions.map((action: string) =>
                    action.replace("team", context.category === 'entrepreneur' ? "business" : "team")
                        .replace("organization", context.org)
                )
            };

            return res.status(200).json(personalizedSim);
        }

        // 4. REAL AI CALL - GOOGLE GEMINI PRO
        console.log("Using Google Gemini Pro for generation...");
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonResponse = JSON.parse(cleanedText);
            return res.status(200).json(jsonResponse);
        } catch (jsonError) {
            console.error("Failed to parse Gemini JSON:", text);
            // Fallback if AI output isn't valid JSON
            throw new Error("Invalid JSON from AI");
        }

    } catch (error) {
        console.error("AI Generation Error:", error);

        // Robust Fallback: Return simulation so the user never sees an error page
        const sim = (SIMULATION_RESPONSES as any)[req.body.archetype?.name] || SIMULATION_RESPONSES['default'];
        return res.status(200).json(sim);
    }
}
