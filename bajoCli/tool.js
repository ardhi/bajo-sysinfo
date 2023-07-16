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
  const [_, delay, stripAnsi, select] = await importPkg('lodash::bajo',
    'delay::bajo', 'strip-ansi::bajo-cli', '@inquirer/select::bajo-cli')
  const paths = _.concat(_.without(_.keys(si), ...withoutTypes), extTypes).sort()
  const choices = _.map(paths, c => {
    return { value: c }
  })
  const config = getConfig()
  if (!path) {
    path = await select({
      message: print.__(`Please select a method:`),
      pageSize: 10,
      choices
    })
  }
  if (!paths.includes(path)) print.fatal(`Unknown method '%s'`, path)
  const spinner = print.bora('Retrieving...').start()
  const handler = path.startsWith('bajo') ? toolBajo[path].bind(this) : si[path]
  if (!path.startsWith('bajo') && withParams.includes(path)) args[0] = args[0] || '*'
  if (secondCall.includes(path)) {
    await handler(...args)
    await delay(3000)
  }
  let result = await handler(...args)
  spinner.info('Done!')
  result = config.pretty ? (await prettyPrint(result)) : JSON.stringify(result, null, 2)
  if (config.save) {
    const file = `/${path}.${config.pretty ? 'txt' : 'json'}`
    const fullPath = await saveAsDownload(file, stripAnsi(result), 'bajoSysinfo')
    print.bora(`Saved as '%s'`, fullPath, { skipSilence: true }).succeed()
  } else console.log(result)
}

export default tool
