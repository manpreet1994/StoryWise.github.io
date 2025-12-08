import { GoogleGenerativeAI } from "@google/generative-ai";

// Read API key from window.env (injected via env.js)
const API_KEY = window.env?.GEMINI_API_KEY || "";

let genAI = null;
let model = null;

/**
 * Initializes the Gemini API client.
 */
function initGemini() {
    if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
        console.warn("Gemini API Key is not set. Please create env.js with your key.");
        alert("API Key missing! Please check the console/setup.");
    }
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
}

/**
 * Generates a trivia question and answer based on the topic.
 * @param {string} topic - The topic for the trivia.
 * @returns {Promise<{question: string, answer: string}>}
 */
export async function generateTrivia(topic) {
    if (!genAI) initGemini();

    const prompt = `
    I want to create a trivia. Follow these steps to create one

    1. Find an interesting fact

    2. Choose an answer from the fact. Ideally answer should be an entity, person, company, date etc. Not a long sentence.

    3. Find background story and other relevant details around the answer

    4. Then combine all the info to create a trivia question in a way that the answer is not given away

    Example:
    X WAS BORN IN 1965 IN A SUBURB OF TOKYO AND HAD A HOBBY OF COLLECTING INSECTS EARNING HIM
    NICKNAME OF "DR. BUG".
    AT THE AGE OF 17, X PUBLISHED A MAGAZINE SPECIALIZING IN VIDEO GAMES CALLED GAME FREAK AND
    COLLABORATED WITH AN ILLUSTRATOR TO DEVELOP A PUZZLE VIDEO GAME. EVENTUALLY, X FOUNDED A VIDEO
    GAME COMPANY NAMED AFTER HIS MAGAZINE, GAME FREAK.
    X BEGAN WORKING ON A NEW GAME IDEA AND PITCHED IT TO Y, WHO WAS WITH NINTENDO AT THE TIME. IN
    1990, GAME FREAK AND NINTENDO SIGNED A CONTRACT TO DEVELOP THE GAME, AIMING FOR AN OCTOBER
    1990 RELEASE WITH A LOW BUDGET. HOWEVER, THE DEVELOPMENT PROVED CHALLENGING, AND THE PROJECT
    WAS SUSPENDED
    AFTER MANY EFFORTS, THE PROJECT NEARED COMPLETION, BUT IT MISSED ITS PLANNED RELEASE DATE OF
    DECEMBER 21, 1995, EVENTUALLY LAUNCHING IN FEBRUARY 1996.
    IN SEPTEMBER 1996, DISCUSSIONS BEGAN ABOUT CREATING AN ANIME ADAPTATION OF THE GAME, WHICH
    WAS DECIDED TO LAST AT LEAST A YEAR AND A HALF.
    THE ANIME WAS PREMIERED ON 1 APRIL 1997 AND BECAME HIGHEST RATED TV PROGRAM ON TV TOKYO BY
    NOV 1997. THE ANIME WAS THEN LOCALIZED FOR LAUNCH IN NORTH AMERICA AND LAUNCHED IN SEPTEMBER
    1998.
    THE PROTAGONIST OF THE ANIME SHARES THE SAME NAME AS X IN THE ORIGINAL VERSION
    WHICH ANIME ARE WE TALKING ABOUT?
    
    Format the output exactly as a JSON object with two keys: "question" and "answer".
    
    "question": A detailed, intriguing paragraph that sets up the trivia question without revealing the answer immediately. It should be engaging and long-form.
    "answer": The concise answer to the question, followed by a brief 1-sentence interesting fact.
    
    Do not use Markdown code blocks for the JSON. Just return the raw JSON string.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown formatting if Gemini adds it
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanText);
    } catch (error) {
        console.error("Error generating trivia:", error);
        throw error;
    }
}
