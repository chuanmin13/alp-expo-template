const { withAppBuildGradle } = require('@expo/config-plugins')

const withAndroidPlugin = (config) => {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'gradle') {
      config.modResults.contents = modifyAppBuildGradle(config.modResults.contents)
    }
    return config
  })
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

/**
 * 在指定 buildType block（debug / release）內：
 * 1. 移除舊的 signingConfig 行
 * 2. 在 block 結尾前插入新的 signingConfig
 *
 * @param {string} contents  僅包含 buildTypes { ... } 的字串
 */
function setSigningConfig(contents, buildType, signingConfigValue) {
  const block = findBlock(contents, buildType)
  if (!block) return contents

  let blockStr = contents.slice(block.start, block.end + 1)

  // 移除已存在的 signingConfig 行
  blockStr = blockStr.replace(/\n[ \t]*signingConfig signingConfigs\.\w+/g, '')

  // 在結尾 } 前插入
  const lastBrace = blockStr.lastIndexOf('}')
  blockStr =
    blockStr.slice(0, lastBrace) +
    `        signingConfig ${signingConfigValue}\n    }` +
    blockStr.slice(lastBrace + 1)

  return contents.slice(0, block.start) + blockStr + contents.slice(block.end + 1)
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

  // 1. 注入或替換整個 signingConfigs block（括號計數，避免 nested block 截斷問題）
  const signingBlock = findBlock(contents, 'signingConfigs')
  if (signingBlock) {
    contents =
      contents.slice(0, signingBlock.start) +
      signingConfigsBlock +
      contents.slice(signingBlock.end + 1)
  } else {
    contents = contents.replace(/(\s*buildTypes\s*\{)/, `\n${signingConfigsBlock}\n$1`)
  }

  // 2. 修改 buildTypes 內的 debug / release signingConfig
  //    只在 buildTypes block 範圍內操作，避免誤改 signingConfigs 裡的同名 block
  const buildTypesBlock = findBlock(contents, 'buildTypes')
  if (!buildTypesBlock) return contents

  let buildTypesStr = contents.slice(buildTypesBlock.start, buildTypesBlock.end + 1)
  buildTypesStr = setSigningConfig(buildTypesStr, 'debug', 'signingConfigs.debug')
  buildTypesStr = setSigningConfig(buildTypesStr, 'release', 'signingConfigs.release')

  contents =
    contents.slice(0, buildTypesBlock.start) +
    buildTypesStr +
    contents.slice(buildTypesBlock.end + 1)

  return contents
}

module.exports = withAndroidPlugin
