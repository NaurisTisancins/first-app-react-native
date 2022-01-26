import * as React from 'react';
import { View, StyleSheet, Text, Vibration, Platform } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import {useKeepAwake} from 'expo-keep-awake';

import { color } from '../../utils/color';
import { spacing, fontSizes } from '../../utils/sizes';
import { Countdown } from '../../components/Countdown';
import { RoundedButton } from '../../components/RoundedButton';
import { Timing } from './Timing';

export const Timer = ({ focusSubject, onTimerEnd, clearSubject }) => {
  useKeepAwake();
  const [minutes, setMinutes] = React.useState(0.1);
  const [isStarted, setStarted] = React.useState(false);
  const [progress, setProgress] = React.useState(1);

  const onProgress = (progress) => {
    setProgress(progress);
  };

  const vibrate = () => {
    Vibration.vibrate();
  }

  const onEnd = () => {
    setMinutes(0);
    setProgress(1);
    setStarted(false);
    onTimerEnd();
    vibrate();
  }

  const changeTime = (min) => {
    setMinutes(min);
    setProgress(1);
    setStarted(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.countdown}>
        <Countdown
          minutes={minutes}
          isPaused={!isStarted}
          onProgress={onProgress}
          onEnd={onEnd}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Focusing on: </Text>
        <Text style={styles.task}>{focusSubject}</Text>
      </View>
      <ProgressBar progress={progress} />
      <View style={styles.buttons}>
        <Timing onChangeTime={changeTime} />
      </View>
      <View style={styles.buttons}>
        {isStarted ? (
          <RoundedButton
            title="||"
            size={70}
            onPress={() => {
              setStarted(false);
            }}
          />
        ) : (
          <RoundedButton
            title=">"
            size={70}
            onPress={() => {
              setStarted(true);
            }}
          />
        )}
      </View>
        <View style={styles.clearSubject}>
           <RoundedButton
            title="-"
            size={60}
            onPress={() => {
              clearSubject();
            }}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  countdown: {
    flex: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    paddingTop: spacing.xxl,
  },
  title: {
    color: color.white,
    textAlign: 'center',
    fontSize: fontSizes.lg,
  },
  task: {
    color: color.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttons: {
    flex: 0.2,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearSubject: {
    paddingBottom: 25,
    paddingLeft: 25,
  },
});
