import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
} from "../../services/socket";
import { useAuthStore } from "../../store/authStore";

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useAuthStore((s) => s.user)!;
  const router = useRouter();
  const groupId = parseInt(id!, 10);

  const [group, setGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isInfoExpanded, setInfoExpanded] = useState(false);

  useEffect(() => {
    axios
      .get(`http://150.95.111.137:8080/api/group-chat/${groupId}`, {
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => setGroup(res.data))
      .catch(console.error);

    axios
      .get(`http://150.95.111.137:8080/api/group-chat/${groupId}/messages`, {
        params: { userId: user.id },
        headers: { Authorization: `Bearer ${user.accessToken}` },
      })
      .then((res) => setMessages(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));

    connectWebSocket(groupId, user.accessToken, (msg: any) =>
      setMessages((prev) => [...prev, msg])
    );
    return () => disconnectWebSocket();
  }, [groupId, user]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage({
      groupId,
      senderId: user.id,
      content: inputText.trim(),
    });
    setInputText("");
  };

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const handleAcceptTrip = async () => {
    try {
      // Bước 1: Kiểm tra số lượng thành viên
      if (group.userIds.length < group.numberOfPeople) {
        Alert.alert(
          "Chưa đủ thành viên",
          "Cần đủ thành viên trước khi bắt đầu hành trình."
        );
        return;
      }

      // Bước 2: Kiểm tra đã đóng quỹ chưa
      const depositCheckRes = await axios.get(
        `http://150.95.111.137:8080/api/group-chat/${groupId}/is-all-deposited`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      const allDeposited = depositCheckRes.data;
      if (!allDeposited) {
        Alert.alert("Thông báo", "Tất cả thành viên chưa đóng quỹ.");
        return;
      }

      // Bước 3: Gọi API cập nhật roomType thành private
      const updateRes = await axios.put(
        `http://150.95.111.137:8080/api/group-chat/${groupId}/room-type`,
        { roomType: "private" },
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      setGroup(updateRes.data);
      Alert.alert("Thành công", "Đã cập nhật nhóm thành Private Room");
    } catch (error) {
      console.error("Lỗi trong handleAcceptTrip:", error);
      Alert.alert("Lỗi", "Không thể bắt đầu hành trình. Vui lòng thử lại.");
    }
  };

  const handleDeposit = async () => {
    Alert.alert(
      "Xác nhận ký quỹ",
      "Bạn đồng ý đóng cọc 200.000 VND vào ví nhóm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          style: "default",
          onPress: async () => {
            try {
              const res = await axios.post(
                `http://150.95.111.137:8080/api/group-chat/${groupId}/deposit`,
                null,
                {
                  params: { userId: user.id },
                  headers: { Authorization: `Bearer ${user.accessToken}` },
                }
              );
              Alert.alert("Thành công", "Bạn đã ký quỹ thành công!");

              // Cập nhật lại thông tin nhóm
              const updatedGroup = await axios.get(
                `http://150.95.111.137:8080/api/group-chat/${groupId}`,
                {
                  headers: { Authorization: `Bearer ${user.accessToken}` },
                }
              );
              setGroup(updatedGroup.data);
            } catch (error: any) {
              if (error?.response?.status === 401) {
                Alert.alert(
                  "Không đủ tiền",
                  "Bạn không đủ tiền trong tài khoản để ký quỹ."
                );
              } else {
                Alert.alert(
                  "Lỗi",
                  error?.response?.data?.message ||
                    "Không thể ký quỹ. Vui lòng thử lại."
                );
              }
            }
          },
        },
      ]
    );
  };
  const handleLeaveGroup = async () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn rời khỏi hoặc dừng nhóm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đồng ý",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.post(
                `http://150.95.111.137:8080/api/group-chat/${groupId}/refund-half`,
                null,
                {
                  params: { userId: user.id },
                  headers: { Authorization: `Bearer ${user.accessToken}` },
                }
              );
              await axios.post(
                `http://150.95.111.137:8080/api/group-chat/${groupId}/leave`,
                null,
                {
                  params: { userId: user.id },
                  headers: { Authorization: `Bearer ${user.accessToken}` },
                }
              );

              Alert.alert(
                "Thành công",
                "Bạn đã rời khỏi nhóm và được hoàn lại một phần tiền cọc."
              );
              router.back();
            } catch (error) {
              console.error("Lỗi khi rời nhóm hoặc hoàn tiền:", error);
              Alert.alert(
                "Lỗi",
                "Không thể rời nhóm hoặc hoàn tiền. Vui lòng thử lại."
              );
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  if (!group)
    return (
      <View style={styles.loader}>
        <Text>Không tìm thấy nhóm</Text>
      </View>
    );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.header}>
            {group.imageUrl && (
              <Image
                source={{ uri: group.imageUrl }}
                style={styles.headerAvatar}
              />
            )}
            <Text style={styles.headerTitle}>{group.destination}</Text>
            <Ionicons name="videocam" size={20} style={styles.headerIcon} />
            <Ionicons name="call" size={20} style={styles.headerIcon} />
          </View>
          <View style={styles.infoBoxContainer}>
            <View style={styles.infoBox}>
              <TouchableOpacity
                onPress={() => setInfoExpanded(!isInfoExpanded)}
                style={styles.expandToggle}
              >
                <Text style={styles.infoTitle}>
                  {isInfoExpanded
                    ? "Thông tin chuyến đi ▲"
                    : "Thông tin chuyến đi ▼"}
                </Text>
              </TouchableOpacity>

              {isInfoExpanded && (
                <>
                  <Text style={styles.infoText}>
                    Địa điểm: {group.destination}
                  </Text>
                  <Text style={styles.infoText}>
                    Ngày đến: {group.arrivalDate}
                  </Text>
                  <Text style={styles.infoText}>
                    Ngày về: {group.departureDate}
                  </Text>
                  <Text style={styles.infoText}>
                    Thành viên: {group.userIds.length}/ {group.numberOfPeople}
                  </Text>
                  <Text style={styles.infoText}>
                    Loại phòng: {group.roomType.toUpperCase()}
                  </Text>
                  <Text style={styles.infoText}>
                    Mô tả: {group.description}
                  </Text>
                  <View style={styles.infoButtons}>
                    {group.roomType === "public" && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleAcceptTrip}
                      >
                        <Text style={styles.actionButtonText}>Đồng ý</Text>
                      </TouchableOpacity>
                    )}
                    {group.roomType === "public" && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleLeaveGroup}
                      >
                        <Text style={styles.actionButtonText}>Dừng lại</Text>
                      </TouchableOpacity>
                    )}
                    {group.roomType === "public" && (
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={handleDeposit}
                      >
                        <Text style={styles.actionButtonText}>Ký quỹ</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 4 }}
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isCurrentUser = item.senderId === user.id;
              return (
                <View
                  style={[
                    styles.messageRow,
                    { flexDirection: isCurrentUser ? "row-reverse" : "row" },
                  ]}
                >
                  <Image
                    source={{ uri: item.senderAvatar }}
                    style={styles.messageAvatar}
                  />
                  <View
                    style={[
                      styles.messageContent,
                      {
                        backgroundColor: isCurrentUser ? "#DCF8C6" : "#B3E5FC",
                        alignItems: isCurrentUser ? "flex-end" : "flex-start",
                      },
                    ]}
                  >
                    <Text style={styles.messageUser}>{item.senderName}</Text>
                    <Text>{item.content}</Text>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 8,
              paddingBottom: 12,
            }}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            onLayout={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          <View
            style={[
              styles.inputBar,
              {
                paddingBottom:
                  Platform.OS === "android" ? (isKeyboardVisible ? 40 : 16) : 8,
              },
            ]}
          >
            <TextInput
              style={styles.textInput}
              placeholder="Nhập tin nhắn..."
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={handleSend}>
              <Ionicons name="send" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? 30 : 40,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerTitle: { flex: 1, fontWeight: "600", fontSize: 17, color: "#333" },
  headerIcon: { marginHorizontal: 8, color: "#007AFF" },

  infoButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8, // Cách đều các nút
  },

  actionButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  actionButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  infoTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  infoText: { fontSize: 14, marginVertical: 3 },

  messageList: { paddingHorizontal: 12, paddingTop: 8, paddingBottom: 80 },
  messageRow: { flexDirection: "row", marginBottom: 12 },
  messageAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  messageContent: { padding: 8, borderRadius: 8, maxWidth: "75%" },
  messageUser: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
    fontSize: 13,
  },
  expandToggle: {
    marginBottom: 8,
    alignItems: "center",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: Platform.OS === "android" ? 16 : 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
  },
  textInput: {
    flex: 1,
    marginRight: 8,
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  infoBoxContainer: {
    position: "absolute",
    top: Platform.OS === "android" ? 100 : 100,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  btnDeposit: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
  },
  btnDepositText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
