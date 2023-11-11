// Con ESModules se recomienda siempre añadir la extensión al final del nombre de un archivo a la hora de importarlo.

import express, { json } from 'express'
import { corsMiddelware } from './middlewares/cors.js'
import { moviesRouter } from './routes/movies.js'

// import movies from './movies.json' assert { type: 'json' } -- Esta sintaxis no existe (assert). No se recomienda su uso pues quedará sin soporte.
// import movies from './movies.json' with { type: 'json' } -- Esta sintaxis sigue en etapa experimental (with).

// import fs from 'node:fs'
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8')) -- Este sería una tercera opción válida y vigente en archivos con ES Modules. El único problema con este método es que es lento.

// Método más recomendado actualmente para importar archivos .JSON con ES Modules actualmente:

import { readJSON } from './utils.js' // Revisar utils.js

const movies = readJSON('./movies.json')

const app = express()
const PORT = process.env.PORT ?? 1234

// Configuraciones necesarias para la app (a excepción de la primera, aunque por cuestiones de seguridad se recomienda).

app.disable('x-powered-by')
app.use(json())
app.use(corsMiddelware())

// Todos los recursos que sean MOVIES se identificarán con la ruta /movies.
// En la siguiente línea estamos indicando a Express que maneje la direción con prefijo '/movies' con todas las rutas definidas en moviesRouter, como si se tratase de una conexión o puente.

app.use('/movies', moviesRouter)

// app.listen(PORT, () => {
//   console.log(`Servidor conectado al puerto ${PORT}. Entra a https://probable-system-j765pxr5pq63jv4-${PORT}.app.github.dev/`)
// })

app.listen(PORT, () => {
  console.log(`Servidor conectado al puerto ${PORT}. Entra a http://localhost:${PORT}`)
})
