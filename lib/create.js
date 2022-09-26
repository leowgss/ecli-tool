'use strict'
const path = require('path')
const validateProjectName = require('validate-npm-package-name')
const chalk = require('chalk')
const fs = require('fs')
// const inquirer = require('inquirer')
const { inquirer, config, exec, fsPromises } = require('./npm')
// const exec = require('child_process').exec
// const co = require('co')
// const prompt = require('co-prompt')
// const config = require('../templates')
// const chalk = require('chalk')

async function create(projectName, options) {
  const cwd = options.cwd || process.cwd()
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName
  const targetDir = path.resolve(cwd, projectName || '.')
  const result = validateProjectName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${name}"`))
    result.errors &&
      result.errors.forEach((err) => {
        console.error(chalk.red.dim('Error: ' + err))
      })
    result.warnings &&
      result.warnings.forEach((warn) => {
        console.error(chalk.red.dim('Warning: ' + warn))
      })
    process.exit(1)
  }
  // todo
  if (fs.existsSync(targetDir) && !options.merge) {
    if (options.force) {
      await fsPromises.rm(targetDir, { recursive: true, force: true })
    } else {
      // await clearConsole()
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: `Generate project in current directory?`,
          },
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `Target directory ${chalk.cyan(targetDir)} already exists. Pick an action:`,
            choices: [
              { name: 'Overwrite', value: 'overwrite' },
              { name: 'Cancel', value: false },
            ],
          },
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\nRemoving ${chalk.cyan(targetDir)}...`)
          const res = await fsPromises.rm(targetDir, { recursive: true, force: true })
          console.log(`\nRemoved`, res ? 'fail' : 'success')
          if (res) return
        }
      }
    }
  }
  const { tplName } = await inquirer.prompt([
    {
      name: 'tplName',
      type: 'input',
      message: `Template name:`,
      default: 'demotpl',
    },
  ])
  let gitUrl = config.tpl[tplName].url
  let branch = config.tpl[tplName].branch
  // git命令，远程拉取项目并自定义项目名
  let cmdStr = `git clone ${gitUrl} ${name} && cd ${name} && git checkout ${branch}`

  console.log(chalk.white('\n Start generating...'))

  exec(cmdStr, (error, stdout, stderr) => {
    if (error) {
      console.log(error)
      process.exit()
    }
    console.log(chalk.green('\n √ Generation completed!'))
    console.log(`\n cd ${projectName} && npm install \n`)
    process.exit()
  })
}

module.exports = (...args) => create(...args)
