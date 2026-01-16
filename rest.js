
// rest.js - minimál REST CRUD a feladat2.dolgozok táblára

const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Body parser – JSON és x-www-form-urlencoded (cURL/Postman kompatibilis)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL kapcsolat (phpMyAdmin-ban létrehozott feladat2 adatbázis)
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'feladat2',
});

con.connect((err) => {
  if (err) {
    console.error('Adatbázis kapcsolódási hiba:', err.message);
  } else {
    console.log('Sikeres adatbázis-kapcsolat (feladat2).');
  }
});

// GET /dolgozo – összes rekord
app.get('/dolgozo', (req, res) => {
  const sql = 'SELECT * FROM dolgozok';
  con.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ message: 'Hiba történt' });
    res.status(200).json(rows);
  });
});

// POST /dolgozo – új dolgozó (nev, magassag, suly a body-ban)
app.post('/dolgozo', (req, res) => {
  const { nev, magassag, suly } = req.body;
  const data = { nev, magassag, suly }; // minimál: ami érkezik, azt tesszük
  const sql = 'INSERT INTO dolgozok SET ?';
  con.query(sql, data, (err, result) => {
    if (err) return res.status(500).json({ message: 'Hiba történt' });
    res.status(201).json({ message: 'Sikeres beszúrás', insertId: result.insertId });
  });
});

// PUT /dolgozo/:id – rekord módosítása
app.put('/dolgozo/:id', (req, res) => {
  const { id } = req.params;
  const { nev, magassag, suly } = req.body;
  const data = { nev, magassag, suly };
  const sql = 'UPDATE dolgozok SET ? WHERE id = ?';
  con.query(sql, [data, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Hiba történt' });
    res.status(202).json({ message: 'Sikeres módosítás', affectedRows: result.affectedRows });
  });
});

// DELETE /dolgozo/:id – rekord törlése
app.delete('/dolgozo/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM dolgozok WHERE id = ?';
  con.query(sql, id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Hiba történt' });
    res.status(200).json({ message: 'Sikeres törlés', affectedRows: result.affectedRows });
  });
});

app.listen(port, () => {
  console.log(`REST szerver fut: http://localhost:${port}`);
});



// ======================
// GET – összes dolgozó
// ======================
//curl.exe http://localhost:3000/dolgozo

// =====================================
// POST – új dolgozó (urlencoded BODY)
// =====================================
//curl.exe -X POST "http://localhost:3000/dolgozo" -H "Content-Type: application/x-www-form-urlencoded" -d "nev=Teszt Elek&magassag=182&suly=81"

// ===================================================
// PUT – meglévő rekord módosítása (példa: id = 2)
// ===================================================
//curl.exe -X PUT "http://localhost:3000/dolgozo/2" `
//  -H "Content-Type: application/x-www-form-urlencoded" `
//  -d "nev=Kovács Éva&magassag=168&suly=66"

// ======================================
// DELETE – rekord törlése (példa: id=2)
// ======================================
//curl.exe -X DELETE "http://localhost:3000/dolgozo/2"