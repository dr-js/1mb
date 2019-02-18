import { strictEqual, doesNotThrow } from 'assert'
import { resolve } from 'path'
import { readFileSync } from 'fs'

import { getPathStat, copyPath } from 'dr-js/module/node/file/File'

import { runMain, argvFlag } from 'dr-dev/module/main'
import { initOutput, packOutput, publishOutput } from 'dr-dev/module/output'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)

const testOutput = async ({ logger: { padLog, stepLog } }) => {
  padLog('test output')

  stepLog('verify size')
  strictEqual(
    (await getPathStat(fromOutput('1mb.js'))).size,
    1024 * 1024,
    'should be exactly 1MB'
  )

  stepLog('verify require()')
  doesNotThrow(
    () => require(fromOutput('1mb.js')),
    'should support require()'
  )

  stepLog('verify eval()')
  doesNotThrow(
    () => eval(readFileSync(fromOutput('1mb.js')).toString()), // eslint-disable-line no-eval
    'should support eval()'
  )
}

runMain(async (logger) => {
  const isTest = argvFlag('test', 'publish', 'publish-dev')
  const packageJSON = await initOutput({ fromRoot, fromOutput, logger })
  await copyPath(fromRoot('1mb.js'), fromOutput('1mb.js'))
  const pathPackagePack = await packOutput({ fromRoot, fromOutput, logger })
  isTest && await testOutput({ logger })
  await publishOutput({ flagList: process.argv, packageJSON, pathPackagePack, logger })
})
