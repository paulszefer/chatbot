// Framework to enable real-time bidirectional communication
// A realtime socket allows us to communicate without explicitly
//   sending multiple HTTP/AJAX messages back and forth
// - This is the client side
const socket = io();

const speakButton = document.querySelector('.speakButton');
const inputBox = document.querySelector('.inputBox');

// Framework for voice recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.isListening = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

speakButton.addEventListener('click', () => {
    if (!recognition.isListening) {
        console.log('Started listening.');
        recognition.isListening = true;
        recognition.start();
    } else {
        console.log('Stopped listening.');
        recognition.isListening = false;
        recognition.abort();
    }
});

recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
    console.log('Speech result has been detected.');
    recognition.isListening = false;

    const last = e.results.length - 1;
    const text = e.results[last][0].transcript;

    console.log('User said: ' + text);
    console.log('Confidence: ' + e.results[0][0].confidence);

    handleInput(text);
});

recognition.addEventListener('speechend', () => {
    console.log('End of speech has been detected.');
    recognition.isListening = false;
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    console.error('Error: ' + e.error);
    recognition.isListening = false;
});

inputBox.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        console.log('Text result has been detected');

        const text = inputBox.value;

        console.log('User said: ' + text);

        handleInput(text);
    }
});

function handleInput(text) {
    addLocalMessage(text);
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
    addRemoteMessage(replyText);
});

socket.on('bot error', function (errorMessage) {
    console.error(errorMessage);
    addRemoteMessage(errorMessage);
});

////

function addRemoteMessage(text) {
    const chatContainer = document.getElementsByClassName('chat-container')[0];
    const newMessageRow = generateRemoteMessageRow(text);
    chatContainer.appendChild(newMessageRow);
}

function addLocalMessage(text) {
    const chatContainer = document.getElementsByClassName('chat-container')[0];
    const newMessageRow = generateLocalMessageRow(text);
    chatContainer.appendChild(newMessageRow);
}

function generateRemoteMessageRow(text) {
    const row = generateRow();
    const message = generateMessage(text);
    message.classList.add('chat-bubble-left');
    row.appendChild(message);
    return row;
}

function generateLocalMessageRow(text) {
    const row = generateRow();
    const message = generateMessage(text);
    message.classList.add('chat-bubble-right');
    row.appendChild(message);
    return row;
}

function generateRow() {
    const row = document.createElement('div');
    row.classList.add('chat-row');
    return row;
}

function generateMessage(text) {
    const message = document.createElement('div');
    message.classList.add('chat-bubble');
    message.textContent = text;
    return message;
}

addRemoteMessage('hey');
addRemoteMessage('how\'s it going');
addLocalMessage('not bad');
addLocalMessage('you?');
addRemoteMessage('pretty good');
addLocalMessage('that\'s good');