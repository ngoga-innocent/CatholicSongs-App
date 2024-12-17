import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { dimensions } from './Global';

const ESkeleton = () => {
  const shimmerValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();
    return () => shimmerAnimation.stop();
  }, [shimmerValue]);

  const shimmerBackground = shimmerValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#adadad', '#ffffff'],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: shimmerBackground },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: dimensions.width * 0.96,
    height: dimensions.height * 0.3,
    borderRadius: 10,
  },
});

export default ESkeleton;
