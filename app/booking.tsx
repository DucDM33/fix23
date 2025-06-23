import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import BusTab from "./BusTab";
import TabBarIcons from "./components/TabBarIcons";
import FlightTab from "./FlightTab";
import GuideTab from "./GuideTab";
import HotelTab from "./HotelTab";

const bookingTabs = [ "Vé máy bay", "Vé xe khách","Khách sạn", "Hướng dẫn viên"];

export default function BookingScreen() {
  const [activeTab, setActiveTab] = useState("Vé máy bay");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ marginTop: 50 }}>
        <TabBarIcons />
      </View>

      {/* Booking tab selector - horizontal scrollable */}
      <View style={styles.tabWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {bookingTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.bookingTab,
                activeTab === tab && styles.bookingTabActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={{
                  color: activeTab === tab ? "#1e90ff" : "#666",
                  fontWeight: "bold",
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      {activeTab === "Khách sạn" && <HotelTab />}
      {activeTab === "Hướng dẫn viên" && <GuideTab />}
      {activeTab === "Vé máy bay" && <FlightTab />}
      {activeTab === "Vé xe khách" && <BusTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  tabWrapper: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    paddingVertical: 10,
  },
  bookingTab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    marginLeft: 10,
  },
  bookingTabActive: {
    borderBottomWidth: 2,
    borderColor: "#1e90ff",
  },
});
