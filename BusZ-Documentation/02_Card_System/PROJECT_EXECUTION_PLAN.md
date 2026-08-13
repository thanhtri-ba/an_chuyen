# PROJECT EXECUTION PLAN - Card System & Digital Signer

**Project:** BusZ Card Management & Digital Signer System  
**Team:** antiravity  
**Duration:** 8 months (32 weeks)  
**Target Launch:** Q4 2026  

---

## 🎯 HIGH-LEVEL OVERVIEW

```
WHO                 WHAT                          WHEN              OUTPUT
═══════════════════════════════════════════════════════════════════════════════

Backend Lead        Card Service (Java)          Weeks 1-2         card-service.jar
                    + Database Schema            Weeks 1-2         migration scripts
                    + API Endpoints              Weeks 1-2         8 REST endpoints

Backend Dev 1       Unit Tests                   Weeks 1-2         80% coverage
                    Integration Tests           Weeks 3-4         10+ scenarios

Backend Lead        Signer Service (Java)        Weeks 3-4         signer-service.jar
                    Cryptography Setup          Weeks 3-4         RSA/SHA256 impl
                    
Backend Dev 2       Certificate Management      Weeks 5-6         X.509 handling
                    Signature Operations        Weeks 5-6         Sign/Verify APIs

DevOps              Docker Setup                 Weeks 1-2         Dockerfile
                    Kubernetes Manifests         Weeks 5-6         K8s YAMLs
                    CI/CD Pipeline              Weeks 7-8         GitHub Actions

QA Lead             Test Plans                   Weeks 1-2         Test matrix
                    Security Testing            Weeks 7-8         Penetration test
                    Performance Testing         Weeks 7-8         Load test results

Mobile Dev          Android App (Kotlin)         Weeks 7-8         APK release
                    Biometric Payment           Weeks 9-10        Fingerprint auth
                    
Product Manager     Requirements Refinement     Week 1             Requirements doc
                    Stakeholder Reviews         Weeks 4,8,12       Sign-off docs
```

---

## 📅 PHASE-BY-PHASE BREAKDOWN

### **PHASE 1: CARD SERVICE (Weeks 1-2)**

#### **Backend Lead - Card Service Development**

**Week 1 - Setup & Database**
```
Task 1.1: Project Setup
  - Create Spring Boot 3.1 project structure
  - Setup Maven pom.xml with dependencies
  - Configure application.yml for dev/prod
  - Setup logging (SLF4J + Logback)
  └─ Deliverable: Working Spring Boot app, compiles without errors
  └─ Time: 2 hours
  └─ Check: mvn clean install ✓

Task 1.2: Database Schema
  - Create PostgreSQL database (busz_card)
  - Write Flyway migration: V1.0__Initial_Card_Tables.sql
  - Define: cards, card_transactions, card_wallets tables
  - Add indexes & constraints
  └─ Deliverable: migration scripts, ER diagram
  └─ Time: 3 hours
  └─ Check: psql -d busz_card -c "\dt" shows all tables ✓

Task 1.3: Entity & Repository
  - Create @Entity Card.java with all fields
  - Create CardRepository with custom queries
  - Test with @DataJpaTest
  └─ Deliverable: Card.java, CardRepository.java, tests
  └─ Time: 2 hours
  └─ Check: gradlew test passes ✓
```

**Week 1 - Core Services**
```
Task 1.4: CardService Implementation
  - Implement: addCard(request) → CardDTO
  - Implement: getUserCards(userId) → List<CardDTO>
  - Implement: deleteCard(cardId) → void (soft delete)
  - Add validation: Luhn check, expiry check, CVV check
  - Encryption: integrate EncryptionService
  └─ Deliverable: CardService.java with 4 methods
  └─ Time: 4 hours
  └─ Check: Unit tests pass, 85%+ coverage ✓

Task 1.5: CardController Implementation
  - POST /api/v1/cards → addCard
  - GET /api/v1/cards → getUserCards
  - GET /api/v1/cards/{id} → getCardDetail
  - PUT /api/v1/cards/{id} → updateCard
  - DELETE /api/v1/cards/{id} → deleteCard
  └─ Deliverable: CardController.java
  └─ Time: 3 hours
  └─ Check: curl tests all pass ✓
```

**Week 2 - Encryption & Testing**
```
Task 1.6: Encryption Service
  - Implement AES-256 encrypt/decrypt
  - Integration with HashiCorp Vault
  - Key rotation logic
  └─ Deliverable: EncryptionService.java
  └─ Time: 2 hours
  └─ Check: encrypt("data") → decrypt() = "data" ✓

Task 1.7: Exception Handling
  - CardNotFoundException
  - CardExpiredException
  - InvalidCardException
  - Global @ExceptionHandler
  └─ Deliverable: Custom exceptions, error responses
  └─ Time: 1 hour
  └─ Check: 404, 400, 500 responses correct ✓

Task 1.8: API Documentation
  - Swagger/OpenAPI 3.0 annotations
  - Document all endpoints
  - Generate API docs
  └─ Deliverable: /swagger-ui.html working
  └─ Time: 1 hour
  └─ Check: http://localhost:8081/swagger-ui ✓
```

#### **Backend Dev 1 - Unit & Integration Tests**

**Week 1-2 Test Development**
```
Task 1.9: Unit Tests
  Tests to write (20+ test cases):
  
  CardServiceTest:
    ✓ testAddCardSuccess
    ✓ testAddExpiredCardFails
    ✓ testLuhnValidation
    ✓ testInvalidCVV
    ✓ testEncryption
    ✓ testDuplicateCardPrevention
    ✓ testSoftDelete
    ✓ testCardExpiration
  
  CardControllerTest:
    ✓ testAddCardEndpoint
    ✓ testGetCardsEndpoint
    ✓ testUnauthorizedAccess
    ✓ testInvalidInput
  
  EncryptionServiceTest:
    ✓ testEncryptDecrypt
    ✓ testKeyRotation
  
  └─ Deliverable: 20+ passing tests
  └─ Time: 6 hours
  └─ Check: mvn test → 20/20 passed ✓
  └─ Coverage: 85%+ ✓

Task 1.10: Integration Tests
  - Database tests (with Testcontainers)
  - Vault integration tests
  - End-to-end API tests
  
  └─ Deliverable: 10+ integration tests
  └─ Time: 4 hours
  └─ Check: mvn verify -P integration ✓

Task 1.11: Code Review & SonarQube
  - Run SonarQube analysis
  - Fix code smells
  - Ensure Quality Gate pass
  
  └─ Deliverable: Quality Gate passed
  └─ Time: 2 hours
  └─ Check: sonar report green ✓
```

#### **Week 1-2 Deliverables Checklist**

```
✅ Card Service code complete
   └─ CardService.java (300+ LOC)
   └─ CardController.java (200+ LOC)
   └─ Repository & Entities
   └─ Exception handlers
   
✅ Database ready
   └─ Migration scripts (V1.0)
   └─ Tables: cards, card_transactions, card_wallets
   └─ Indexes & constraints
   
✅ Tests passing
   └─ 20+ unit tests
   └─ 10+ integration tests
   └─ 85%+ code coverage
   
✅ Documentation
   └─ Swagger/OpenAPI docs
   └─ README updated
   └─ Code comments

✅ Running services
   └─ mvn spring-boot:run → http://localhost:8081
   └─ Database: psql -d busz_card
   └─ Redis: redis-cli ping

SIGN-OFF:
  Backend Lead: _______________  Date: _______
  QA Lead:      _______________  Date: _______
```

---

### **PHASE 2: DIGITAL SIGNER (Weeks 3-4)**

#### **Backend Lead - Signer Service**

**Week 3 - Cryptography & Certificates**
```
Task 2.1: Signer Service Setup
  - Spring Boot project
  - Bouncy Castle dependencies
  - Vault integration
  └─ Time: 1 hour
  └─ Check: mvn compile ✓

Task 2.2: CryptoProvider (RSA/SHA256)
  - KeyPairGenerator setup
  - Sign data (RSA-2048 + SHA256)
  - Verify signature
  - Timestamp generation
  └─ Time: 3 hours
  └─ Check: sign("data") → verify(data, sig) = true ✓

Task 2.3: Certificate Management
  - Generate X.509 certificates
  - Store in database + Vault
  - Certificate validation logic
  - Expiration handling
  └─ Time: 4 hours
  └─ Check: cert.verify() ✓

Task 2.4: SignerService Implementation
  - signData(entity, data) → signature
  - verifySignature(sig, data) → boolean
  - getCertificate(id) → cert
  - revokeCertificate(id) → void
  └─ Time: 3 hours
  └─ Check: Unit tests pass ✓
```

**Week 4 - APIs & Testing**
```
Task 2.5: Signer Controller
  - POST /api/v1/certificates/generate
  - GET /api/v1/certificates
  - POST /api/v1/sign
  - POST /api/v1/verify
  - POST /api/v1/certificates/{id}/revoke
  └─ Time: 2 hours

Task 2.6: Audit Logging
  - Log all signature operations
  - Immutable audit trail
  - AuditService implementation
  └─ Time: 2 hours

Task 2.7: Security Hardening
  - Private key never exposed
  - Certificate pinning ready
  - Rate limiting
  └─ Time: 1 hour
```

#### **Backend Dev 2 - Signer Tests**

**Week 3-4 Testing**
```
Task 2.8: Cryptographic Tests
  - RSA key generation
  - Signature generation/verification
  - Certificate validation
  - Timestamp verification
  
  └─ 15+ test cases
  └─ Time: 5 hours
  └─ Coverage: 90%+

Task 2.9: Security Tests
  - Private key access prevention
  - Certificate expiration
  - Revocation check
  - Audit trail integrity
  
  └─ 10+ test cases
  └─ Time: 3 hours
```

#### **Week 3-4 Sign-Off**

```
✅ Signer Service working
   └─ RSA/SHA256 signing
   └─ Certificate generation
   └─ Signature verification
   
✅ Tests passing
   └─ 25+ tests
   └─ 90%+ coverage
   
✅ APIs documented
   └─ /api/v1/sign
   └─ /api/v1/verify
   └─ /api/v1/certificates
   
SIGN-OFF:
  Backend Lead: _______________  Date: _______
  QA Lead:      _______________  Date: _______
```

---

### **PHASE 3: INTEGRATION & TESTING (Weeks 5-6)**

#### **All Developers - Integration**

**Week 5 - Payment & Ticket Integration**
```
Task 3.1: Payment Service Integration
  WHO: Backend Lead
  WHAT:
    - CardService.verifyCard() → Payment API
    - SignerService.signTransaction() → Payment callback
    - Create transaction record in card_transactions table
  HOW:
    - Update payment-service/PaymentService.ts
    - Add Card Service client
    - Add Signer Service client
  TIME: 4 hours
  CHECK: Payment flow with signature working ✓

Task 3.2: Ticket Service Integration
  WHO: Backend Dev 2
  WHAT:
    - Ticket creation with signature_id
    - Embed signature in QR code
    - E-ticket download with signature
  TIME: 3 hours
  CHECK: E-ticket contains signature ✓

Task 3.3: Database Migrations Phase 2
  WHO: DevOps
  WHAT:
    - V2.0__Add_Audit_Tables.sql
    - Indexes for performance
    - Constraints & triggers
  TIME: 2 hours
  CHECK: All migrations pass ✓
```

**Week 6 - End-to-End Testing**
```
Task 3.4: E2E Test Scenarios
  WHO: QA Lead
  WHAT:
    Scenario 1: Add Card → Pay → Signature → Ticket
    Scenario 2: Multiple cards → Payment retry
    Scenario 3: Signature verification
    Scenario 4: Error handling
  TIME: 6 hours
  CHECK: All scenarios pass ✓

Task 3.5: Load Testing
  WHO: QA Lead
  WHAT:
    - 1000 RPS load test
    - Measure latency (target: p99 < 200ms)
    - Check memory/CPU
  TIME: 2 hours
  CHECK: Performance acceptable ✓

Task 3.6: Security Testing
  WHO: QA Lead  
  WHAT:
    - SQL injection tests
    - XSS tests
    - Signature tampering
    - Certificate validation
  TIME: 4 hours
  CHECK: All security tests pass ✓
```

#### **Week 5-6 Sign-Off**

```
✅ Complete payment flow working
   Card → Payment → Signature → Ticket
   
✅ Performance acceptable
   p99 latency < 200ms
   Throughput > 500 RPS
   
✅ Security hardened
   Zero security issues
   PCI DSS ready
   
✅ All tests passing
   E2E: 10/10 ✓
   Load: OK ✓
   Security: OK ✓

SIGN-OFF:
  Backend Lead: _______________  Date: _______
  QA Lead:      _______________  Date: _______
  DevOps:       _______________  Date: _______
```

---

### **PHASE 4: DEPLOYMENT (Weeks 7-8)**

#### **DevOps - Infrastructure**

```
Task 4.1: Docker Images
  WHO: DevOps
  WHAT:
    - Build card-service image
    - Build signer-service image
    - Push to registry
  TIME: 2 hours
  CHECK: docker pull ghcr.io/busz/card-service ✓

Task 4.2: Kubernetes Manifests
  WHO: DevOps
  WHAT:
    - Deployment.yaml (3 replicas)
    - Service.yaml (ClusterIP)
    - ConfigMap (config)
    - Secret (credentials)
    - HPA (autoscaling)
    - Ingress (routing)
  TIME: 4 hours
  CHECK: kubectl get deployment ✓

Task 4.3: CI/CD Pipeline
  WHO: DevOps
  WHAT:
    - GitHub Actions workflow
    - Build → Test → Push → Deploy
    - Automated testing on PR
    - Staging deployment on develop
    - Production deployment on main
  TIME: 3 hours
  CHECK: GitHub Actions running ✓

Task 4.4: Monitoring & Logging
  WHO: DevOps
  WHAT:
    - Prometheus setup
    - Grafana dashboards
    - ELK stack (Elasticsearch, Logstash, Kibana)
    - Alert rules
  TIME: 3 hours
  CHECK: Dashboard showing metrics ✓
```

#### **Week 7-8 Sign-Off**

```
✅ Docker images built
✅ Kubernetes running
✅ CI/CD automated
✅ Monitoring active
✅ Logging collecting

SIGN-OFF:
  DevOps: _______________  Date: _______
```

---

### **PHASE 5: MOBILE APP (Weeks 9-10)**

#### **Mobile Dev - Android App**

```
Task 5.1: Android Project Setup
  WHO: Mobile Dev
  WHAT:
    - Kotlin project
    - Jetpack Compose UI
    - Retrofit + OkHttp for API
  TIME: 2 hours
  CHECK: App compiles ✓

Task 5.2: Card Management UI
  WHO: Mobile Dev
  WHAT:
    - Card list screen
    - Add card screen
    - Card detail screen
    - Delete card flow
  TIME: 6 hours
  CHECK: UI complete, no crashes ✓

Task 5.3: Payment Screen
  WHO: Mobile Dev
  WHAT:
    - Select card
    - Biometric authentication
    - Payment confirmation
    - Success/failure handling
  TIME: 4 hours
  CHECK: Payment flow working ✓

Task 5.4: Biometric Integration
  WHO: Mobile Dev
  WHAT:
    - BiometricPrompt API
    - Fingerprint/Face auth
    - Secure storage (Keystore)
  TIME: 3 hours
  CHECK: Biometric working ✓

Task 5.5: Testing
  WHO: Mobile Dev
  WHAT:
    - Unit tests
    - UI tests (Espresso)
    - E2E scenarios
  TIME: 4 hours
  CHECK: All tests pass ✓
```

#### **Week 9-10 Sign-Off**

```
✅ Android app ready
✅ All features working
✅ Biometric auth working
✅ Tests passing

SIGN-OFF:
  Mobile Dev: _______________  Date: _______
  QA Lead:    _______________  Date: _______
```

---

## 📊 RESOURCE ALLOCATION

```
Backend Lead (40 hours/week) × 8 weeks = 320 hours
├─ Week 1-2: Card Service (80h)
├─ Week 3-4: Signer Service (80h)
├─ Week 5-6: Integration (80h)
└─ Week 7-8: Deployment (80h)

Backend Dev 1 (40 hours/week) × 8 weeks = 320 hours
├─ Week 1-2: Card tests (80h)
├─ Week 3-6: Integration tests (160h)
└─ Week 7-8: Final testing (80h)

Backend Dev 2 (40 hours/week) × 4 weeks = 160 hours
├─ Week 3-4: Signer tests (80h)
└─ Week 5-6: Integration (80h)

DevOps (40 hours/week) × 2 weeks = 80 hours
├─ Week 1-2: Docker setup (40h)
└─ Week 7-8: K8s + CI/CD (40h)

Mobile Dev (40 hours/week) × 2 weeks = 80 hours
├─ Week 9-10: Android app (80h)

QA Lead (40 hours/week) × 8 weeks = 320 hours
├─ Week 1-2: Test plans (40h)
├─ Week 3-6: Testing (160h)
└─ Week 7-10: Load + Security (120h)

TOTAL: 1,360 hours (6 people, 8 weeks)
```

---

## ✅ WEEKLY CHECKLIST TEMPLATE

**Week #: ____  Team: antiravity**

### Completed This Week
- [ ] Task 1: ___________________  By: ____________  Status: ✅/❌
- [ ] Task 2: ___________________  By: ____________  Status: ✅/❌
- [ ] Task 3: ___________________  By: ____________  Status: ✅/❌

### In Progress
- [ ] Task A: ___________________  By: ____________  % Done: ____%
- [ ] Task B: ___________________  By: ____________  % Done: ____%

### Blockers
- [ ] Issue 1: ___________________  Impact: High/Med/Low  Solution: ________
- [ ] Issue 2: ___________________  Impact: High/Med/Low  Solution: ________

### Metrics
- [ ] Code Coverage: _____%
- [ ] Tests Passed: ____/%
- [ ] Bugs Found: ____
- [ ] Performance (p99): ____ms

### Next Week Plan
- [ ] Task 1: ___________________  Owner: ____________
- [ ] Task 2: ___________________  Owner: ____________
- [ ] Task 3: ___________________  Owner: ____________

### Sign-Off
- Project Lead: ________________  Date: _______
- QA Lead: ________________  Date: _______

---

## 🚀 SUCCESS CRITERIA PER PHASE

### Phase 1 (Week 2)
✅ Card Service running (mvn spring-boot:run works)  
✅ All 4 APIs working (test with curl)  
✅ 85%+ code coverage  
✅ Tests: 20+ passing  

### Phase 2 (Week 4)
✅ Signer Service running  
✅ Signatures generated & verified  
✅ 90%+ code coverage  
✅ Tests: 25+ passing  

### Phase 3 (Week 6)
✅ Complete payment + signature flow working  
✅ E2E tests: 10/10 passing  
✅ Load test: p99 < 200ms  
✅ Security tests: All pass  

### Phase 4 (Week 8)
✅ Docker images in registry  
✅ K8s pods running  
✅ CI/CD automated  
✅ Monitoring active  

### Phase 5 (Week 10)
✅ Android app released  
✅ Biometric working  
✅ All E2E flows verified  
✅ Ready for production  

---

## ⚠️ RISK & MITIGATION

| Risk | Severity | Owner | Mitigation |
|------|----------|-------|-----------|
| Cryptography complexity | High | Backend Lead | Pair programming + Bouncy Castle training |
| Integration delays | Medium | Backend Lead | Phased testing + feature flags |
| Performance issues | Medium | DevOps + QA | Load testing week 5-6 |
| Mobile delays | Low | Mobile Dev | Start week 9 (enough backend ready) |

---

## 📞 ESCALATION MATRIX

**Issue:** Cannot compile Java code  
**Escalate to:** Backend Lead (24 hours)  

**Issue:** Test failing but unclear why  
**Escalate to:** QA Lead (12 hours)  

**Issue:** Vault connection problem  
**Escalate to:** DevOps (4 hours)  

**Issue:** Project blocked (critical)  
**Escalate to:** Project Lead (immediately)  

---

## 🎯 FINAL DELIVERY CHECKLIST

```
PHASE 1: Card Service
  ✅ card-service.jar
  ✅ Migration scripts
  ✅ API docs
  ✅ 85%+ test coverage

PHASE 2: Signer Service
  ✅ signer-service.jar
  ✅ Certificate handling
  ✅ 90%+ test coverage
  ✅ Audit logs

PHASE 3: Integration
  ✅ End-to-end flow working
  ✅ Payment + Signature + Ticket
  ✅ Load test results (p99 < 200ms)
  ✅ Security test report

PHASE 4: Deployment
  ✅ Docker images
  ✅ Kubernetes manifests
  ✅ CI/CD pipeline
  ✅ Monitoring dashboards
  ✅ Staging deployment

PHASE 5: Mobile
  ✅ Android APK
  ✅ Biometric auth
  ✅ Full test coverage
  ✅ Ready for App Store

DOCUMENTATION
  ✅ API reference
  ✅ Admin guide
  ✅ User guide
  ✅ Deployment runbook
  ✅ Troubleshooting guide

COMPLIANCE
  ✅ PCI DSS certified
  ✅ Security audit passed
  ✅ Performance benchmarks met
  ✅ SLA compliance verified
```

---

## 📋 WHO DOES WHAT - QUICK REFERENCE

| Role | Weeks | What | Deliverable |
|------|-------|------|-------------|
| **Backend Lead** | 1-8 | Card + Signer services | Java code, APIs |
| **Backend Dev 1** | 1-8 | Unit/Integration tests | Tests, coverage reports |
| **Backend Dev 2** | 3-6 | Signer tests | Cryptographic tests |
| **DevOps** | 1-2, 7-8 | Docker, K8s, CI/CD | Infrastructure code |
| **QA Lead** | 1-10 | Test plans, execution | Test reports, metrics |
| **Mobile Dev** | 9-10 | Android app | APK, app store ready |
| **Product Manager** | 1,4,8 | Requirements, reviews | Sign-off docs |

---

**DOCUMENT VERSION:** 1.0  
**LAST UPDATED:** 2026-08-13  
**STATUS:** ✅ READY FOR EXECUTION  

**APPROVAL TO START:**
- Project Lead: _________________ Date: _______
- Tech Lead: _________________ Date: _______
- Team Lead (antiravity): _________________ Date: _______

🚀 **LET'S BUILD!**
