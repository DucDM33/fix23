import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
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
import MapView, { Marker, UrlTile } from "react-native-maps";

const SUGGESTIONS = [
  "Thành phố Hồ Chí Minh",
  "Đường hoa Nguyễn Huệ",
  "Hà Giang",
  "Quy Nhơn",
];

type Step2Props = {
  destination: string;
  setDestination: (text: string) => void;
  numberOfPeople: string;
  setNumberOfPeople: (text: string) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Step2LocationPeople({
  destination,
  setDestination,
  numberOfPeople,
  setNumberOfPeople,
  onNext,
  onBack,
}: Step2Props) {
  const user = useAuthStore((state) => state.user);
  const avatarUrl = user?.avatar || "https://via.placeholder.com/100";

  const [region, setRegion] = useState({
    latitude: 10.762622,
    longitude: 106.660172,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!destination) return;

      fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          destination
        )}`,
        {
          headers: {
            "User-Agent": "MyTravelApp/1.0 (ducdm303@gmail.com)",
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            const loc = data[0];
            console.log("📍 Found location:", loc);
            setRegion({
              latitude: parseFloat(loc.lat),
              longitude: parseFloat(loc.lon),
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            });
          } else {
            console.log("Không tìm thấy địa điểm");
          }
        })
        .catch((err) => {
          console.error("Lỗi lấy tọa độ:", err);
        });
    }, 800);

    return () => clearTimeout(timeout);
  }, [destination]);

  const handleSelectSuggestion = (text: string) => {
    setDestination(text);
    setShowSuggestions(false);
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Tạo chuyến đi</Text>
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        </View>

        {/* Địa điểm */}
        <Text style={styles.sectionTitle}>Địa điểm muốn đi</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            value={destination}
            onChangeText={(text) => {
              setDestination(text);
              setShowSuggestions(true);
            }}
            placeholder="Nhập tên địa điểm"
          />
          <Ionicons
            name="search"
            size={20}
            color="#2563eb"
            style={styles.searchIcon}
          />
        </View>

        {showSuggestions && (
          <View style={styles.suggestionBox}>
            <Text style={styles.suggestionTitle}>Gợi ý</Text>
            {SUGGESTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(item)}
              >
                <Ionicons name="location-outline" size={18} color="#444" />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bản đồ */}
        <MapView style={styles.map} region={region} pointerEvents="none">
          <UrlTile
            urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maximumZ={19}
          />
          <Marker coordinate={region} />
        </MapView>

        {/* Số người */}
        <Text style={styles.sectionTitle}>Số lượng người đi</Text>
        <View style={{ alignItems: "center", marginTop: 8 }}>
          <Ionicons name="people-outline" size={48} color="#3b82f6" />
        </View>

        <View style={styles.peopleRow}>
          <TouchableOpacity
            onPress={() => {
              const current = parseInt(numberOfPeople || "1");
              setNumberOfPeople(`${Math.max(current - 1, 1)}`);
            }}
          >
            <Ionicons name="remove-circle-outline" size={30} color="#333" />
          </TouchableOpacity>

          <Text style={styles.peopleText}>{numberOfPeople || "1"}</Text>

          <TouchableOpacity
            onPress={() => {
              const current = parseInt(numberOfPeople || "1");
              setNumberOfPeople(`${current + 1}`);
            }}
          >
            <Ionicons name="add-circle-outline" size={30} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => {
            if (!destination.trim()) {
              alert("Vui lòng nhập địa điểm muốn đi.");
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
    paddingBottom: 100,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#1e3a8a",
    alignSelf: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    flex: 1,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginLeft: 8,
  },
  suggestionBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    elevation: 2,
  },
  suggestionTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    color: "#2563eb",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    gap: 6,
  },
  suggestionText: {
    fontSize: 14,
  },
  map: {
    height: 250,
    marginTop: 12,
    borderRadius: 12,
  },
  peopleRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 20,
  },
  peopleText: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
    minWidth: 30,
    textAlign: "center",
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
