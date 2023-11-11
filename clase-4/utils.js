import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

export function readJSON (path) {
  return require(path)
}

// Se recomienda este método ya que este módulo de Node cuenta con ya con todo el procesamiento necesario precargado para leer un JSON.
