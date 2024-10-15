// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection
const mongoURI = 'mongodb+srv://admin:admin@cluster0.uzlo2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the public directory

// User Schema
const userSchema = new mongoose.Schema({
    fullName: String,
    mobile: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model('User', userSchema);

// Sign Up Route
app.post('/api/auth/signup', async (req, res) => {
    const { fullName, mobile, email, password } = req.body;
    
    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        // Create and save the new user
        const newUser = new User({ fullName, mobile, email, password });
        await newUser.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during sign-up:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Sign In Route
app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Find user by email and password
        const user = await User.findOne({ email, password });
        if (user) {
            // Return token (you can implement JWT for a real app)
            res.status(200).json({ token: 'dummy-token', message: 'Signed in successfully' });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error during sign-in:', error);
        res.status(500).json({ message: 'Error signing in' });
    }
});

// Forgot Password Route
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (user) {
            // Logic to handle password reset (e.g., send email with reset link)
            res.status(200).json({ message: 'Password reset link sent to your email' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ message: 'Error processing forgot password request' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
