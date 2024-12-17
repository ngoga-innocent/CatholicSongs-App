import React, { useRef, useEffect } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { dimensions } from './Global';

const Skeleton = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const shimmerBackground = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#adadad', '#ffffff'], // Background colors for shimmer effect
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.skeletonBox,
          { backgroundColor: shimmerBackground },
        ]}
      />
      <Animated.View
        style={[
          styles.skeletonCircle,
          { backgroundColor: shimmerBackground },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: dimensions.width * 0.96,
    height: dimensions.height * 0.07,
    backgroundColor: '#adadad',
    borderRadius: 8,
    overflow: 'hidden',
  },
  skeletonBox: {
    flex: 1,
    marginLeft: 10,
    width: dimensions.width * 0.9,
    height: dimensions.width * 0.2,
    borderRadius: 10,
  },
  skeletonCircle: {
    flex: 1,
    width: dimensions.width * 0.9,
    height: dimensions.width * 0.9,
    borderRadius: dimensions.width * 0.1,
  },
});

export default Skeleton;
