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
    // Default fallback
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

            // Personalize the simulation
            const personalizedSim = {
                ...sim,
                executive_summary: sim.executive_summary.replace("Your psychometric profile", `${userProfile.name}, your profile`)
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
