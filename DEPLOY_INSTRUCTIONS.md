# 🚀 Hướng dẫn Deploy lên Server

## ⚡ Cách nhanh nhất: Vercel (Khuyến nghị)

### Bước 1: Đẩy code lên GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Bước 2: Deploy lên Vercel
1. Truy cập: https://vercel.com
2. Đăng nhập bằng GitHub
3. Click **"Add New Project"**
4. Chọn repository vừa push
5. Vercel tự động detect:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Click **"Deploy"**
7. Đợi 2-3 phút
8. Nhận URL: `https://your-project.vercel.app`

✅ **Xong!** Bạn đã có link để gửi cho bạn bè.

---

## 🌐 Cách 2: Netlify

### Bước 1: Đẩy code lên GitHub (giống trên)

### Bước 2: Deploy lên Netlify
1. Truy cập: https://netlify.com
2. Đăng nhập bằng GitHub
3. Click **"Add new site"** > **"Import an existing project"**
4. Chọn repository
5. Cấu hình:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **"Deploy site"**
7. Nhận URL: `https://your-project.netlify.app`

---

## 📦 Cách 3: Deploy thủ công (nếu có server riêng)

### Bước 1: Build project
```bash
npm run build
```

### Bước 2: Upload thư mục `dist`
- Upload toàn bộ nội dung trong thư mục `dist/` lên web server
- Đảm bảo server hỗ trợ SPA routing (redirect về index.html)

---

## 🔧 Cấu hình đã sẵn sàng

✅ `vercel.json` - Cấu hình cho Vercel
✅ `netlify.toml` - Cấu hình cho Netlify  
✅ `vite.config.js` - Đã cấu hình build

---

## 📝 Lưu ý

1. **HTTPS tự động**: Tất cả platform đều có HTTPS
2. **Custom Domain**: Có thể thêm domain riêng
3. **Auto Deploy**: Mỗi lần push code lên GitHub sẽ tự động deploy lại
4. **Environment Variables**: Nếu cần biến môi trường, thêm trong settings của platform

---

## 🎯 Test sau khi deploy

1. ✅ Trang login hoạt động
2. ✅ Đăng ký user mới
3. ✅ Đăng nhập với các role khác nhau
4. ✅ Phân quyền hoạt động
5. ✅ CRUD Projects và Tenders

---

## 🆘 Troubleshooting

### Lỗi 404 khi refresh trang
- ✅ Đã có cấu hình redirect trong `vercel.json` và `netlify.toml`

### Build failed
- Kiểm tra console log
- Đảm bảo tất cả dependencies đã install

### Routing không hoạt động
- Kiểm tra file cấu hình đã có redirect rules

---

## 💡 Gợi ý

**Vercel** là lựa chọn tốt nhất vì:
- ⚡ Nhanh nhất
- 🆓 Miễn phí
- 🔄 Auto deploy từ GitHub
- 📱 Hỗ trợ mobile tốt
- 🌍 CDN toàn cầu