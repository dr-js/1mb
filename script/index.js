import { resolve } from 'path'
import { execSync } from 'child_process'

import { initOutput, packOutput, publishOutput } from '@dr-js/dev/module/output'
import { runMain, argvFlag } from '@dr-js/dev/module/main'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)
const execShell = (command) => execSync(command, { cwd: fromRoot(), stdio: argvFlag('quiet') ? [ 'ignore', 'ignore', 'inherit' ] : 'inherit' })

runMain(async (logger) => {
  const isTest = argvFlag('test', 'publish', 'publish-dev')
  const packageJSON = await initOutput({
    copyPathList: [ 'README.md', '1mb.js' ],
    fromRoot, fromOutput, logger
  })
  const pathPackagePack = await packOutput({ fromRoot, fromOutput, logger })
  isTest && execShell('npm run lint')
  isTest && execShell('npm run test-source')
  await publishOutput({ flagList: process.argv, packageJSON, pathPackagePack, logger })
})
