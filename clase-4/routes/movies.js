// Router es una clase de Express que crea un enrutador para gestionar las rutas de tu API o app:
import { Router } from 'express'
import { MovieController } from '../controllers/movies.js'
export const moviesRouter = Router()

// Aquí dejamos de incluir en el nombre de la rutas la palabra 'movies' porque el nombre de este archivo en sí (movies) está ya representando esa sección de la app, gracias a la clase Router de Express.

// Todas las películas

moviesRouter.get('/', MovieController.getAll)

// Una película por su Id.

moviesRouter.get('/:id', MovieController.getById)

// Publicar un objeto/ película nuevo.

moviesRouter.post('/', MovieController.create)

// Eliminar una objeto/ película.

moviesRouter.delete('/:id', MovieController.delete)

// Modificar, actualizar un objeto/ película pre-existente.

moviesRouter.patch('/:id', MovieController.update)
