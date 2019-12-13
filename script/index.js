import { resolve } from 'path'
import { execSync } from 'child_process'

import { initOutput, packOutput, clearOutput, verifyGitStatusClean, publishOutput } from '@dr-js/dev/module/output'
import { runMain, argvFlag } from '@dr-js/dev/module/main'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)
const execShell = (command) => execSync(command, { cwd: fromRoot(), stdio: argvFlag('quiet') ? [ 'ignore', 'ignore', 'inherit' ] : 'inherit' })

runMain(async (logger) => {
  const packageJSON = await initOutput({
    copyPathList: [ 'README.md', '1mb.js' ],
    fromRoot, fromOutput, logger
  })
  if (!argvFlag('pack')) return
  const isTest = argvFlag('test', 'publish', 'publish-dev')
  isTest && logger.padLog('lint source')
  isTest && execShell('npm run lint')
  isTest && logger.padLog('test source')
  isTest && execShell('npm run test-source')
  await clearOutput({ fromOutput, logger })
  isTest && await verifyGitStatusClean({ fromRoot, logger })
  const pathPackagePack = await packOutput({ fromRoot, fromOutput, logger })
  await publishOutput({ flagList: process.argv, packageJSON, pathPackagePack, logger })
})
