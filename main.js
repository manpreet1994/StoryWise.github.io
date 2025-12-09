import { generateTrivia } from './gemini.js';

const setupSection = document.getElementById('setup-section');
const triviaSection = document.getElementById('trivia-section');
const topicInput = document.getElementById('topic-input');
const generateBtn = document.getElementById('generate-btn');
const questionText = document.getElementById('question-text');
const revealBtn = document.getElementById('reveal-btn');
const answerContainer = document.getElementById('answer-container');
const answerText = document.getElementById('answer-text');
const resetBtn = document.getElementById('reset-btn');
const loader = document.querySelector('.loader');
const btnText = document.querySelector('.btn-text');

let currentAnswer = "";

// Event Listeners
generateBtn.addEventListener('click', handleGenerate);
revealBtn.addEventListener('click', handleReveal);
resetBtn.addEventListener('click', handleReset);
topicInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGenerate();
});

async function handleGenerate() {
    const topic = topicInput.value.trim();

    setLoading(true);

    try {
        const data = await generateTrivia(topic);

        // Update UI with question
        questionText.textContent = data.question;
        currentAnswer = data.answer;

        // Switch sections
        setupSection.classList.add('hidden');
        triviaSection.classList.remove('hidden');

        // Reset answer state
        answerContainer.classList.add('hidden');
        revealBtn.classList.remove('hidden');

    } catch (error) {
        alert("Failed to generate trivia. Please check your API key and try again.");
        console.error(error);
    } finally {
        setLoading(false);
    }
}

function handleReveal() {
    answerText.textContent = currentAnswer;
    answerContainer.classList.remove('hidden');
    revealBtn.classList.add('hidden');
}

function handleReset() {
    triviaSection.classList.add('hidden');
    setupSection.classList.remove('hidden');
    topicInput.value = "";
    currentAnswer = "";
    answerContainer.classList.add('hidden');
    revealBtn.classList.remove('hidden');
}

function setLoading(isLoading) {
    generateBtn.disabled = isLoading;
    if (isLoading) {
        loader.classList.remove('hidden');
        btnText.classList.add('hidden');
    } else {
        loader.classList.add('hidden');
        btnText.classList.remove('hidden');
    }
}
