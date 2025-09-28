/**
 * Plugin factory
 *
 * @param {string} pkgName - NPM package name
 * @returns {class}
 */
async function factory (pkgName) {
  const me = this

  /**
   * BajoSysinfo class
   *
   * @class
   */
  class BajoSysinfo extends this.app.pluginClass.base {
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
