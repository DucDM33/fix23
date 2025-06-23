import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreatePostScreen() {
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const token = useAuthStore((state) => state.token);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!caption || !imageUri) {
      Alert.alert("Lỗi", "Vui lòng nhập nội dung và chọn ảnh.");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("content", caption); // Đảm bảo đúng key như backend yêu cầu
      formData.append("image", {
        uri: imageUri,
        type: "image/jpeg",
        name: "photo.jpg",
      } as any);

      const res = await axios.post(
        "http://150.95.111.137:8080/api/post", // API post của bạn
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Alert.alert("Thành công", "Bài viết đã được đăng.");
      router.back();
    } catch (err: any) {
      console.error("Upload failed:", err.response?.data || err.message);
      Alert.alert("Lỗi", "Không thể đăng bài viết.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Tạo bài viết mới</Text>

      <TextInput
        style={styles.input}
        placeholder="Bạn đang nghĩ gì..."
        multiline
        value={caption}
        onChangeText={setCaption}
      />

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>+ Chọn ảnh</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, uploading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>🚀 Đăng bài</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#2c3e50",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    textAlignVertical: "top",
    minHeight: 120,
    fontSize: 15,
  },
  imagePicker: {
    height: 200,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#bbb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },
  imagePickerText: {
    color: "#888",
    fontSize: 16,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
