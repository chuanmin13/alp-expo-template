import React from 'react'

import { applicationName } from 'expo-application'
import { Text, View } from 'react-native'

const App = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello World!</Text>
      <Text style={{ fontSize: 20, fontWeight: 'bold', backgroundColor: 'yellow' }}>{applicationName}</Text>
    </View>
  )
}

export default App
