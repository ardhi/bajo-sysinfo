async function bajoApp () {

}

async function bajoPlugin () {
  const { importPkg } = this.bajo.helper
  const _ = await importPkg('lodash::bajo')
  const keys = _.without(_.keys(this), 'bajo', 'app')
  const result = _.map(keys, k => {
    const def = { name: k, package: this[k].config.pkg.name }
    const item = _.merge({}, def, _.omit(this[k].config.pkg, ['name']))
    item.helper = _.keys(this[k].helper)
    return item
  })
  return result
}

export default { bajoApp, bajoPlugin }