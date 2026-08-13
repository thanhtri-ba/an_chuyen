# File Management

Project

BusZ - Intercity Bus Ticket Booking Platform

Module

Admin Web

Document ID

ADM-016

Priority

High

Version

1.0

---

# 1. Purpose

File Management quản lý toàn bộ tài nguyên số của hệ thống BusZ.

Bao gồm:

- Hình ảnh
- Logo nhà xe
- Vé PDF
- Hợp đồng
- Giấy phép
- Hóa đơn
- Tài liệu
- File Import/Export

---

# 2. User Flow

```text
Dashboard

↓

File Management

↓

Upload

↓

Process

↓

Store

↓

Manage
```

---

# 3. File Categories

```text
Images

Documents

Invoices

Tickets

Company Logos

Vehicle Photos

Driver Documents

Contracts

Reports

Import Files
```

---

# 4. Supported Formats

Images

```text
PNG

JPG

JPEG

WEBP

SVG
```

Documents

```text
PDF

DOCX

XLSX

CSV

TXT
```

Archives

```text
ZIP
```

---

# 5. Upload

Cho phép

```text
Single Upload

Multiple Upload

Drag & Drop

Folder Upload
```

Hiển thị

```text
Progress

Speed

Remaining Time
```

---

# 6. File Validation

Kiểm tra

```text
File Size

File Type

Extension

Virus Scan

Duplicate File
```

Giới hạn

```text
Image

10MB

Document

50MB

Archive

200MB
```

---

# 7. File Storage

Hỗ trợ

```text
Supabase Storage

Amazon S3

Cloudinary

Local Storage (Development)
```

---

# 8. Folder Structure

Ví dụ

```text
companies/

tickets/

payments/

contracts/

drivers/

vehicles/

reports/

system/
```

---

# 9. File Metadata

Lưu

```text
File ID

Name

Extension

Size

Mime Type

Checksum

Uploaded By

Created Time

Last Modified

Storage Path
```

---

# 10. File Versioning

Cho phép

```text
Create New Version

View Version

Restore Version
```

Không ghi đè trực tiếp.

---

# 11. Image Processing

Tự động

```text
Resize

Compress

Thumbnail

WebP Conversion
```

---

# 12. Preview

Hỗ trợ

```text
Image Preview

PDF Preview

Text Preview
```

Không cần tải xuống.

---

# 13. Access Control

Quyền

```text
View

Upload

Edit

Delete

Download

Share
```

Áp dụng RBAC.

---

# 14. Sharing

Cho phép

```text
Temporary Link

Public Link

Private Link
```

Có thời hạn

```text
15 Minutes

1 Hour

24 Hours
```

---

# 15. File Search

Theo

```text
File Name

Uploader

Category

Extension

Date
```

---

# 16. File Lifecycle

```text
Uploaded

↓

Processed

↓

Active

↓

Archived

↓

Deleted
```

---

# 17. API Integration

```text
GET /admin/files

GET /admin/files/{id}

POST /admin/files/upload

PATCH /admin/files/{id}

DELETE /admin/files/{id}

POST /admin/files/{id}/restore
```

---

# 18. Component Tree

```text
FileManagementPage

↓

UploadPanel

↓

SearchBox

↓

FilterBar

↓

FileTable

↓

PreviewDrawer

↓

VersionHistory

↓

StorageStatistics
```

---

# 19. Performance

Upload

```text
10MB/s
```

Preview

```text
<500ms
```

Search

```text
<200ms
```

---

# 20. Security

✓ Virus Scan.

✓ MIME Validation.

✓ Signed URL.

✓ Encrypted Storage.

✓ File Integrity Check.

✓ RBAC.

✓ Audit Log.

---

# 21. UX Guidelines

✓ Drag & Drop Upload.

✓ Upload Progress rõ ràng.

✓ Thumbnail cho hình ảnh.

✓ Preview trực tiếp.

✓ Hỗ trợ tải nhiều file.

---

# 22. Test Cases

✓ Single Upload.

✓ Multiple Upload.

✓ Preview PDF.

✓ Preview Image.

✓ Restore Version.

✓ Delete File.

✓ Search.

✓ Share Link.

---

# 23. Acceptance Criteria

✓ Upload thành công.

✓ Preview hoạt động.

✓ Versioning hoạt động.

✓ Search chính xác.

✓ Signed URL an toàn.

✓ Audit Log đầy đủ.

---

# 24. Related Documents

ADM-005 Bus Company Management

ADM-015 Audit Log

ADM-019 Deployment

API-016 File API

---

# 25. Summary

File Management là hệ thống quản lý tài nguyên số của BusZ Admin, hỗ trợ tải lên, lưu trữ, xem trước, phân quyền và quản lý phiên bản tệp. Module tích hợp với các dịch vụ lưu trữ đám mây như Supabase Storage, Amazon S3 hoặc Cloudinary, đồng thời đảm bảo tính bảo mật, khả năng mở rộng và hiệu năng cao.