async function bajoApp () {

}

async function bajoPlugin () {
  const { without, map, keys, merge, omit } = this.bajo.helper._
  const ky = without(keys(this), 'bajo', 'app')
  const result = map(ky, k => {
    const def = { name: k, package: this[k].config.pkg.name }
    const item = merge({}, def, omit(this[k].config.pkg, ['name']))
    item.helper = keys(this[k].helper)
    return item
  })
  return result
}

export default { bajoApp, bajoPlugin }
