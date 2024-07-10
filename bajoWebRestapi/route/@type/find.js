async function find (ctx, req, reply) {
  const { paginate } = this.app.bajo.helper
  const { prepPagination } = this.app.bajoDb.helper
  const { parseFilter, transformResult } = this.app.bajoWebRestapi.helper
  const { getInfo } = this.helper
  const { isArray } = this.app.bajo.helper._
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
