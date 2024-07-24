import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import CharacterList from './src/components/CharacterList';

const App: React.FC = () => {
  const handleOnFilterIcon = () => {
    console.log('clicked to filter icon');
  };

  return (
    <SafeAreaView style={styles.container}>
      <GestureHandlerRootView>
        <CharacterList handleOnFilterIcon={handleOnFilterIcon} />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
