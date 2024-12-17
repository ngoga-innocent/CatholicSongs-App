import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons'; // Adjust based on the icon library you're using
import { dimensions } from './Global';

const Sskeleton = () => {
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
    <View style={styles.container}>
      <FontAwesome6 name="file-pdf" size={27} color="#F40F02" />
      <View style={styles.textContainer}>
        <Animated.View
          style={[styles.textLine, { width: '80%', backgroundColor: shimmerBackground }]}
        />
        <Animated.View
          style={[styles.textLine, { width: '70%', height: 20, backgroundColor: shimmerBackground }]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    padding: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: 'column',
    width: dimensions.width * 0.2,
    height: dimensions.width * 0.2,
  },
  textLine: {
    height: 25,
    marginVertical: 3,
    borderRadius: 4,
  },
});

export default Sskeleton;
