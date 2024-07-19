const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "infiniti",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// const db = mysql.createPool({
//   host: "localhost",
//   user: "chartap_infiniti",
//   password: "p@rv2thiV",
//   database: "chartap_infiniti",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

// Function to handle reconnections
async function handleDisconnect() {
  try {
    const connection = await db.getConnection();
    connection.release();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Error connecting to the database:', err);
    setTimeout(handleDisconnect, 2000); // Try to reconnect after 2 seconds
  }
}

// Initialize the connection
handleDisconnect();

app.get('/data/api/:id', async(req, res) => {
  const ID = req.params.id;
  try {
    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM sensor_data WHERE ID = ? ORDER BY timestamp DESC LIMIT 10', [ID]);
    connection.release();
    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).send('No query Available');
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Error fetching data');
  }
});



app.post("/data/api", async(req, res) => {
    let user = {
      COMPANY: req.body.COMPANY,
      ID: req.body.ID,
      volt_R: req.body.volt_R,
      volt_Y: req.body.volt_Y,
      volt_B: req.body.volt_B,
      Cur_R: req.body.Cur_R,
      Cur_Y: req.body.Cur_Y,
      Cur_B: req.body.Cur_B,
      motor: req.body.motor,
    };
try {
  const connection = await db.getConnection();
  let sql = "INSERT INTO sensor_data SET ?";
  await connection.query(sql, user);
  connection.release();
  res.status(201).send('Senor data added successfully');
} catch (err) {
  console.error('Sensor Error inserting data:', err);
  res.status(500).send('Sensor Error inserting data');
}
})

app.post('/data/button/', async(req, res) => {
  let idB  = {buttonID:req.body.id};
 try {
    const connection = await db.getConnection();
    let sql = "INSERT INTO sensor_button SET ?";
    await connection.query(sql, [idB]);
    connection.release();
    res.status(201).send('Button data added successfully');
  } catch (err) {
    console.error('Button Error inserting data:', err);
    res.status(500).send('Button Error inserting data');
  }
  });

  app.get('/data/button', async(req, res) => {
    try {
      const connection = await db.getConnection();
      const [rows] = await connection.query(  'SELECT DISTINCT id, buttonID FROM sensor_button GROUP BY id, buttonID');
      if (rows.length > 0) {
        res.json(rows);
        connection.release();
      } else {
        res.status(404).send('Button Not Found');
      }
    } catch (err) {
      console.error('Button Error fetching data:', err);
      res.status(500).send('Button Error fetching data');
    }
  });

  
const PORT =4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
