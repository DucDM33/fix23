import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../store/authStore";

const DURATION_OPTIONS = [
  { label: "Theo tháng", value: "MONTH" },
  { label: "Theo năm", value: "YEAR" },
];

// Hàm tính giá theo rank và thời gian
const getUpgradePrice = (rank: string, duration: "MONTH" | "YEAR") => {
  const prices: Record<string, { MONTH: number; YEAR: number }> = {
    BAC: { MONTH: 15000, YEAR: 99000 },
    VANG: { MONTH: 35000, YEAR: 299000 },
  };

  const normalized = rank
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // 👉 chuyển Bạc → BAC
  return prices[normalized]?.[duration] || 0;
};

export default function TopupScreen() {
  const { rank } = useLocalSearchParams<{ rank?: string }>();
  const [amount, setAmount] = useState("");
  const [durationType, setDurationType] = useState<"MONTH" | "YEAR">("MONTH");

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const isUpgrade = !!rank;

  const displayedAmount = isUpgrade
    ? getUpgradePrice(rank as string, durationType)
    : Number(amount || 0);

  const handleTopup = async () => {
    if (!user) return;
    if (!isUpgrade && (!amount || Number(amount) <= 0)) {
      Alert.alert("Vui lòng nhập số tiền hợp lệ.");
      return;
    }

    if (!isUpgrade && Number(amount) < 50000) {
      Alert.alert("Giới hạn", "Số tiền nạp tối thiểu là 50,000 VNĐ.");
      return;
    }

    if (!isUpgrade && (!amount || Number(amount) <= 0)) {
      Alert.alert("Vui lòng nhập số tiền hợp lệ.");
      return;
    }
    const normalizeRank = (rank: string | null | undefined) => {
      if (!rank) return null;
      return rank
        .normalize("NFD") // tách dấu
        .replace(/[\u0300-\u036f]/g, "") // xoá dấu
        .toLowerCase(); // về chữ thường
    };
    const rankToSend = normalizeRank(rank);

    try {
      const res = await axios.post(
        "http://150.95.111.137:8080/api/payment/create",
        {
          userId: user.id,
          amount: displayedAmount,
          description: isUpgrade ? `Nâng cấp lên ${rank}` : "Nạp tiền vào ví",
          paymentType: isUpgrade ? "MUA_RANK" : "NAP_VI",
          rank: rankToSend,
          durationType: isUpgrade ? durationType : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Rank to send:", rankToSend);
      const { checkoutUrl } = res.data;
      if (checkoutUrl) {
        router.push("/pending");
        Linking.openURL(checkoutUrl); // ✅ Dùng Linking thay vì window.open
      } else {
        Alert.alert("Lỗi", "Không nhận được liên kết thanh toán.");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi", "Giao dịch không thành công.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isUpgrade ? `Nâng cấp hạng ${rank}` : "Nạp tiền vào ví"}
      </Text>

      {!isUpgrade && (
        <TextInput
          placeholder="Nhập số tiền (VNĐ)"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          style={styles.input}
        />
      )}

      {isUpgrade && (
        <View style={styles.durationContainer}>
          {DURATION_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setDurationType(opt.value as "MONTH" | "YEAR")}
              style={[
                styles.durationButton,
                durationType === opt.value && styles.selected,
              ]}
            >
              <Text
                style={[
                  styles.durationText,
                  durationType === opt.value && styles.selectedText,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Text style={styles.amountText}>
        Số tiền cần thanh toán:{" "}
        <Text style={styles.amountNumber}>
          {displayedAmount.toLocaleString()} VNĐ
        </Text>
      </Text>

      <Button title="Thanh toán" onPress={handleTopup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 80,
    padding: 24,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  durationContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  durationButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  selected: {
    backgroundColor: "#1e90ff",
    borderColor: "#1e90ff",
  },
  durationText: {
    color: "#333",
    fontWeight: "500",
  },
  selectedText: {
    color: "#fff",
  },
  amountText: {
    fontSize: 16,
    marginBottom: 16,
  },
  amountNumber: {
    fontWeight: "bold",
    color: "#1e90ff",
  },
});
