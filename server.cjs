const express = require('express');
const {MongoClient, ObjectId} = require('mongodb');
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
        db = client.db(process.env.MONGODB_DB_NAME || 'finance_tracker');
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

// API Endpoints
app.get('/api/test-connection', async (req, res) => {
    try {
        await client.db().admin().ping();
        res.json({success: true, message: 'MongoDB connection successful'});
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'MongoDB connection failed',
            error: err.message
        });
    }
});

// Initialize database
app.get('/api/init-database', async (req, res) => {
    try {
        // Ensure collections exist
        await db.createCollection('categories');
        await db.createCollection('transactions');
        await db.createCollection('users');

        // Create default admin user if none exists
        const adminUser = await db.collection('users').findOne({ role: 'admin' });
        if (!adminUser) {
            await db.collection('users').insertOne({
                username: 'admin',
                password: 'admin123', // In production, use hashed passwords
                role: 'admin'
            });
        }

        res.json({ success: true, message: 'Database initialized successfully' });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to initialize database',
            error: err.message
        });
    }
});

// Categories endpoints
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await db.collection('categories').find({}).toArray();
        res.json(categories);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const result = await db.collection('categories').insertMany(req.body);
        res.json({success: true, insertedCount: result.insertedCount});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.put('/api/categories', async (req, res) => {
    try {
        // Replace all categories
        await db.collection('categories').deleteMany({});
        if (req.body.length > 0) {
            await db.collection('categories').insertMany(req.body);
        }
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Transactions endpoints
app.get('/api/transactions', async (req, res) => {
    try {
        const transactions = await db.collection('transactions').find({}).toArray();
        res.json(transactions);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.post('/api/transactions', async (req, res) => {
    try {
        const result = await db.collection('transactions').insertMany(req.body);
        res.json({success: true, insertedCount: result.insertedCount});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.put('/api/transactions', async (req, res) => {
    try {
        // Replace all transactions
        await db.collection('transactions').deleteMany({});
        if (req.body.length > 0) {
            await db.collection('transactions').insertMany(req.body);
        }
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// Users endpoints
app.get('/api/users', async (req, res) => {
    try {
        const users = await db.collection('users').find({}).toArray();
        const formattedUsers = users.map(user => ({
            id: user._id, // Use MongoDB's _id as the ID
            username: user.username,
            role: user.role
        }));
        res.json(formattedUsers);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const result = await db.collection('users').insertMany(req.body);
        res.json({success: true, insertedCount: result.insertedCount});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.put('/api/users', async (req, res) => {
    try {
        // Replace all users
        await db.collection('users').deleteMany({});
        if (req.body.length > 0) {
            await db.collection('users').insertMany(req.body);
        }
        res.json({success: true});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

app.post('/api/users/create', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = await db.collection('users').insertOne({
            username,
            password, // Note: In production, password should be hashed
            role,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        res.json({ success: true, user: { id: user.insertedId, username, role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    try {
        const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
    const port = process.env.PORT || 3001;
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});
