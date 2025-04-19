

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const messageDiv = document.getElementById('message');

// Request camera access
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        return new Promise((resolve) => {
            video.onloadedmetadata = () => {
                resolve(true);
            };
        });
    } catch (err) {
        console.error('Error accessing camera:', err);
        showMessage('Camera access denied. Please check permissions.', 'error');
        return false;
    }
}

// Show message with styling
function showMessage(message, type = 'normal') {
    messageDiv.textContent = message;
    messageDiv.className = type === 'error' ? 'error-message' :
        type === 'success' ? 'success-message' : '';
}

// Capture face from video stream
function captureFrame() {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
}

// Send captured image to server for face recognition
async function sendFaceForRecognition(imageData) {
    try {
        showMessage('Verifying face...', 'normal');

        const response = await axios.post('/accounts/login/',
            { face_image: imageData },
            {
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.status === 'success') {
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
            return true;
        } else {
            // Show error message from server
            showMessage(response.data.message || 'Login failed', 'error');
            return false;
        }
    } catch (error) {
        // Detailed error handling
        const errorMessage = error.response
            ? (error.response.data.message || 'Server error during login')
            : 'Network error. Please try again.';

        showMessage(errorMessage, 'error');
        return false;
    }
}

// Periodic face capture and recognition
async function startFaceRecognition() {
    const cameraReady = await setupCamera();
    if (!cameraReady) return;

    setInterval(async () => {
        const imageData = captureFrame();
        await sendFaceForRecognition(imageData);
    }, 4000);  // Capture and check every 4 seconds
}

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

// Start face recognition when page loads
startFaceRecognition();

// Voice navigation and feedback scripts
function speak(message) {
    try {
        if (window.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(message);
            window.speechSynthesis.speak(utterance);
        }
    } catch (error) {
        console.error('Speech synthesis error:', error);
    }
}
