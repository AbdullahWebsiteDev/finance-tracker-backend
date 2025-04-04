const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection URI - using the provided URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
let db;

// Connect to MongoDB
async function connectToMongo() {
    try {
        await client.connect();
        db = client.db(process.env.MONGODB_DB_NAME);
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    }
}

// API Endpoints
app.get('/api/test-connection', async (req, res) => {
    try {
        await client.db().admin().ping();
        res.json({ success: true, message: 'MongoDB connection successful' });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'MongoDB connection failed',
            error: err.message,
        });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await db.collection('users').findOne({ username });

        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // In a real app, you'd compare hashed passwords
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Don't send password back to client
        const { password: _, ...userData } = user;
        res.json({ data: userData });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Initialize and start server
connectToMongo().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
