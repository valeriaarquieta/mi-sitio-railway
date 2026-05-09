// const express = require('express');
// const path = require('path');

// const app = express();


// app.use(express.static(__dirname));

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log('Servidor corriendo en ' + PORT);
// });

const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, 'site')));
app.use(express.json());

// Conexión a SQLite
const db = new sqlite3.Database('./database.db');

// Crear tabla si no existe
db.run("CREATE TABLE IF NOT EXISTS registros (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, edad INTEGER)");

// Consultar todos
app.get('/registros', (req, res) => {
  db.all("SELECT * FROM registros", [], (err, rows) => {
    if (err) return res.status(500).send(err);
    res.json(rows);
  });
});

// Consultar uno
app.get('/registros/:id', (req, res) => {
  db.get("SELECT * FROM registros WHERE id = ?", [req.params.id], (err, row) => {
    if (err) return res.status(500).send(err);
    res.json(row);
  });
});

// Agregar
app.post('/registros', (req, res) => {
  const { nombre, edad } = req.body;
  db.run("INSERT INTO registros (nombre, edad) VALUES (?, ?)", [nombre, edad], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ id: this.lastID, nombre, edad });
  });
});

// Editar
app.put('/registros/:id', (req, res) => {
  const { nombre, edad } = req.body;
  db.run("UPDATE registros SET nombre = ?, edad = ? WHERE id = ?", [nombre, edad, req.params.id], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ changes: this.changes });
  });
});

// Eliminar
app.delete('/registros/:id', (req, res) => {
  db.run("DELETE FROM registros WHERE id = ?", [req.params.id], function(err) {
    if (err) return res.status(500).send(err);
    res.json({ changes: this.changes });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
