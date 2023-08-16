import si from 'systeminformation'

const withoutTypes = ['version', 'observe', 'get', 'getAllData', 'getDynamicData', 'getStaticData',
  'dockerAll']
const extTypes = ['bajoApp', 'bajoPlugin']

async function getTypes () {
  const { importPkg, titleize } = this.bajo.helper
  const { map, concat, without, keys, upperFirst } = await importPkg('lodash-es')
  const paths = concat(without(keys(si), ...withoutTypes), extTypes).sort()

  function transformer (item) {
    const replace = {
      mem: 'Memory',
      cpu: 'CPU',
      fs: 'Filesystem',
      inet: 'Internet',
      os: 'OS',
      usb: 'USB',
      uuid: 'UUID',
      vbox: 'Virtual Box'
    }
    if (replace[item]) return replace[item]
    return upperFirst(item)
  }

  const all = map(paths, c => {
    return { id: c, name: titleize(c, { transformer }) }
  })
  return all
}

export default getTypes
