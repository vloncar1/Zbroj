const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = process.env.PORT || 3000;

const pool = mysql.createPool({
    host: 'ucka.veleri.hr',
    user: 'vloncar',
    password: '11',
    database: 'vloncar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

function zbroj(a, b) {
    return a + b;
}

app.get('/zbroj', async (req, res) => {
    const a = parseInt(req.query.a);
    const b = parseInt(req.query.b);
    const rezultat = zbroj(a, b);
    
    try {
        const connection = await pool.getConnection();

        await connection.query(
            'INSERT INTO zbrojrez (a, b, rezultat) VALUES (?, ?, ?)',
            [a, b, rezultat]
        );

        connection.release();

        res.send(`Rezultat: ${rezultat}`);
    } catch (error) {
        console.error('Greška u spremanju rezultata u bazu podataka:', error);
        res.status(500).send('Greška u spremanju rezultata u bazu podataka');
    }
});

app.use((req, res) => {
    res.status(404).send('Greška');
});

app.listen(port, () => {
    console.log(`Server je pokrenut na portu: ${port}`);
});
