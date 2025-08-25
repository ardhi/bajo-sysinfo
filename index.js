async function factory (pkgName) {
  const me = this

  class BajoSysinfo extends this.lib.Plugin {
    static alias = 'si'

    constructor () {
      super(pkgName, me.app)
      this.config = {
        prettyPrint: true
      }
    }
  }

  return BajoSysinfo
}

export default factory
