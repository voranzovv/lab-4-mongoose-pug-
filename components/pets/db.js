import mongoose from "mongoose";

const dbUrl = process.env.MONGO_URI;

// connect helper
async function connect() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUrl);
  }
}

// schema
const MovieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  rating: String,
});

const Movie = mongoose.model("Movie", MovieSchema);

// initialize
async function initializeMovies() {
  await connect();

  const count = await Movie.countDocuments();

  if (count === 0) {
    await Movie.insertMany([
      { title: "Inception", year: 2010, rating: "R" },
      { title: "Titanic", year: 1997, rating: "PG" },
      { title: "Interstellar", year: 2014, rating: "PG-13" },
      { title: "The Dark Knight", year: 2008, rating: "R" },
      { title: "The Matrix", year: 1999, rating: "R" },
      { title: "The Shawshank Redemption", year: 1994, rating: "R" },
      {
        title: "The Lord of the Rings",
        year: 2003,
        rating: "PG-13",
      },
    ]);

    console.log("Movies initialized");
  }
}

// get all
async function getMovies() {
  await connect();
  return await Movie.find({});
}

// update
async function updateMovieRating(title, newRating) {
  await connect();
  await Movie.updateOne({ title }, { rating: newRating });
}

// delete by rating
async function deleteMoviesByRating(rating) {
  await connect();
  await Movie.deleteMany({ rating });
}

//delete movie my id
async function deleteMovieById(id) {
  await connect();
  await Movie.deleteOne({ _id: id });
}

// update movie rating by id
async function updateMovieRatingById(id) {
  await connect();

  const movie = await Movie.findById(id);

  const newRating = movie.rating === "R" ? "PG-13" : "R";

  await Movie.updateOne({ _id: id }, { rating: newRating });
}

export default {
  initializeMovies,
  getMovies,
  updateMovieRating,
  deleteMoviesByRating,
  deleteMovieById,
  updateMovieRatingById,
};
