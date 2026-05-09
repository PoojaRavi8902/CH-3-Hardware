// CONFIGURATION
const PASS_PERCENTAGE = 0.70;
const TOTAL_MARKS = 25;
const GAME_TIME_LIMIT = 10 * 60 * 1000; // 10 minutes in ms

/**
 * CORE QUIZ LOGIC
 * Optimized to handle multiple quiz forms without memory leaks
 */
function calculateScore(topicId) {
    const quizForm = document.getElementById(`quiz-${topicId}`);
    if (!quizForm) return;

    const results = new FormData(quizForm);
    let userMarks = 0;

    // Sum up correct answers
    for (let entry of results.values()) {
        if (entry === "correct") userMarks++;
    }

    const percentage = userMarks / TOTAL_MARKS;
    
    // Save progress locally
    if (percentage >= PASS_PERCENTAGE) {
        localStorage.setItem(`topic_${topicId}_done`, "true");
    }

    displayResult(topicId, userMarks, percentage);
}

function displayResult(topicId, marks, percent) {
    const display = document.getElementById(`result-${topicId}`);
    if (!display) return;
    
    const passed = percent >= PASS_PERCENTAGE;
    const passMark = Math.ceil(TOTAL_MARKS * PASS_PERCENTAGE);

    display.innerHTML = passed ? `
        <div class="card" style="border: 2px solid var(--success); text-align:center; animation: slideIn 0.5s ease;">
            <h2 style="color: var(--success);">🎉 Score: ${marks}/${TOTAL_MARKS}</h2>
            <p>Mastery Confirmed! The Game Zone is now available.</p>
            <button onclick="startGaming()" class="btn-gamify">START 10-MIN SESSION</button>
        </div>
    ` : `
        <div class="card" style="border: 2px solid var(--error); text-align:center; animation: shake 0.4s ease;">
            <h2 style="color: var(--error);">❌ Score: ${marks}/${TOTAL_MARKS}</h2>
            <p>You need at least ${passMark} marks to unlock the rewards. Review the diagrams and try again!</p>
        </div>
    `;
    
    // Scroll result into view smoothly
    display.scrollIntoView({ behavior: 'smooth' });
}

/**
 * GAME ACCESS & PERSISTENCE
 */
function startGaming() {
    const startTime = Date.now();
    localStorage.setItem('gameStartTime', startTime);
    window.location.href = 'game.html';
}

function checkGameExpiry() {
    const startTime = localStorage.getItem('gameStartTime');
    if (!startTime) return;

    const elapsed = Date.now() - parseInt(startTime);
    
    if (elapsed > GAME_TIME_LIMIT) {
        localStorage.removeItem('gameStartTime');
        alert("Your 10-minute Mastery Reward has expired. Time to return to the Lab!");
        window.location.href = 'index.html';
    }
}

/**
 * UI INITIALIZATION
 * Runs on every page load to sync progress
 */
function initProgress() {
    // 1. Check if we are on the game page
    if (window.location.pathname.includes('game.html')) {
        if (!localStorage.getItem('gameStartTime')) {
            window.location.href = 'index.html'; // Kick out if no active session
        }
        checkGameExpiry();
        // Check expiry less frequently to save CPU
        setInterval(checkGameExpiry, 5000); 
    }

    // 2. Visual feedback for completed topics in Navigation
    const topics = ['3-1', '3-2', '3-3', '3-4'];
    topics.forEach(id => {
        if (localStorage.getItem(`topic_${id}_done`) === "true") {
            // Optional: You could add a checkmark to nav links here
            console.log(`Topic ${id} completed.`);
        }
    });
}

// Global Event Listener for memory-efficient loading
document.addEventListener('DOMContentLoaded', initProgress);

// Reset Progress (Call this from console for testing)
function resetQuest() {
    localStorage.clear();
    location.reload();
}