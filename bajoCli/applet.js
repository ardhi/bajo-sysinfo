async function applet (path, ...args) {
  const { importPkg } = this.app.bajo
  const { map } = this.app.bajo.lib._
  const { getOutputFormat, writeOutput } = this.app.bajoCli
  const select = await importPkg('bajoCli:@inquirer/select')
  const paths = await this.getTypes()
  const format = getOutputFormat()

  const choices = map(paths, c => {
    return { value: c.id }
  })
  if (!path) {
    path = await select({
      message: this.print.write('selectMethod'),
      pageSize: 10,
      choices
    })
  }
  const spin = this.print.spinner().start('retreiving')
  let result
  try {
    result = await this.getInfo(path, ...args)
  } catch (err) {
    this.print.fatal(err.message)
  }
  spin.info('Done!')
  await writeOutput(result, path, format)
}

export default applet
