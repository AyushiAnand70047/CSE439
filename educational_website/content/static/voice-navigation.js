// Voice Navigation System
class VoiceNavigation {
    constructor(options = {}) {
        this.options = {
            language: options.language || 'en-US',
            pages: options.pages || {},
            commandPrefix: options.commandPrefix || 'go to',
            feedbackEnabled: options.feedbackEnabled !== undefined ? options.feedbackEnabled : true,
            continuousListening: options.continuousListening !== undefined ? options.continuousListening : true
        };

        this.recognition = null;
        this.isListening = false;
        this.setupSpeechRecognition();
    }

    setupSpeechRecognition() {
        // Check browser support
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Speech recognition not supported in this browser');
            return;
        }

        // Create speech recognition instance
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();

        // Configure recognition
        this.recognition.lang = this.options.language;
        this.recognition.continuous = this.options.continuousListening;
        this.recognition.interimResults = false;

        // Set up event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('Voice navigation is listening...');
            this.updateUI('listening');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('Voice navigation stopped listening');
            this.updateUI('not-listening');

            // Restart if continuous listening is enabled
            if (this.options.continuousListening) {
                this.recognition.start();
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.updateUI('error');
        };

        this.recognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.trim().toLowerCase();

            console.log('Voice command detected:', command);
            this.processCommand(command);
        };
    }

    start() {
        if (!this.recognition) {
            console.error('Speech recognition not initialized');
            return;
        }

        if (!this.isListening) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting speech recognition:', error);
            }
        }
    }

    stop() {
        if (this.recognition && this.isListening) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
        }
    }

    processCommand(command) {
        // Check if command starts with the prefix
        if (this.options.commandPrefix && !command.startsWith(this.options.commandPrefix)) {
            console.log('Command does not start with prefix, ignoring');
            return;
        }

        // Extract the page name from the command
        let pageName = command;
        if (this.options.commandPrefix) {
            pageName = command.substring(this.options.commandPrefix.length).trim();
        }

        // Check if we have a matching page
        for (const [page, url] of Object.entries(this.options.pages)) {
            if (pageName === page.toLowerCase()) {
                // Found a match, navigate to that page
                if (this.options.feedbackEnabled) {
                    this.provideFeedback(`Redirecting to ${page}`);
                }

                // Navigate after a small delay to allow for speech feedback
                setTimeout(() => {
                    window.location.href = url;
                }, this.options.feedbackEnabled ? 1000 : 0);

                return;
            }
        }

        // No match found
        console.log('No matching page found for command:', pageName);
        if (this.options.feedbackEnabled) {
            this.provideFeedback(`I couldn't find a page matching ${pageName}`);
        }
    }

    provideFeedback(message) {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(message);
            speech.lang = this.options.language;
            window.speechSynthesis.speak(speech);
        }

        // Also log to console
        console.log('Voice feedback:', message);
    }

    updateUI(state) {
        // Update UI elements if available
        const statusElement = document.getElementById('voice-navigation-status');
        if (statusElement) {
            statusElement.dataset.state = state;

            switch (state) {
                case 'listening':
                    statusElement.textContent = 'Listening...';
                    statusElement.classList.add('active');
                    break;
                case 'not-listening':
                    statusElement.textContent = 'Voice Navigation (Inactive)';
                    statusElement.classList.remove('active');
                    break;
                case 'error':
                    statusElement.textContent = 'Voice Navigation Error';
                    statusElement.classList.remove('active');
                    statusElement.classList.add('error');
                    setTimeout(() => {
                        statusElement.classList.remove('error');
                    }, 3000);
                    break;
            }
        }
    }
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    // Create an optional UI element for voice navigation status
    const statusUI = document.createElement('div');
    statusUI.id = 'voice-navigation-status';
    statusUI.textContent = 'Voice Navigation (Inactive)';
    statusUI.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 15px;
      border-radius: 30px;
      font-size: 14px;
      z-index: 1000;
      display: flex;
      align-items: center;
      transition: all 0.3s ease;
    `;
    document.body.appendChild(statusUI);

    // Add a style for the status indicator
    const style = document.createElement('style');
    style.textContent = `
      #voice-navigation-status::before {
        content: '';
        width: 10px;
        height: 10px;
        background-color: #999;
        border-radius: 50%;
        margin-right: 10px;
        display: inline-block;
      }
      #voice-navigation-status.active::before {
        background-color: #4CAF50;
        box-shadow: 0 0 0 rgba(76, 175, 80, 0.4);
        animation: pulse 1.5s infinite;
      }
      #voice-navigation-status.error::before {
        background-color: #F44336;
      }
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
        }
      }
      
      /* Styles for the accessibility navigation button */
      #voice-nav-button {
        position: fixed;
        top: 20px;
        left: 20px;
        background-color: #4285F4;
        color: white;
        border: none;
        padding: 20px 25px;
        border-radius: 10px;
        cursor: pointer;
        z-index: 1001;
        font-size: 24px;
        font-weight: bold;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 250px;
        min-height: 60px;
        transition: all 0.3s ease;
      }
      
      #voice-nav-button:hover {
        background-color: #3367D6;
      }
      
      #voice-nav-button:focus {
        outline: 4px solid #FFC107;
        outline-offset: 2px;
      }
      
      #voice-nav-button.active {
        background-color: #EA4335;
      }
      
      /* Make the button even more accessible */
      @media screen and (max-width: 768px) {
        #voice-nav-button {
          font-size: 20px;
          padding: 15px 20px;
          min-width: 200px;
        }
      }
    `;
    document.head.appendChild(style);

    // Initialize voice navigation with site pages
    const voiceNav = new VoiceNavigation({
        language: 'en-US',
        pages: {
            "home": "/content/home/",
            "alphabet": "/content/home/basics/alphabet/",
            "numbers": "/content/home/basics/number/",
            "table": "/content/home/basics/table/",
            "practice": "/chatbot/talk/"
        },
        commandPrefix: 'go to',
        feedbackEnabled: true,
        continuousListening: true
    });

    // Add a button to start/stop voice navigation - now bigger and positioned at top left
    const toggleButton = document.createElement('button');
    toggleButton.id = 'voice-nav-button';
    toggleButton.textContent = 'Start Voice Navigation';
    toggleButton.setAttribute('aria-label', 'Start Voice Navigation');
    toggleButton.setAttribute('role', 'button');
    toggleButton.setAttribute('tabindex', '0');

    let navigationActive = false;
    let audioTimeoutId = null;

    // Function to speak text using the Speech Synthesis API
    const speakText = (text) => {
        // Cancel any previous speech
        window.speechSynthesis.cancel();
        
        // Create a new utterance
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = 'en-US';
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        
        // Speak the text
        window.speechSynthesis.speak(speech);
    };

    // Add mouseover event to speak the button's purpose
    toggleButton.addEventListener('mouseover', () => {
        // Clear any existing timeout
        if (audioTimeoutId) {
            clearTimeout(audioTimeoutId);
        }
        
        // Set a small delay to prevent repeated audio when moving the mouse over the button
        audioTimeoutId = setTimeout(() => {
            const buttonText = navigationActive ? 'Stop Voice Navigation' : 'Start Voice Navigation';
            speakText(buttonText);
        }, 200);
    });
    
    // Stop speaking when mouse leaves the button
    toggleButton.addEventListener('mouseout', () => {
        if (audioTimeoutId) {
            clearTimeout(audioTimeoutId);
            audioTimeoutId = null;
        }
        window.speechSynthesis.cancel();
    });

    toggleButton.addEventListener('click', () => {
        if (navigationActive) {
            voiceNav.stop();
            toggleButton.textContent = 'Start Voice Navigation';
            toggleButton.setAttribute('aria-label', 'Start Voice Navigation');
            toggleButton.classList.remove('active');
            navigationActive = false;
            speakText('Voice navigation stopped');
        } else {
            voiceNav.start();
            toggleButton.textContent = 'Stop Voice Navigation';
            toggleButton.setAttribute('aria-label', 'Stop Voice Navigation');
            toggleButton.classList.add('active');
            navigationActive = true;
            speakText('Voice navigation started');
        }
    });

    // Add keyboard support for better accessibility
    toggleButton.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleButton.click();
        }
    });

    document.body.appendChild(toggleButton);
    
    // Announce the presence of the voice navigation button using screen readers
    const announceElement = document.createElement('div');
    announceElement.setAttribute('role', 'status');
    announceElement.setAttribute('aria-live', 'polite');
    announceElement.style.position = 'absolute';
    announceElement.style.clip = 'rect(0 0 0 0)';
    announceElement.style.clipPath = 'inset(50%)';
    announceElement.style.height = '1px';
    announceElement.style.width = '1px';
    announceElement.style.overflow = 'hidden';
    announceElement.style.whiteSpace = 'nowrap';
    announceElement.textContent = 'Voice navigation button is available at the top left corner of the page.';
    document.body.appendChild(announceElement);
    
    // Initial audio announcement after page load
    setTimeout(() => {
        speakText('Voice navigation button is available at the top left corner of the page.');
    }, 2000);
});