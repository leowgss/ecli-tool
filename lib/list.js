'use strict'
const config = require('../templates')
const { path, fs, fsPromises, chalk } = require('./npm')

module.exports = async (options) => {
  const { exportTemplates, importTemplates } = options
  if (exportTemplates) {
    const targetPath = path.join(process.cwd(), typeof exportTemplates === 'string' ? exportTemplates : './')
    if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath)
    const err = await fsPromises.writeFile(path.join(targetPath, 'templates.json'), JSON.stringify(config, null, 2)).catch((e) => e)
    if (err) console.log(err)
    if (!err) console.log(chalk.green('Templates exported!\n'))
  }
  if (importTemplates) {
    const filePath = path.join(process.cwd(), importTemplates)
    // if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath)
    const data = await fsPromises.readFile(filePath, { encoding: 'utf8' }).catch((e) => e)
    try {
      JSON.parse(data)
      console.log(chalk.green('Start Writing!'))
      // 把模板信息写入templates.json
      const err = await fsPromises.writeFile(path.join(__dirname, '../templates.json'), data).catch((e) => e)
      if (err) console.log(err)
      if (!err) console.log(chalk.green('Templates import!\n'))
    } catch (error) {
      console.log(chalk.red('文件JSON 格式错误!\n'))
    }
  }
  if (!exportTemplates && !importTemplates) {
    console.log(config.tpl)
  }
  process.exit()
}
