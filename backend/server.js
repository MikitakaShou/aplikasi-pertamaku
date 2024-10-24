import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  optionsSuccessStatus: 200,
}));

const connection = new sqlite3.Database('./db/aplikasi.db');

// Endpoint untuk mendapatkan user berdasarkan ID
app.get('/api/user/:id', (req, res) => {
  const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
  console.log(query);
  connection.get(query, (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    if (!result) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(result);
    }
  });
});

// Endpoint untuk mengubah email berdasarkan ID user
app.post('/api/user/:id/change-email', (req, res) => {
  const newEmail = req.body.email;
  const query = `UPDATE users SET email = '${newEmail}' WHERE id = ${req.params.id}`;

  connection.run(query, function (err) {
    if (err) {
      res.status(500).json({ error: 'Database error' });
      return;
    }
    if (this.changes === 0) {
      res.status(404).send('User not found');
    } else {
      res.status(200).send('Email updated successfully');
    }
  });
});

// Endpoint untuk mengakses file berdasarkan query parameter 'name'
app.get('/api/file', (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, 'files', req.query.name);
  res.sendFile(filePath);
});

// Menjalankan server di port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
