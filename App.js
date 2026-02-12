import React, { useEffect } from 'react'
import { AppState, Text, View } from 'react-native'
// import { createStore, compose, applyMiddleware } from 'redux'
// import { Provider } from 'react-redux'
// import { thunk } from 'redux-thunk'
import Bugsnag from '@bugsnag/expo'
import { NavigationContainer } from '@react-navigation/native'
import codePush from '@revopush/react-native-code-push'
import { applicationName } from 'expo-application'
import 'react-native-gesture-handler'

// import '~/locales'
// import reducers from '~/reducers'

// import AppContainer from '~/app'
// import ErrorView from '~/app/containers/ErrorView'

Bugsnag.start({
  onError: (event) => {
    const errorMsg = event.errors[0].errorMessage
    return !errorMsg.includes('Network request failed')
  }
})
// const ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React)

// const composeEnhancers = process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//   ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//   : compose

// const store = createStore(reducers, composeEnhancers(
//   applyMiddleware(thunk)
// ))

const App = () => {
  useEffect(() => {
    process.env.NODE_ENV === 'production' && codePush.sync({ installMode: codePush.InstallMode.IMMEDIATE })

    const handleAppStateChange = nextAppState => {
      nextAppState === 'active' && process.env.NODE_ENV === 'production' && codePush.sync({ installMode: codePush.InstallMode.IMMEDIATE })
    }
    AppState.addEventListener('change', handleAppStateChange)
    return () => AppState.addEventListener('change', handleAppStateChange).remove()
  }, [])

  return (
    // <Provider store={store}>
    <NavigationContainer>
      {/* <ErrorBoundary FallbackComponent={ErrorView}> */}
      {/* <AppContainer /> */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello World!</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', backgroundColor: 'yellow' }}>{applicationName}</Text>
      </View>
      {/* </ErrorBoundary> */}
    </NavigationContainer>
    // </Provider>
  )
}

export default App
