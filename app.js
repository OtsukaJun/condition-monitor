// Vocabulary data will be loaded from vocabulary_data.js

// App state
let currentScreen = 'start';
let username = 'あなた';
let currentQuestionIndex = 0;
let correctAnswers = 0;
let totalAnswers = 0;
let startTime = null;
let questionStartTime = null;
let todayTotalCorrect = 0; // Today's cumulative correct answers
let shuffledVocabulary = []; // Shuffled vocabulary for current session

// DOM elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');

const startBtn = document.getElementById('start-btn');
const viewResultsBtn = document.getElementById('view-results-btn');
const finishBtn = document.getElementById('finish-btn');

const wordDisplay = document.getElementById('word-display');
const choiceBtns = document.querySelectorAll('.choice-btn');
const correctCountEl = document.getElementById('correct-count');
const totalCountEl = document.getElementById('total-count');
const totalCountFractionEl = document.getElementById('total-count-fraction');
const timeSpentEl = document.getElementById('time-spent');
const goalRateEl = document.getElementById('goal-rate');
const predictedRateEl = document.getElementById('predicted-rate');
const encouragementMessageEl = document.getElementById('encouragement-message');
const chartProgressEl = document.getElementById('chart-progress');

// Initialize app
function init() {
    // Check if vocabulary is loaded
    if (typeof vocabulary === 'undefined' || !vocabulary || vocabulary.length === 0) {
        console.error('Vocabulary not loaded. Make sure vocabulary_data.js is included before app.js');
        startBtn.textContent = '読み込みエラー';
        startBtn.disabled = true;
        return;
    }
    
    console.log(`Loaded ${vocabulary.length} vocabulary items`);
    
    // Load today's cumulative score
    loadTodayScore();
    
    // Event listeners
    startBtn.addEventListener('click', startQuiz);
    viewResultsBtn.addEventListener('click', showResults);
    finishBtn.addEventListener('click', () => showScreen('start'));
    
    choiceBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => handleAnswer(index));
    });
    
    showScreen('start');
}

// Get today's date as string (YYYY-MM-DD)
function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Load today's cumulative score
function loadTodayScore() {
    const today = getTodayDateString();
    const scoreKey = `score_${username}_${today}`;
    const savedScore = localStorage.getItem(scoreKey);
    todayTotalCorrect = savedScore ? parseInt(savedScore) : 0;
}

// Save today's cumulative score
function saveTodayScore() {
    const today = getTodayDateString();
    const scoreKey = `score_${username}_${today}`;
    localStorage.setItem(scoreKey, todayTotalCorrect.toString());
}

// Show screen
function showScreen(screen) {
    startScreen.classList.add('hidden');
    quizScreen.classList.add('hidden');
    resultsScreen.classList.add('hidden');
    
    switch(screen) {
        case 'start':
            startScreen.classList.remove('hidden');
            break;
        case 'quiz':
            quizScreen.classList.remove('hidden');
            break;
        case 'results':
            resultsScreen.classList.remove('hidden');
            break;
    }
    
    currentScreen = screen;
}

// Start quiz
function startQuiz() {
    if (vocabulary.length === 0) {
        alert('問題を読み込めませんでした。ページを再読み込みしてください。');
        return;
    }
    
    // Shuffle vocabulary for this session to avoid duplicate questions
    shuffledVocabulary = shuffleArray([...vocabulary]);
    
    currentQuestionIndex = 0;
    correctAnswers = 0; // Reset session correct answers
    totalAnswers = 0;
    startTime = Date.now();
    
    showScreen('quiz');
    loadQuestion();
}

// Load question
function loadQuestion() {
    if (shuffledVocabulary.length === 0) {
        console.error('No vocabulary loaded');
        return;
    }
    
    // If we've gone through all questions, shuffle again
    if (currentQuestionIndex >= shuffledVocabulary.length) {
        shuffledVocabulary = shuffleArray([...vocabulary]);
        currentQuestionIndex = 0;
    }
    
    const question = shuffledVocabulary[currentQuestionIndex];
    
    if (!question) {
        console.error('Question is undefined at index:', currentQuestionIndex);
        return;
    }
    
    wordDisplay.textContent = question.word;
    
    // Create shuffled choices
    const choices = [question.correct, ...question.options];
    const shuffledChoices = shuffleArray(choices);
    
    // Update choice buttons
    choiceBtns.forEach((btn, index) => {
        btn.classList.remove('correct', 'incorrect', 'disabled');
        const choiceText = btn.querySelector('.choice-text');
        choiceText.textContent = shuffledChoices[index];
        btn.dataset.answer = shuffledChoices[index];
    });
    
    questionStartTime = Date.now();
}

// Handle answer
function handleAnswer(index) {
    if (!shuffledVocabulary || shuffledVocabulary.length === 0 || currentQuestionIndex >= shuffledVocabulary.length) {
        console.error('Invalid state in handleAnswer');
        return;
    }
    
    const selectedBtn = choiceBtns[index];
    const selectedAnswer = selectedBtn.dataset.answer;
    const question = shuffledVocabulary[currentQuestionIndex];
    
    if (!question) {
        console.error('Question not found at index:', currentQuestionIndex);
        return;
    }
    
    const isCorrect = selectedAnswer === question.correct;
    
    // Disable all buttons
    choiceBtns.forEach(btn => btn.classList.add('disabled'));
    
    // Show feedback
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        correctAnswers++;
    } else {
        selectedBtn.classList.add('incorrect');
        // Highlight correct answer
        choiceBtns.forEach(btn => {
            if (btn.dataset.answer === question.correct) {
                btn.classList.add('correct');
            }
        });
    }
    
    totalAnswers++;
    
    // Move to next question after 1 second
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion(); // loadQuestion will handle shuffling if needed
    }, 1000);
}

// Encouragement messages
const encouragementMessages = [
    '今日の学びが、あなたの未来を静かに変え始めています。すごいね。',
    'コツコツ積み重ねる姿、とても素敵だよ。',
    '今日の一歩が、明日の自信につながっていくよ。',
    '少しでも続けたあなた、もう十分前進できています。',
    '「わかった」が増えるたびに、英語がもっと楽しくなるね。',
    '今日も自分を大切にして学べたね。えらいよ。',
    '小さな努力が、確かな力になっているよ。',
    'あなたのペースで続けられること、その力が本当にすごい。',
    '今日の挑戦、しっかりできていたよ。自信を持ってね。',
    '積み重ねる力は、あなたの大きな武器になるよ。',
    '学ぶ姿勢がとても前向きで、見ていて応援したくなるよ。',
    '今日の学習で、またひとつ成長できたね。',
    '進み方がゆっくりでも、確実に前に進んでいるよ。',
    '毎日の努力が、あなたをより強くしていることを忘れないでね。',
    '今日のあなた、とても頑張っていたよ。素晴らしい！',
    '続けられるあなたの力、本当に尊敬するよ。',
    '少しだけでも学べた自分をほめてあげてね。',
    '今日もちゃんと前へ進んだね。その積み重ねが未来を作るよ。',
    'あなたにはちゃんと続ける力があるよ。安心して進んでね。',
    '今日の努力が、あなたの夢へ一歩近づけてくれたよ。'
];

// Get random encouragement message
function getRandomEncouragementMessage() {
    const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
    return encouragementMessages[randomIndex];
}

// Show results
function showResults() {
    const endTime = Date.now();
    const timeSpent = Math.floor((endTime - startTime) / 1000);
    
    // Update today's cumulative score
    todayTotalCorrect += correctAnswers;
    saveTodayScore();
    
    // Calculate goal rate (max 100%)
    const goalRate = Math.min(Math.round((correctAnswers / 10) * 100), 100);
    
    // Calculate predicted rate (goal rate * 1.2, but if goal rate is 100, keep it 100)
    const predictedRate = goalRate === 100 ? 100 : Math.min(Math.round(goalRate * 1.2), 100);
    
    // Update text content
    correctCountEl.textContent = correctAnswers;
    totalCountFractionEl.textContent = totalAnswers;
    totalCountEl.textContent = totalAnswers;
    timeSpentEl.textContent = timeSpent;
    goalRateEl.textContent = goalRate;
    predictedRateEl.textContent = predictedRate;
    
    // Display random encouragement message
    encouragementMessageEl.textContent = getRandomEncouragementMessage();
    
    // Update circular chart
    updateCircularChart(correctAnswers, totalAnswers);
    
    showScreen('results');
}

// Update circular chart
function updateCircularChart(correct, total) {
    const percentage = total > 0 ? (correct / total) : 0;
    const circumference = 2 * Math.PI * 85; // r = 85
    const offset = circumference * (1 - percentage);
    
    chartProgressEl.style.strokeDasharray = circumference;
    chartProgressEl.style.strokeDashoffset = offset;
}

// Utility: Shuffle array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Start app
init();
