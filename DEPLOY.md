# Hướng dẫn Deploy lên Server

## Option 1: Deploy lên Vercel (Khuyến nghị - Dễ nhất)

### Bước 1: Chuẩn bị
1. Đảm bảo code đã được commit lên GitHub
2. Truy cập [vercel.com](https://vercel.com)
3. Đăng nhập bằng GitHub account

### Bước 2: Deploy
1. Click "Add New Project"
2. Import repository từ GitHub
3. Vercel sẽ tự động detect Vite
4. Click "Deploy"
5. Đợi vài phút để build xong
6. Bạn sẽ nhận được URL như: `https://your-project.vercel.app`

### Bước 3: Cấu hình (nếu cần)
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Option 2: Deploy lên Netlify

### Bước 1: Chuẩn bị
1. Đảm bảo code đã được commit lên GitHub
2. Truy cập [netlify.com](https://netlify.com)
3. Đăng nhập bằng GitHub account

### Bước 2: Deploy
1. Click "Add new site" > "Import an existing project"
2. Chọn GitHub và chọn repository
3. Cấu hình:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Click "Deploy site"
5. Bạn sẽ nhận được URL như: `https://your-project.netlify.app`

## Option 3: Deploy lên GitHub Pages

### Bước 1: Cài đặt gh-pages
```bash
npm install --save-dev gh-pages
```

### Bước 2: Thêm script vào package.json
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

### Bước 3: Deploy
```bash
npm run deploy
```

### Bước 4: Cấu hình GitHub
1. Vào Settings > Pages
2. Chọn branch `gh-pages`
3. URL sẽ là: `https://username.github.io/repo-name`

## Option 4: Build và Deploy thủ công

### Build project
```bash
npm run build
```

### Upload thư mục `dist` lên server
- Upload toàn bộ nội dung trong thư mục `dist` lên web server
- Đảm bảo server hỗ trợ SPA routing (redirect tất cả routes về index.html)

## Lưu ý quan trọng

1. **Environment Variables**: Nếu có biến môi trường, cần cấu hình trong platform deploy
2. **API URLs**: Nếu có backend API, cần cập nhật URL trong code
3. **HTTPS**: Tất cả các platform trên đều hỗ trợ HTTPS tự động
4. **Custom Domain**: Có thể thêm domain riêng nếu muốn

## Kiểm tra sau khi deploy

1. Kiểm tra trang login hoạt động
2. Kiểm tra đăng ký user mới
3. Kiểm tra phân quyền
4. Kiểm tra các chức năng CRUD

## Troubleshooting

### Lỗi 404 khi refresh trang
- Đảm bảo đã cấu hình redirect rules (đã có trong vercel.json và netlify.toml)

### Lỗi build
- Kiểm tra console log trong quá trình build
- Đảm bảo tất cả dependencies đã được install

### Lỗi routing
- Kiểm tra file vercel.json hoặc netlify.toml đã có redirect rules