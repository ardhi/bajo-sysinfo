async function find (ctx, req, reply) {
  const { paginate } = this.app.bajo.helper
  const { prepPagination } = this.app.bajoDb.helper
  const { parseFilter, transformResult } = this.app.bajoWebRestapi.helper
  const { getTypes } = this.helper
  const filter = parseFilter(req)
  const all = await getTypes()
  const data = paginate(all, await prepPagination(filter))
  return await transformResult({ data, req, reply, options: { forFind: true } })
}

export default find
