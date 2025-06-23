import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import SwipeCard from "./components/SwipeCard";
import TabBarIcons from "./components/TabBarIcons";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function FindGroupScreen() {
  const [groupCards, setGroupCards] = useState<any[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [noMoreGroups, setNoMoreGroups] = useState(false);
  const user = useAuthStore((s) => s.user)!;

  const {
    gender,
    location,
    time,
    ageGroup,
    interestGender,
    personality,
    travelType,
  } = useLocalSearchParams();

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setNoMoreGroups(false);
      const res = await axios.get(
        "http://150.95.111.137:8080/api/group-chat/public",
        {
          params: { userId: user.id },
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );
      setGroupCards(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy nhóm:", err);
    } finally {
      setLoading(false);
    }
  };

  const joinGroup = async (groupId: number) => {
    const res = await axios.post(
      `http://150.95.111.137:8080/api/group-chat/${groupId}/join?userId=${user.id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
    return res.data;
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (!groupCards.length) return;

    const filtered = groupCards.filter((group) => {
      if (
        location &&
        group.destination &&
        !group.destination.toLowerCase().includes((location as string).toLowerCase())
      )
        return false;
      if (
        time &&
        group.arrivalDate &&
        (() => {
          const groupMonth = new Date(group.arrivalDate).getMonth() + 1;
          const filterMonth = parseInt(String(time).replace("Tháng ", ""));
          return groupMonth !== filterMonth;
        })()
      )
        return false;
      // if (
      //   ageGroup &&
      //   group.members &&
      //   (() => {
      //     const map: Record<string, [number, number]> = {
      //       "18-23 tuổi": [18, 23],
      //       "23-30 tuổi": [23, 30],
      //       "trên 30 tuổi": [31, 100],
      //     };
      //     const [minAge, maxAge] = map[ageGroup];
      //     return !group.members.some(
      //       (m: any) => m.age >= minAge && m.age <= maxAge
      //     );
      //   })()
      // )
      //   return false;

      if (
        interestGender &&
        group.interests &&
        !group.interests.toLowerCase().includes((interestGender as string).toLowerCase())
      )
        return false;

      if (
        personality &&
        group.personalities &&
        !group.personalities.toLowerCase().includes((personality as string).toLowerCase())
      )
        return false;

      if (
        travelType &&
        group.travelStyle &&
        !group.travelStyle.toLowerCase().includes((travelType as string).toLowerCase())
      )
        return false;

      return true;
    });

    setFilteredGroups(filtered);
  }, [groupCards, gender, location, time, ageGroup, interestGender, personality, travelType]);

  return (
    <View style={styles.container}>
      <View style={styles.tabBarWrapper}>
        <TabBarIcons />
      </View>

      <View style={styles.swiperWrapper}>
        <View style={styles.filterWrapper}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              if (user.rank === "DONG") {
                Alert.alert(
                  "Tính năng bị giới hạn",
                  "Chức năng lọc nhóm chỉ dành cho người dùng hạng Bạc trở lên. Vui lòng nâng cấp để sử dụng.",
                  [
                    { text: "Hủy", style: "cancel" },
                    { text: "Nâng cấp", onPress: () => router.push("/wallet") },
                  ]
                );
              } else {
                router.push("/filter");
              }
            }}
          >
            <Image
              source={require("@/assets/images/filter.png")}
              style={styles.filterIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.swiperContent}>
          {loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#007AFF" />
            </View>
          ) : filteredGroups.length === 0 ? (
            <View style={styles.loader}>
              <Text>Không còn nhóm nào để hiển thị</Text>
              <TouchableOpacity onPress={fetchGroups} style={styles.reloadBtn}>
                <Text style={{ color: "#fff" }}>Tải lại nhóm</Text>
              </TouchableOpacity>
            </View>
          ) : (
            !showModal &&
            filteredGroups
              .slice(0)
              .reverse()
              .map((group) => (
                <SwipeCard
                  key={group.id}
                  group={group}
                  onSwipeRight={(groupSwiped: any) => {
                    setFilteredGroups((prev) =>
                      prev.filter((g) => g.id !== groupSwiped.id)
                    );
                    setSelectedGroup(groupSwiped);
                    setShowModal(true);
                  }}
                  onSwipeLeft={(groupSwiped: any) => {
                    setFilteredGroups((prev) =>
                      prev.filter((g) => g.id !== groupSwiped.id)
                    );
                    setSelectedGroup(null);
                  }}
                />
              ))
          )}

          {noMoreGroups && (
            <View style={styles.noMoreGroups}>
              <Text style={styles.noMoreText}>
                Bạn đã lướt hết tất cả các nhóm.
              </Text>
              <TouchableOpacity onPress={fetchGroups} style={styles.reloadBtn}>
                <Text style={{ color: "#fff" }}>Tải lại nhóm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedGroup?.creatorName}</Text>
            <Text style={styles.modalDesc}>
              {selectedGroup?.description || "Không có mô tả"}
            </Text>
            <View style={styles.avatarRow}>
              {selectedGroup?.userIds?.slice(0, 5).map((_: any, idx: number) => (
                <Image
                  key={idx}
                  source={{ uri: "https://i.pravatar.cc/100?img=" + (idx + 1) }}
                  style={styles.avatar}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={async () => {
                try {
                  await joinGroup(selectedGroup.id);
                  router.push({
                    pathname: "/groupChat/[id]",
                    params: { id: selectedGroup.id },
                  });
                  setShowModal(false);
                } catch (error: any) {
                  setShowModal(false);
                  if (error?.response?.status === 403) {
                    Alert.alert(
                      "Vượt giới hạn nhóm",
                      "Số nhóm theo rank của bạn đã đầy, vui lòng nâng cấp.",
                      [
                        { text: "Hủy", style: "cancel" },
                        {
                          text: "Nâng cấp",
                          onPress: () => router.push("/wallet"),
                        },
                      ]
                    );
                  } else {
                    Alert.alert("Lỗi", "Không thể tham gia nhóm. Vui lòng thử lại.");
                  }
                }
              }}
            >
              <Text style={styles.joinButtonText}>Tham gia nhóm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  tabBarWrapper: { backgroundColor: "#fff", paddingTop: 50, paddingBottom: 10 },
  swiperWrapper: { flex: 1 },
  swiperContent: {
    position: "relative",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 20,
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  reloadBtn: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  noMoreGroups: { alignItems: "center", justifyContent: "center", flex: 1 },
  noMoreText: { fontSize: 16, color: "#999" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  modalDesc: { fontSize: 14, textAlign: "center", marginBottom: 12 },
  avatarRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  joinButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  joinButtonText: { color: "#fff", fontWeight: "bold" },
  filterWrapper: {
    width: "100%",
    position: "absolute",
    zIndex: 10,
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 50,
    marginLeft: -20,
  },
  filterButton: {
    backgroundColor: "#e0f2fe",
    padding: 8,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  filterIcon: { width: 34, height: 34, resizeMode: "contain" },
});
