async function tool ({ path, args = [] }) {
  const { print, importPkg, saveAsDownload, spinner } = this.app.bajo
  const { prettyPrint } = this.app.bajoCli
  const { map, get } = this.app.bajo.lib._
  const [stripAnsi, select] = await importPkg('bajoCli:strip-ansi', 'bajoCli:@inquirer/select')
  const paths = await this.getTypes()
  const format = get(this, 'app.bajo.config.format')
  const exts = ['json']
  if (this.app.bajoConfig) exts.push('yml', 'yaml', 'toml')
  if (format && !exts.includes(format)) print.fatal('Invalid format \'%s\'', format)

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
  switch (format) {
    case 'yml':
    case 'yaml': result = await this.app.bajoConfig.toYaml(result, true); break
    case 'toml': result = await this.app.bajoConfig.toToml(result, true); break
    case 'json':
      if (this.app.bajoConfig) result = await this.app.bajoConfig.toJson(result, true)
      else result = JSON.stringify(result, null, 2)
      break
    default:
      result = await prettyPrint(result)
  }
  if (this.config.save) {
    const file = `/${path}.${format ?? 'txt'}`
    await saveAsDownload(file, stripAnsi(result))
  } else console.log(result)
}

export default tool
