import "dotenv/config";
import express from "express";
import path from "path";

import db from "./components/pets/db.js"; //load db.js

const __dirname = import.meta.dirname;

//set up the Express app
const app = express();
const port = process.env.PORT || "8888";

//set up application template engine
app.set("views", path.join(__dirname, "views")); //the first "views" is the setting name
//the second value above is the path: __dirname/views
app.set("view engine", "pug");

//set up folder for static files
app.use(express.static(path.join(__dirname, "public")));
//cretae movie list if empty
const movies = [
  { title: "Inception", year: 2010, rating: "PG-13" },
  { title: "Titanic", year: 1997, rating: "PG" },
  { title: "Interstellar", year: 2014, rating: "PG-13" },
  { title: "The Dark Knight", year: 2008, rating: "PG-13" },
  { title: "The Matrix", year: 1999, rating: "R" },
  { title: "The Shawshank Redemption", year: 1994, rating: "R" },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    rating: "PG-13",
  },
];

//USE PAGE ROUTES FROM ROUTER(S)
app.get("/", async (req, res) => {
  let movieList = await db.getMovies();

  if (!movieList.length) {
    await db.initializeMovies();
    movieList = await db.getMovies();
  }

  res.render("index", {
    movies: movieList,
  });
});

app.get("/update", async (req, res) => {
  await db.updateMovieRating("Titanic", "R");
  res.redirect("/");
});

//update movie rating by id
app.get("/update/:id", async (req, res) => {
  await db.updateMovieRatingById(req.params.id, "R");
  res.redirect("/");
});
//delete by id
app.get("/delete/:id", async (req, res) => {
  await db.deleteMovieById(req.params.id);
  res.redirect("/");
});

//delete all the movies with the rating r
app.get("/delete", async (req, res) => {
  await db.deleteMoviesByRating("R");
  res.redirect("/");
});
//set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
