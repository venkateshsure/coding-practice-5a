const express = require("express");

const app = express();
//console.log(app.locals);

app.use(express.json());

const sqlite = require("sqlite");
const { open } = sqlite;
//console.log(sqlite);

const sqlite3 = require("sqlite3");
//console.log(sqlite3);

const path = require("path");

const filePath = path.join(__dirname, "moviesData.db");
//console.log(filePath);

let db = null;

const dbServer = async () => {
  try {
    db = await open({
      filename: filePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running");
    });
  } catch (e) {
    console.log(e.message);
  }
};

dbServer();

//call api 1 on get
const dbToRes = (each) => {
  return {
    movieName: each.movie_name,
  };
};
app.get("/movies/", async (req, res) => {
  const query = `
        SELECT * FROM movie;`;
  let response = await db.all(query);
  const resObj = response.map((each) => dbToRes(each));
  res.send(resObj);
});

//call api 2 on post

app.post("/movies/", async (req, res) => {
  const body = req.body;
  //console.log(body);
  const { directorId, movieName, leadActor } = body;
  const query = `
       INSERT INTO 
          movie(director_id,movie_name,lead_actor)
       VALUES
          (${directorId},'${movieName}','${leadActor}');`;
  const response = await db.run(query);
  res.send("Movie Successfully Added");
  //console.log();
});

//api call 3 on get
app.get("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const query = `
        select * from movie 
        where movie_id=${movieId};`;
  const response = await db.get(query);
  //const resObj = response.map((each) => dbToRes(each));
  res.send({
    movieId: response.movie_id,
    directorId: response.director_id,
    movieName: response.movie_name,
    leadActor: response.lead_actor,
  });
});
/*movie_id	INTEGER
director_id	INTEGER
movie_name	TEXT
lead_actor	TEXT
/*movieId: 12,
  directorId: 3,
  movieName: "The Lord of the Rings",
  leadActor: "Elijah Wood",*/

//api call 4 put
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

//api call 5  on delete

app.delete("/movies/:movieId/", async (req, res) => {
  const { movieId } = req.params;
  const query = `
        DELETE  FROM movie
          WHERE movie_id=${movieId};`;
  await db.run(query);
  res.send("Movie Removed");
});

//api call 6 on directors get

const dbToResOfDire = (each) => {
  return {
    directorId: each.director_id,
    directorName: each.director_name,
  };
};
app.get("/directors/", async (req, res) => {
  const query = `
        SELECT * FROM director;`;
  const response = await db.all(query);
  const resObj = response.map((each) => dbToResOfDire(each));
  res.send(resObj);
});

// api call 7

app.get("/directors/:directorId/movies/", async (req, res) => {
  const { directorId } = req.params;
  const query = `
       SELECT movie_name
       FROM movie
         WHERE director_id=${directorId};`;
  const response = await db.all(query);
  console.log(response);
  const resObj = response.map((each) => dbToRes(each));
  res.send(resObj);
});

module.exports = app;
