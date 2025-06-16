async function find (req, reply) {
  const { paginate } = this.lib.aneka
  const { prepPagination } = this.app.bajoDb
  const { parseFilter, transformResult } = this.app.bajoWebRestapi
  const filter = parseFilter(req)
  const all = await this.getTypes()
  const data = paginate(all, await prepPagination(filter))
  return await transformResult({ data, req, reply, options: { forFind: true } })
}

export default find
