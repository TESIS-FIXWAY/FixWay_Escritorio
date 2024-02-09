import { describe, it, expect } from 'vitest'

const fizzbuzz = (number) => {
  if (typeof number !== 'number') throw new Error('parameter provided must be a number')
  if (Number.isNaN(number)) throw new Error('parameter provided must be a number')
  const multiple = { 3: 'fizz', 5: 'buzz' }
  let output = ''
  Object
    .entries(multiple)
    .forEach(([key, value]) => {
      if (number % key === 0) output += value
    })
  return output === '' ? number : output
}

describe('FizzBuzz', () => {
  // it('should be a function', () => {
  //   expect(typeof fizzbuzz).toBe('function')
  // })

  it('should throw it not number is providern as parameter', () => {
    expect(() => fizzbuzz('')).toThrow()
  })

  it('should throw a specific error message if not number is provided as parameter', () => {
    expect(() => fizzbuzz('')).toThrow('parameter provided must be a number')
  })

  it('should throw a specific error message not a number is provided', () => {
    expect(() => fizzbuzz(NaN)).toThrow('parameter provided must be a number')
  })

  it('should return 1 if 1 is provided', () => {
    expect(fizzbuzz(1)).toBe(1)
  })

  it ('should return 2 if 2 is provided', () => {
    expect(fizzbuzz(2)).toBe(2)
  })

  it('should return fizz if 3 is provided', () => {
    expect(fizzbuzz(3)).toBe('fizz')
  })

  it('should return fizz if 3 is provided is multiple of 3', () => {
    expect(fizzbuzz(3)).toBe('fizz')
    expect(fizzbuzz(6)).toBe('fizz')
    expect(fizzbuzz(9)).toBe('fizz')
    expect(fizzbuzz(12)).toBe('fizz')
  })

  // it('should return 4 if number provided is 4', () => {
  //   expect(fizzbuzz(4)).toBe(4)
  // })

  it('should return buzz if number provided is 5', () => {
    expect(fizzbuzz(5)).toBe('buzz')
  })

  it('should return buzz if number provided is multple of 5', () => {
    expect(fizzbuzz(10)).toBe('buzz')
    expect(fizzbuzz(20)).toBe('buzz')
  })

  it('should return fizzbuzz if number provided is multiple of 3 and 5', () => {
    expect(fizzbuzz(15)).toBe('fizzbuzz')
    expect(fizzbuzz(30)).toBe('fizzbuzz')
  })
})