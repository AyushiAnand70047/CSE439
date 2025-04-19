document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const cameraContainer = document.getElementById('camera-container');
    const messageDiv = document.getElementById('message');
    const scanStatus = document.querySelector('.scan-status');
    const scanText = document.querySelector('.scan-text');
    const progressBar = document.getElementById('progress-bar');
    
    let loginAttemptInProgress = false;
    let captureInterval = null;
    let loginTimeout = null;
    
    // Function to get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Show message with styling
    function showMessage(message, type = 'normal') {
        messageDiv.textContent = message;
        messageDiv.className = '';
        
        if (type === 'error') {
            messageDiv.classList.add('error-message');
        } else if (type === 'success') {
            messageDiv.classList.add('success-message');
        } else if (type === 'processing') {
            messageDiv.classList.add('processing-message');
        }
    }
    
    // Request camera access
    async function setupCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            
            return new Promise((resolve) => {
                video.onloadedmetadata = () => {
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    resolve(true);
                };
            });
        } catch (err) {
            console.error('Error accessing camera:', err);
            showMessage('Camera access denied. Please check permissions.', 'error');
            scanStatus.textContent = 'ERROR';
            scanText.textContent = 'NO CAMERA';
            return false;
        }
    }
    
    // Capture face from video stream
    function captureFrame() {
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg');
    }
    
    // Reset login state
    function resetLoginState() {
        loginAttemptInProgress = false;
        clearInterval(captureInterval);
        clearTimeout(loginTimeout);
        progressBar.style.width = '0%';
        scanStatus.textContent = 'SCANNING';
        scanText.textContent = 'FACE DETECTION';
        cameraContainer.classList.remove('scanner-active');
    }
    
    // Send captured image to server for face recognition
    async function sendFaceForRecognition(imageData) {
        if (loginAttemptInProgress) return;
        
        loginAttemptInProgress = true;
        cameraContainer.classList.add('scanner-active');
        scanStatus.textContent = 'VERIFYING';
        scanText.textContent = 'PLEASE WAIT';
        showMessage('Verifying your identity...', 'processing');
        
        // Animate progress bar
        progressBar.style.width = '100%';
        
        try {
            const response = await fetch('/accounts/login/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ face_image: imageData })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                scanStatus.textContent = 'ACCESS GRANTED';
                scanText.textContent = 'WELCOME';
                showMessage('Login successful! Redirecting...', 'success');
                
                // Stop video stream
                const stream = video.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                
                // Redirect to home page
                setTimeout(() => {
                    window.location.href = '/content/home/';
                }, 2000);
            } else {
                scanStatus.textContent = 'ACCESS DENIED';
                scanText.textContent = 'RETRY';
                showMessage(data.message || 'Login failed. Retrying...', 'error');
                
                // Reset after delay
                setTimeout(() => {
                    resetLoginState();
                    startFaceRecognition();
                }, 3000);
            }
        } catch (error) {
            scanStatus.textContent = 'CONNECTION ERROR';
            scanText.textContent = 'RETRY';
            showMessage('Network error. Please try again.', 'error');
            
            // Reset after delay
            setTimeout(() => {
                resetLoginState();
                startFaceRecognition();
            }, 3000);
        }
    }
    
    // Periodic face capture and recognition
    async function startFaceRecognition() {
        const cameraReady = await setupCamera();
        if (!cameraReady) return;
        
        showMessage('Detecting face... Please look at the camera.', 'processing');
        
        // Wait 2 seconds before first attempt to ensure camera is initialized
        setTimeout(() => {
            // Attempt face recognition every 5 seconds
            captureInterval = setInterval(() => {
                try {
                    if (!loginAttemptInProgress) {
                        const imageData = captureFrame();
                        sendFaceForRecognition(imageData);
                    }
                } catch (error) {
                    console.error('Error during face capture:', error);
                }
            }, 5000);
            
            // Initial capture
            const imageData = captureFrame();
            sendFaceForRecognition(imageData);
        }, 2000);
    }
    
    // Voice feedback function
    window.speak = function(message) {
        try {
            if (window.speechSynthesis) {
                const utterance = new SpeechSynthesisUtterance(message);
                window.speechSynthesis.speak(utterance);
            }
        } catch (error) {
            console.error('Speech synthesis error:', error);
        }
    };
    
    // Start automatic face recognition when page loads
    startFaceRecognition();
});