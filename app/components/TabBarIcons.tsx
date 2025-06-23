import { Ionicons } from "@expo/vector-icons";
import type { NavigationProp } from "@react-navigation/native";
import { router, useNavigation, usePathname } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function TabBarIcons() {
  const navigation = useNavigation<NavigationProp<any>>();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path: string) => pathname.startsWith(path);

  const toggleDropdown = () => setShowDropdown(!showDropdown);

  const handleSelect = (type: "public" | "private") => {
    setShowDropdown(false);
    router.push(`/GroupList?type=${type}`);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.tabIcons}>
        <TouchableOpacity onPress={() => navigation.navigate("booking")}>
          <Ionicons
            name="airplane-outline"
            size={26}
            color={isActive("/booking") ? "#1e90ff" : "#333"}
          />
        </TouchableOpacity>

        <View style={styles.iconWrapper}>
          <TouchableOpacity onPress={toggleDropdown}>
            <Ionicons
              name="people-outline"
              size={26}
              color={isActive("/matching") || showDropdown ? "#1e90ff" : "#333"}
            />
          </TouchableOpacity>

          {showDropdown && (
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect("public")}
              >
                <Text style={styles.dropdownText}>Nhóm giả lập</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelect("private")} //private
              >
                <Text style={styles.dropdownText}>Nhóm chính thức</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Ionicons
            name="home-outline"
            size={26}
            color={pathname === "/" ? "#1e90ff" : "#333"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("groupChatView")}>
          <Ionicons
            name="chatbubble-ellipses-outline"
            size={26}
            color={isActive("/groupChatView") ? "#1e90ff" : "#333"}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("profile")}>
          <Ionicons
            name="person-outline"
            size={26}
            color={isActive("/profile") ? "#1e90ff" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  tabIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  iconWrapper: {
    position: "relative",
    alignItems: "center",
  },
  dropdown: {
    position: "absolute",
    top: 30,
    width: 150,
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 6,
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 60,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
