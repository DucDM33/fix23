// BusTab.js
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const dummyBuses = [
  {
    company: "Dien Linh Limousin",
    time: "00:00",
    duration: "6 giờ 5 phút",
    arrive: "06:05",
    from: "VP Suối Tiên",
    to: "VP Đà Lạt",
    price: "2.272.228 VND",
    available: 33,
  },
  // More dummy bus data can be added here
];

export default function BusTab() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [passengers, setPassengers] = useState("");
  const [departDate, setDepartDate] = useState(new Date());
  const [returnDate, setReturnDate] = useState(new Date());
  const [showDepartPicker, setShowDepartPicker] = useState(false);
  const [showReturnPicker, setShowReturnPicker] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.title}>Tìm kiếm vé xe khách</Text>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Điểm đi</Text>
            <TextInput
              placeholder="Thành phố, địa điểm"
              style={styles.input}
              value={from}
              onChangeText={setFrom}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Điểm đến</Text>
            <TextInput
              placeholder="Thành phố, địa điểm"
              style={styles.input}
              value={to}
              onChangeText={setTo}
            />
          </View>
        </View>

        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>Số lượng người</Text>
          <TextInput
            placeholder="1 người lớn, 0 trẻ em, 0 em bé"
            style={styles.input}
            value={passengers}
            onChangeText={setPassengers}
          />
        </View>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày khởi hành</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDepartPicker(true)}
            >
              <Text>{departDate.toLocaleDateString("vi-VN")}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ngày về</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowReturnPicker(true)}
            >
              <Text>{returnDate.toLocaleDateString("vi-VN")}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDepartPicker && (
          <DateTimePicker
            value={departDate}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowDepartPicker(false);
              if (date) setDepartDate(date);
            }}
          />
        )}

        {showReturnPicker && (
          <DateTimePicker
            value={returnDate}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowReturnPicker(false);
              if (date) setReturnDate(date);
            }}
          />
        )}

        <TouchableOpacity style={styles.searchBtn}>
          <Text style={styles.searchBtnText}>Tìm kiếm</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyBuses}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.subtitle}>Giường nằm - Limousin 36 giường</Text>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.busInfo}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.duration}>{item.duration}</Text>
                <Text style={styles.time}>{item.arrive}</Text>
              </View>
              <Text style={styles.route}>{item.from} → {item.to}</Text>
              <Text style={styles.price}>{item.price}</Text>
              <Text style={styles.available}>Còn {item.available} chỗ</Text>
              <TouchableOpacity style={styles.selectBtn}>
                <Text style={styles.selectBtnText}>Mua ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: "#fff",
    flex: 1,
  },
  searchBox: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  inputGroup: {
    flex: 1,
    marginRight: 5,
  },
  inputGroupFull: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 4,
    fontSize: 12,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#fff",
  },
  searchBtn: {
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  searchBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#e6f6ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  cardHeader: {
    marginBottom: 8,
  },
  company: {
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitle: {
    color: "#555",
    fontSize: 12,
  },
  cardBody: {
    marginTop: 6,
  },
  busInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  time: {
    fontWeight: "bold",
    fontSize: 16,
  },
  duration: {
    color: "#555",
  },
  route: {
    color: "#333",
    marginBottom: 4,
  },
  price: {
    color: "#1e90ff",
    fontWeight: "bold",
    fontSize: 16,
  },
  available: {
    color: "#ff5c8d",
    fontSize: 12,
    marginBottom: 6,
  },
  selectBtn: {
    backgroundColor: "#ff5c8d",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    width: 100,
    alignSelf: "flex-end",
  },
  selectBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});