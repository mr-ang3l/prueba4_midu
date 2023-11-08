const z = require('zod')

const movieSchema = z.object({
  title: z.string({

    // Este mensaje se enviará tan pronto el usuario mande un tipo de dato equivocado.

    invalid_type_error: 'Movie title must be a string',

    // Este mensaje se enviará tan pronto el usuario omita llenar este campo.

    required_error: 'Movie title is required'
  }),

  // Zod permite la encadenación de métodos para especificar aún más un requerimiento.

  year: z.number().int().min(1900).max(2024),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),

  // Esto incluso se puede complementar con un .containsWith() para definir un formato o extensión.

  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),

  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Thriller', 'Sci-Fi']),
    {
      required_error: 'Movie genre is required.',
      invalid_type_error: 'Movie genre must be an array of enum genre'
    }
  )

})

// Esta función se encargará de validar si un objeto dado es igual al de referencia.

function validateMovie (input) {
  return movieSchema.safeParse(input)
}

function validatePartialMovie (input) {
  // .partial() es un método que convierte a todas las partes de nuestro esquema en opcionales, de esta manera habilitándonos la posibilidad de modificar partes de objetos ya creados en la base de datos.

  return movieSchema.partial().safeParse(input)
}

module.exports = { validateMovie, validatePartialMovie }
