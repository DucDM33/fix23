import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Comment {
  id: number;
  content: string;
  userId: number;
  userName: string;
  userAvatar: string;
  createdAt: string;
}

interface Post {
  id: number;
  content: string;
  imageUrl: string;
  commentCount: number;
  comments: Comment[];
  avatarUrl: string;
  fullName: string;
}

interface PostCommentModalProps {
  visible: boolean;
  onClose: () => void;
  post: Post;
  userId: number;
  onCommentAdded: (postId: number, newComment: Comment) => void;
}

export default function PostCommentModal({
  visible,
  onClose,
  post,
  userId,
  onCommentAdded,
}: PostCommentModalProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>([]);

  useEffect(() => {
    // Khi post thay đổi (postId), thì cập nhật localComments
    setLocalComments(post.comments || []);
  }, [post]);

  const handleSendComment = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://150.95.111.137:8080/api/post/${post.id}/comments?userId=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: commentText }),
        }
      );

      const text = await response.text();
      console.log("Response status:", response.status);
      console.log("Response body:", text);
      console.log(userId)

      if (!response.ok) {
        throw new Error("Failed to send comment");
      }

      const newComment: Comment = JSON.parse(text);

      setLocalComments((prev) => [...prev, newComment]); // ✅ thêm vào UI
      onCommentAdded(post.id, newComment); // nếu cha cần cập nhật
      setCommentText(""); // reset input
    } catch (error) {
      console.error("Error sending comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Bình luận</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>Đóng</Text>
          </TouchableOpacity>
        </View>

        {/* Thông tin bài viết */}
        <View style={styles.postInfo}>
          <Image
            source={{
              uri: post.avatarUrl || "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.postUserName}>
              {post.fullName || "Người dùng"}
            </Text>
            <Text style={styles.postContent}>{post.content}</Text>
          </View>
        </View>

        {/* Danh sách bình luận */}
        <FlatList
          data={localComments}
          keyExtractor={(item, index) =>
            item?.id?.toString() ?? `comment-${index}`
          }
          style={styles.commentList}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <Image
                source={{
                  uri: item.userAvatar || "https://via.placeholder.com/100",
                }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentBody}>
                <Text style={styles.commentUserName}>{item.userName}</Text>
                <Text style={styles.commentContent}>{item.content}</Text>
                <Text style={styles.commentTime}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Chưa có bình luận nào.
            </Text>
          }
        />

        {/* Input bình luận */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Viết bình luận..."
            value={commentText}
            onChangeText={setCommentText}
            style={styles.input}
            editable={!isSubmitting}
          />
          <TouchableOpacity
            onPress={handleSendComment}
            style={[styles.sendBtn, isSubmitting && { opacity: 0.5 }]}
            disabled={isSubmitting}
          >
            <Text style={styles.sendBtnText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  title: { fontSize: 18, fontWeight: "bold" },
  closeBtn: { color: "blue", fontSize: 16 },
  postInfo: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  postUserName: { fontWeight: "bold", marginBottom: 4 },
  postContent: { fontSize: 14, color: "#333" },
  commentList: { flex: 1, paddingHorizontal: 12 },
  commentItem: {
    flexDirection: "row",
    marginVertical: 8,
  },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  commentBody: { flex: 1 },
  commentUserName: { fontWeight: "bold" },
  commentContent: { fontSize: 14, color: "#444" },
  commentTime: { fontSize: 10, color: "#999", marginTop: 2 },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sendBtn: {
    marginLeft: 12,
    backgroundColor: "#007bff",
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  sendBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
