async function factory (pkgName) {
  const me = this

  return class BajoSysinfo extends this.lib.BajoPlugin {
    constructor () {
      super(pkgName, me.app)
      this.alias = 'si'
      this.config = {
        prettyPrint: true
      }
    }
  }
}

export default factory
