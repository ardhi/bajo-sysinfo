import si from 'systeminformation'

const withoutTypes = ['version', 'observe', 'get', 'getAllData', 'getDynamicData', 'getStaticData']
const withParams = ['processLoad', 'services', 'inetChecksite', 'inetLatency']
const secondCall = ['fsStats', 'disksIO', 'networkStats', 'currentLoad']

async function get () {
  const { getConfig, print, importPackage } = this.bajo.helper
  const { vTable, hTable } = this.bajoCli.helper
  const _ = await importPackage('lodash::bajo')
  const fs = await importPackage('fs-extra::bajo')
  const delay = await importPackage('delay::bajo')
  const keys = _.without(_.keys(si), ...withoutTypes).sort()
  const choices = _.map(keys, c => {
    return { value: c }
  })
  const config = getConfig()
  let [type, param = '*'] = ((config.args[0] || '')).split(':')
  if (_.isEmpty(type)) {
    const { select } = await importPackage('@inquirer/prompts::bajo-cli')
    type = await select({
      message: `Choose type:`,
      pageSize: 10,
      choices
    })
  }
  if (!keys.includes(type)) print.fatal(`Unsupported type '${type}'`)
  const spinner = print.ora('Retrieving...').start()
  if (secondCall.includes(type)) {
    await si[type](withParams.includes(type) ? param : undefined)
    await delay(3000)
  }
  let result = await si[type](withParams.includes(type) ? param : undefined)
  spinner.info('Done!')
  if (config.pretty) {
    if (_.isString(result) || _.isNumber(result)) result = hTable([{ result }], { print: false, noHeader: true })
    else if (_.isArray(result)) result = hTable(result, { print: false })
    else result = vTable(result, { print: false })
  } else {
    result = JSON.stringify(result, null, 2)
  }
  if (config.save) {
    let dir = `${config.dir.data}/bajoSysinfo`
    fs.ensureDirSync(dir)
    const file = `${dir}/${config.args[0]}.${config.pretty ? 'txt' : 'json'}`
    fs.writeFileSync(file, result, 'utf8')
    print.ora(`Saved as '${file}'`, true).succeed()
  } else console.log(result)
}

export default get
