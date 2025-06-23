import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://150.95.111.137:8080/api/user/me", {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Lỗi tải thông tin user:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchUser();
    }
  }, [user?.accessToken]);

  const handlePickImage = async (field: "avatarUrl" | "backgroundUrl") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      const formData = new FormData();
      formData.append("file", {
        uri: image.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      try {
        const res = await axios.post(
          "http://150.95.111.137:8080/api/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUserData((prev: any) => ({ ...prev, [field]: res.data }));
      } catch (err) {
        console.error("Upload lỗi:", err);
        Alert.alert("Lỗi", "Không thể tải ảnh lên");
      }
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.put(
        "http://150.95.111.137:8080/api/user/me",
        {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          avatarUrl: userData.avatarUrl,
          backgroundUrl: userData.backgroundUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
      Alert.alert("Thành công", "Cập nhật thông tin thành công");
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable onPress={() => handlePickImage("backgroundUrl")}>
        <Image
          source={{
            uri:
              userData.backgroundUrl ||
              "https://via.placeholder.com/600x200.png?text=Background",
          }}
          style={styles.cover}
        />
        <Text style={styles.editOverlay}>Sửa ảnh nền</Text>
      </Pressable>

      <Pressable
        style={{ alignSelf: "flex-start", marginTop: -40, marginLeft: 20 }}
        onPress={() => handlePickImage("avatarUrl")}
      >
        <Image
          source={{
            uri:
              userData.avatarUrl ||
              "https://via.placeholder.com/100.png?text=Avatar",
          }}
          style={styles.avatar}
        />
        <Text style={styles.editAvatar}>✏️</Text>
      </Pressable>

      <View style={styles.form}>
        <Text style={styles.label}>Họ</Text>
        <TextInput
          value={userData.firstName}
          onChangeText={(text) =>
            setUserData((prev: any) => ({ ...prev, firstName: text }))
          }
          style={styles.input}
        />

        <Text style={styles.label}>Tên</Text>
        <TextInput
          value={userData.lastName}
          onChangeText={(text) =>
            setUserData((prev: any) => ({ ...prev, lastName: text }))
          }
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={userData.email}
          onChangeText={(text) =>
            setUserData((prev: any) => ({ ...prev, email: text }))
          }
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          value={userData.phoneNumber}
          onChangeText={(text) =>
            setUserData((prev: any) => ({ ...prev, phoneNumber: text }))
          }
          keyboardType="phone-pad"
          style={styles.input}
        />

        <Pressable
          onPress={handleSave}
          style={{
            backgroundColor: "#3498db",
            padding: 12,
            borderRadius: 8,
            marginTop: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/change-password")}
          style={{ marginTop: 16, alignItems: "center" }}
        >
          <Text style={{ color: "#3498db", fontWeight: "bold" }}>
            Thay đổi mật khẩu
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  cover: {
    width: "100%",
    height: 200,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  editOverlay: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#0006",
    color: "#fff",
    padding: 6,
    borderRadius: 6,
    fontSize: 12,
  },
  editAvatar: {
    position: "absolute",
    bottom: 0,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
    fontSize: 14,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#444",
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 8,
    marginBottom: 16,
  },
});
