// Configuration
const CORRECT_CODE = "ADASTRA";
const MAX_ATTEMPTS = 5;
// Utilisez le nom exact de votre fichier audio VoiceTool
const AUDIO_FILE = "voicertool_audio_Henri_28-06-2026_at_17_29_19_on_June_28th_2026.mp3";

// State
let attempts = 0;
let isLocked = false;

// DOM Elements
const codeInput = document.getElementById('code-input');
const sendBtn = document.getElementById('send-btn');
const feedback = document.getElementById('feedback');
const successModal = document.getElementById('success-modal');
const errorModal = document.getElementById('error-modal');
const timeDisplay = document.getElementById('time');
const audioBtn = document.getElementById('audio-btn');
const audioElement = document.getElementById('encoded-audio');
const visualizer = document.getElementById('visualizer');

// Update time display
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Initialize
function init() {
    updateTime();
    setInterval(updateTime, 1000);
    
    // Set audio source
    audioElement.src = AUDIO_FILE;
    
    // Event listeners
    sendBtn.addEventListener('click', checkCode);
    audioBtn.addEventListener('click', toggleAudio);
    codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !isLocked) {
            checkCode();
        }
    });
    
    // Audio events
    audioElement.addEventListener('play', onAudioPlay);
    audioElement.addEventListener('pause', onAudioPause);
    audioElement.addEventListener('ended', onAudioEnd);
    
    // Focus on input
    codeInput.focus();
}

// Toggle audio playback
function toggleAudio() {
    if (audioElement.paused) {
        audioElement.play().catch(error => {
            console.error('Erreur lors de la lecture:', error);
            showFeedback('Erreur lors de la lecture du message', 'error');
        });
    } else {
        audioElement.pause();
    }
}

// Audio playing
function onAudioPlay() {
    audioBtn.classList.add('playing');
    audioBtn.textContent = '⏹️ ARRÊTER';
    visualizer.classList.add('active');
}

// Audio paused
function onAudioPause() {
    audioBtn.classList.remove('playing');
    audioBtn.textContent = '🔊 RÉÉCOUTER LE MESSAGE';
    visualizer.classList.remove('active');
}

// Audio ended
function onAudioEnd() {
    audioBtn.classList.remove('playing');
    audioBtn.textContent = '🔊 RÉÉCOUTER LE MESSAGE';
    visualizer.classList.remove('active');
}

// Check code
function checkCode() {
    if (isLocked) return;
    
    const inputCode = codeInput.value.trim().toUpperCase();
    
    // Validate input
    if (inputCode.length === 0) {
        showFeedback('Veuillez entrer un code', 'error');
        return;
    }
    
    attempts++;
    
    // Check if correct
    if (inputCode === CORRECT_CODE) {
        success();
        return;
    }
    
    // Check if max attempts reached
    if (attempts >= MAX_ATTEMPTS) {
        locked();
        return;
    }
    
    // Wrong code
    wrong(inputCode);
}

// Wrong code feedback
function wrong(inputCode) {
    showFeedback(`Code incorrect. Tentatives restantes: ${MAX_ATTEMPTS - attempts}`, 'error');
    codeInput.value = '';
    
    // Visual feedback
    codeInput.classList.add('shake');
    setTimeout(() => {
        codeInput.classList.remove('shake');
    }, 500);
    
    codeInput.focus();
}

// Success
function success() {
    isLocked = true;
    sendBtn.disabled = true;
    codeInput.disabled = true;
    audioBtn.disabled = true;
    
    // Stop audio if playing
    if (!audioElement.paused) {
        audioElement.pause();
    }
    
    // Update console header
    const statusIndicator = document.querySelector('.status-indicator');
    statusIndicator.classList.remove('offline');
    statusIndicator.classList.add('online');
    statusIndicator.textContent = '● EN LIGNE';
    
    // Show success modal
    setTimeout(() => {
        successModal.classList.add('show');
    }, 500);
    
    // Play success animation
    playSuccessAnimation();
}

// Locked (too many attempts)
function locked() {
    isLocked = true;
    sendBtn.disabled = true;
    codeInput.disabled = true;
    audioBtn.disabled = true;
    
    // Stop audio if playing
    if (!audioElement.paused) {
        audioElement.pause();
    }
    
    showFeedback('Trop de tentatives. Système verrouillé.', 'error');
    
    // Show error modal
    setTimeout(() => {
        errorModal.classList.add('show');
    }, 1000);
}

// Show feedback
function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `feedback ${type}`;
}

// Play success animation
function playSuccessAnimation() {
    const consoleContent = document.querySelector('.console-content');
    
    // Add success text
    const successText = document.createElement('p');
    successText.style.color = '#00ff00';
    successText.style.textAlign = 'center';
    successText.style.marginTop = '20px';
    successText.style.fontSize = '1.1em';
    successText.style.animation = 'slideIn 0.5s ease-out';
    successText.innerHTML = '> 🛰️ Reconnexion établie avec l\'ISS<br>> Transmission de données active<br>> Tous les systèmes nominal';
    consoleContent.appendChild(successText);
}

// Close modal
function closeModal() {
    errorModal.classList.remove('show');
}

// Start the app
document.addEventListener('DOMContentLoaded', init);

// Add some easter eggs
document.addEventListener('keydown', (e) => {
    // Escape to play/stop audio
    if (e.key === 'Escape') {
        toggleAudio();
    }
});
