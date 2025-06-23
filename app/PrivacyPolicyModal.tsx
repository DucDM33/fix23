// components/PrivacyPolicyModal.tsx
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PrivacyPolicyModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            <Text style={styles.title}>
              CHÍNH SÁCH QUYỀN RIÊNG TƯ – ỨNG DỤNG WETRIP
            </Text>
            <Text style={styles.text}>
              Chào mừng bạn đến với WeTrip – ứng dụng du lịch du lịch kết hợp
              tính năng đặt tour, phòng, vé và kết nối bạn đồng hành cùng sở
              thích. Chúng tôi cam kết tôn trọng và bảo vệ quyền riêng tư của
              người dùng. Chính sách này giải thích cách We Trip thu thập, sử
              dụng, lưu trữ và chia sẻ thông tin cá nhân của bạn.
              {"\n"}1. THÔNG TIN CHÚNG TÔI THU THẬP{"\n"}...{"\n"}
              a. Thông tin tài khoản Họ tên, ảnh đại diện Ảnh đại diện, giấy tờ
              tùy thân (để xác thực). Ngày sinh, giới tính, sở thích (phục vụ
              tính năng matching) Số điện thoại, email, mật khẩu (được mã hóa){" "}
              {"\n"}
              b. Thông tin du lịch và sở thích Các địa điểm yêu thích, lịch
              trình dự kiến Thông tin được cung cấp trong hồ sơ "tìm bạn đồng
              hành" như mô tả bản thân, phong cách du lịch, ngôn ngữ nói {"\n"}
              c. Vị trí địa lý Vị trí hiện tại (chỉ khi bạn cho phép) nhằm gợi ý
              bạn đồng hành hoặc dịch vụ gần bạn d. Dữ liệu thiết bị và hoạt
              động sử dụng Thiết bị sử dụng, hệ điều hành, địa chỉ IP Lịch sử
              tìm kiếm, đặt chỗ, hoạt động tương tác (chat, thích, kết nối bạn){" "}
              {"\n"}e. Dữ liệu bên thứ ba Nếu bạn liên kết tài khoản We Trip với
              Google/Facebook/Apple, chúng tôi có thể truy cập thông tin cơ bản
              từ đó (với sự đồng ý của bạn) {"\n"}
              {"\n"}2. MỤC ĐÍCH SỬ DỤNG DỮ LIỆU {"\n"}
              {"\n"}Thông tin cá nhân được dùng để: Tạo tài khoản và xác thực
              người dùng Cung cấp dịch vụ đặt vé, phòng, tour Kết nối bạn đồng
              hành phù hợp thông qua thuật toán matching Gửi thông báo quan
              trọng, xác nhận giao dịch hoặc lời mời kết bạn Đề xuất địa điểm,
              hành trình, bạn đồng hành theo sở thích và vị trí Cải thiện trải
              nghiệm người dùng và đảm bảo an toàn hệ thống {"\n"}
              {"\n"}3. BẢO MẬT THÔNG TIN{"\n"}
              {"\n"}
              We Trip áp dụng các biện pháp bảo mật cao: Mã hóa mật khẩu bằng
              thuật toán một chiều, không thể giải ngược Dữ liệu được lưu trữ
              trên hệ thống bảo mật với quyền truy cập nội bộ được kiểm soát
              nghiêm ngặt Định kỳ kiểm tra bảo mật và ngăn chặn truy cập trái
              phép {"\n"}
              {"\n"}4. CHIA SẺ THÔNG TIN {"\n"}
              {"\n"}Chúng tôi không bán dữ liệu người dùng. Dữ liệu chỉ được
              chia sẻ trong các trường hợp sau: Với đối tác dịch vụ như khách
              sạn, hãng xe, cổng thanh toán để xử lý đơn đặt Với bạn đồng hành
              được đề xuất qua tính năng matching – chỉ chia sẻ thông tin công
              khai trong hồ sơ, không bao gồm thông tin nhạy cảm (email, số điện
              thoại trừ khi bạn đồng ý) Với bên cung cấp kỹ thuật (cloud, phân
              tích dữ liệu) – có ký kết thỏa thuận bảo mật Theo yêu cầu hợp pháp
              của cơ quan chức năng {"\n"}
              {"\n"}5. QUYỀN CỦA NGƯỜI DÙNG {"\n"}
              {"\n"}Bạn có quyền: Xem và chỉnh sửa thông tin cá nhân trong hồ sơ
              Tắt hoặc xóa hồ sơ "tìm bạn đồng hành" bất kỳ lúc nào Rút lại
              quyền truy cập vị trí hoặc liên kết tài khoản mạng xã hội Yêu cầu
              xóa vĩnh viễn tài khoản và dữ liệu cá nhân Từ chối nhận email tiếp
              thị, thông báo không cần thiết {"\n"}
              {"\n"}6. COOKIE VÀ CÔNG NGHỆ THEO DÕI{"\n"}
              {"\n"}
              WeTrip sử dụng cookies để: Ghi nhớ lựa chọn người dùng Phân tích
              hành vi sử dụng để tối ưu trải nghiệm Bạn có thể tắt cookies qua
              trình duyệt, tuy nhiên một số chức năng có thể bị giới hạn {"\n"}
              {"\n"}7. LƯU TRỮ VÀ THỜI GIAN LƯU GIỮ{"\n"}
              {"\n"} Dữ liệu cá nhân được lưu trong thời gian bạn sử dụng WeTrip
              Bạn có thể yêu cầu xóa tài khoản. Một số thông tin sẽ được lưu trữ
              thêm trong thời gian ngắn để đáp ứng yêu cầu pháp lý (nếu có){" "}
              {"\n"}
              {"\n"}8. THAY ĐỔI CHÍNH SÁCH {"\n"}
              {"\n"}Chính sách có thể được cập nhật định kỳ. Chúng tôi sẽ thông
              báo trên ứng dụng hoặc qua email nếu có thay đổi quan trọng.
              {"\n\n"}9. LIÊN HỆ{"\n"}
              Email hỗ trợ: wetrip.innox@gmail.com
            </Text>
          </ScrollView>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    height: "80%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
    color: "#0C4A7F",
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#0C4A7F",
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
