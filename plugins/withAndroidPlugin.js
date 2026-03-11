const { withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

const withAndroidPlugin = (config) => {
  // 1. 修改 build.gradle 注入 signingConfigs
  config = withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy' || config.modResults.language === 'gradle') {
      config.modResults.contents = modifyAppBuildGradle(config.modResults.contents)
    }
    return config
  })

  // 2. 自動從專案根目錄複製 release.keystore 到 android/app/
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot
      const srcKeystorePath = path.join(projectRoot, 'release.keystore')
      const destKeystorePath = path.join(projectRoot, 'android', 'app', 'release.keystore')

      if (fs.existsSync(srcKeystorePath)) {
        console.log(`[withAndroidPlugin] Copying keystore from ${srcKeystorePath} to ${destKeystorePath}`)
        fs.copyFileSync(srcKeystorePath, destKeystorePath)
      } else {
        console.warn(`[withAndroidPlugin] Warning: release.keystore not found at ${srcKeystorePath}`)
      }
      return config
    }
  ])

  return config
}

/**
 * 用括號計數法找出指定 block 的範圍
 * @returns {{ start: number, end: number } | null}
 *   start: blockName 的起始 index
 *   end:   對應結尾 } 的 index
 */
function findBlock(contents, blockName) {
  const regex = new RegExp(`\\b${blockName}\\s*\\{`)
  const match = regex.exec(contents)
  if (!match) return null

  let depth = 0
  let i = contents.indexOf('{', match.index)
  while (i < contents.length) {
    if (contents[i] === '{') depth++
    else if (contents[i] === '}') {
      depth--
      if (depth === 0) return { start: match.index, end: i }
    }
    i++
  }
  return null
}

function modifyAppBuildGradle(contents) {
  const signingConfigsBlock =
    '    signingConfigs {\n' +
    '        debug {\n' +
    '            storeFile file(\'debug.keystore\')\n' +
    '            storePassword \'android\'\n' +
    '            keyAlias \'androiddebugkey\'\n' +
    '            keyPassword \'android\'\n' +
    '        }\n' +
    '        release {\n' +
    '            storeFile file(\'release.keystore\')\n' +
    '            storePassword ALP_UPLOAD_STORE_PASSWORD\n' +
    '            keyAlias ALP_UPLOAD_KEY_ALIAS\n' +
    '            keyPassword ALP_UPLOAD_KEY_PASSWORD\n' +
    '        }\n' +
    '    }'

  // 1. 注入或替換整個 signingConfigs block
  const signingBlock = findBlock(contents, 'signingConfigs')
  if (signingBlock) {
    contents =
      contents.slice(0, signingBlock.start) +
      signingConfigsBlock +
      contents.slice(signingBlock.end + 1)
  } else {
    // 插入在 buildTypes 之前
    contents = contents.replace(/(\s*buildTypes\s*\{)/, `\n${signingConfigsBlock}\n$1`)
  }

  // 2. 修改 buildTypes 內的 debug / release signingConfig
  const buildTypesBlock = findBlock(contents, 'buildTypes')
  if (buildTypesBlock) {
    let buildTypesStr = contents.slice(buildTypesBlock.start, buildTypesBlock.end + 1)

    // 確保 release block 使用 signingConfigs.release (如果有的話)
    const releaseBlock = findBlock(buildTypesStr, 'release')
    if (releaseBlock) {
      let releaseStr = buildTypesStr.slice(releaseBlock.start, releaseBlock.end + 1)
      if (!releaseStr.includes('signingConfigs.release')) {
        // 替換現有的 signingConfig 或插入新的
        if (releaseStr.includes('signingConfig')) {
          releaseStr = releaseStr.replace(/signingConfig signingConfigs\.\w+/, 'signingConfig signingConfigs.release')
        } else {
          const lastBrace = releaseStr.lastIndexOf('}')
          releaseStr = releaseStr.slice(0, lastBrace) + '        signingConfig signingConfigs.release\n    }' + releaseStr.slice(lastBrace + 1)
        }
        buildTypesStr = buildTypesStr.slice(0, releaseBlock.start) + releaseStr + buildTypesStr.slice(releaseBlock.end + 1)
      }
    }

    contents =
      contents.slice(0, buildTypesBlock.start) +
      buildTypesStr +
      contents.slice(buildTypesBlock.end + 1)
  }

  return contents
}

module.exports = withAndroidPlugin
