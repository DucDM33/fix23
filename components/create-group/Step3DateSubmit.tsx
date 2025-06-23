import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { format } from "date-fns";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

type Step3Props = {
  image: { uri: string } | null;
  destination: string;
  numberOfPeople: string;
  description: string;
  roomType: string;
  interests: string;
  personality: string;
  travelStyle: string;
  onBack: () => void;
};

export default function Step3DatePicker({
  image,
  destination,
  numberOfPeople,
  description,
  roomType,
  interests,
  personality,
  travelStyle,
  onBack,
}: Step3Props) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const avatarUrl = user?.avatar || "https://via.placeholder.com/100";

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleDayPress = (day: any) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(day.dateString);
      setEndDate("");
    } else if (day.dateString < startDate) {
      setStartDate(day.dateString);
    } else {
      setEndDate(day.dateString);
    }
  };

  const getMarkedDates = () => {
    const marked: any = {};
    if (startDate) {
      marked[startDate] = {
        startingDay: true,
        color: "#60a5fa",
        textColor: "white",
      };
    }
    if (endDate && startDate) {
      let current = new Date(startDate);
      const last = new Date(endDate);
      while (current <= last) {
        const date = format(current, "yyyy-MM-dd");
        marked[date] = {
          color: "#bfdbfe",
          textColor: "black",
        };
        current.setDate(current.getDate() + 1);
      }
      marked[endDate] = {
        endingDay: true,
        color: "#2563eb",
        textColor: "white",
      };
    }
    return marked;
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      return Alert.alert("Vui lòng chọn ngày bắt đầu và kết thúc.");
    }

    if (!user || !token) {
      Alert.alert("Lỗi", "Không tìm thấy người dùng hoặc token.");
      return;
    }

    try {
      const groupChatData = {
        destination,
        numberOfPeople: parseInt(numberOfPeople),
        description,
        departureDate: startDate,
        arrivalDate: endDate,
        roomType,
        interests,
        personalities: personality,
        travelStyle,
      };

      const formData = new FormData();
      formData.append("group", JSON.stringify(groupChatData));

      if (image?.uri) {
        const filename = image.uri.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append("image", {
          uri: image.uri,
          name: filename,
          type,
        } as any);
      }
      const response = await axios.post(
        `http://150.95.111.137:8080/api/group-chat/create2?creatorId=${user.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const created = response.data;
      Alert.alert("Tạo nhóm thành công!");
      router.push({ pathname: "/groupChat/[id]", params: { id: created.id } });
    } catch (error: any) {
      console.log("Submit error >>>", error.response?.data || error.message);
      Alert.alert("Lỗi", "Không thể tạo nhóm. Vui lòng thử lại.");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Tạo chuyến đi</Text>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </View>

      <Text style={styles.label}>Ngày đi dự kiến của bạn</Text>
      <Calendar
        markingType="period"
        markedDates={getMarkedDates()}
        onDayPress={handleDayPress}
        minDate={format(new Date(), "yyyy-MM-dd")}
        theme={{
          selectedDayBackgroundColor: "#2563eb",
          todayTextColor: "#2563eb",
        }}
      />

      <TouchableOpacity style={styles.doneButton} onPress={handleSubmit}>
        <Text style={styles.doneText}>Hoàn thành</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#000" },
  avatar: { width: 36, height: 36, borderRadius: 18 },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1e3a8a",
    alignSelf: "center",
  },
  doneButton: {
    backgroundColor: "#f87171",
    padding: 14,
    borderRadius: 14,
    marginTop: 30,
    alignItems: "center",
  },
  doneText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
