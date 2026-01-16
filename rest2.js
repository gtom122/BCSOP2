const express = require("express");
const mysql = require("mysql2");
const app = express(); 
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

const con = mysql.createConnection({ 
    host: "localhost", 
    user: "root", 
    password: "", 
    database: "feladat2" 
}); 

con.connect(err => { 
    if (err) { 
        console.error("Database Connection Error:", err); 
    } else { 
        console.log('Successfully connected to the database'); 
    } 
}); 

function queryPromise(query, value) { 
    return new Promise((resolve, reject) => { 
        // value pl. => app.get('/dolgozok/:id', async (req, res) => queryPromise(query, id); 
        // => "SELECT * FROM dolgozo WHERE id = ?"; 
        con.query(query, value, (err, result) => { 
            if (err) reject(err); 
            else resolve(result); 
        })  
    }) 
}

// GET: Lekéri az összes hallgatói rekord listáját az adatbázisból. 
app.get("/dolgozok/", async (req, res) => { 
    try { 
        const query = "SELECT * FROM dolgozok"; 
        const result = await queryPromise(query); 
        res.status(200).send(result); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ message: "Some issue occurred" }); 
    } 
}); 

// POST: Új dolgozo rekordot ad az adatbázis táblához. 
app.post('/dolgozok', async (req, res) => { 
    try { 
        const value = req.body; 
        const query = "INSERT INTO dolgozok SET ?"; 
        const result = await queryPromise(query, value); 
        res.status(201).json({ message: "Data successfully inserted" }); 
        console.log(result); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ message: "Some issue occurred" }); 
    } 
});

// PUT: Frissít egy meglévő rekordot az id paraméter megadásával. 
app.put('/dolgozok/:id', async (req, res) => { 
    try { 
        let id = req.params.id; 
        const value = req.body; 
        const query = "UPDATE dolgozok SET ? WHERE id = ?"; // lásd cURL-es POST hívás 
        const result = await queryPromise(query, [value, id]); 
        res.status(202).json({ message: "Data updated successfully" }); 
        console.log(result); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ message: "Some issue occurred" }); 
    } 
}); 

// DELETE: Töröl egy meglévő dolgozót az id paraméter megadásával. 
app.delete('/dolgozok/:id', async (req, res) => { 
    try { 
        const id = req.params.id; 
        const query = "DELETE FROM dolgozok WHERE id = ?"; 
        const result = await queryPromise(query, id); 
        res.status(200).json({ message: "Data deleted successfully" }); 
    } catch (error) { 
        console.error(error); 
        res.status(500).json({ message: "Some issue occurred" }); 
    } 
}); 

const port = process.env.PORT || 3000; 
app.listen(port, () => { 
    console.log(`Server started on http://localhost:${port}`); 
}); 


// ======================
// GET – összes dolgozó
// ======================
//curl.exe http://localhost:3000/dolgozok

// =====================================
// POST – új dolgozó (urlencoded BODY)
// =====================================
//curl.exe -X POST "http://localhost:3000/dolgozok" -H "Content-Type: application/x-www-form-urlencoded" -d "nev=Teszt Elek&magassag=182&suly=81"

// ===================================================
// PUT – meglévő rekord módosítása (példa: id = 2)
// ===================================================
//curl.exe -X PUT "http://localhost:3000/dolgozok/2" -H "Content-Type: application/x-www-form-urlencoded" -d "nev=Kovács Éva&magassag=168&suly=66"

// ======================================
// DELETE – rekord törlése (példa: id=2)
// ======================================
//curl.exe -X DELETE "http://localhost:3000/dolgozo/2"