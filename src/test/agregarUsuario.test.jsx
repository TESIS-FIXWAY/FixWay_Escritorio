import { describe, it, expect, document, } from 'vitest'
import { render } from 'vidom' // <-- importamos render
import AgregarUsuario from '../components/admin/agregarUsuario'

describe('AgregarUsuario', () => {
  it('should be a function', () => {
    expect(typeof AgregarUsuario).toBe('function')
  })
  // it('debería agregar un usuario a la lista', () => {
  //   const container = document.createElement('div') // <-- creamos un contenedor
  //   render(AgregarUsuario(), container) // <-- renderizamos el componente
  //   const button = container.querySelector('button') // <-- buscamos el botón
  //   button.click() // <-- simulamos un click
  //   const list = container.querySelector('ul') // <-- buscamos la lista
  //   expect(list.children.length).toBe(1) // <-- verificamos que tenga un hijo
  // })
})