import { Client } from "@stomp/stompjs";
import { Stack, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import SockJS from "sockjs-client";
import { useAuthStore } from "../store/authStore";

export default function PendingScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    if (!user) return;
      
    const client = new Client({
      webSocketFactory: () => new SockJS("http://150.95.111.137:8080/ws"),
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
    });

    client.onConnect = () => {
      console.log("✅ STOMP connected");
      client.subscribe(`/topic/wallet-updated/${user.id}`, () => {
        console.log("📩 wallet updated");
        showSuccessAnimation();
      });
      client.subscribe(`/topic/rank-updated/${user.id}`, () => {
        console.log("📩 rank updated");
        showSuccessAnimation();
      });
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [user]);

  const showSuccessAnimation = () => {
    setIsSuccess(true);
    animationRef.current?.play();

    setTimeout(() => {
      router.replace("/wallet");
    }, 2500);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Đang xử lý thanh toán..." }} />

      {!isSuccess ? (
        <>
          <LottieView
            autoPlay
            loop
            style={styles.lottie}
            source={require("../assets/animations/loading.json")}
          />
          <Text style={styles.text}>Vui lòng chờ trong giây lát...</Text>
        </>
      ) : (
        <>
          <LottieView
            ref={animationRef}
            loop={false}
            style={styles.lottie}
            source={require("../assets/animations/success.json")}
          />
          <Text style={styles.successText}>Giao dịch thành công!</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  successText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
    color: "green",
  },
  lottie: {
    width: 150,
    height: 150,
  },
});
