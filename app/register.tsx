import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState({ day: "", month: "", year: "" });
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [username, setUsername] = useState("");

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone: string) => /^[0-9]{9,11}$/.test(phone);

  const handleRegister = async () => {
    if (!firstName || !lastName || !username || !email || !phone || !password) {
      Alert.alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Email không hợp lệ");
      return;
    }
    const isValidDate = () => {
      const y = parseInt(dob.year),
        m = parseInt(dob.month),
        d = parseInt(dob.day);
      const date = new Date(y, m - 1, d);
      return (
        date.getFullYear() === y &&
        date.getMonth() === m - 1 &&
        date.getDate() === d
      );
    };

    if (!isValidDate()) {
      Alert.alert("Ngày sinh không hợp lệ");
      return;
    }

    if (!isValidPhone(phone)) {
      Alert.alert("Số điện thoại không hợp lệ");
      return;
    }

    if (!isAgreed) {
      Alert.alert("Bạn cần đồng ý với các điều khoản để tiếp tục");
      return;
    }

    try {
      const res = await fetch("http://150.95.111.137:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          username,
          email,
          gender,
          dayOfBirth: `${dob.year}-${dob.month}-${dob.day}`,
          phoneNumber: phone,
          password,
          role: "USER",
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Đăng ký thất bại");
      }
      router.push({
        pathname: "/verify-otp",
        params: { email },
      });
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
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
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={styles.title}>Tạo tài khoản</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              placeholder="Họ"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 5 }]}
              placeholder="Tên"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1, marginRight: 5 }]}
              placeholder="Ngày"
              keyboardType="numeric"
              maxLength={2}
              value={dob.day}
              onChangeText={(v) => setDob({ ...dob, day: v })}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginHorizontal: 5 }]}
              placeholder="Tháng"
              keyboardType="numeric"
              maxLength={2}
              value={dob.month}
              onChangeText={(v) => setDob({ ...dob, month: v })}
            />
            <TextInput
              style={[styles.input, { flex: 1, marginLeft: 5 }]}
              placeholder="Năm"
              keyboardType="numeric"
              maxLength={4}
              value={dob.year}
              onChangeText={(v) => setDob({ ...dob, year: v })}
            />
          </View>

          <View style={styles.row}>
            {["Nữ", "Nam", "Khác"].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderButton,
                  gender === g && styles.genderButtonActive,
                ]}
                onPress={() => setGender(g)}
              >
                <Text
                  style={[styles.genderText, gender === g && { color: "#fff" }]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            keyboardType="numeric"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <View style={styles.checkboxContainer}>
            <TouchableOpacity
              onPress={() => setIsAgreed(!isAgreed)}
              style={styles.checkbox}
            >
              <View
                style={[styles.checkboxBox, isAgreed && styles.checkboxChecked]}
              >
                {isAgreed && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                Tôi đồng ý với các điều khoản và chính sách quyền riêng tư. Tôi
                có thể nhận thông báo qua Email và có thể hủy đăng ký bất kỳ lúc
                nào.
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Đăng kí</Text>
          </TouchableOpacity>

          <View style={{ alignItems: "center", marginTop: 10 }}>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text style={{ color: "#0C4A7F" }}>Bạn đã có tài khoản?</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: { flex: 1, justifyContent: "center" },
  inner: { padding: 20, paddingTop: 150 },
  title: {
    fontSize: 24,
    color: "#0D4D7A",
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: "#0C4A7F",
  },
  genderText: {
    color: "#000",
  },
  registerButton: {
    backgroundColor: "#0C4A7F",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 10,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 3,
  },
  checkboxChecked: {
    backgroundColor: "#0C4A7F",
  },
  checkboxTick: {
    color: "#fff",
    fontSize: 14,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 12,
    color: "#333",
  },
});
