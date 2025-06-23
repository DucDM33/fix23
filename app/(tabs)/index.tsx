import { useAuthStore } from "@/store/authStore";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PostCommentModal from "../components/PostCommentModal";
import TabBarIcons from "../components/TabBarIcons";

export default function HomeScreen() {
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  const fetchPostDetail = async (postId: number) => {
    try {
      const res = await fetch(`http://150.95.111.137:8080/api/post/${postId}`);
      const data = await res.json();

      const isLiked = data.likedUserIds?.includes(user?.id);
      const isSaved = data.isSaved ?? false;

      setSelectedPost({ ...data, isLiked, isSaved });

      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...data, isLiked, isSaved } : p))
      );
    } catch (err) {
      console.error("Lỗi tải chi tiết bài viết:", err);
    }
  };

  const openCommentModal = async (post: any) => {
    await fetchPostDetail(post.id);
    setIsCommentModalVisible(true);
  };

  const closeCommentModal = () => {
    setSelectedPost(null);
    setIsCommentModalVisible(false);
  };

  const handleCommentAdded = async (postId: number, newComment: any) => {
    try {
      await fetchPostDetail(postId);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    const fetchRandomPosts = async () => {
      try {
        const res = await fetch(`http://150.95.111.137:8080/api/post/random?userId=${user.id}`);
        const data = await res.json();

        const withState = data.map((post: any) => ({
          ...post,
          isLiked: post.likedUserIds?.includes(user?.id),
          isSaved: post.saved  ?? false,
        }));

        setPosts(withState);
      } catch (err) {
        console.error("Lỗi khi load bài viết:", err);
      }
    };

    fetchRandomPosts();
  }, [user]);

  const handleLike = async (postId: number) => {
    if (!user) return;
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId && !p.isLiked) {
          fetch(
            `http://150.95.111.137:8080/api/post/${postId}/like?userId=${user.id}`,
            { method: "POST" }
          ).catch((err) => console.error("Lỗi khi like:", err));

          return {
            ...p,
            isLiked: true,
            likeCount: p.likeCount + 1,
          };
        }
        return p;
      })
    );
  };

  const handleToggleSave = async (
    postId: number,
    isCurrentlySaved: boolean
  ) => {
    if (!user) return;
    try {
      const method = isCurrentlySaved ? "DELETE" : "POST";
      const endpoint = isCurrentlySaved ? "unsave" : "save";
    

      await fetch(
        `http://150.95.111.137:8080/api/saved-posts/${endpoint}?userId=${user.id}&postId=${postId}`,
        { method }
      );
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isSaved: !isCurrentlySaved } : p
        )
      );
    } catch (err) {
      console.error("Lỗi khi lưu/bỏ lưu:", err);
    }
  };

  const handleMenuPress = (option: string) => {
    switch (option) {
      case "Ví của tôi":
        router.push("/wallet");
        break;
      case "Quản lý tài khoản":
        router.push("/profileScreen");
        break;
      case "Đăng xuất":
        useAuthStore.getState().logout();
        router.replace("/login");
        break;
      default:
        break;
    }
    setMenuVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/LogoWeTripBlack.png")}
          style={styles.logo}
        />
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="#888"
          />
          <Ionicons name="search" size={18} color="#000" />
        </View>
        <Ionicons name="notifications-outline" size={22} style={styles.icon} />
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Feather name="menu" size={22} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* Popup Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            {[
              "Ví của tôi",
              "Cài đặt và quyền riêng tư",
              "Quản lý tài khoản",
              "Đăng xuất",
              "Hỗ trợ",
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <TabBarIcons />

      {/* Greeting */}
      <TouchableOpacity
        style={styles.greetingBar}
        onPress={() => router.push("/createPost")}
      >
        <Image
          source={{ uri: user?.avatar ?? "https://via.placeholder.com/150" }}
          style={styles.avatarSmall}
        />
        <Text style={styles.greetingText}>
          {user?.fullName ?? "Bạn"}, bạn có chuyến đi mới không?
        </Text>
      </TouchableOpacity>

      {/* Post list */}
      <ScrollView style={styles.postList}>
        {posts.map((post) => (
          <View key={post.id} style={styles.post}>
            <View style={styles.postHeader}>
              <Image
                source={{
                  uri: post.avatarUrl ?? "https://via.placeholder.com/150",
                }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>
                {post.fullName ?? "Người dùng"}
              </Text>

              <TouchableOpacity
                onPress={() => handleToggleSave(post.id, post.isSaved)}
              >
                <MaterialIcons
                  name={post.isSaved ? "star" : "star-border"}
                  size={20}
                  color={post.isSaved ? "#facc15" : "#888"}
                />
              </TouchableOpacity>
            </View>

            <Image source={{ uri: post.imageUrl }} style={styles.postImage} />

            <Text style={styles.caption}>{post.content}</Text>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={16} />
              <Text style={styles.locationText}>Địa điểm chưa xác định</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity onPress={() => handleLike(post.id)}>
                <Ionicons
                  name={post.isLiked ? "heart" : "heart-outline"}
                  size={20}
                  color={post.isLiked ? "red" : "black"}
                />
              </TouchableOpacity>
              <Text style={styles.actionText}>{post.likeCount}</Text>

              <TouchableOpacity
                onPress={() => openCommentModal(post)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons name="chatbubble-outline" size={20} />
                <Text style={styles.actionText}>{post.commentCount}</Text>
              </TouchableOpacity>

              <Ionicons name="paper-plane-outline" size={20} />
            </View>
          </View>
        ))}

        {user?.id !== undefined && selectedPost && (
          <PostCommentModal
            visible={isCommentModalVisible}
            onClose={closeCommentModal}
            post={selectedPost}
            userId={user.id}
            onCommentAdded={handleCommentAdded}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
    marginRight: 6,
  },
  logo: { width: 30, height: 30, resizeMode: "contain" },
  icon: { marginLeft: 6 },
  greetingBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 12,
    marginHorizontal: 10,
    marginTop: 8,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  greetingText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  postList: { padding: 10 },
  post: {
    backgroundColor: "#fff",
    marginBottom: 16,
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 20,
    marginRight: 8,
  },
  userName: { fontWeight: "bold", flex: 1 },
  star: { color: "#f88" },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  caption: { marginBottom: 6 },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 4,
  },
  locationText: { marginLeft: 4 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  actionText: { fontSize: 12, color: "#555" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 80,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: 220,
    paddingVertical: 6,
    elevation: 5,
  },
  menuItem: {
    backgroundColor: "#f2f2f2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
