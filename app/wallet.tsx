import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

export default function WalletScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const updateUserFields = useAuthStore((s) => s.updateUserFields);

  const [balance, setBalance] = useState<number>(0);
  const [rank, setRank] = useState<string>("Đồng");
  const [loading, setLoading] = useState<boolean>(false);

  const normalizeRank = (rank: string) => {
    switch (rank.toUpperCase()) {
      case "DONG":
        return "Đồng";
      case "BAC":
        return "Bạc";
      case "VANG":
        return "Vàng";
      default:
        return rank;
    }
  };
  const fetchUserInfo = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `http://150.95.111.137:8080/api/user/${user.id}/info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = res.data;
      setBalance(userData.balance || 0);
      setRank(normalizeRank(userData.userRank || "DONG"));
      const newBalance =
        typeof userData.balance === "number" ? userData.balance : 0;
      const rawRank =
        typeof userData.userRank === "string" ? userData.userRank : "DONG";
      const newRank = normalizeRank(rawRank);

      setBalance(newBalance);
      setRank(newRank);
      if (user.balance !== newBalance || user.rank !== rawRank) {
        updateUserFields({
          balance: newBalance,
          rank: rawRank, // lưu rank gốc để tránh lỗi về sau
        });
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin người dùng:", err);
      Alert.alert("Lỗi", "Không thể tải thông tin ví người dùng.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  const handleUpgrade = (targetRank: string) => {
    router.push({ pathname: "/topup", params: { rank: targetRank } });
  };
  const handleTopUp = () => {
    router.push("/topup");
  };
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text>Đang tải thông tin ví...</Text>
      </View>
    );
  }
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      <Text style={styles.title}>Thông tin ví của bạn</Text>

      <View style={styles.row}>
        <Text style={styles.label}>
          Số dư:{" "}
          <Text style={styles.value}>{balance.toLocaleString()} VNĐ</Text>
        </Text>
        <TouchableOpacity onPress={handleTopUp} style={styles.topupIcon}>
          <Ionicons name="add-circle-outline" size={24} color="#1e90ff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>
        Hạng thành viên: <Text style={styles.value}>{rank}</Text>
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quyền lợi hạng {rank}</Text>

        {rank === "Đồng" && (
          <>
            <Text style={styles.bullet}>
              • Truy cập tính năng cơ bản: Đặt phòng, vé máy bay, tour, Matching
              Friends (cơ bản), Keep Location’s Memories.
            </Text>
            <Text style={styles.bullet}>
              • Matching Friends: Ghép nhóm ngẫu nhiên theo điểm đến.
            </Text>
            <Text style={styles.bullet}>
              • Tourist Guide: Tự động ghép hướng dẫn viên ngẫu nhiên.
            </Text>
            <Text style={styles.bullet}>
              • Gợi ý lịch trình cơ bản, không có so sánh giá.
            </Text>
            <Text style={styles.bullet}>
              • Phải xem quảng cáo để mở một số tính năng.
            </Text>
            <Text style={styles.bullet}>• Tham gia tối đa 2 nhóm.</Text>
            <Text style={styles.bullet}>
              • Giới hạn 5 lượt quẹt/phải mỗi giờ.
            </Text>
          </>
        )}

        {rank === "Bạc" && (
          <>
            <Text style={styles.bullet}>• Truy cập tính năng nâng cao.</Text>
            <Text style={styles.bullet}>
              • Matching Friends: Chọn nhóm hoặc bạn đồng hành theo sở thích.
            </Text>
            <Text style={styles.bullet}>
              • Tourist Guide: Chọn hướng dẫn viên từ danh sách đề xuất.
            </Text>
            <Text style={styles.bullet}>
              • Gợi ý lịch trình nâng cao, có giá vé, đánh giá, so sánh giá.
            </Text>
            <Text style={styles.bullet}>• Ít quảng cáo (chỉ banner).</Text>
            <Text style={styles.bullet}>• Tham gia 3 nhóm.</Text>
            <Text style={styles.bullet}>• Giới hạn 15 lượt quẹt mỗi giờ.</Text>
          </>
        )}

        {rank === "Vàng" && (
          <>
            <Text style={styles.bullet}>
              • Truy cập tất cả tính năng cao cấp.
            </Text>
            <Text style={styles.bullet}>
              • Matching Friends: Bộ lọc chi tiết theo sở thích, độ tuổi, phong
              cách.
            </Text>
            <Text style={styles.bullet}>
              • Tourist Guide: Đặt trước hướng dẫn viên theo lịch trình.
            </Text>
            <Text style={styles.bullet}>
              • Gợi ý lịch trình VIP + ưu đãi độc quyền.
            </Text>
            <Text style={styles.bullet}>• Trải nghiệm không quảng cáo.</Text>
            <Text style={styles.bullet}>• Ưu đãi riêng từ đối tác.</Text>
            <Text style={styles.bullet}>• Tham gia 5 nhóm.</Text>
            <Text style={styles.bullet}>• Không giới hạn lượt quẹt.</Text>
          </>
        )}
      </View>

      {rank === "Đồng" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quyền lợi hạng Bạc</Text>
          <Text style={styles.bullet}>• Tính năng nâng cao.</Text>
          <Text style={styles.bullet}>• Chọn nhóm Matching Friends.</Text>
          <Text style={styles.bullet}>• Gợi ý lịch trình nâng cao.</Text>
          <Text style={styles.bullet}>• Ít quảng cáo (banner).</Text>
          <Text style={styles.bullet}>• Tham gia 3 nhóm.</Text>
          <Text style={styles.bullet}>• 15 lượt quẹt/phải mỗi giờ.</Text>
          <Text style={styles.price}>15.000 VNĐ/tháng - 99.000 VNĐ/năm</Text>
          <Button
            title="Nâng cấp lên Bạc"
            onPress={() => handleUpgrade("Bạc")}
          />
        </View>
      )}

      {rank !== "Vàng" && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quyền lợi hạng Vàng</Text>
          <Text style={styles.bullet}>
            • Truy cập tất cả tính năng cao cấp.
          </Text>
          <Text style={styles.bullet}>• Bộ lọc Matching Friends nâng cao.</Text>
          <Text style={styles.bullet}>• Đặt trước hướng dẫn viên.</Text>
          <Text style={styles.bullet}>• Lịch trình VIP, ưu đãi độc quyền.</Text>
          <Text style={styles.bullet}>• Không quảng cáo.</Text>
          <Text style={styles.bullet}>• Tham gia 5 nhóm.</Text>
          <Text style={styles.bullet}>• Không giới hạn lượt quẹt.</Text>
          <Text style={styles.price}>35.000 VNĐ/tháng - 299.000 VNĐ/năm</Text>
          <Button
            title="Nâng cấp lên Vàng"
            onPress={() => handleUpgrade("Vàng")}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
  },
  topupIcon: {
    marginLeft: 8,
  },
  value: {
    fontWeight: "bold",
    color: "#1e90ff",
  },
  section: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
  },
  bullet: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontStyle: "italic",
    marginVertical: 8,
    color: "#e67e22",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
});
