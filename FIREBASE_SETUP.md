# 🔥 Hướng dẫn tích hợp Firebase để lưu dữ liệu chung

## Vấn đề hiện tại:
- Dữ liệu lưu trong localStorage (mỗi trình duyệt riêng biệt)
- User A tạo tài khoản → chỉ lưu trong localStorage của User A
- Admin không thấy tài khoản của User A

## Giải pháp: Firebase Realtime Database

### Bước 1: Tạo Firebase Project
1. Truy cập: https://console.firebase.google.com
2. Click "Add project"
3. Đặt tên project (ví dụ: `quanlyduan`)
4. Tắt Google Analytics (hoặc bật nếu muốn)
5. Click "Create project"

### Bước 2: Tạo Realtime Database
1. Vào "Realtime Database" trong menu trái
2. Click "Create Database"
3. Chọn location (gần nhất với bạn)
4. Chọn "Start in test mode" (để test nhanh)
5. Click "Enable"

### Bước 3: Lấy Firebase Config
1. Vào "Project Settings" (biểu tượng bánh răng)
2. Scroll xuống "Your apps"
3. Click icon Web `</>`
4. Đặt tên app: `quanlyduan-web`
5. Copy các thông tin:
   - apiKey
   - authDomain
   - databaseURL
   - projectId
   - storageBucket
   - messagingSenderId
   - appId

### Bước 4: Cấu hình Rules (Quan trọng!)
1. Vào "Realtime Database" > "Rules"
2. Thay đổi rules thành:
```json
{
  "rules": {
    "users": {
      ".read": true,
      ".write": true
    }
  }
}
```
3. Click "Publish"

### Bước 5: Cài đặt Firebase trong project
```bash
npm install firebase
```

### Bước 6: Tạo file config Firebase
Tạo file `src/config/firebase.js` với config đã copy

### Bước 7: Cập nhật authSlice để dùng Firebase
Thay localStorage bằng Firebase Realtime Database

---

## Lưu ý bảo mật:
- Test mode chỉ để demo
- Production cần cấu hình Authentication và Rules phù hợp
- Không lưu password dạng plain text (cần hash)

---

## Alternative: Supabase (Dễ hơn Firebase)
- Có sẵn authentication
- Database PostgreSQL
- API tự động
- Miễn phí tier tốt

Bạn muốn tôi tích hợp Firebase hay Supabase?