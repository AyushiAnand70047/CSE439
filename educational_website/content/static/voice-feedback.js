// Global variable to track if speaking is allowed
let canSpeak = true;

function speak(text) {
    // Only speak if allowed
    if (canSpeak) {
        // Create and configure speech utterance
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US';
        speech.rate = 1;
        
        // Speak the text
        window.speechSynthesis.speak(speech);
        
        // Disable speaking for 5 seconds
        canSpeak = false;
        
        // Update button appearance if it exists
        const speakButton = document.getElementById('speakButton');
        if (speakButton) {
            speakButton.disabled = true;
            speakButton.classList.add('disabled');
        }
        
        // Show countdown if element exists
        startCountdown();
        
        // Re-enable speaking after 5 seconds
        setTimeout(() => {
            canSpeak = true;
            
            // Reset button appearance
            if (speakButton) {
                speakButton.disabled = false;
                speakButton.classList.remove('disabled');
            }
            
            // Reset countdown display
            const countdownElement = document.getElementById('countdown');
            if (countdownElement) {
                countdownElement.textContent = '';
            }
        }, 5000);
    }
}

// Function to display countdown timer
function startCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;
    
    let secondsLeft = 2;
    
    // Display initial countdown
    countdownElement.textContent = `Please wait ${secondsLeft} seconds`;
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
        secondsLeft--;
        
        if (secondsLeft > 0) {
            countdownElement.textContent = `Please wait ${secondsLeft} seconds`;
        } else {
            countdownElement.textContent = 'Ready to speak again';
            clearInterval(countdownInterval);
        }
    }, 1000);
}