async function find (ctx, req, reply) {
  const { paginate, importPkg } = this.bajo.helper
  const { prepPagination } = this.bajoDb.helper
  const { parseFilter, transformResult } = this.bajoWebRestapi.helper
  const { getInfo } = this.bajoSysinfo.helper
  const { isArray } = await importPkg('lodash-es')
  const item = await getInfo(req.params.type)
  const filter = parseFilter(req)
  if (!isArray(item)) {
    const data = { data: item, success: true, statusCode: 200 }
    return await transformResult({ data, req, reply })
  }
  const data = paginate(item, await prepPagination(filter))
  return await transformResult({ data, req, reply, options: { forFind: true } })
}

export default find
