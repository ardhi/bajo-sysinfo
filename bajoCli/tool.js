async function tool ({ path, args = [] }) {
  const { print, importPkg, saveAsDownload, spinner } = this.app.bajo
  const { prettyPrint } = this.app.bajoCli
  const { map, get } = this.app.bajo.lib._
  const [stripAnsi, select] = await importPkg('bajoCli:strip-ansi', 'bajoCli:@inquirer/select')
  const paths = await this.getTypes()
  const choices = map(paths, c => {
    return { value: c.id }
  })
  if (!path) {
    path = await select({
      message: print.__('Please select a method:'),
      pageSize: 10,
      choices
    })
  }
  const spin = spinner().start('Retrieving...')
  let result
  try {
    result = await this.getInfo(path, ...args)
  } catch (err) {
    print.fatal(err.message)
  }
  spin.info('Done!')
  const format = get(this, 'app.bajo.config.format')
  const exts = map(this.app.bajo.configHandlers, 'ext')
  if (format && !exts.includes(`.${format}`)) print.fatal('Invalid format \'%s\'', format)
  result = await prettyPrint(result)
  if (this.config.save) {
    const file = `/${path}.${format ?? 'txt'}`
    await saveAsDownload(file, stripAnsi(result))
  } else console.log(result)
}

export default tool
