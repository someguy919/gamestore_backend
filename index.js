// Pseudocode: GET - All Video Games
// 1. Handle a GET request to retrieve all video games.
// 2. Connect to the PostgreSQL database.
// 3. Define an SQL query to retrieve all video games.
// 4. Execute the SQL query.
// 5. If the query is successful, send the retrieved data as a response.
// 6. If an error occurs, handle the error and send an error response.



const pg = require('pg');
const express = require('express');
const app = express();


app.use(express.json());


const client = new pg.Client('postgres://localhost/gamestore');
// pseudocode: get
// connect to PostgreSQL database, define query to retrive all videogames, execute the query 
app.get('/api/videogames', async (req, res, next) => {
  try {
    const SQL = `
      SELECT *
      FROM videogames
      WHERE id = $1
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

// pseudocode: get
// connect to PostgreSQL database, define query to retrive all boardgames, execute the query 

app.get('/api/boardgames', async (req, res, next) => {
  try {
    const SQL = `
      SELECT *
      FROM boardgames
      WHERE id = $1
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

// psuedocode: post 
// connect to postgreSQL database, extract details, define a new SQL query to insert
app.post('/api/boardgames', async (req, res, next) => {
  try {
    const { name, price, image } = req.body; 
    const SQL = `
      INSERT INTO boardgames (name, price, image)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const response = await client.query(SQL, [name, price, image]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.post('/api/videogames', async (req, res, next) => {
  try {
    const { name, price, image } = req.body; 
    const SQL = `
      INSERT INTO videogames (name, price, image)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const response = await client.query(SQL, [name, price, image]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

//pseudo code update:
//extract the updated games details, connect to database, define an SQL query to update, 

app.put('/api/boardgames/:id', async (req, res, next) => {
  try {
    const SQL = `
      UPDATE boardgames
      SET name = $1, price = $2, image = $3
      WHERE id = $4
      RETURNING *
    `;
    const response = await client.query(SQL, [req.body.name, req.body.price, req.body.image, req.params.id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

app.put('/api/videogames/:id', async (req, res, next) => {
  try {
    const SQL = `
      UPDATE videogames
      SET name = $1, price = $2, image = $3
      WHERE id = $4
      RETURNING *
    `;
    const response = await client.query(SQL, [req.body.name, req.body.price, req.body.image, req.params.id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

//pseudo code delete: 
//extract the games id, connect to the database, define the SQL query, delete the queery with the extracted ID, 204 response = successful delete

app.delete('/api/boardgames/:id', async (req, res, next) => {
  try {
    const SQL = `
      DELETE FROM boardgames WHERE id=$1
    `;
    const response = await client.query(SQL, [req.params.id]);
    console.log(response);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/videogames/:id', async (req, res, next) => {
  try {
    const SQL = `
      DELETE FROM videogames WHERE id=$1
    `;
    const response = await client.query(SQL, [req.params.id]);
    console.log(response);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

const start = async () => {
  try {
    await client.connect();
    console.log('Connected to the database!');

    
    const SQL = `
      DROP TABLE IF EXISTS boardgames;
      CREATE TABLE boardgames (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price VARCHAR(1000),
        image VARCHAR(500)
      );
      INSERT INTO boardgames(name, price, image) VALUES ('Settler''s of Catan', '$60', 'https://www.boardgamequest.com/wp-content/uploads/2013/04/Settlers-of-Catan.jpg');
      INSERT INTO boardgames(name, price, image) VALUES ('Risk', '$100', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnr1SHaqwJuiTW2DfmSmp8HRzGtrYgYUQ_Wg&usqp=CAU');
      INSERT INTO boardgames(name, price, image) VALUES ('mahjong', '$100', 'https://the1a.org/wp-content/uploads/sites/4/2021/05/GettyImages-71186690-1500x1017.jpg');

      DROP TABLE IF EXISTS videogames;
      CREATE TABLE videogames (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        price VARCHAR(1000),
        image VARCHAR(500)
      );
      INSERT INTO videogames(name, price, image) VALUES ('Metal Gear Solid', '$60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVsB6m1DCQZj7sRJWTl1gYCbhV17eM-4IoNg&usqp=CAU');
      INSERT INTO videogames(name, price, image) VALUES ('Dark Souls', '$60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0622HzLa0pKyYIfbZgLqgS6BjALBwbdQFhw&usqp=CAU');
      INSERT INTO videogames(name, price, image) VALUES ('Arkham City', '$60', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf0oHMvJJvzA3RogviekJ0T1Z7Yl1E8gelUw&usqp=CAU');
    `;
    await client.query(SQL);
    console.log('Tables created and data seeded');

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`App running on port ${port}`);
    });
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

start();
