// Read API key from the environment at build/run time. This file now expects
// `process.env.GEMINI_API_KEY` to be provided by your runtime or build tooling.
const MY_API_KEY = (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) || "";

let genAI = null;
let model = null;

/**
 * Generates a trivia question and answer based on the topic.
 * @param {string} topic - The topic for the trivia.
 * @returns {Promise<{question: string, answer: string}>}
 */

async function generateContent(promptText) {
  // --- Configuration ---
  const apiKey = MY_API_KEY;
  const modelName = 'gemini-2.5-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  // --- Request Body ---
  const body = {
    contents: [{ parts: [{ text: promptText }] }],
  };

  try {
    // 1. Await the fetch call
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Handle HTTP errors (e.g., 400, 500)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 2. Await the JSON parsing
    const data = await response.json();

    // 3. Extract the text
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (generatedText) {
      return generatedText;
    } else {
      throw new Error('Could not find generated text in response.');
    }

  } catch (error) {
    console.error('API call failed:', error);
    return `Error: ${error.message}`;
  }
}

export async function generateTrivia(topic) {

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
    example:
    {
    "question": A detailed, intriguing paragraph that sets up the trivia question without revealing the answer immediately. It should be engaging and long-form.
    "answer": The concise answer to the question, followed by a brief 1-sentence interesting fact.
    }
    Do not use Markdown code blocks for the JSON. Just return the raw JSON string.
    `;

    try{
        const jsonString = await generateContent(prompt);
        const data = JSON.parse(jsonString);
        return data;
    }
    catch (error) {
        console.error('API call failed:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
 
}
