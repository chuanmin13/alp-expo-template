const withAndroidPlugin = require('./withAndroidPlugin')

/**
 * 複合 plugin - 依序執行所有自定義 plugins
 */
const withCustomPlugins = (config) => {
  config = withAndroidPlugin(config)
  return config
}

module.exports = withCustomPlugins
