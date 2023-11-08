const express = require('express')
const movies = require('./movies.json')
const crypto = require('node:crypto')
const app = express()
const cors = require('cors')
const { validateMovie, validatePartialMovie } = require('./schemas/movies')
const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

app.use(express.json()) // Esto es un middleware que tratará a la solicitud (petición, request) antes de pasarla a comparar con todas las rutas preestablecidas. Este middleware captura la request y verifica si necesita ser procesada por 'chunks' (pedazo a pedazo) y en caso de que sí, procesarlo, de este modo, pudiendo acceder directamente al 'req.body'.

// app.get('/', (req, res) => {
//   res.json({ message: 'Hola mundo' })
// })

app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com',
      'https://midu.dev'
    ]

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
}))

// Todos los recursos que sean MOVIES se identificarán con la ruta /movies.

app.get('/movies', (req, res) => {
  // La propiedad 'query' es un objeto que almacena todas las búsquedas o 'querys' contenidas en la solicitud del usuario a las cuales podemos acceder.

  // Todos los orígenes distintos al nuestro, tienen permiso de acceso a esta API.

  // res.header('Access-Control-Allow-Origin', '*')

  const { genre } = req.query

  if (genre) {
    const filteredMovies = movies.filter(
      movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
    )

    return res.json(filteredMovies)
  }
  res.json(movies)
})

// La siguiente función utiliza parámetros abstractos (:id) los cuales son interpretados por medio del método 'path to regex'.
// Como en realidad se vería la ruta si lo escribiéramos en lenguaje 'regex'/ 'regular expression' es muy diferente a como lo escribimos en la actualidad, en este caso siendo '/movies/:id' .

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)

  if (result.error) {
    // El código de error 422 (UNprocessable Entity) también es aplicable.
    return res.status(400).json({

      error: JSON.parse(result.error.message)

    })
  }

  const newMovie = {
    // Esta función genera un UUIID, es un módulo nativo de Node.
    id: crypto.randomUUID(),
    ...result.data
  }

  // Esto no sería REST, porque estamos guardando
  // el estado de la aplicación en memoria

  movies.push(newMovie)

  // Status code 201 significa 'created', un recurso nuevo hecho.

  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found!' })
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updateMovie

  return res.json(updateMovie)
})

// app.listen(PORT, () => {
//   console.log(`Servidor conectado al puerto ${PORT}. Entra a https://probable-system-j765pxr5pq63jv4-${PORT}.app.github.dev/`)
// })

app.listen(PORT, () => {
  console.log(`Servidor conectado al puerto ${PORT}. Entra a http://localhost:${PORT}`)
})
