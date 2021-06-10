const router = require('express').Router();

const { validateMovieBody } = require('../middlewares/validation');

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);
router.post('/', validateMovieBody, createMovie);
router.delete('/:movieId', deleteMovie);

module.exports = router;
