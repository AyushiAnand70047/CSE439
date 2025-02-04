document.addEventListener('DOMContentLoaded',function(){
    const hoverElements = document.querySelectorAll('.hover-speak');

    hoverElements.forEach(element => {
        element.addEventListener('mouseover',function(){
            const text = element.getAttribute('data-text');
            speak(text);
        });
    });
    function speak(text){
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    }
});