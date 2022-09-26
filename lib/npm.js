const path = require('path')
const validateProjectName = require('validate-npm-package-name')
const chalk = require('chalk')
const fs = require('fs')
const inquirer = require('inquirer')
const { exec } = require('child_process')
const config = require('../templates')

module.exports = {
  path,
  validateProjectName,
  chalk,
  fs,
  fsPromises: fs.promises,
  inquirer,
  exec,
  config,
}
