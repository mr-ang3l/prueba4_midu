// Con ESModules se recomienda siempre añadir la extensión al final del nombre de un archivo a la hora de importarlo.

import express, { json } from 'express'
import { corsMiddleware } from './middlewares/cors.js'
import { moviesRouter } from './routes/movies.js'

const app = express()
const PORT = process.env.PORT ?? 1234

// Configuraciones necesarias para la app (a excepción de la primera, aunque por cuestiones de seguridad se recomienda).

app.use(corsMiddleware())
app.disable('x-powered-by')
app.use(json())

// Todos los recursos que sean MOVIES se identificarán con la ruta /movies.
// En la siguiente línea estamos indicando a Express que maneje la direción con prefijo '/movies' con todas las rutas definidas en moviesRouter, como si se tratase de una conexión o puente.

app.use('/movies', moviesRouter)

app.listen(PORT, () => {
  console.log(`Servidor conectado al puerto ${PORT}. Entra a https://probable-system-j765pxr5pq63jv4-${PORT}.app.github.dev/`)
})

// app.listen(PORT, () => {
//   console.log(`Servidor conectado al puerto ${PORT}. Entra a http://localhost:${PORT}`)
// })
