// Router es una clase de Express que crea un enrutador para gestionar las rutas de tu API o app:
import { Router } from 'express'
import { validateMovie, validatePartialMovie } from '../schemas/movies.js'
import { MovieModel } from '../models/movie.js'
const moviesRouter = Router()

// Aquí dejamos de incluir en el nombre de la rutas la palabra 'movies' porque el nombre de este archivo en sí (movies) está ya representando esa sección de la app, gracias a la clase Router de Express.

// Todas las películas

moviesRouter.get('/', async (req, res) => {
  const { genre } = req.query
  const movies = await MovieModel.getAll({ genre })
  res.json(movies)
})

// Una película por su Id.

moviesRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const movie = await MovieModel.getById({ id })

  if (movie) return res.json(movie)
  res.status(404).json({ message: 'Movie not found' })
})

// Publicar un objeto/ película nuevo.

moviesRouter.post('/', async (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    // El código de error 422 (UNprocessable Entity) también es aplicable.
    return res.status(400).json({

      error: JSON.parse(result.error.message)

    })
  }

  const newMovie = await MovieModel.create({ input: result.data })

  res.status(201).json(newMovie)
})

// Eliminar una objeto/ película.

moviesRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  const result = await MovieModel.delete({ id })

  if (result === false) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  return res.json({ message: 'Movie deleted' })
})

// Modificar, actualizar un objeto/ película pre-existente.

moviesRouter.patch('/:id', async (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params

  const updateMovie = await MovieModel.update({ id })

  return res.json(updateMovie)
})

export default moviesRouter