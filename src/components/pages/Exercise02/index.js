/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Exercise 02: Movie Library
 * We are trying to make a movie library for internal users. We are facing some issues by creating this, try to help us following the next steps:
 * !IMPORTANT: Make sure to run yarn movie-api for this exercise
 * 1. We have an issue fetching the list of movies, check why and fix it (handleMovieFetch)
 * 2. Create a filter by fetching the list of gender (http://localhost:3001/genres) and then loading
 * list of movies that belong to that gender (Filter all movies).
 * 3. Order the movies by year and implement a button that switch between ascending and descending order for the list
 * 4. Try to recreate the user interface that comes with the exercise (exercise02.png)
 * 
 * You can modify all the code, this component isn't well designed intentionally. You can redesign it as you need.
 */

import "./assets/styles.css";
import { useEffect, useState } from "react";

export default function Exercise02() {
  const [movies, setMovies] = useState([])
  const [moviesFiltereds, setMoviesFiltereds] = useState([])
  const [genres, setGenres] = useState([])
  const [ascending, setAscending] = useState(false);
  const [fetchCount, setFetchCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleMovieFetch = (filter) => {
    setLoading(true)
    setFetchCount(fetchCount + 1)
    console.log('Getting movies')
    let apiUrl = `http://localhost:3001/movies?_limit=50`;
    if (filter) apiUrl = apiUrl + `&${filter.key}=${filter.value}`;

    fetch(apiUrl)
      .then(res => res.json())
      .then(json => {
        setMovies(json)
        setMoviesFiltereds(json)
        setLoading(false)
      })
      .catch(() => {
        console.log('Run yarn movie-api for fake api')
      })
  }
  const listGenresFetch = () => {
    setLoading(true)
    setFetchCount(fetchCount + 1)
    fetch('http://localhost:3001/genres')
      .then(res => res.json())
      .then(json => {
        setGenres(json)
        setLoading(false)
      })
      .catch(() => {

      })
  }

  useEffect(async () => {
    await listGenresFetch();
    await handleMovieFetch();
  }, [])


  function filterMoviesByGenre(value) {
    if (value) {
      const filtereds = movies.filter(movie => movie.genres.find(_genre => _genre === value));
      setMoviesFiltereds(filtereds);
    } else {
      setMoviesFiltereds(movies);
    }
  }

  function orderMovies() {
    let sortMovies = [];
    if (ascending) {
      sortMovies = moviesFiltereds.sort((a, b) => +b.year - +a.year);
      setAscending(false);
    } else {
      sortMovies = moviesFiltereds.sort((a, b) => +a.year - +b.year);
      setAscending(true);
    }
    setMoviesFiltereds([...sortMovies]);
  }



  return (
    <section className="movie-library">
      <div className="movie-library__cover">
        <div className="container">
          <h1 className="movie-library__title">
            Movie Library
          </h1>
          <div className="movie-library__actions">
            <select name="genre" placeholder="Search by genre..." onChange={(e => filterMoviesByGenre(e.target.value))}>
              <option value=''>Todos los Generos</option>
              {genres.map(genre => <option key={`option-genre-${genre}`} value={`${genre}`}>{`${genre}`}</option>)}
            </select>
            <button onClick={orderMovies}>Order {ascending ? `Descending` : 'Ascending'}</button>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="movie-library__loading">
          <p>Loading...</p>
          <p>Fetched {fetchCount} times</p>
        </div>
      ) : (
        <ul className="movie-library__list">
          {moviesFiltereds.map(movie => (
            <li key={movie.id} className="movie-library__card">
              <img src={movie.posterUrl} alt={movie.title} />
              <ul>
                <li>ID: {movie.id}</li>
                <li>Title: {movie.title}</li>
                <li>Year: {movie.year}</li>
                <li>Runtime: {movie.runtime}</li>
                <li>Genres: {movie.genres && movie.genres.join(', ')}</li>
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}