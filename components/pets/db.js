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
      { title: "Inception", year: 2010, rating: "PG-13" },
      { title: "Titanic", year: 1997, rating: "PG" },
    ]);
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

// delete
async function deleteMoviesByRating(rating) {
  await connect();
  await Movie.deleteMany({ rating });
}

export default {
  initializeMovies,
  getMovies,
  updateMovieRating,
  deleteMoviesByRating,
};
