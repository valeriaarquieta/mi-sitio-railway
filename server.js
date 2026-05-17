const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'site')));
app.use(express.json());

const db = new sqlite3.Database('./database.db');

// Crear tabla
db.run("CREATE TABLE IF NOT EXISTS tareas (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, descripcion TEXT)");

// Consultar todas
app.get('/tareas', (req, res) => {
  db.all("SELECT * FROM tareas", [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// Consultar una
app.get('/tareas/:id', (req, res) => {
  db.get("SELECT * FROM tareas WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).send(err);
    res.json(row);
  });
});

// Agregar
app.post('/tareas', (req, res) => {
  const { nombre, descripcion } = req.body;
  db.run("INSERT INTO tareas (nombre, descripcion) VALUES (?, ?)", [nombre, descripcion], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ id: this.lastID, nombre, descripcion });
  });
});

// Editar
app.put('/tareas/:id', (req, res) => {
  const { nombre, descripcion } = req.body;
  db.run("UPDATE tareas SET nombre = ?, descripcion = ? WHERE id = ?", [nombre, descripcion, req.params.id], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ changes: this.changes });
  });
});

// Eliminar
app.delete('/tareas/:id', (req, res) => {
  db.run("DELETE FROM tareas WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ changes: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
