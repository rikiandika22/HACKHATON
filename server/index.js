const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const db = require('./db');
const authenticateToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Routes
app.get('/', (req, res) => {
    res.send('Autospec API is running');
});

// --- AUTHENTICATION --- //

// 1. Register User
app.post('/api/auth/register', async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // Basic validation
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Semua kolom harus diisi' });
        }

        // Check if user already exists
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert user into database
        const insertQuery = `
      INSERT INTO users (full_name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, full_name, email
    `;
        const newUser = await db.query(insertQuery, [fullName, email, passwordHash]);

        // Create JWT Token
        const token = jwt.sign(
            { id: newUser.rows[0].id, email: newUser.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'Registrasi berhasil',
            token,
            user: newUser.rows[0],
        });
    } catch (err) {
        console.error('Error in register:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// 2. Login User
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Email dan password harus diisi' });
        }

        // Find the user by email
        const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        const user = userQuery.rows[0];

        // Check password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Email atau password salah' });
        }

        // Passwords match, create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login berhasil',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
            },
        });
    } catch (err) {
        console.error('Error in login:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// 3. Get Current User Profile (Protected Route)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        // req.user has { id, email } from the decoded token
        const userQuery = await db.query('SELECT id, full_name, email FROM users WHERE id = $1', [req.user.id]);

        if (userQuery.rows.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }

        res.json(userQuery.rows[0]);
    } catch (err) {
        console.error('Error getting user profile:', err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Autospec Backend running on http://localhost:${PORT}`);
});
