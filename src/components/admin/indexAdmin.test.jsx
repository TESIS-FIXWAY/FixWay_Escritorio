import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest'
import IndexAdmin from './indexAdmin';

describe('IndexAdmin', () => {
  it('should be a function', () => {
    expect(typeof IndexAdmin).toBe('function')
  })

});