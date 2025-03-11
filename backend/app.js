import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { setupDatabase, pool } from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('combined'));

// Initialize Database First
setupDatabase()
  .then(() => {
    app.locals.db = pool; // Store pool for later use in routes
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Server startup failed:', err);
  });

// Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 3,
//   message: 'Too many requests from this IP, please try again later.',
// });
// app.use(limiter);

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Centralized Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// User Registration
app.post(
  '/api/register',
  [
    body('firstname').isString().notEmpty(),
    body('lastname').isString().notEmpty(),
    body('email').isEmail(),
    body('password'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { firstname, lastname, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await pool.execute(
        'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)',
        [firstname, lastname, email, hashedPassword]
      );

      res.status(201).json({ message: 'User registered successfully', userId: result.insertId });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



// User Login
app.post(
  '/api/login',
  body('email').isEmail(),
  body('password'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;

      const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('jwt',
          token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Secure in production
          sameSite: 'strict', // Prevent CSRF attacks
          maxAge: 300000
        });
        res.json({ message: 'Login successful', firstName: user.firstname });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

// User Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('jwt');
  res.json({ message: 'Logout successful' });
});

// User CRUD Operations (Protected)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute('SELECT id, firstname, lastname, email FROM users');
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get('/api/users/:id', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [users] = await pool.execute('SELECT id, firstname, lastname, email FROM users WHERE id = ?', [id]);
//     if (users.length === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json(users[0]);
//   } catch (error) {
//     console.error('Get user by id error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.put('/api/users/:id', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { firstname, lastname, email } = req.body;

//     await pool.execute('UPDATE users SET firstname = ?, lastname = ?, email = ? WHERE id = ?', [
//       firstname,
//       lastname,
//       email,
//       id,
//     ]);
//     res.json({ message: 'User updated successfully' });
//   } catch (error) {
//     console.error('Update user error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// app.delete('/api/users/:id', authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     await pool.execute('DELETE FROM users WHERE id = ?', [id]);
//     res.json({ message: 'User deleted successfully' });
//   } catch (error) {
//     console.error('Delete user error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });
