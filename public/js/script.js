// Framework to enable real-time bidirectional communication
// A realtime socket allows us to communicate without explicitly
//   sending multiple HTTP/AJAX messages back and forth
// - This is the client side
const socket = io();

const speakButton = document.querySelector('.speakButton');
const inputBox = document.querySelector('.inputBox');
const clientText = document.querySelector('.clientText');
const serverText = document.querySelector('.serverText');

// Framework for voice recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

speakButton.addEventListener('click', () => {
    console.log('Started listening.');
    recognition.start();
});

recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
    console.log('Speech result has been detected.');

    const last = e.results.length - 1;
    const text = e.results[last][0].transcript;

    console.log('Confidence: ' + e.results[0][0].confidence);

    handleInput(text);
});

recognition.addEventListener('speechend', () => {
    console.log('Stopped listening.');
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    serverText.textContent = 'Error: ' + e.error;
});

inputBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        console.log('Text result has been detected');

        const text = inputBox.value;

        handleInput(text);
    }
});

function handleInput(text) {
    clientText.textContent = text;
    socket.emit('chat message', text);
}

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}

socket.on('bot reply', function (replyText) {
    synthVoice(replyText);

    if (replyText == '') replyText = '(No answer...)';
    serverText.textContent = replyText;
});

socket.on('bot error', function (errorMessage) {
    console.log(errorMessage);

    serverText.textContent = errorMessage;
});