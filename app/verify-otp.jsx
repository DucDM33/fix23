import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OTPVerifyScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // lấy email từ URL param

  const [otp, setOtp] = useState("");

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã xác minh");
      return;
    }

    try {
      const res = await fetch("http://150.95.111.137:8080/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otpCode: otp,
        }),
      });

      const raw = await res.text();
      console.log("Raw response:", raw);

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Xác minh OTP thất bại");
      }

      Alert.alert("Thành công", "Xác minh OTP thành công!");
      router.replace("/login");
    } catch (err) {
      Alert.alert("Lỗi", err.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/login-bg.png")}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Nhập mã xác minh từ tin nhắn văn bản</Text>
          <Text style={styles.subText}>
            Để xác nhận đây là số điện thoại của bạn, vui lòng nhập mã bạn đã
            nhận được qua tin nhắn văn bản
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Nhập mã xác minh"
            keyboardType="numeric"
            maxLength={6}
            value={otp}
            onChangeText={setOtp}
          />

          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton}>
            <Text style={styles.resendText}>Gửi lại mã xác minh</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    padding: 24,
    paddingTop: 290,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D4D7A",
    marginBottom: 16,
  },
  subText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#0C4A7F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendButton: {
    backgroundColor: "#eee",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  resendText: {
    color: "#999",
    fontWeight: "500",
  },
});
