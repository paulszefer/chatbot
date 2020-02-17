// Framework to use environment variables
const dotenv = require('dotenv');
dotenv.config();

// Framework to generate unique identifiers
const uuidGenerator = require('uuid/v1');

// Environment Variables
const APIAI_API_KEY = process.env.APIAI_API_KEY;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID || uuidGenerator();

// Framework to manage a web application server
const express = require('express');
const app = express();

// Serve static files for the webpage
app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

// Start the Express server to handle requests
const server = app.listen(process.env.PORT || 5000,
  () => console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env));

// Serve the Web UI when requested
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// Framework to enable real-time bidirectional communication
// - A realtime socket allows us to communicate without explicitly
//   sending multiple HTTP/AJAX messages back and forth
// - This is the server side
const io = require('socket.io')(server);

// Framework to handle input and respond with messages
const apiai = require('apiai')(APIAI_API_KEY);
const session = { sessionId: APIAI_SESSION_ID };

io.on('connection', function (socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Send the client message to API.ai to get a response
    let apiaiReq = apiai.textRequest(text, session);
    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
      socket.emit('bot error', 'Something went wrong. Please try again.');
    });

    apiaiReq.end();
  });
});