# FORMAL REQUIREMENT SPECIFICATION
## BusZ Card Management & Digital Signer Service

**Document Type:** Formal Work Order / Requirement Specification  
**Date Issued:** August 13, 2026  
**Valid Until:** September 30, 2026  
**Reference:** BusZ-CARD-2026-v1.0  

---

## 📋 EXECUTIVE SUMMARY

This document formalizes the requirements for **Team antiravity** to develop a complete **Card Management System** with **Digital Signer Service** for BusZ platform.

**Scope:** Backend (Java/Spring Boot) + Mobile (Kotlin) + DevOps (K8s)  
**Duration:** 8 weeks (32 working days)  
**Budget:** $104,000 (development) + $27,000/year (infrastructure)  
**Target Completion:** November 30, 2026  

---

## 1. PROJECT OVERVIEW

### 1.1 Objective
Develop a production-ready **Card Management System** and **Digital Signer Service** to:
- Enable users to save and reuse payment cards (1-click checkout)
- Digitally sign transactions and e-tickets for non-repudiation
- Achieve PCI DSS Level 1 compliance
- Improve payment conversion by 30%

### 1.2 Problem Statement
**Current System Issues:**
- Users must enter card details for every transaction (Poor UX)
- E-tickets lack digital proof of authenticity (Compliance risk)
- No card tokenization (PCI security risk)
- No audit trail for transactions (Regulatory gap)

### 1.3 Proposed Solution
Implement:
1. **Card Service (Java/Spring Boot)** - Secure card storage & management
2. **Signer Service (Java/Spring Boot)** - Digital signatures & certificates
3. **Payment Integration** - Seamless payment flow with signatures
4. **Mobile App (Kotlin)** - Android app with biometric authentication
5. **Infrastructure** - Docker, Kubernetes, CI/CD automation

---

## 2. SCOPE OF WORK

### 2.1 IN SCOPE

#### Phase 1: Card Service (Weeks 1-2)
**Deliverables:**
- ✅ Spring Boot Card Service (REST API)
- ✅ Card CRUD operations (Add, Read, Update, Delete)
- ✅ Card encryption (AES-256)
- ✅ Card tokenization with payment gateway
- ✅ Card wallet management
- ✅ Database schema (PostgreSQL)
- ✅ Unit tests (80%+ coverage)
- ✅ Integration tests
- ✅ API documentation (OpenAPI/Swagger)
- ✅ Docker image
- ✅ 8 REST endpoints working

**Endpoints:**
```
POST   /api/v1/cards                 - Add card
GET    /api/v1/cards                 - List user cards
GET    /api/v1/cards/{id}            - Get card detail
PUT    /api/v1/cards/{id}            - Update card
DELETE /api/v1/cards/{id}            - Delete card
POST   /api/v1/cards/{id}/set-default
POST   /api/v1/wallet/balance
POST   /api/v1/wallet/topup
```

#### Phase 2: Digital Signer (Weeks 3-4)
**Deliverables:**
- ✅ Spring Boot Signer Service
- ✅ RSA-2048 key pair generation
- ✅ SHA-256 digital signature generation
- ✅ Signature verification
- ✅ X.509 certificate management
- ✅ Timestamp authority support
- ✅ Audit logging (immutable)
- ✅ Unit tests (90%+ coverage)
- ✅ Cryptographic security tests
- ✅ 5 REST endpoints

**Endpoints:**
```
POST   /api/v1/certificates/generate
GET    /api/v1/certificates
POST   /api/v1/sign
POST   /api/v1/verify
POST   /api/v1/timestamp
```

#### Phase 3: Integration & Testing (Weeks 5-6)
**Deliverables:**
- ✅ Payment Service → Card Service integration
- ✅ Payment Service → Signer Service integration
- ✅ Ticket Service → Signer integration
- ✅ Complete end-to-end payment flow
- ✅ E-ticket generation with digital signature
- ✅ Database migration scripts (Flyway)
- ✅ End-to-end test scenarios (10+)
- ✅ Load testing (1000 RPS, p99 < 200ms)
- ✅ Security testing (SQL injection, XSS, signature tampering)
- ✅ Performance benchmarks

#### Phase 4: Deployment (Weeks 7-8)
**Deliverables:**
- ✅ Docker images (card-service, signer-service)
- ✅ Kubernetes manifests
  - Deployment (3 replicas)
  - Service (ClusterIP)
  - ConfigMap (configuration)
  - Secret (credentials)
  - HPA (autoscaling)
  - Ingress (routing)
- ✅ GitHub Actions CI/CD pipeline
- ✅ Automated testing on PR
- ✅ Automated deployment on merge
- ✅ Monitoring setup (Prometheus, Grafana)
- ✅ Logging setup (ELK stack)
- ✅ Health checks & alerts

#### Phase 5: Mobile App (Weeks 9-10)
**Deliverables:**
- ✅ Android app (Kotlin)
- ✅ Card management UI (Jetpack Compose)
- ✅ Payment screen
- ✅ Biometric authentication (Fingerprint/Face)
- ✅ E-ticket display with signature
- ✅ Offline signature verification
- ✅ Secure storage (Android Keystore, Tink)
- ✅ Unit & UI tests
- ✅ APK release build
- ✅ App Store ready

### 2.2 OUT OF SCOPE

❌ iOS app (Limitation: Kotlin/Android only)  
❌ Web dashboard (Future phase)  
❌ Advanced analytics (Future phase)  
❌ E-wallet (Planned for Phase 5+)  
❌ Subscription management (Future phase)  
❌ Custom payment gateway integration (Use existing: VNPay, MoMo, ZaloPay)  

---

## 3. TECHNICAL REQUIREMENTS

### 3.1 Technology Stack

**Backend:**
```
Language:       Java 17+
Framework:      Spring Boot 3.1+
ORM:            Spring Data JPA + Hibernate
Security:       Spring Security + JWT (RS256)
Cryptography:   Bouncy Castle 1.76+
Database:       PostgreSQL 14+
Cache:          Redis 7+
Secret Mgmt:    HashiCorp Vault
Container:      Docker
Orchestration:  Kubernetes 1.24+
CI/CD:          GitHub Actions
Monitoring:     Prometheus + Grafana
Logging:        ELK Stack (Elasticsearch, Logstash, Kibana)
```

**Mobile:**
```
Language:       Kotlin 1.9+
Framework:      Android SDK 26+
UI:             Jetpack Compose
HTTP:           Retrofit 2 + OkHttp
Database:       Room Database
Security:       Android Keystore, Tink
Biometric:      BiometricPrompt API
Testing:        JUnit 5, Espresso
```

**Database:**
```
PostgreSQL 14+
Migration Tool: Flyway
Connection Pool: HikariCP (20-50 connections)
Encryption:     pgcrypto extension
Row-level Security: Enabled
```

### 3.2 Non-Functional Requirements

| Requirement | Target | Notes |
|------------|--------|-------|
| **Availability** | 99.9% | 43.2 min downtime/month allowed |
| **API Latency (p50)** | < 100ms | 50th percentile response time |
| **API Latency (p99)** | < 200ms | 99th percentile (critical) |
| **Throughput** | > 500 RPS | Requests per second minimum |
| **Memory** | 512MB-1GB | Per service instance |
| **Startup Time** | < 30s | Container startup |
| **Code Coverage** | 80%+ | Unit + Integration tests |
| **Security** | PCI DSS L1 | Compliance required |
| **Encryption** | AES-256 | Data at rest |
| **TLS** | 1.3 | Minimum for data in transit |

---

## 4. DELIVERABLES CHECKLIST

### Phase 1 (Week 2 End)
**Sign-Off Required**

```
Code Deliverables:
☐ card-service.jar (executable)
☐ Source code (GitHub)
☐ Dockerfile (working)
☐ docker-compose.yml (local dev)
☐ pom.xml (Maven)
☐ application.yml + application-dev.yml

Database:
☐ Migration script: V1.0__Initial_Card_Tables.sql
☐ Database schema (11 tables designed)
☐ Indexes created
☐ Constraints defined

Tests:
☐ 20+ unit tests (passing)
☐ 10+ integration tests (passing)
☐ 85%+ code coverage
☐ SonarQube report (Quality Gate: PASS)

Documentation:
☐ API documentation (Swagger/OpenAPI)
☐ README.md updated
☐ Code comments for complex logic
☐ Exception codes documented

Verification:
☐ mvn clean install → SUCCESS
☐ mvn test → 20/20 PASSED
☐ mvn spring-boot:run → HTTP 200
☐ curl http://localhost:8081/api/v1/cards → SUCCESS

Sign-Off:
Tech Lead:    ________________  Date: _______
QA Lead:      ________________  Date: _______
Product Mgr:  ________________  Date: _______
```

### Phase 2 (Week 4 End)
**Sign-Off Required**

```
Code Deliverables:
☐ signer-service.jar
☐ CryptoProvider.java (RSA/SHA256)
☐ CertificateService.java
☐ SignerService.java
☐ AuditService.java

Cryptographic:
☐ RSA-2048 key generation
☐ SHA-256 signature generation
☐ Signature verification working
☐ X.509 certificate handling
☐ Timestamp token support

Tests:
☐ 25+ cryptographic tests (passing)
☐ 10+ certificate tests (passing)
☐ 90%+ code coverage
☐ Security audit passed

Database:
☐ Migration: V1.1__Initial_Signer_Tables.sql
☐ Certificate table
☐ Signature table
☐ Audit log table

Sign-Off:
Tech Lead:    ________________  Date: _______
Security Lead: ________________  Date: _______
QA Lead:      ________________  Date: _______
```

### Phase 3 (Week 6 End)
**Sign-Off Required**

```
Integration:
☐ Payment Service → Card Service (API calls working)
☐ Payment Service → Signer Service (signatures generated)
☐ Ticket Service → Signer Service (e-tickets with signatures)
☐ Complete flow: Card → Payment → Signature → Ticket

Testing:
☐ E2E scenarios: 10/10 PASSED
☐ Load test: p99 < 200ms ✓
☐ Security tests: All PASSED
☐ Database migration: All PASSED
☐ Concurrent requests: Handled ✓

Documentation:
☐ Integration guide updated
☐ Payment flow diagram
☐ Troubleshooting guide

Sign-Off:
Tech Lead:    ________________  Date: _______
QA Lead:      ________________  Date: _______
Product Mgr:  ________________  Date: _______
```

### Phase 4 (Week 8 End)
**Sign-Off Required**

```
Deployment:
☐ Docker images built & pushed
☐ Kubernetes manifests ready
☐ ConfigMap configured
☐ Secrets configured
☐ HPA configured (min 3, max 10 replicas)
☐ Ingress configured

CI/CD:
☐ GitHub Actions workflow (.github/workflows/)
☐ Build step: mvn clean package
☐ Test step: mvn test
☐ Security scan: Trivy + SonarQube
☐ Push step: Docker push
☐ Deploy step: kubectl apply

Monitoring:
☐ Prometheus scrape config
☐ Grafana dashboards (5+ dashboards)
☐ Alert rules defined
☐ ELK stack configured

Sign-Off:
DevOps Lead:  ________________  Date: _______
Tech Lead:    ________________  Date: _______
```

### Phase 5 (Week 10 End)
**Sign-Off Required**

```
Android App:
☐ Kotlin project compiled
☐ Card management screens (3 screens)
☐ Payment screen (1 screen)
☐ Biometric authentication working
☐ E-ticket display with signature
☐ Unit tests: 15+ passing
☐ UI tests: 10+ passing

APK:
☐ Debug APK builds
☐ Release APK builds
☐ Code signed
☐ Proguard/R8 applied
☐ Ready for App Store

Documentation:
☐ Android dev guide
☐ Build instructions
☐ Testing guide

Sign-Off:
Mobile Lead:  ________________  Date: _______
QA Lead:      ________________  Date: _______
Product Mgr:  ________________  Date: _______
```

---

## 5. RESOURCE REQUIREMENTS

### 5.1 Team Composition

| Role | Hours/Week | Weeks | Total Hours | Responsibility |
|------|-----------|-------|------------|-----------------|
| Backend Lead | 40 | 8 | 320 | Card + Signer services design & implementation |
| Backend Dev 1 | 40 | 8 | 320 | Card tests + integration testing |
| Backend Dev 2 | 40 | 4 | 160 | Signer tests + security testing |
| DevOps | 40 | 2 | 80 | Docker + K8s + CI/CD |
| QA Lead | 40 | 8 | 320 | Test plans + execution |
| Mobile Dev | 40 | 2 | 80 | Android app development |
| **TOTAL** | - | - | **1,360 hours** | - |

### 5.2 Infrastructure Requirements

**Development:**
- 6x Developer machines (4+ cores, 8+ GB RAM)
- Shared PostgreSQL database
- Shared Redis cache
- HashiCorp Vault server

**Staging/Production:**
- Kubernetes cluster (AWS EKS / GCP GKE / On-premise)
- PostgreSQL managed service (RDS / Cloud SQL)
- Redis managed service
- Load balancer (nginx / cloud LB)
- Monitoring stack (Prometheus, Grafana)
- Logging stack (ELK)

---

## 6. SUCCESS CRITERIA

### 6.1 Code Quality
```
✅ Code Coverage:         >= 80%
✅ SonarQube Quality:     Grade A+ (no critical issues)
✅ Code Duplication:      < 3%
✅ Cyclomatic Complexity: < 10 per method
✅ Security Rating:       A (no vulnerabilities)
✅ Code Style:            Google Java/Kotlin guide followed
```

### 6.2 Performance
```
✅ API Latency (p50):     < 100ms
✅ API Latency (p95):     < 150ms
✅ API Latency (p99):     < 200ms (CRITICAL)
✅ Throughput:            >= 500 RPS sustained
✅ Memory per instance:   < 1GB
✅ Startup time:          < 30s
```

### 6.3 Security
```
✅ PCI DSS Level 1:       Certified
✅ Penetration Test:      No critical findings
✅ Dependency Scan:       No high/critical CVEs
✅ SAST Scan:             No critical issues
✅ Certificate Validation: All working
✅ Audit Trail:           Complete & immutable
✅ Encryption:            AES-256 at rest, TLS 1.3 in transit
```

### 6.4 Functionality
```
✅ All APIs:              26+ endpoints working
✅ Card Management:       Add/Read/Update/Delete working
✅ Signatures:            Generated & verified
✅ E-tickets:             Generated with signature
✅ Payment Integration:   Complete flow working
✅ Mobile App:            All features working
✅ Biometric Auth:        Fingerprint/Face working
```

### 6.5 Operations
```
✅ Deployment:            Automated (GitHub Actions)
✅ Monitoring:            All metrics visible
✅ Alerting:              Critical alerts configured
✅ Logging:               All operations logged
✅ Backup:                Daily automated
✅ Runbook:               Troubleshooting guide ready
✅ Availability:          99.9% (measured over 30 days)
```

---

## 7. TIMELINE & MILESTONES

```
Week 1-2:   PHASE 1 - Card Service MVP
            ├─ Milestone 1.1 (Day 3): Database schema
            ├─ Milestone 1.2 (Day 5): CRUD APIs
            ├─ Milestone 1.3 (Day 8): Encryption integrated
            └─ Milestone 1.4 (Day 10): Tests 85%+, Signed off

Week 3-4:   PHASE 2 - Digital Signer
            ├─ Milestone 2.1 (Day 15): Cryptography working
            ├─ Milestone 2.2 (Day 18): Certificates generated
            ├─ Milestone 2.3 (Day 22): Signatures verified
            └─ Milestone 2.4 (Day 24): Tests 90%+, Signed off

Week 5-6:   PHASE 3 - Integration & Testing
            ├─ Milestone 3.1 (Day 28): Payment integration
            ├─ Milestone 3.2 (Day 32): E-ticket with signature
            ├─ Milestone 3.3 (Day 36): Load testing (p99 < 200ms)
            └─ Milestone 3.4 (Day 40): Security audit passed

Week 7-8:   PHASE 4 - Deployment
            ├─ Milestone 4.1 (Day 42): Docker images
            ├─ Milestone 4.2 (Day 45): K8s running
            ├─ Milestone 4.3 (Day 48): CI/CD automated
            └─ Milestone 4.4 (Day 50): Staging live

Week 9-10:  PHASE 5 - Mobile App
            ├─ Milestone 5.1 (Day 55): UI complete
            ├─ Milestone 5.2 (Day 60): Biometric working
            ├─ Milestone 5.3 (Day 65): APK ready
            └─ Milestone 5.4 (Day 70): App Store submission

**FINAL DELIVERY: November 30, 2026**
```

---

## 8. ASSUMPTIONS

1. **Team Availability** - Team members dedicated full-time (40 hrs/week)
2. **Stakeholder Support** - Approval cycles < 48 hours
3. **Infrastructure** - Cloud/on-premise K8s available by Week 7
4. **Payment Gateway** - VNPay/MoMo/ZaloPay APIs accessible
5. **Security Review** - No blocking security issues pre-review
6. **Database Access** - PostgreSQL accessible with admin rights
7. **External Dependencies** - No breaking changes to payment APIs
8. **Team Skills** - All team members have Java 17 + Spring Boot experience

---

## 9. CONSTRAINTS & RISKS

### 9.1 Constraints
```
❌ Cannot use proprietary payment libraries (must use public APIs)
❌ Cannot modify existing Payment Service without testing (high risk)
❌ Cannot store full card numbers (PCI requirement)
❌ Cannot expose private keys (security requirement)
❌ Cannot modify database schema without migration (data safety)
```

### 9.2 Risks & Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Cryptography complexity | HIGH | Pair programming + Bouncy Castle training |
| Integration delays | MEDIUM | Phased testing + feature flags enabled |
| Performance degradation | MEDIUM | Weekly load testing starting Week 5 |
| Security audit failure | HIGH | 3rd party security review at Week 6 |
| Mobile dev delays | LOW | Start Week 9 (allows buffer) |

---

## 10. TERMS & CONDITIONS

### 10.1 Work Order Terms

**Valid Period:** August 13, 2026 - September 30, 2026  
**Extension:** Can be extended with written agreement  
**Cancellation:** 2-week notice required (non-refundable work paid)  
**Changes:** Change requests processed via formal CR process  

### 10.2 Quality Standards

- **Code Review:** 2+ approvals required before merge
- **Testing:** 80%+ coverage mandatory
- **Security:** All vulnerabilities fixed before release
- **Documentation:** All code documented (Javadoc + inline comments)
- **Performance:** Weekly benchmarks against targets

### 10.3 Sign-Off Process

Each phase requires formal sign-off from:
1. **Tech Lead** - Code quality & architecture approved
2. **QA Lead** - Testing completed & passed
3. **Product Manager** - Features verified & business approved

No phase can proceed without previous phase sign-off.

---

## 11. COMMUNICATION & REPORTING

### 11.1 Weekly Status

**Every Friday 5 PM UTC:**
- Completed tasks ✅
- In-progress tasks ⏳
- Blockers ⚠️
- Metrics (coverage, tests, performance)

### 11.2 Daily Standup

**Every weekday 9 AM UTC (30 min):**
- What was done yesterday
- What will be done today
- Any blockers

### 11.3 Escalation Path

- **Code/Technical Issues** → Tech Lead (within 24 hours)
- **Testing Issues** → QA Lead (within 12 hours)
- **Blocking Issues** → Project Lead (immediately)
- **Critical Issues** → Executive escalation (immediate)

---

## 12. ACCEPTANCE CRITERIA

### Phase 1 Acceptance
```
✅ Card Service code reviewed & approved
✅ All tests passing (20+ tests)
✅ Code coverage >= 85%
✅ Database migrations working
✅ API documented & testable
✅ Docker image working
✅ Tech Lead + QA Lead + PM signed off
```

### Phase 2 Acceptance
```
✅ Signer Service code reviewed & approved
✅ Cryptographic tests passing (25+ tests)
✅ Code coverage >= 90%
✅ Certificate generation working
✅ Signatures verified working
✅ Security audit completed
✅ Tech Lead + Security Lead + QA Lead signed off
```

### Phase 3 Acceptance
```
✅ End-to-end payment flow working
✅ E-ticket with signature generated
✅ Load test: p99 < 200ms PASSED
✅ Security tests: All passed
✅ Integration tests: 10+ scenarios passed
✅ Tech Lead + QA Lead + PM signed off
```

### Phase 4 Acceptance
```
✅ Kubernetes cluster operational
✅ CI/CD pipeline fully automated
✅ All services deployed to staging
✅ Health checks passing
✅ Monitoring & alerting active
✅ DevOps + Tech Lead signed off
```

### Phase 5 Acceptance
```
✅ Android app compiled & tested
✅ Biometric authentication working
✅ E-ticket display with signature
✅ APK ready for App Store
✅ All features tested & verified
✅ Mobile Lead + QA Lead signed off
```

---

## 13. FORMAL APPROVAL

### This requirement specification must be signed by:

```
FOR TEAM ANTIRAVITY:

Project Lead:    ________________________   Date: ___________
                 (Confirm team availability & commitment)

Tech Lead:       ________________________   Date: ___________
                 (Confirm technical feasibility)

QA Lead:         ________________________   Date: ___________
                 (Confirm testing approach)

DevOps Lead:     ________________________   Date: ___________
                 (Confirm infrastructure readiness)


FOR BUSZ MANAGEMENT:

Product Manager: ________________________   Date: ___________
                 (Confirm business requirements met)

Tech Architect:  ________________________   Date: ___________
                 (Confirm architecture approved)

Finance Lead:    ________________________   Date: ___________
                 (Confirm budget $134K approved)

Executive Lead:  ________________________   Date: ___________
                 (Confirm project approval & go-ahead)
```

---

## 14. ADDITIONAL INFORMATION

### Supporting Documents
- ✅ 01_Card_System_Overview.md - Architecture & design
- ✅ 02_API_Specification.md - All 26+ API endpoints
- ✅ 03_Implementation_Guide.md - Code examples & setup
- ✅ 04_Security_Architecture.md - Security & PCI DSS
- ✅ 05_Database_Migration.md - SQL migration scripts
- ✅ 06_Deployment_DevOps.md - K8s & CI/CD setup
- ✅ 07_Payment_Integration.md - Payment integration flow
- ✅ 08_Testing_QA_Guide.md - Testing strategy
- ✅ PROJECT_EXECUTION_PLAN.md - Detailed week-by-week plan

### Resources Provided
- GitHub repository template (structure ready)
- Maven pom.xml templates
- Dockerfile templates
- docker-compose.yml (local dev)
- Kubernetes manifests (staging/prod)
- GitHub Actions workflow template
- Database migration scripts (Flyway)
- Test templates (JUnit, Mockito)

---

## 15. ACCEPTANCE & START DATE

**Upon receipt of all signatures above, Project Start Date is:** 
```
MONDAY, AUGUST 19, 2026 9:00 AM UTC
```

**First Daily Standup:** Monday 9:00 AM UTC  
**First Weekly Status:** Friday 5:00 PM UTC  
**Phase 1 Completion Target:** Friday, August 30, 2026  

---

**DOCUMENT PREPARED BY:** Architecture & Requirements Team  
**DATE:** August 13, 2026  
**REFERENCE:** BusZ-CARD-REQ-2026-v1.0  
**VERSION:** 1.0 (FINAL)  

---

## ✅ CONFIRMATION CHECKLIST

**Before signing, please confirm:**

- [ ] All team members read & understood this document
- [ ] Technical feasibility confirmed
- [ ] Resource availability confirmed
- [ ] Timeline is realistic & achievable
- [ ] All deliverables are clear & measurable
- [ ] Success criteria understood by all
- [ ] Budget allocation approved
- [ ] Infrastructure will be ready Week 7
- [ ] No conflicts with other projects
- [ ] Questions answered & clarifications provided

---

**FORMAL WORK ORDER IS VALID UPON COMPLETION OF ALL SIGNATURES ABOVE**

**Contact for questions:** [Project Lead Email]

---

**Ngày ký:** _______________  
**Nơi ký:** _______________  

