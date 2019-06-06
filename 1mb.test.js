import { strictEqual } from 'assert'
import { readFileSync, statSync } from 'fs'
import { resolve } from 'path'

const PATH_1MB_JS = resolve(__dirname, './1mb.js')

const { describe, it } = global

describe('1mb', () => {
  it('should be exactly 1MB', () => {
    strictEqual(statSync(PATH_1MB_JS).size, 1024 * 1024)
  })

  it('should support require()', () => {
    require(PATH_1MB_JS)
  })

  it('should support eval()', () => {
    eval(readFileSync(PATH_1MB_JS).toString()) // eslint-disable-line no-eval
  })
})
