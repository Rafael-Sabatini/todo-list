const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

// Create a connection to your MySQL database
const db = mysql.createConnection({
    host: 'localhost',    // or '127.0.0.1'
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'TodoDB'
});

// Test the database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.get('/api/items', (req, res) => {
    const query = 'SELECT * FROM tarefas';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching items:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
});

app.get('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM tarefas WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching item:', err);
            return res.status(500).json({ error: 'Database query error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(results[0]);
    });
});

app.post('/api/items', (req, res) => {
    const { tarefa_nome, tarefa_desc, tarefa_completo } = req.body;
    const query = `
    INSERT INTO tarefas (tarefa_nome, tarefa_desc, tarefa_completo)
    VALUES (?, ?, ?)
  `;
    db.query(query, [tarefa_nome, tarefa_desc, tarefa_completo], (err, result) => {
        if (err) {
            console.error('Error inserting item:', err);
            return res.status(500).json({ error: 'Database insertion error' });
        }
        // Insert was successful
        res.status(201).json({ message: 'Item created successfully', insertedId: result.insertId });
    });
});

app.put('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const { tarefa_nome, tarefa_desc, tarefa_completo } = req.body;
    const query = `
    UPDATE tarefas
    SET tarefa_nome = ?, tarefa_desc = ?, tarefa_completo = ?
    WHERE id = ?
  `;
    db.query(query, [tarefa_nome, tarefa_desc, tarefa_completo, id], (err, result) => {
        if (err) {
            console.error('Error updating item:', err);
            return res.status(500).json({ error: 'Database update error' });
        }
        if (result.affectedRows === 0) {
            // No row found with that ID
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully' });
    });
});

// COMPLETE TASK SET DATE

app.put('/api/items/:id/complete', (req, res) => {
    const { id } = req.params;
    const { tarefa_completo, data_conclusao } = req.body;
    const query = `
    UPDATE tarefas
    SET tarefa_completo = true, data_conclusao = NOW()
    WHERE id = ?
  `;
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error updating item:', err);
            return res.status(500).json({ error: 'Database update error' });
        }
        if (result.affectedRows === 0) {
            // No row found with that ID
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully' });
    });
});

app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tarefas WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error deleting item:', err);
            return res.status(500).json({ error: 'Database deletion error' });
        }
        if (result.affectedRows === 0) {
            // No row found with that ID
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully' });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
