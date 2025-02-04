function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.rate = 1; // Normal speaking rate
    window.speechSynthesis.speak(speech);
}