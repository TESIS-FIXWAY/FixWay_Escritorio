import { describe, it, expect } from 'vitest'
import GenerarFactura from '../components/admin/generarFactura'

describe('GenerarFactura', () => {
  it('should be a function', () => {
    expect(typeof GenerarFactura).toBe('function')
  })
})