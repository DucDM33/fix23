import { useAuthStore } from "@/store/authStore";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PostCommentModal from "./components/PostCommentModal";
import TabBarIcons from "./components/TabBarIcons";

interface UserInfo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  avatarUrl: string;
  backgroundUrl: string;
  userRank: "DONG" | "BAC" | "VANG";
  balance: string;
  currentGroupCount: number;
  groupSearchCount: number;
}

export default function ProfileScreen() {
  const [selectedTab, setSelectedTab] = useState<"posts" | "favorites">(
    "posts"
  );
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const [userData, setUserData] = useState<UserInfo | null>(null);

  const userId = user?.id;

  // State modal comment
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);

  // Lấy bài viết user
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://150.95.111.137:8080/api/post/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          }
        );
        const postsWithLike = res.data.map((p: any) => {
          const isLiked = p.likedUserIds?.includes(userId);
          const isSaved = p.saved ?? false;
          return {
            ...p,
            isLiked: isLiked ?? false,
            isSaved,
          };
        });

        setPosts(postsWithLike);
      } catch (err) {
        console.error("Lỗi tải bài viết:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId && user?.accessToken) {
      fetchPosts();
    }
  }, [userId, user?.accessToken]);

  const handleToggleSave = async (
    postId: number,
    isCurrentlySaved: boolean
  ) => {
    if (!user) return;

    try {
      const method = isCurrentlySaved ? "DELETE" : "POST";
      const endpoint = isCurrentlySaved ? "unsave" : "save";

      await axios({
        method,
        url: `http://150.95.111.137:8080/api/saved-posts/${endpoint}?userId=${user.id}&postId=${postId}`,
      });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isSaved: !isCurrentlySaved } : p
        )
      );
    } catch (err) {
      console.error("Lỗi khi lưu/bỏ lưu:", err);
    }
  };
  // Lấy thông tin user
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("http://150.95.111.137:8080/api/user/me", {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Lỗi lấy thông tin user:", err);
      }
    };

    if (user?.accessToken) {
      fetchUserInfo();
    }
  }, [user?.accessToken]);

  // Hàm sửa: Xử lý like bài viết
  const handleLike = async (postId: number) => {
    const post = posts.find((p) => p.id === postId);
    if (!post || post.isLiked) {
      return; // ⛔ Đã like rồi thì không làm gì cả
    }

    try {
      // Cập nhật UI ngay
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: true,
              likeCount: p.likeCount + 1,
            };
          }
          return p;
        })
      );

      // Gửi request like lên server
      await axios.post(
        `http://150.95.111.137:8080/api/post/${postId}/like`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        }
      );
    } catch (err) {
      console.error("Lỗi khi like:", err);
      // Nếu lỗi rollback lại UI
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === postId) {
            return {
              ...p,
              isLiked: false,
              likeCount: p.likeCount > 0 ? p.likeCount - 1 : 0,
            };
          }
          return p;
        })
      );
    }
  };

  useEffect(() => {
    console.log("🧑 User từ store:", user);
  }, [user]);
  // Lấy chi tiết post khi mở comment modal
  const fetchPostDetail = async (postId: number) => {
    try {
      const res = await axios.get(
        `http://150.95.111.137:8080/api/post/${postId}`
      );
      const data = res.data;

      // Xác định lại isLiked theo user hiện tại
      const isLiked = data.likedUserIds?.includes(userId);
      const updatedPost = { ...data, isLiked };

      // Cập nhật selectedPost và danh sách posts
      setSelectedPost(updatedPost);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updatedPost : p)));
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
    await fetchPostDetail(postId);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ marginTop: 50 }}>
        <TabBarIcons />
      </View>

      <View>
        <Image
          source={{
            uri:
              userData?.backgroundUrl ||
              "https://imagedelivery.net/Ohdh7iLryFFVJERrofTMxQ/b1ab7d5e-1f1c-4e89-2734-800da1899500/public",
          }}
          style={styles.cover}
        />
        <Image
          source={{
            uri: userData?.avatarUrl || "https://via.placeholder.com/100",
          }}
          style={styles.avatarProfile}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{user?.fullName || "Tên người dùng"}</Text>
        <Text style={styles.followers}>
          Đang theo dõi 143 người dùng{" "}
          <Text style={{ fontWeight: "bold" }}>100k</Text> người theo dõi
        </Text>
        <Text style={styles.bio}>
          Một mình vui vẻ đây, 2 mình thì vui hơn 😁
        </Text>
        <Text style={styles.link}>
          🔗 https://www.instagram.com/jenniebyjune/
        </Text>
      </View>

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setSelectedTab("posts")}
          style={[
            styles.tabButton,
            selectedTab === "posts" && styles.activeTab,
          ]}
        >
          <Text style={styles.tabText}>Bài viết</Text>
        </Pressable>
        <Pressable
          onPress={() => setSelectedTab("favorites")}
          style={[
            styles.tabButton,
            selectedTab === "favorites" && styles.activeTab,
          ]}
        >
          <Text style={styles.tabText}>Yêu thích</Text>
        </Pressable>
      </View>

      {selectedTab === "posts" && (
        <View style={styles.postContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#3498db" />
          ) : posts.length === 0 ? (
            <Text style={{ padding: 20, textAlign: "center", color: "#888" }}>
              Không có bài viết nào.
            </Text>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={styles.post}>
                <View style={styles.postHeader}>
                  <Image
                    source={{
                      uri: post.avatarUrl || "https://via.placeholder.com/150",
                    }}
                    style={styles.avatar}
                  />
                  <Text style={styles.userName}>
                    {post.fullName || "Người dùng"}
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

                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
                />

                <Text style={styles.caption}>{post.content}</Text>

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
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginLeft: 16,
                    }}
                  >
                    <Ionicons name="chatbubble-outline" size={20} />
                    <Text style={styles.actionText}>{post.commentCount}</Text>
                  </TouchableOpacity>
                  <Ionicons
                    name="paper-plane-outline"
                    size={20}
                    style={{ marginLeft: 16 }}
                  />
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {selectedTab === "favorites" && (
        <View style={styles.postContainer}>
          {posts.filter((p) => p.isSaved).length === 0 ? (
            <Text style={{ padding: 20, textAlign: "center", color: "#888" }}>
              Chưa có bài viết yêu thích.
            </Text>
          ) : (
            posts
              .filter((p) => p.isSaved)
              .map((post) => (
                <View key={post.id} style={styles.post}>
                  <View style={styles.postHeader}>
                    <Image
                      source={{
                        uri:
                          post.avatarUrl || "https://via.placeholder.com/150",
                      }}
                      style={styles.avatar}
                    />
                    <Text style={styles.userName}>
                      {post.fullName || "Người dùng"}
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

                  <Image
                    source={{ uri: post.imageUrl }}
                    style={styles.postImage}
                  />

                  <Text style={styles.caption}>{post.content}</Text>

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
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginLeft: 16,
                      }}
                    >
                      <Ionicons name="chatbubble-outline" size={20} />
                      <Text style={styles.actionText}>{post.commentCount}</Text>
                    </TouchableOpacity>
                    <Ionicons
                      name="paper-plane-outline"
                      size={20}
                      style={{ marginLeft: 16 }}
                    />
                  </View>
                </View>
              ))
          )}
        </View>
      )}

      {selectedPost && (
        <PostCommentModal
          visible={isCommentModalVisible}
          onClose={closeCommentModal}
          post={selectedPost}
          userId={userId!}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginBottom: 20 },
  cover: { width: "100%", height: 200, resizeMode: "cover" },
  avatarProfile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    position: "absolute",
    left: 20,
    bottom: -40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  infoContainer: {
    marginTop: 50,
    paddingHorizontal: 16,
  },
  name: { fontSize: 18, fontWeight: "bold" },
  username: { color: "#888" },
  followers: { marginVertical: 4, fontSize: 13 },
  bio: { marginVertical: 4 },
  link: { color: "#3498db", fontSize: 13 },
  tabs: {
    flexDirection: "row",
    marginTop: 20,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontWeight: "bold",
  },
  postContainer: {
    padding: 10,
  },
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
  userName: {
    fontWeight: "bold",
    flex: 1,
  },
  star: {
    color: "#f88",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
  },
  caption: {
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  actionText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 4,
  },
  emptyTab: {
    padding: 40,
    alignItems: "center",
  },
});
