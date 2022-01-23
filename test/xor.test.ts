import { describe, expect, test } from 'vitest'
import { xorStrings } from '../src/xor-crypt'

describe('XOR string', () => {
  test('xor', () => {
    expect(xorStrings('abc', xorStrings('abc', '弄虚作假'))).toBe('弄虚作假')
  })
})
