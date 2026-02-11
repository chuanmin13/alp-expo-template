const { withAppBuildGradle } = require('@expo/config-plugins')

const withAndroidPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'gradle') {
      config.modResults.contents = modifyAppBuildGradle(config.modResults.contents)
    }
    return config
  })
}

function modifyAppBuildGradle(contents) {
  // 1. Inject or Update Signing Configs
  const signingConfigsBlock = `
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            storeFile file('release.keystore')
            storePassword ALP_UPLOAD_STORE_PASSWORD
            keyAlias ALP_UPLOAD_KEY_ALIAS
            keyPassword ALP_UPLOAD_KEY_PASSWORD
        }
    }
`

  if (!contents.includes('signingConfigs {')) {
    contents = contents.replace(/buildTypes {/, `${signingConfigsBlock}\n    buildTypes {`)
  } else {
    const signingConfigsRegex = /signingConfigs\s*{[\s\S]*?}\n/s
    contents = contents.replace(signingConfigsRegex, signingConfigsBlock)
  }

  // 3. Ensure signingConfig is set in buildTypes correctly
  // First, remove existing signingConfig lines in debug and release blocks within buildTypes
  contents = contents.replace(
    /(debug\s*{[\s\S]*?)\s*signingConfig signingConfigs\.\w+/g,
    '$1'
  )
  contents = contents.replace(
    /(release\s*{[\s\S]*?)\s*signingConfig signingConfigs\.\w+/g,
    '$1'
  )

  // Then add them back correctly
  contents = contents.replace(
    /debug\s*{([\s\S]*?)}/g,
    (match, p1) => {
      if (!p1.includes('signingConfig signingConfigs.debug')) {
        return `debug {${p1}        signingConfig signingConfigs.debug\n    }`
      }
      return match
    }
  )

  contents = contents.replace(
    /release\s*{([\s\S]*?)}/g,
    (match, p1) => {
      if (!p1.includes('signingConfig signingConfigs.release')) {
        return `release {${p1}        signingConfig signingConfigs.release\n    }`
      }
      return match
    }
  )

  return contents
}

module.exports = withAndroidPlugin
