import { describe, it, expect } from 'vitest'
import ListadoInventario from '../components/admin/listarInventario'

describe('ListadoInventario', () => {
  it('should be a function', () => {
    expect(typeof ListadoInventario).toBe('function')
  })
})