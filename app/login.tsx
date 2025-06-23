import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomAlert from "../components/CustomAlert";
import { useAuthStore } from "../store/authStore";
import PrivacyPolicyModal from "./PrivacyPolicyModal";

// Thay đổi URL tại đây nếu server bạn khác
const API_ENDPOINT = "http://150.95.111.137:8080/api/login";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const router = useRouter();

  // Thêm biến để kiểm soát CustomAlert
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const handleLogin = async () => {
    try {
      const response = await axios.post(API_ENDPOINT, {
        username,
        password,
      });

      const data = response.data;
      const fullName = `${data.lastName} ${data.firstName}`.trim();
      const user = {
        id: data.id ?? 0,
        fullName,
        avatar: data.avatarUrl,
        role: data.role,
        rank: data.userRank,
        balance: data.balance,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };

      setUser(user);
      router.replace("/(tabs)");
    } catch (err) {
      let message = "Sai tài khoản hoặc mật khẩu";
      if (
        axios.isAxiosError(err) &&
        err.response?.data?.message &&
        typeof err.response.data.message === "string"
      ) {
        message = "Sai tài khoản hoặc mật khẩu";
      }
      setErrorMessage(message);
      setErrorVisible(true);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/login-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.logo}>Wetrip</Text>

          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#666"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#666"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Đăng nhập</Text>
          </TouchableOpacity>

          <View style={styles.linksContainer}>
            <TouchableOpacity>
              <Text style={styles.link}>Quên mật khẩu?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.link}>Tạo tài khoản mới</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => setShowPrivacyModal(true)}>
            <Text style={(styles.footerText, styles.linkText)}>
              Điều khoản & điều kiện của Wetrip
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowPrivacyModal(true)}>
            <Text style={(styles.footerText, styles.linkText)}>
              Chính sách quyền riêng tư
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>Đã bảo vệ bởi ©</Text>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Alert khi login lỗi */}
      <CustomAlert
        visible={errorVisible}
        message={errorMessage}
        onClose={() => setErrorVisible(false)}
      />
      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  innerContainer: {
    paddingHorizontal: 30,
    paddingTop: 300,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    color: "#003366",
  },
  input: {
    backgroundColor: "#f1f1f1",
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: "#0C4A7F",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingHorizontal: 5,
  },
  link: {
    color: "#0C4A7F",
    fontSize: 14,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    gap: 2,
    marginBottom: 25,
  },
  footerText: {
    fontSize: 10,
    color: "#999",
  },
  linkText: {
    color: "#007AFF", // màu xanh dương giống iOS
    textDecorationLine: "underline",
  },
});
