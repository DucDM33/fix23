import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

export default function GroupList() {
  const { type } = useLocalSearchParams<{ type: string }>();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await axios.get(
          `http://150.95.111.137:8080/api/group-chat/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          }
        );
        // filter by roomType param
        const all = res.data as any[];
        const filtered = all.filter((g) => g.roomType === type);
        setGroups(filtered);
      } catch (err) {
        console.error("Lỗi tải nhóm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [type, user]);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        router.push({ pathname: "/groupChat/[id]", params: { id: item.id } });
      }}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.destination}</Text>
      </View>
      <Text style={styles.time}>{/* format time if present */}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="people-outline" size={22} color="#000" />
        <Text style={styles.searchText}>
          {type === "public" ? "Nhóm Public" : "Nhóm Private"}
        </Text>
        {type === "public" && (
          <TouchableOpacity
            onPress={() => router.push("/createGroup")}
            style={styles.addButton}
          >
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Không có nhóm nào thuộc loại này.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    flex: 1,
    backgroundColor: "#e6e6e6",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 12,
    padding: 10,
    borderRadius: 12,
  },
  searchText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  addButton: {
    padding: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
});
