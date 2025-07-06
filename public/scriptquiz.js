import { GoogleGenerativeAI } from "@google/generative-ai";

const ques = document.getElementById('ques');
const ans = document.getElementById('ans');
const submit = document.getElementById('submit');
const responseText = document.getElementById('responseText');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const ratingDiv = document.getElementById('rating');
const analysisDiv = document.getElementById('analysis');  // For AI performance analysis text
const topicInput = document.getElementById('topicInput');
const startQuiz = document.getElementById('startQuiz');
const quizContent = document.getElementById('quizContent');

const videoElement = document.getElementById('videoElement');
const cheatAlert = document.getElementById('cheatAlert');

const apiKey = 'AIzaSyB1QiMcUVr8Yd2yy0M9bkAFwmfe9KXho9c';

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let userArr = new Array(10).fill(0);  // Track correctness for 10 questions (1: correct, 0: incorrect)
let userAnswers = [];
let currInd = 0;
let topic = '';

// Always generate a new question without caching
async function generateQuestion(index) {
    const prompt = `Generate a random good single line question on ${topic}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
}

function updateRatingDisplay(correct, incorrect) {
    ratingDiv.textContent = `Correct: ${correct}  |  Incorrect: ${incorrect}`;
}

// Generate a performance chart using Chart.js
function createPerformanceChart(correct, incorrect) {
    const ctx = document.getElementById('chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [correct, incorrect],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Quiz Performance' }
            }
        }
    });
}

// Use generative AI to analyze performance and generate suggestions
async function analyzePerformance() {
    let correct = 0, incorrect = 0;
    userArr.forEach(val => {
        if (val === 1) correct++;
        else if (val === 0) incorrect++;
    });

    const analysisPrompt = `I answered ${correct} questions correctly and ${incorrect} questions incorrectly on a quiz about ${topic}. Provide a detailed analysis of my performance, highlighting areas of weakness and suggestions for improvement in two paragraphs.`;
    const result = await model.generateContent(analysisPrompt);
    const analysisText = result.response.text();
    analysisDiv.textContent = analysisText;

    createPerformanceChart(correct, incorrect);
}

// async function analyzePerformance() {
//     let correct = 0, incorrect = 0;
//     userArr.forEach(val => {
//         if (val === 1) correct++;
//         else if (val === 0) incorrect++;
//     });

//     const analysisPrompt = `I answered ${correct} questions correctly and ${incorrect} questions incorrectly on a quiz about ${topic}. Provide a detailed analysis of my performance, highlighting areas of strength and weaknesses. Include suggestions for improvement in bullet points and make it engaging.`;
//     const result = await model.generateContent(analysisPrompt);
//     const analysisText = result.response.text();

//     // Format the analysis text to be more engaging
//     const formattedAnalysis = `
//         <p><strong>Overall Performance:</strong> You answered ${correct} questions correctly and ${incorrect} questions incorrectly. Let's break down the key points:</p>
//         <ul>
//             <li><strong>Strengths:</strong> You have a good grasp of topics like [List of Strong Topics]. Keep up the great work!</li>
//             <li><strong>Areas for Improvement:</strong> You struggled with questions related to [List of Weak Topics]. Here's what you can focus on:</li>
//             <ul>
//                 <li>Review the concepts on [Weak Topic 1]</li>
//                 <li>Practice more on [Weak Topic 2] using [Resources or Tips]</li>
//             </ul>
//             <li><strong>Suggestions for Improvement:</strong> Here are some actionable tips to improve your score:
//                 <ul>
//                     <li>Set aside dedicated time each week to study [Topic].</li>
//                     <li>Engage with more interactive learning tools (e.g., quizzes, flashcards) to reinforce key concepts.</li>
//                     <li>Consider taking mini-quizzes every few days to track your progress.</li>
//                 </ul>
//             </li>
//         </ul>
//         <p><strong>Keep practicing, and you'll improve your performance significantly!</strong></p>
//     `;
//     document.getElementById('analysisText').innerHTML = formattedAnalysis;

//     createPerformanceChart(correct, incorrect);
// }


async function displayQuestion() {
    const question = await generateQuestion(currInd);
    ques.textContent = `Q${currInd + 1} - ${question}`;
    ans.value = userAnswers[currInd] || "";
    responseText.textContent = "";

    prev.disabled = currInd === 0;
    next.textContent = currInd === userArr.length - 1 ? "Show Result" : "Next";
}

startQuiz.addEventListener('click', () => {
    topic = topicInput.value;
    if (!topic) {
        alert('Please enter a topic!');
        return;
    }
    topicInput.disabled = true;
    startQuiz.disabled = true;
    quizContent.hidden = false;
    displayQuestion();
    next.disabled = false;
    startCheatDetection();  // Initialize cheat detection when quiz starts
});

function showRating() {
    let correct = 0;
    let incorrect = 0;
    userArr.forEach(val => {
        if (val === 1) correct++;
        else if (val === 0) incorrect++;
    });
    updateRatingDisplay(correct, incorrect);
}

async function submitAnswer() {
    const userAnswer = ans.value;
    if (!userAnswer) {
        alert('Please type your answer!');
        return;
    }
    userAnswers[currInd] = userAnswer;

    const prompt = `Q: ${ques.textContent}\nA: ${userAnswer}\nExplain your answer in 2 lines only.`;
    const result = await model.generateContent(prompt);
    responseText.textContent = result.response.text();

    const promptAns = `Q: ${ques.textContent}\nA: ${userAnswer}\nIf my answer is correct, write 1; if incorrect or empty, write 0.`;
    const resultAns = await model.generateContent(promptAns);
    userArr[currInd] = parseInt(resultAns.response.text(), 10);
}

submit.addEventListener('click', submitAnswer);

next.addEventListener('click', async () => {
    if (currInd < userArr.length - 1) {
        currInd++;
        displayQuestion();
    } else if (currInd === userArr.length - 1) {
        showRating();
        await analyzePerformance();
    }
});

prev.addEventListener('click', () => {
    if (currInd > 0) {
        currInd--;
        displayQuestion();
    }
});

// ---------- Cheat Detection Code ----------

// Set up the webcam and start video playback
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        await videoElement.play();
    } catch (error) {
        console.error("Error accessing camera:", error);
        cheatAlert.textContent = "Camera access is required for cheat detection.";
    }
}

// Load face-api.js TinyFaceDetector model from a public URL
async function loadFaceModels() {
    const modelUrl = "https://justadudewhohacks.github.io/face-api.js/models/";
    await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
}

// Check every 2 seconds if a face is detected in the video feed
async function checkCheating() {
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 160, scoreThreshold: 0.5 });
    // Use detectSingleFace for simplicity
    const detection = await faceapi.detectSingleFace(videoElement, options);
    if (!detection) {
        cheatAlert.textContent = "No face detected! Please stay focused on the screen.";
    } else {
        cheatAlert.textContent = "";
    }
}

// Start cheat detection: set up camera, load models, then check periodically
async function startCheatDetection() {
    await setupCamera();
    await loadFaceModels();
    setInterval(checkCheating, 2000); // Check every 2 seconds
}
