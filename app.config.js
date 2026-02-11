export default ({ config }) => {
  return {
    ...config,
    extra: {
      ...(config.extra || {}),
      bugsnag: {
        apiKey: process.env.BUGSNAG_API_KEY
      }
    },
    plugins: [
      ...(config.plugins || []),
      [
        '@revopush/expo-code-push-plugin',
        {
          ios: {
            CodePushDeploymentKey: process.env.CODEPUSH_IOS_KEY,
            CodePushServerUrl: 'https://api.revopush.org'
          },
          android: {
            CodePushDeploymentKey: process.env.CODEPUSH_ANDROID_KEY,
            CodePushServerUrl: 'https://api.revopush.org'
          }
        }
      ]
    ]
  }
}
