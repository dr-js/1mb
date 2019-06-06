import { resolve } from 'path'
import { execSync } from 'child_process'

import { runMain, argvFlag } from 'dr-dev/module/main'
import { initOutput, packOutput, publishOutput } from 'dr-dev/module/output'

const PATH_ROOT = resolve(__dirname, '..')
const PATH_OUTPUT = resolve(__dirname, '../output-gitignore')
const fromRoot = (...args) => resolve(PATH_ROOT, ...args)
const fromOutput = (...args) => resolve(PATH_OUTPUT, ...args)
const execOptionRoot = { cwd: fromRoot(), stdio: argvFlag('quiet') ? [ 'ignore', 'ignore', 'inherit' ] : 'inherit', shell: true }

runMain(async (logger) => {
  const isTest = argvFlag('test', 'publish', 'publish-dev')
  const packageJSON = await initOutput({ copyPathList: [ 'README.md', '1mb.js' ], fromRoot, fromOutput, logger })
  const pathPackagePack = await packOutput({ fromRoot, fromOutput, logger })
  isTest && execSync('npm run lint', execOptionRoot)
  isTest && execSync('npm run test-source', execOptionRoot)
  await publishOutput({ flagList: process.argv, packageJSON, pathPackagePack, logger })
})
