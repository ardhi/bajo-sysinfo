async function tool ({ path, args = [] }) {
  const { getConfig, print, importPkg, saveAsDownload } = this.bajo.helper
  const { prettyPrint } = this.bajoCli.helper
  const { getTypes, getInfo } = this.bajoSysinfo.helper
  const { map } = await importPkg('lodash-es')
  const [stripAnsi, select] = await importPkg('bajo-cli:strip-ansi', 'bajo-cli:@inquirer/select')
  const paths = await getTypes()
  const choices = map(paths, c => {
    return { value: c.id }
  })
  const config = getConfig()
  if (!path) {
    path = await select({
      message: print.__('Please select a method:'),
      pageSize: 10,
      choices
    })
  }
  const spinner = print.bora('Retrieving...').start()
  let result
  try {
    result = await getInfo(path, ...args)
  } catch (err) {
    print.fatal(err.message)
  }
  spinner.info('Done!')
  result = config.pretty ? (await prettyPrint(result)) : JSON.stringify(result, null, 2)
  if (config.save) {
    const file = `/${path}.${config.pretty ? 'txt' : 'json'}`
    await saveAsDownload(file, stripAnsi(result))
  } else console.log(result)
}

export default tool
