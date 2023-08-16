async function find (ctx, req, reply) {
  const { paginate } = this.bajo.helper
  const { prepPagination } = this.bajoDb.helper
  const { getFilter, transformResult } = this.bajoWebRestapi.helper
  const { getTypes } = this.bajoSysinfo.helper
  const all = await getTypes()
  const data = paginate(all, await prepPagination(getFilter(req)))
  return await transformResult({ data, req, reply, options: { forFind: true } })
}

export default find
