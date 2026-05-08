// CONFIGURATION
const PASS_PERCENTAGE = 0.70;
const TOTAL_MARKS = 25;
const GAME_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes in ms

// CORE FUNCTIONS
function calculateScore(topicId) {
    const quizForm = document.getElementById(`quiz-${topicId}`);
    const results = new FormData(quizForm);
    let userMarks = 0;

    // Check answers (Logic will look for values marked 'correct')
    for (let entry of results.values()) {
        if (entry === "correct") userMarks++;
    }

    const percentage = userMarks / TOTAL_MARKS;
    displayResult(topicId, userMarks, percentage);
}

function displayResult(topicId, marks, percent) {
    const display = document.getElementById(`result-${topicId}`);
    
    if (percent >= PASS_PERCENTAGE) {
        display.innerHTML = `
            <div style="color: var(--success); text-align:center;">
                <h2>🎉 Score: ${marks}/${TOTAL_MARKS} (Excellent!)</h2>
                <p>Hardware Mastery Achieved. Game Zone Unlocked for 10 Minutes!</p>
                <button onclick="startGaming()" class="btn-gamify">ENTER GAME ZONE</button>
            </div>
        `;
        saveProgress(topicId, true);
    } else {
        display.innerHTML = `
            <div style="color: var(--error); text-align:center;">
                <h2>❌ Score: ${marks}/${TOTAL_MARKS}</h2>
                <p>You need ${Math.ceil(TOTAL_MARKS * PASS_PERCENTAGE)} marks to unlock the game. Review the content above and try again!</p>
            </div>
        `;
    }
}

// GAME ACCESS LOGIC
function startGaming() {
    const startTime = new Date().getTime();
    localStorage.setItem('gameStartTime', startTime);
    window.location.href = 'game.html';
}

function checkGameExpiry() {
    const startTime = localStorage.getItem('gameStartTime');
    if (startTime) {
        const now = new Date().getTime();
        if (now - startTime > GAME_TIME_LIMIT) {
            localStorage.removeItem('gameStartTime');
            alert("10 minutes are up! Returning to study zone.");
            window.location.href = 'index.html';
        }
    }
}

function saveProgress(topic, status) {
    localStorage.setItem(`topic_${topic}_completed`, status);
}

// Initialized Check for Game Page
if (window.location.pathname.includes('game.html')) {
    checkGameExpiry();
    setInterval(checkGameExpiry, 10000); // Check every 10 seconds
}