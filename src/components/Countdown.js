import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { color } from '../utils/color';
import { spacing, fontSizes } from '../utils/sizes';

const minutesToMillis = (min) => min * 1000 * 60;

const formatTime = (time) => {
  return time < 10 ? `0${time}` : time;
};

export const Countdown = ({ minutes = 20, isPaused, onProgress, onEnd }) => {
  const [millis, setMillis] = React.useState(minutesToMillis(minutes));
  const interval = React.useRef(null);

  const countDown = () => {
    setMillis((time) => {
      if (time === 0) {
        clearInterval(interval.current);
        return time;
      }
      const timeLeft = time - 1000;
      return timeLeft;
    });
  };

  React.useEffect(() => {
    onProgress(millis / minutesToMillis(minutes));
    if(millis === 0) {
      onEnd();
    }
  }, [millis]);

  React.useEffect(() => {
    setMillis(minutesToMillis(minutes));
  }, [minutes]);

  React.useEffect(() => {
    if (isPaused) {
      if (interval.current) clearInterval(interval.current);
      return;
    }
    interval.current = setInterval(countDown, 1000);

    return () => clearInterval(interval.current);
  }, [isPaused]);

  const minute = Math.floor(millis / 1000 / 60) % 60;
  const seconds = Math.floor(millis / 1000) % 60;

  return (
    <View>
      <Text style={styles.text}>
        {formatTime(minute)}:{formatTime(seconds)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {

  // },
  text: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: color.white,
    padding: spacing.lg,
    backgroundColor: 'rgba(94, 132, 226, 0.3)',
  },
});
