import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
dotenv.config();

const PORT = process.env.PORT || 8000; // Changed port to 8005
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL).then(() => {
    console.log("Database is connected successfully.");
    const server = app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

    const io = new Server(server); // Set up socket.io with the server

    io.on('connection', (socket) => {
        console.log('A user connected');
        // Handle socket events here
    });
})
.catch((error) => console.log(error));

// Route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.resolve('frontend/index.html')); // Serve the index.html file
});

// This allows us to send to a mongodb database.
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: Number,
    age: Number,
});

// for user
const UserModel = mongoose.model("users", userSchema);

app.get("/getUsers", async (req, res) => {
    const userData = await UserModel.find();
    res.json(userData);
});

// Set static folder
app.use(express.static(path.resolve('frontend')));
