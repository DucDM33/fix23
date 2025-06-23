// FlightTab.js
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

const dummyFlights = [
  {
    airline: "Vietnam Airlines",
    time: "08:00",
    duration: "2 giờ 10 phút",
    arrive: "10:10",
    from: "SGN",
    to: "HAN",
    type: "Bay thẳng",
    price: "2.272.228 VND",
    date: "2025-06-20",
  },
  {
    airline: "Bamboo Airways",
    time: "14:30",
    duration: "2 giờ",
    arrive: "16:30",
    from: "SGN",
    to: "HAN",
    type: "Bay thẳng",
    price: "2.100.000 VND",
    date: "2025-06-21",
  },
  {
    airline: "VietJet Air",
    time: "17:45",
    duration: "2 giờ 5 phút",
    arrive: "19:50",
    from: "SGN",
    to: "HAN",
    type: "Bay thẳng",
    price: "1.980.000 VND",
    date: "2025-06-22",
  },
  {
    airline: "Vietnam Airlines",
    time: "20:00",
    duration: "2 giờ 15 phút",
    arrive: "22:15",
    from: "SGN",
    to: "HAN",
    type: "Bay thẳng",
    price: "2.350.000 VND",
    date: "2025-06-23",
  },
  {
    airline: "Bamboo Airways",
    time: "06:15",
    duration: "2 giờ 20 phút",
    arrive: "08:35",
    from: "SGN",
    to: "HAN",
    type: "Bay thẳng",
    price: "2.200.000 VND",
    date: "2025-06-24",
  },
  {
    airline: "VietJet Air",
    time: "10:30",
    duration: "2 giờ 15 phút",
    arrive: "12:45",
    from: "SGN",
    to: "HAN",
    type: "Bay thẳng",
    price: "1.750.000 VND",
    date: "2025-06-25",
  },
  {
    airline: "Vietnam Airlines",
    time: "13:45",
    duration: "2 giờ",
    arrive: "15:45",
    from: "SGN",
    to: "HAN",
    type: "Bay thẳng",
    price: "2.400.000 VND",
    date: "2025-06-26",
  },
  {
    airline: "Bamboo Airways",
    time: "19:00",
    duration: "2 giờ 10 phút",
    arrive: "21:10",
    from: "SGN",
    to: "HAN",
    type: "Bay thẳng",
    price: "2.300.000 VND",
    date: "2025-06-27",
  },
];

export default function FlightTab() {
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
        <Text style={styles.title}>Tìm kiếm vé máy bay</Text>

        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Điểm đi</Text>
            <TextInput
              placeholder="VD: SGN"
              style={styles.input}
              value={from}
              onChangeText={setFrom}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Điểm đến</Text>
            <TextInput
              placeholder="VD: HAN"
              style={styles.input}
              value={to}
              onChangeText={setTo}
            />
          </View>
        </View>

        <View style={styles.inputGroupFull}>
          <Text style={styles.label}>Số lượng hành khách & hạng ghế</Text>
          <TextInput
            placeholder="VD: 2 người lớn, hạng phổ thông"
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
        data={dummyFlights}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.airline}>{item.airline}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.date}>Ngày khởi hành: {item.date}</Text>
              <View style={styles.flightInfo}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.duration}>{item.duration}</Text>
                <Text style={styles.time}>{item.arrive}</Text>
              </View>
              <Text style={styles.route}>
                {item.from} → {item.to} ({item.type})
              </Text>
              <Text style={styles.price}>{item.price}</Text>
              <TouchableOpacity style={styles.selectBtn}>
                <Text style={styles.selectBtnText}>Chọn</Text>
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
    backgroundColor: "#e6f0ff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  cardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 8,
  },
  airline: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cardBody: {
    marginTop: 6,
  },
  date: {
    color: "#444",
    marginBottom: 4,
    fontStyle: "italic",
  },
  flightInfo: {
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
    marginBottom: 6,
  },
  price: {
    color: "#1e90ff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 6,
  },
  selectBtn: {
    backgroundColor: "#ff5c8d",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    width: 80,
    alignSelf: "flex-end",
  },
  selectBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});