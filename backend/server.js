const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Create a message schema
const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    // Load previous messages
    Message.find().sort({ timestamp: 1 }).exec((err, messages) => {
        if (err) throw err;
        socket.emit('previousMessages', messages);
    });

    // Listen for new messages
    socket.on('chatMessage', (msg) => {
        const newMessage = new Message(msg);
        newMessage.save()
            .then(() => {
                io.emit('chatMessage', msg); // Broadcast the message to all clients
            })
            .catch(err => console.log(err));
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});