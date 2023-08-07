import si from 'systeminformation'
import toolBajo from './tool/bajo.js'

const withoutTypes = ['version', 'observe', 'get', 'getAllData', 'getDynamicData', 'getStaticData',
  'dockerAll']
const withParams = ['processLoad', 'services', 'inetChecksite', 'inetLatency']
const secondCall = ['fsStats', 'disksIO', 'networkStats', 'currentLoad']
const extTypes = ['bajoApp', 'bajoPlugin']

async function tool ({ path, args = [] }) {
  const { getConfig, print, importPkg, saveAsDownload } = this.bajo.helper
  const { prettyPrint } = this.bajoCli.helper
  const { concat, without, keys, map } = await importPkg('lodash-es')
  const [delay, stripAnsi, select] = await importPkg('delay', 'bajo-cli:strip-ansi', 'bajo-cli:@inquirer/select')
  const paths = concat(without(keys(si), ...withoutTypes), extTypes).sort()
  const choices = map(paths, c => {
    return { value: c }
  })
  const config = getConfig()
  if (!path) {
    path = await select({
      message: print.__('Please select a method:'),
      pageSize: 10,
      choices
    })
  }
  if (!paths.includes(path)) print.fatal('Unknown method \'%s\'', path)
  const spinner = print.bora('Retrieving...').start()
  const handler = path.startsWith('bajo') ? toolBajo[path].bind(this) : si[path]
  if (!path.startsWith('bajo')) {
    if (withParams.includes(path)) args[0] = args[0] || '*'
    else args = []
  }
  if (secondCall.includes(path)) {
    await handler(...args)
    await delay(3000)
  }
  let result = await handler(...args)
  spinner.info('Done!')
  result = config.pretty ? (await prettyPrint(result)) : JSON.stringify(result, null, 2)
  if (config.save) {
    const file = `/${path}.${config.pretty ? 'txt' : 'json'}`
    await saveAsDownload(file, stripAnsi(result))
  } else console.log(result)
}

export default tool
