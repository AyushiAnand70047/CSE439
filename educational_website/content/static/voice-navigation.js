function startVoiceRecognition() { 
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Set language to English (US)
    recognition.interimResults = false; // Process only final results
    recognition.maxAlternatives = 1; // Get only the most probable result

    recognition.start(); // Start speech recognition

    // Event triggered when speech is recognized
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        handleVoiceCommand(transcript); // Process the recognized command
    };

    // Restart recognition automatically after it ends
    recognition.onend = () => {
        recognition.start();
    };

    // Restart recognition if an error occurs
    recognition.onerror = () => {
        recognition.start();
    };
}

// Function to handle recognized voice commands
function handleVoiceCommand(command) {
    const actions = {
        'home': '/',
        'about': '/about/',
        'contact': '/contact/',
    };

    // Redirect to the corresponding URL if the command exists
    if (actions[command]) {
        window.location.href = actions[command];
    }
}

// Start voice recognition when the page loads
window.onload = startVoiceRecognition;