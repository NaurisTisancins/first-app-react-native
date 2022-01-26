import * as React from 'react';
import { Text, View, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Focus } from './src/features/focus/Focus';
import { FocusHistory } from './src/features/focus/FocusHistory';
import { Timer } from './src/features/timer/Timer';
import { color } from './src/utils/color';
import { spacing } from './src/utils/sizes';

export default function App() {
  const [focusSubject, setFocusSubject] = React.useState(null);
  const [focusHistory, setFocusHistory] = React.useState([]);

  const addFocusHistorySubjectWithState = (subject, status) => {
    setFocusHistory(() => {
      return [
        ...focusHistory,
        {
          key: String(focusHistory.length + 1),
          subject,
          complete: status,
        },
      ];
    });
  };

  const onTimerEnd = () => {
    addFocusHistorySubjectWithState(focusSubject, true);
    setFocusSubject(null);
  };

  const onClearSubject = () => {
    addFocusHistorySubjectWithState(focusSubject, false);
    setFocusSubject(null);
  };

  const onClear = () => {
    setFocusHistory([]);
  };

  const saveFocusHistory = async () => {
    try {
      await AsyncStorage.setItem("focusHistory", JSON.stringify(focusHistory))
    } catch (e) {
      console.log(e);
    }
  };

  const loadFocusHistory = async () => {
    try{
      const history = await AsyncStorage.getItem("focusHistory");

      if(history && JSON.parse(history).length) {
        setFocusHistory(JSON.parse(history))
      }
    }catch(e) {
      console.log(e);
    }
  }

  React.useEffect(()=> {
    loadFocusHistory();
  }, [])

  React.useEffect(() => {
    saveFocusHistory();
  }, [focusHistory]);

  return (
    <View style={styles.container}>
      {focusSubject ? (
        <Timer
          focusSubject={focusSubject}
          onTimerEnd={onTimerEnd}
          clearSubject={onClearSubject}
        />
      ) : (
        <View style={{flex: 0.5}}>
          <Focus addSubject={setFocusSubject} />
          <FocusHistory focusHistory={focusHistory} onClear={onClear} />
        </View>
      )}
      <Text>{focusSubject}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.xxl,
    backgroundColor: color.darkBlue,
  },
});
