import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const mockHotels = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  name: "The Lake House Dalat",
  address: "Phường 3, Đà Lạt, Lâm Đồng",
  rating: 4.6,
  reviews: 250,
  image:
    "https://source.unsplash.com/random/300x200?house&sig=" + (i + 1),
}));

const locations = ["Đà Lạt", "Vũng Tàu", "Đà Nẵng"];

export default function HotelTab() {
  const [selectedLocation, setSelectedLocation] = useState("Đà Lạt");

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {/* Tìm kiếm */}
      <Text style={styles.sectionTitle}>Tìm kiếm khách sạn</Text>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Thành phố, địa điểm"
          style={styles.input}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      {/* Deals */}
      <Text style={styles.sectionTitle}>Deals</Text>
      <View style={styles.dealsRow}>
        {["WELCOMEWITHU5", "WELCOMEWITHU10", "WELCOMEWITHU15"].map((code) => (
          <View key={code} style={styles.dealCard}>
            <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
              Giảm giá lên đến 200k
            </Text>
            <Text style={{ fontSize: 12 }}>Chỉ áp dụng cho người mới</Text>
            <TouchableOpacity style={styles.couponButton}>
              <Text style={{ color: "#e74c3c", fontWeight: "bold" }}>
                {code}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Danh sách khách sạn */}
      <Text style={styles.sectionTitle}>
        Top những khách sạn được đánh giá cao
      </Text>

      {/* Tabs địa điểm */}
      <View style={styles.tabRow}>
        {locations.map((loc) => (
          <TouchableOpacity
            key={loc}
            onPress={() => setSelectedLocation(loc)}
            style={[
              styles.tabButton,
              selectedLocation === loc && styles.tabButtonActive,
            ]}
          >
            <Text
              style={{
                color: selectedLocation === loc ? "#fff" : "#333",
              }}
            >
              {loc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách khách sạn */}
      <FlatList
        data={mockHotels}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={styles.hotelCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.hotelImage}
              resizeMode="cover"
            />
            <Text style={styles.hotelName}>{item.name}</Text>
            <Text style={styles.hotelAddress}>{item.address}</Text>
            <Text style={styles.hotelRating}>
              ⭐ {item.rating} ({item.reviews} đánh giá)
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  searchButton: {
    backgroundColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
  },
  dealsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dealCard: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    width: (width - 48) / 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  couponButton: {
    backgroundColor: "#fdecea",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 6,
  },
  tabRow: {
    flexDirection: "row",
    marginBottom: 16,
    marginTop: 8,
  },
  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 8,
  },
  tabButtonActive: {
    backgroundColor: "#1e90ff",
    borderColor: "#1e90ff",
  },
  hotelCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
  },
  hotelImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
  },
  hotelName: {
    fontWeight: "bold",
    marginTop: 6,
  },
  hotelAddress: {
    fontSize: 12,
    color: "#777",
  },
  hotelRating: {
    fontSize: 12,
    color: "#f39c12",
  },
});
