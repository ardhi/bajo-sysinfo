import si from 'systeminformation'
import toolBajo from '../../lib/tool/bajo.js'

const withParams = ['processLoad', 'services', 'inetChecksite', 'inetLatency']
const secondCall = ['fsStats', 'disksIO', 'networkStats', 'currentLoad']

async function getInfo (type, args) {
  const { importPkg, error } = this.app.bajo
  const delay = await importPkg('delay')
  const { map } = this.app.bajo.lib._
  const types = map(this.getTypes(), 'id')
  if (!types.includes(type)) throw error('Unsupported type \'%s\'', type)
  const handler = type.startsWith('bajo') ? toolBajo[type].bind(this) : si[type]
  if (!type.startsWith('bajo')) {
    if (withParams.includes(type)) args[0] = args[0] ?? '*'
    else args = []
  }
  if (secondCall.includes(type)) {
    await handler(...args)
    await delay(3000)
  }
  return await handler(...args)
}

export default getInfo
