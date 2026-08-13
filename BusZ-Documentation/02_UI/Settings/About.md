# About

Project: BusZ - Intercity Bus Ticket Booking Platform

Module: Settings

Document ID: SETTINGS-010

Priority: Medium

Status: Draft

Version: 1.0

---

# 1. Purpose

About cung cấp thông tin chính thức về ứng dụng BusZ, phiên bản phần mềm, chính sách sử dụng và các thông tin hỗ trợ người dùng.

Module này cũng là nơi người dùng có thể:

- Kiểm tra phiên bản.
- Xem điều khoản sử dụng.
- Xem chính sách quyền riêng tư.
- Báo lỗi.
- Kiểm tra cập nhật.

---

# 2. Objectives

Đảm bảo:

✓ Minh bạch.

✓ Hỗ trợ người dùng.

✓ Kiểm tra phiên bản.

✓ Báo lỗi.

✓ Điều hướng tới tài liệu pháp lý.

---

# 3. Actors

Customer

Admin

Support Service

Update Service

---

# 4. About Categories

Application

Version

License

Terms of Service

Privacy Policy

Open Source Licenses

Support

Feedback

Updates

Copyright

---

# 5. Application Information

Application Name

BusZ

Application Version

Semantic Versioning

Build Number

Release Date

Environment

Production / Staging / Development

---

# 6. Legal Information

Terms of Service

Privacy Policy

Cookie Policy (Web)

Open Source Licenses

Third-party Services

---

# 7. Support Information

Customer Support Email

Support Hotline

FAQ

Help Center

Report a Bug

Feature Request

---

# 8. Business Rules

SETTINGS-BR-045

Version phải đồng bộ với Build.

SETTINGS-BR-046

Privacy Policy luôn hiển thị phiên bản mới nhất.

SETTINGS-BR-047

Terms of Service phải được lưu phiên bản.

SETTINGS-BR-048

Report Bug phải ghi Audit Log.

SETTINGS-BR-049

Update Check chỉ kiểm tra phiên bản mới hơn.

---

# 9. Business Logic

Open About

↓

Load App Information

↓

Load Legal Information

↓

Load Version

↓

Display

---

# 10. API

GET /settings/about

GET /settings/version

GET /settings/licenses

GET /settings/privacy-policy

GET /settings/terms

POST /settings/report-bug

GET /settings/check-update

---

# 11. Database

application_versions

legal_documents

bug_reports

release_notes

audit_logs

---

# 12. Loading State

Loading Application Info

↓

Loading Version

↓

Loading Documents

---

# 13. Empty State

No Information

↓

Load Default Content

---

# 14. Error State

Load Failed

↓

Retry

---

Update Check Failed

↓

Retry

---

Bug Report Failed

↓

Retry

---

# 15. Success State

Application Information Loaded

↓

Update Available

↓

Bug Report Submitted

---

# 16. Version Check

Current Version

↓

Compare Latest Version

↓

Update Available

↓

Open Store

---

# 17. Report Bug

Describe Problem

↓

Attach Screenshot (Optional)

↓

Submit

↓

Tracking ID Generated

---

# 18. Notification

Update Available

Bug Report Submitted

Terms Updated

Privacy Policy Updated

---

# 19. Analytics

about_opened

version_checked

update_available

bug_report_submitted

privacy_policy_opened

terms_opened

---

# 20. Flutter Widget Tree

Scaffold

↓

ApplicationInfoCard

↓

VersionCard

↓

LegalDocumentList

↓

SupportCard

↓

UpdateCard

↓

ReportBugButton

---

# 21. State Management

AboutBloc

VersionRepository

SupportRepository

UpdateRepository

---

# 22. Performance

Load Information

<500ms

Check Update

<2 giây

Submit Bug Report

<2 giây

---

# 23. Accessibility

Large Font

Screen Reader

Keyboard Navigation

Touch Area ≥48dp

---

# 24. Test Cases

✓ Load About.

✓ Check Version.

✓ Open Privacy Policy.

✓ Open Terms.

✓ Report Bug.

✓ Update Check.

---

# 25. Acceptance Criteria

✓ Version hiển thị đúng.

✓ Documents mở đúng.

✓ Update Check hoạt động.

✓ Bug Report gửi thành công.

✓ Audit Log đầy đủ.

---

# 26. Related Documents

Privacy

Security Settings

Notification

Profile

Authentication

---

# 27. Future Expansion

Release Notes Timeline

Developer Mode

Beta Program

Diagnostics

System Health Check

---

# 28. Summary

About cung cấp thông tin chính thức về BusZ, bao gồm phiên bản ứng dụng, tài liệu pháp lý, hỗ trợ người dùng, báo lỗi và kiểm tra cập nhật, giúp người dùng dễ dàng tra cứu thông tin và nhận hỗ trợ khi cần.