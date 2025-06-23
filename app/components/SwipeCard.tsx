import { FontAwesome } from "@expo/vector-icons";
import { useRef } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import CloseIcon from "../../assets/images/Close.png";

import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SwipeCard({
  group,
  onSwipeRight,
  onSwipeLeft,
  zIndex,
}: any) {
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scrollRef = useRef<ScrollView>(null);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10]) // chỉ bắt gesture ngang mạnh
    .onUpdate((event) => {
      translateX.value = event.translationX;
      rotate.value = event.translationX / 20;
    })
    .onEnd((event) => {
      if (event.translationX > 150) {
        runOnJS(onSwipeRight)(group);
      } else if (event.translationX < -150) {
        runOnJS(onSwipeLeft)(group);
      } else {
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  const heartStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, 150], [0, 1], "clamp");
    const scale = interpolate(translateX.value, [0, 150], [0.5, 1.4], "clamp");
    return { opacity, transform: [{ scale }] };
  });

  const crossStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, -150], [0, 1], "clamp");
    const scale = interpolate(translateX.value, [0, -150], [0.5, 1.4], "clamp");
    return { opacity, transform: [{ scale }] };
  });
 

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle, { zIndex }]}>
        {/* Icon trái tim */}
        <Animated.View style={[styles.iconLeft, heartStyle]}>
          <FontAwesome name="heart" size={80} color="pink" />
        </Animated.View>

        {/* Icon hình chữ X */}
        <Animated.View style={[styles.iconRight, crossStyle]}>
          <Image source={CloseIcon} style={styles.crossIcon} />
        </Animated.View>

        {/* Nội dung chính */}
        <View style={{ flex: 1 }}>
          <Image source={{ uri: group.imageUrl }} style={styles.image} />

          <ScrollView
            ref={scrollRef}
            style={styles.infoScroll}
            contentContainerStyle={styles.infoContent}
            nestedScrollEnabled
            showsVerticalScrollIndicator
          >
            <Text style={styles.name}>{group.creatorName}</Text>
            <Text>📍 {group.destination}</Text>
            <Text>📅 {group.arrivalDate} - {group.departureDate}</Text>
            <Text>👥 {group.userIds.length}/{group.numberOfPeople} thành viên</Text>
            <Text>📝 {group.description}</Text>
            {group.interests && <Text>🎯 Sở thích: {group.interests}</Text>}
            {group.personalities && <Text>😄 Tính cách: {group.personalities}</Text>}
            {group.travelStyle && <Text>✈️ Hình thức du lịch: {group.travelStyle}</Text>}
          </ScrollView>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: SCREEN_WIDTH - 40,
    height: Dimensions.get("window").height * 0.9,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
    alignSelf: "center",
  },
  image: {
    width: "100%",
    height: Dimensions.get("window").height * 0.6,
    borderRadius: 10,
    marginBottom: 12,
  },
  infoScroll: {
    flex: 1,
  },
  infoContent: {
    paddingBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  iconLeft: {
    position: "absolute",
    top: 30,
    left: 40,
    zIndex: 10,
  },
  iconRight: {
    position: "absolute",
    top: 30,
    right: 40,
    zIndex: 10,
  },
  crossIcon: {
    width: 100,
    height: 100,
  },
});
