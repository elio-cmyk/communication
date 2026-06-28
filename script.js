// Configuration
const CORRECT_CODE = "ADASTRA";
const MAX_ATTEMPTS = 5;
const AUDIO_FILE = "voicertool_audio_Henri_28-06-2026_at_17_29_19_on_June_28th_2026.mp3";

// State
let attempts = 0;
let isLocked = false;
let hintsShown = false;

// DOM Elements - déclarés après le chargement
let codeInput;
let sendBtn;
let feedback;
let successModal;
let errorModal;
let timeDisplay;
let audioBtn;
let audioElement;
let visualizer;
let hintsContainer;

// Initialize DOM elements
function initDOMElements() {
    codeInput = document.getElementById('code-input');
    sendBtn = document.getElementById('send-btn');
    feedback = document.getElementById('feedback');
    successModal = document.getElementById('success-modal');
    errorModal = document.getElementById('error-modal');
    timeDisplay = document.getElementById('time');
    audioBtn = document.getElementById('audio-btn');
    audioElement = document.getElementById('encoded-audio');
    visualizer = document.getElementById('visualizer');
    hintsContainer = document.getElementById('hints-container');
    
    console.log('DOM Elements initialized:', {
        codeInput: !!codeInput,
        sendBtn: !!sendBtn,
        audioBtn: !!audioBtn,
        hintsContainer: !!hintsContainer
    });
}

// Show hints
function showHints() {
    if (hintsContainer && !hintsShown) {
        hintsContainer.style.display = 'block';
        hintsShown = true;
        console.log('Hints shown');
    }
}

// Update time display
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

// Initialize
function init() {
    console.log('Initializing app...');
    
    initDOMElements();
    
    if (!audioElement) {
        console.error('Audio element not found');
        return;
    }
    
    updateTime();
    setInterval(updateTime, 1000);
    
    // Set audio source
    audioElement.src = AUDIO_FILE;
    console.log('Audio source set to:', AUDIO_FILE);
    
    // Event listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            console.log('Send button clicked');
            checkCode();
        });
    }
    
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            console.log('Audio button clicked');
            toggleAudio();
        });
    }
    
    if (codeInput) {
        codeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !isLocked) {
                checkCode();
            }
        });
    }
    
    // Audio events
    if (audioElement) {
        audioElement.addEventListener('play', onAudioPlay);
        audioElement.addEventListener('pause', onAudioPause);
        audioElement.addEventListener('ended', onAudioEnd);
    }
    
    // Focus on input
    if (codeInput) {
        codeInput.focus();
    }
    
    console.log('App initialized successfully');
}

// Toggle audio playback
function toggleAudio() {
    console.log('Toggle audio called, paused:', audioElement.paused);
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
    console.log('Audio playing');
    if (audioBtn) {
        audioBtn.classList.add('playing');
        audioBtn.textContent = '⏹️ ARRÊTER';
    }
    if (visualizer) {
        visualizer.classList.add('active');
    }
}

// Audio paused
function onAudioPause() {
    console.log('Audio paused');
    if (audioBtn) {
        audioBtn.classList.remove('playing');
        audioBtn.textContent = '🔊 RÉÉCOUTER LE MESSAGE';
    }
    if (visualizer) {
        visualizer.classList.remove('active');
    }
}

// Audio ended
function onAudioEnd() {
    console.log('Audio ended');
    if (audioBtn) {
        audioBtn.classList.remove('playing');
        audioBtn.textContent = '🔊 RÉÉCOUTER LE MESSAGE';
    }
    if (visualizer) {
        visualizer.classList.remove('active');
    }
}

// Check code
function checkCode() {
    console.log('Checking code...');
    if (isLocked) return;
    
    const inputCode = codeInput.value.trim().toUpperCase();
    console.log('Input code:', inputCode);
    
    // Validate input
    if (inputCode.length === 0) {
        showFeedback('Veuillez entrer un code', 'error');
        return;
    }
    
    attempts++;
    
    // Check if correct
    if (inputCode === CORRECT_CODE) {
        console.log('Code correct!');
        success();
        return;
    }
    
    // Check if max attempts reached
    if (attempts >= MAX_ATTEMPTS) {
        console.log('Max attempts reached');
        locked();
        return;
    }
    
    // Wrong code
    wrong(inputCode);
}

// Wrong code feedback
function wrong(inputCode) {
    console.log('Wrong code:', inputCode);
    showFeedback(`Code incorrect. Tentatives restantes: ${MAX_ATTEMPTS - attempts}`, 'error');
    codeInput.value = '';
    
    // Show hints after first error
    showHints();
    
    // Visual feedback
    codeInput.classList.add('shake');
    setTimeout(() => {
        codeInput.classList.remove('shake');
    }, 500);
    
    codeInput.focus();
}

// Success
function success() {
    console.log('Success!');
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
    if (statusIndicator) {
        statusIndicator.classList.remove('offline');
        statusIndicator.classList.add('online');
        statusIndicator.textContent = '● EN LIGNE';
    }
    
    // Show success modal
    setTimeout(() => {
        if (successModal) {
            successModal.classList.add('show');
        }
    }, 500);
    
    // Play success animation
    playSuccessAnimation();
}

// Locked (too many attempts)
function locked() {
    console.log('System locked');
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
        if (errorModal) {
            errorModal.classList.add('show');
        }
    }, 1000);
}

// Show feedback
function showFeedback(message, type) {
    console.log('Feedback:', message, type);
    if (feedback) {
        feedback.textContent = message;
        feedback.className = `feedback ${type}`;
    }
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
    if (errorModal) {
        errorModal.classList.remove('show');
    }
}

// Start the app
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - starting initialization');
    init();
});

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to play/stop audio
    if (e.key === 'Escape' && audioBtn) {
        toggleAudio();
    }
});

// Fallback initialization if DOM ready before script loads
if (document.readyState === 'loading') {
    console.log('Document still loading');
} else {
    console.log('Document already loaded - initializing now');
    init();
}
