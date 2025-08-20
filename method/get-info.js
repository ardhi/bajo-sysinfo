import si from 'systeminformation'
import toolBajo from '../lib/tool/bajo.js'

const withParams = ['processLoad', 'services', 'inetChecksite', 'inetLatency']
const secondCall = ['fsStats', 'disksIO', 'networkStats', 'currentLoad']

async function getInfo (type, args) {
  const { importPkg } = this.app.bajo
  const delay = await importPkg('bajo:delay')
  const { map } = this.lib._
  const types = map(this.getTypes(), 'id')
  if (!types.includes(type)) throw this.error('unsupported%s%s', this.print.write('type'), type)
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
