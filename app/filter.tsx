import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

// Component Section với scroll ngang cho options dài
const Section = ({
  title,
  options,
  selected,
  onSelect,
  horizontal = false,
  disabled = false,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  horizontal?: boolean;
  disabled?: boolean;
}) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {horizontal ? (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionRow}
      >
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            disabled={disabled}
            style={[
              styles.optionButton,
              selected === opt && styles.optionButtonSelected,
              disabled && { opacity: 0.5 },
            ]}
            onPress={() => onSelect(opt)}
          >
            <Text
              style={[
                styles.optionText,
                selected === opt && styles.optionTextSelected,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    ) : (
      <View style={styles.optionRow}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            disabled={disabled}
            style={[
              styles.optionButton,
              selected === opt && styles.optionButtonSelected,
              disabled && { opacity: 0.5 },
            ]}
            onPress={() => onSelect(opt)}
          >
            <Text
              style={[
                styles.optionText,
                selected === opt && styles.optionTextSelected,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

export default function FilterScreen() {
  const rank = useAuthStore((state) => state.user?.rank);
  const [gender, setGender] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [interestGender, setInterestGender] = useState("");
  const [personality, setPersonality] = useState("");
  const [travelType, setTravelType] = useState<string>("");

  const travelTypeOptions = [
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
  ];

  const handleApply = () => {
    const filters = {
      gender,
      location,
      time,
      ageGroup,
      interestGender,
      personality,
      travelType,
    };

    router.push({
      pathname: "/groupChatView", // đường dẫn của FindGroupScreen
      params: filters,
    });
  };
 

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Bộ lọc</Text>

      <Section
        title="Bạn muốn người đồng hành của mình là"
        options={["Nam", "Nữ", "Mọi người"]}
        selected={gender}
        onSelect={setGender}
        disabled={rank === "BAC"}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Địa điểm muốn đến</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập địa điểm (VD: Đà Lạt)"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <Section
        title="Khoảng thời gian có thể đi"
        options={[
          "Tháng 1",
          "Tháng 2",
          "Tháng 3",
          "Tháng 4",
          "Tháng 5",
          "Tháng 6",
          "Tháng 7",
          "Tháng 8",
          "Tháng 9",
          "Tháng 10",
          "Tháng 11",
          "Tháng 12",
        ]}
        selected={time}
        onSelect={setTime}
        horizontal
      />

      <Section
        title="Nhóm tuổi bạn muốn tham gia cùng"
        options={["18-23 tuổi", "23-30 tuổi", "trên 30 tuổi"]}
        selected={ageGroup}
        onSelect={setAgeGroup}
      />

      <Section
        title="Sở thích"
        options={[
          "Thích ăn uống",
          "Thích khám phá",
          "Thích chụp ảnh",
          "Thích tán gẫu",
          "Thích thư giãn",
        ]}
        selected={interestGender}
        onSelect={setInterestGender}
        horizontal
        disabled={rank === "BAC"}
      />

      <Section
        title="Tính cách"
        options={[
          "Hướng nội",
          "Hướng ngoại",
          "Linh Hoạt",
          "Hoài Niệm",
          "Mạo Hiểm",
        ]}
        selected={personality}
        horizontal
        onSelect={setPersonality}
        disabled={rank === "BAC"}
      />

      <Section
        title="Hình thức du lịch yêu thích của bạn"
        options={travelTypeOptions}
        selected={travelType}
        onSelect={setTravelType}
        horizontal
        disabled={rank === "BAC"}
      />

      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyButtonText}>Xong</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginTop: 40,
    marginBottom: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#003366",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingRight: 12,
    paddingVertical: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    fontSize: 14,
  },
  optionButton: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: "#007AFF",
  },
  optionText: {
    color: "#333",
    fontSize: 13,
  },
  optionTextSelected: {
    color: "#fff",
  },
  applyButton: {
    backgroundColor: "#f87171",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 50,
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  clearButton: {
    backgroundColor: "#fca5a5", // Màu đỏ nhạt
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff", // Chữ trắng
    fontWeight: "bold",
  },
});
