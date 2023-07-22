const express = require("express");

const app = express();
//console.log(app.locals);

app.use(express.json());

const sqlite = require("sqlite");
//console.log(sqlite);

const sqlite3 = require("sqlite3");
//console.log(sqlite3);

const path = require("path");

const filePath = path.join(__dirname, "moviesData.db");
//console.log(filePath);

let db = null;
const dbServer = async () => {
  try {
    db = await sqlite.open({
      filename: filePath,
      driver: sqlite3.Database,
    });
    //console.log(typeof(db));
    app.listen(3000, () => {
      console.log("server is running");
    });
  } catch (e) {
    console.log(e.message);
  }
};

dbServer();

//call api on get
app.get("/movies/", async (req, res) => {
  const query = `
        SELECT * FROM movie;`;
  let dbResponse = await db.all(query);
  res.send(dbResponse);
});

//call api on post

app.post("/movies/", async (req, res) => {
  const body = req.body;
  //console.log(body);
  const { directorId, movieName, leadActor } = body;
  const query = `
       INSERT INTO 
          movie(director_id,movie_name,lead_actor)
       VALUES
          (directorId,movieName,leadActor);`;
  const response = await db.run(query);
  res.send("Movie Successfully Added");
  //console.log();
});

//api call on get
app.get("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const query = `
        select * from movie 
        where movie_id=${movieId};`;
  let dbResponse = await db.all(query);
  res.send(dbResponse);
});

//api call put
app.put("/movies/:movieId/", (req, res) => {
  const { movieId } = req.params;
  const { directorId, movieName, leadActor } = req.body;
  const query = `
       UPDATE movie SET 
         director_id=${directorId},
          movie_name='${movieName}',
          lead_actor='${leadActor}'
          WHERE 
            movie_id=${movieId};`;
  const response = db.run(query);
  res.send("Movie Details Updated");
});

//api call on delete

app.delete("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const query = `
        DELETE  FROM movie
          WHERE movie_id=${movieId};`;
  await db.run(query);
  res.send("Movie Removed");
});

//api call on directors get

app.get("/directors/", async (req, res) => {
  const query = `
        SELECT * FROM director;`;
  const response = await db.all(query);
  res.send(response);
});

app.get("/directors/:directorId/movies/", async (req, res) => {
  const { directorId } = req.params;
  const query = `
       SELECT movie_name 
       FROM movie
         WHERE director_id=${directorId};`;
  const response = await db.get(query);
  res.send(response);
});

module.exports = app;
