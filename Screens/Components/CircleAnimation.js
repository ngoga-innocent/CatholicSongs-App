import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, { Easing, useSharedValue, useAnimatedProps, withTiming } from 'react-native-reanimated';
import { COLORS, dimensions } from './Global';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({songs_number}) => {
  const [count, setCount] = useState(0); // Number for counting
  const progress = useSharedValue(0); // Shared value for the circle's progress

  // UseEffect to increment the count and progress
  useEffect(() => {
    progress.value = withTiming(100, { duration: 5000, easing: Easing.linear }); // Animate from 0 to 100

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 50); // Update count every 50ms (animation duration is 5s)

    return () => clearInterval(interval);
  }, []);

  // Animated props to handle circle's strokeDashoffset
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = 2 * Math.PI * 50 * (1 - progress.value / 100);
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={styles.container}>
      <Svg height="150" width="150" viewBox="0 0 120 120">
        {/* Background Circle */}
        <Circle cx="60" cy="60" r="50" stroke="#e6e6e6" strokeWidth="10" fill="none" />
        {/* Progress Circle */}
        <AnimatedCircle
          cx="60"
          cy="60"
          r="50"
          stroke="#3498db"
          strokeWidth="10"
          strokeDasharray={2 * Math.PI * 50}
          animatedProps={animatedProps}
          fill="none"
        />
      </Svg>
      {/* Text inside the circle */}
      <View style={styles.textContainer}>
        <Text style={styles.counter}>{songs_number} songs</Text>
      </View>
    </View>
  );
};

export default CircularProgress;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    borderRadius:dimensions.width * 0.02,
    marginTop:dimensions.height * 0.03
  },
  textContainer: {
    position: 'absolute', // Overlay text container
    justifyContent: 'center',
    alignItems: 'center',
    width: dimensions.width * 0.9, // Same size as the SVG container
    height: dimensions.height * 0.2,
  },
  counter: {
    fontSize: dimensions.width * 0.05,
    fontWeight: 'bold',
    color: COLORS.Primary, // Matches the circle color
  },
});
