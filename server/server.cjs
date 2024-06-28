const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "infiniti",
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

app.get('/api/:id', (req, res) => {
  const ID = req.params.id;
  db.query('SELECT * FROM sensor_data WHERE ID = ? ORDER BY timestamp DESC LIMIT 10', [ID], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
      return;
    }
    res.json(results);
  });
});


app.post("/api", (req, res) => {
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
    let sql = "INSERT INTO sensor_data SET ?";
    let query = db.query(sql, user, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).send("Sensor data inserted");
    });
  });

app.post('/button/', (req, res) => {
let idB  = {buttonID:req.body.id};
let sql = "INSERT INTO sensor_button SET ?";
    let query = db.query(sql, idB, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).send("Button data inserted");
    });
  });
  
  app.get('/button', (req, res) => {
    db.query('SELECT DISTINCT id, buttonID FROM sensor_button GROUP BY id, buttonID', (err, results) => {
      if (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(results);
    });
  });
const PORT =4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
