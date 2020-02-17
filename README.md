# ChatBot

A simple ChatBot implementation built to create an environment for people to practice communication skills (through speech - hearing/speaking, text - reading/writing).

## Technologies
* **Node.js, Express**
    * Handles the backend server that serves the UI upon request and passes messages from the user to the ChatBot API and back to the user
    * [Node.js](https://nodejs.org/en/)
    * [Express](https://expressjs.com/), [npm - Express](https://www.npmjs.com/package/express)
* **DialogFlow, Api.ai**
    * ChatBot API (and Node package) to process messages sent by the client and return responses
    * [DialogFlow](https://dialogflow.com/)
    * [npm - Api.ai](https://www.npmjs.com/package/apiai)
* **Socket.IO**
    * Support for real-time bidirectional communication between clients
    * [Socket.IO](https://socket.io/)
    * [npm - Socket.IO](https://www.npmjs.com/package/socket.io)
* **Dotenv**
    * Loads environment variables from a static .env file into process.env so they can be retrieved at runtime
    * [npm - Dotenv](https://www.npmjs.com/package/dotenv)
* **uuid**
    * Generates unique session IDs
    * [npm - uuid](https://www.npmjs.com/package/uuid)

Thanks to:
* https://www.smashingmagazine.com/2017/08/ai-chatbot-web-speech-api-node-js/
    * For providing a wonderful tutorial on creating a ChatBot interface and backend
* https://github.com/girliemac/web-speech-ai
    * For putting together the above tutorial