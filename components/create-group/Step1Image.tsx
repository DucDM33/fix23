import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Step1ImageProps = {
  image: { uri: string } | null;
  onImageSelected: (image: { uri: string }) => void;
  onNext: () => void;
  description: string;
  setDescription: (text: string) => void;
  interests: string;
  personality: string;
  travelStyle: string;
  setInterests: (text: string) => void;
  setPersonality: (text: string) => void;
  setTravelStyle: (text: string) => void;
};

export default function Step1Image({
  image,
  onImageSelected,
  onNext,
  description,
  setDescription,
  interests,
  setInterests,
  personality,
  setPersonality,
  travelStyle,
  setTravelStyle,
}: Step1ImageProps) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const avatarUrl = user?.avatar || "https://via.placeholder.com/100";

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Thông báo", "Bạn cần cấp quyền để chọn ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      onImageSelected({ uri: result.assets[0].uri });
    }
  };

  const toggleTagString = (
    tag: string,
    value: string,
    setter: (val: string) => void
  ) => {
    const tags = value.split(", ").filter((t) => t.trim() !== "");
    if (tags.includes(tag)) {
      const updated = tags.filter((t) => t !== tag).join(", ");
      setter(updated);
    } else {
      const updated = [...tags, tag].join(", ");
      setter(updated);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Tạo chuyến đi</Text>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>

        <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image.uri }} style={styles.image} />
          ) : (
            <Ionicons name="image-outline" size={50} color="#999" />
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Sở thích</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Chọn sở thích bên dưới"
          value={interests}
          editable={false}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsRow}>
          {["Thích ăn uống", "Thích khám phá", "Thích chụp ảnh", "Thích tán gẫu", "Thích thư giãn"].map((tag) => {
            const isSelected = interests.split(", ").includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => toggleTagString(tag, interests, setInterests)}
              >
                <Text style={[styles.tagText, isSelected && styles.tagSelectedText]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Tính cách</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Chọn tính cách bên dưới"
          value={personality}
          editable={false}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsRow}>
          {["Hướng ngoại", "Hướng nội", "Linh hoạt", "Hoài niệm", "Mạo hiểm"].map((tag) => {
            const isSelected = personality.split(", ").includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => toggleTagString(tag, personality, setPersonality)}
              >
                <Text style={[styles.tagText, isSelected && styles.tagSelectedText]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Hình thức du lịch</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Chọn hình thức du lịch bên dưới"
          value={travelStyle}
          editable={false}
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsRow}>
          {[
            "Du lịch xa",
            "Du lịch gần",
            "Du lịch một mình",
            "Du lịch nhóm",
            "Du lịch gia đình",
            "Du lịch mạo hiểm",
            "Du lịch nghỉ dưỡng",
            "Du lịch sinh thái",
            "Du lịch lịch sử",
            "Du lịch ẩm thực",
            "Du lịch tâm linh",
          ].map((tag) => {
            const isSelected = travelStyle.split(", ").includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.tag, isSelected && styles.tagSelected]}
                onPress={() => toggleTagString(tag, travelStyle, setTravelStyle)}
              >
                <Text style={[styles.tagText, isSelected && styles.tagSelectedText]}>{tag}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <Text style={styles.label}>Mô tả nhóm</Text>
        <TextInput
          style={[styles.textInput, { height: 80 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (!image) {
              Alert.alert("Thông báo", "Vui lòng chọn ảnh cho nhóm trước khi tiếp tục.");
              return;
            }
            onNext();
          }}
        >
          <Text style={styles.nextText}>Tiếp</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: "#f9f9f9",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#000" },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  imageBox: {
    width: "80%",
    height: 400,
    borderRadius: 16,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  image: { width: "100%", height: "100%", borderRadius: 16 },
  label: { marginTop: 10, marginBottom: 4, fontWeight: "600", fontSize: 14 },
  textInput: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "#dbeafe",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginTop: 6,
  },
  tagSelected: {
    backgroundColor: "#2563eb",
  },
  tagText: {
    color: "#2563eb",
    fontSize: 13,
    fontWeight: "500",
  },
  tagSelectedText: {
    color: "#fff",
  },
  nextButton: {
    backgroundColor: "#f87171",
    padding: 14,
    borderRadius: 14,
    marginTop: 30,
    alignItems: "center",
  },
  nextText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
