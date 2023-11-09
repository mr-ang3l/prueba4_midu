// Con ESModules se recomienda siempre añadir la extensión al final del nombre de un archivo a la hora de importarlo.

import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import cors from 'cors'
import { validateMovie, validatePartialMovie } from './schemas/movies.js'

// import movies from './movies.json' assert { type: 'json' } -- Esta sintaxis no existe (assert). No se recomienda su uso pues quedará sin soporte.
// import movies from './movies.json' with { type: 'json' } -- Esta sintaxis sigue en etapa experimental (with).

// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8')) -- Este sería una tercera opción válida y vigente en archivos con ES Modules. El único problema con este método es que es lento.

// Método más recomendado actualmente para importar archivos .JSON con ES Modules actualmente:

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./movies.json') // Se recomienda este método ya que este módulo de Node cuenta con ya con todo el procesamiento necesario precargado para leer un JSON.

const app = express()
const PORT = process.env.PORT ?? 1234

app.disable('x-powered-by')

app.use(json())

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
    id: randomUUID(),
    ...result.data
  }

  // Esto no sería REST, porque estamos guardando
  // el estado de la aplicación en memoria

  movies.push(newMovie)

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
    return res.status(404).json({ message: 'Movie not found' })
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
