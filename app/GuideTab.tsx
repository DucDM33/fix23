import React from "react";
import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const guides = [
  {
    id: "1",
    name: "Hoàng Anh",
    birthYear: 1975,
    location: "Đảo Phú Quý",
    languages: "Tiếng Việt, Tiếng Anh cơ bản",
    occupation: "Người dẫn trên đảo",
    experience: [
      "Am hiểu văn hoá, lịch sử địa phương",
      "Có kinh nghiệm dẫn đoàn điểm đến đẹp hoang sơ",
      "Biết điều chỉnh lịch trình theo nhu cầu khách hàng",
    ],
    rating: 4.5,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "2",
    name: "Nguyễn Trung Quân",
    birthYear: 1982,
    location: "Đảo Phú Quý",
    languages: "Tiếng Việt, Tiếng Anh cơ bản",
    occupation: "Người dẫn trên đảo",
    experience: [
      "Am hiểu hải sản định vùng",
      "Khách hàng yêu thích chuyến đi biển ngắm san hô",
    ],
    rating: 4.0,
    avatar: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    id: "3",
    name: "Người Chị Đổi Nhiều",
    birthYear: 1970,
    location: "Đảo Phú Quý",
    languages: "Tiếng Việt",
    occupation: "Người dẫn trên đảo",
    experience: [
      "Hướng dẫn đoàn khách trung niên",
      "Nói chuyện rất vui và thân thiện",
    ],
    rating: 5.0,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];

const renderStars = (rating: number) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) stars.push("⭐");
  if (halfStar) stars.push("⭐");
  while (stars.length < 5) stars.push("☆");

  return stars.join(" ");
};

const GuideTab = () => {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <Text style={styles.title}>Tìm kiếm hướng dẫn viên</Text>

      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ alignItems: "center", marginRight: 12 }}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <Text style={styles.rating}>{renderStars(item.rating)}</Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text>Năm sinh: {item.birthYear}</Text>
              <Text>Quê quán: {item.location}</Text>
              <Text>Ngôn ngữ: {item.languages}</Text>
              <Text>Ngành nghề: {item.occupation}</Text>
              <Text style={{ fontWeight: "bold", marginTop: 4 }}>
                Kinh nghiệm và thế mạnh:
              </Text>
              {item.experience.map((exp, idx) => (
                <Text key={idx}>- {exp}</Text>
              ))}
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.buttonMore}>
                  <Text style={{ color: "#000" }}>Xem thêm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContact}>
                  <Text style={{ color: "#fff" }}>Liên hệ</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e90ff",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  buttonRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  buttonMore: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f3d0d0",
    borderRadius: 6,
    marginRight: 8,
  },
  buttonContact: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1e90ff",
    borderRadius: 6,
  },
  rating: {
    marginTop: 6,
    fontSize: 14,
    color: "#f39c12",
  },
});

export default GuideTab;
