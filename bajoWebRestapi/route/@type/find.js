async function find (req, reply) {
  const { paginate } = this.lib.aneka
  const { prepPagination } = this.app.bajoDb
  const { parseFilter, transformResult } = this.app.bajoWebRestapi
  const { isArray } = this.lib._
  const item = await this.getInfo(req.params.type)
  const filter = parseFilter(req)
  if (!isArray(item)) {
    const data = { data: item, success: true, statusCode: 200 }
    return await transformResult({ data, req, reply })
  }
  const data = paginate(item, await prepPagination(filter))
  return await transformResult({ data, req, reply, options: { forFind: true } })
}

export default find
