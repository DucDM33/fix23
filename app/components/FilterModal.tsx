import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  visible: boolean;
  onClose: () => void;
  onApplyFilter: (filters: {
    destination: string;
    startDate: string | null;
    endDate: string | null;
    numberOfPeople: number | null;
  }) => void;
}

const FilterModal = ({ visible, onClose, onApplyFilter }: Props) => {
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const formatDate = (date: Date | null) =>
    date ? date.toISOString().split("T")[0] : "";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Bộ lọc nhóm</Text>

          <Text style={styles.label}>Địa điểm</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập địa điểm"
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={styles.label}>Ngày đi</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateText}>
              {startDate ? formatDate(startDate) : "Chọn ngày đi"}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowStartPicker(false);
                if (date) setStartDate(date);
              }}
            />
          )}

          <Text style={styles.label}>Ngày về</Text>
          <TouchableOpacity
            style={styles.datePicker}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateText}>
              {endDate ? formatDate(endDate) : "Chọn ngày về"}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              display="default"
              onChange={(_, date) => {
                setShowEndPicker(false);
                if (date) setEndDate(date);
              }}
            />
          )}

          <Text style={styles.label}>Số người</Text>
          <TextInput
            style={styles.input}
            placeholder="VD: 3"
            value={numberOfPeople?.toString() || ""}
            onChangeText={(val) => {
              const number = parseInt(val);
              setNumberOfPeople(isNaN(number) ? null : number);
            }}
            keyboardType="numeric"
          />

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => {
              onApplyFilter({
                destination,
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                numberOfPeople,
              });
              onClose();
            }}
          >
            <Text style={styles.applyText}>Áp dụng</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalContent: {
    width: SCREEN_WIDTH * 0.9,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    zIndex: 9999,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#333",
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontWeight: "bold",
  },
  closeButton: {
    alignItems: "center",
    paddingVertical: 10,
    marginTop: 8,
  },
  closeText: {
    color: "#007AFF",
  },
});
