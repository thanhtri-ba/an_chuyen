# BusZ Card System & Digital Signer - Complete Documentation

**Status:** Proposal  
**Version:** 1.0  
**Created:** 2026-08-13  

---

## Overview

Đây là bộ tài liệu đề xuất mở rộng hệ thống BusZ với **Card Management System** và **Digital Signer Service** sử dụng **Java/Spring Boot** và **Kotlin/Android**.

---

## What's Included

### 📋 Documentation Files

1. **01_Card_System_Overview.md** (20 sections, ~600 lines)
   - Executive summary
   - Business context & problem statement
   - Architecture & components
   - Technology stack
   - Database schema design
   - Sequence diagrams
   - Implementation roadmap (5 phases)
   - Cost estimation
   - Risk assessment
   - Code examples (Java, Kotlin)

2. **02_API_Specification.md** (17 sections, ~800 lines)
   - Complete REST API documentation
   - All endpoints with request/response examples
   - Error codes & handling
   - Authentication & authorization
   - Rate limiting
   - Webhook support
   - SDK examples
   - Best practices

3. **03_Implementation_Guide.md** (12 sections, ~600 lines)
   - Project setup & structure
   - Phase-by-phase implementation
   - Code examples for each component
   - Testing strategy
   - CI/CD pipeline setup
   - Git workflow
   - Development checklist
   - Troubleshooting guide

---

## Quick Start for Developers

### Architecture
```
┌─────────────────┐
│  Flutter App    │
│  Kotlin Android │
└────────┬────────┘
         │ REST API
┌────────▼──────────────────────────────────┐
│         API Gateway / Load Balancer        │
└────┬──────────────┬──────────┬────────┬───┘
     │              │          │        │
┌────▼──┐  ┌──────▼──┐  ┌───▼────┐  ┌─▼──────┐
│ Card  │  │ Payment │  │Signer  │  │Ticket  │
│Service│  │ Service │  │Service │  │Service │
│ (Java)│  │(Node.js)│  │(Java)  │  │(Node)  │
└───────┘  └─────────┘  └────────┘  └────────┘
```

### Technology Stack
- **Backend:** Spring Boot 3.x, Java 17
- **Crypto:** Bouncy Castle, RSA 2048+
- **Database:** PostgreSQL
- **Mobile:** Kotlin, Jetpack Compose
- **Security:** JWT, TLS 1.3, PCI DSS
- **DevOps:** Docker, Kubernetes, GitHub Actions

---

## Key Features

### Card Service
✅ Add/Update/Delete Cards  
✅ Card Tokenization (PCI DSS)  
✅ Card Wallet & Top-up  
✅ 3D Secure Verification  
✅ Card Expiration Management  
✅ Transaction History  

### Digital Signer
✅ Certificate Generation (X.509)  
✅ Digital Signature (SHA256WithRSA)  
✅ Signature Verification  
✅ Timestamp Authority  
✅ Audit Trail (Immutable)  
✅ Certificate Revocation  

### Security
✅ PCI DSS Level 1  
✅ AES-256 Encryption  
✅ Vault Integration  
✅ Rate Limiting  
✅ Input Validation  
✅ Replay Protection  

---

## Implementation Timeline

| Phase | Duration | Focus | Output |
|-------|----------|-------|--------|
| **1** | Months 1-2 | Card Service | Backend APIs |
| **2** | Months 3-4 | Digital Signer | Certificate & Signature |
| **3** | Months 5-6 | Integration | End-to-end Flow |
| **4** | Months 7-8 | Mobile | Android App |
| **5** | Months 9+ | Advanced | E-wallet, Subscription |

**Total Timeline:** 8 months for core features (Phase 1-4)

---

## Cost & Resource

### Development
- **1,550 hours** of development
- **Java Backend:** 400 hours
- **Signer Service:** 350 hours
- **Android/Kotlin:** 300 hours
- **Testing & QA:** 250 hours
- **DevOps:** 150 hours

### Infrastructure (Monthly)
- Servers: $500
- Database: $300
- Vault/KMS: $150
- Monitoring: $200
- **Total:** ~$1,350/month

---

## Success Criteria

```
✓ 80%+ code coverage
✓ PCI DSS Level 1 certified
✓ Zero critical security issues
✓ < 200ms API latency (p99)
✓ 99.9% availability
✓ Zero data loss incidents
✓ 10k+ transactions UAT
✓ Zero customer complaints
```

---

## Getting Started

### For Architects
→ Read **01_Card_System_Overview.md**
- Understand business drivers
- Review architecture decisions
- Check risk assessment

### For Developers
→ Read **03_Implementation_Guide.md**
- Setup development environment
- Follow phase-by-phase implementation
- Use code examples as templates

### For API Consumers
→ Read **02_API_Specification.md**
- All endpoints documented
- Request/response examples
- Error handling guide

---

## Key Decisions

### Why Spring Boot for Card Service?
- ✅ Enterprise-grade security
- ✅ Rich ecosystem (Spring Security, Spring Data)
- ✅ Easy to integrate with payment gateways
- ✅ Strong testing framework

### Why Bouncy Castle for Cryptography?
- ✅ Full X.509 certificate support
- ✅ RSA/DSA/ECDSA algorithms
- ✅ Well-tested, production-ready
- ✅ Open-source & audited

### Why Kotlin for Android?
- ✅ Null safety
- ✅ Concise syntax
- ✅ Coroutines for async
- ✅ Full Java interoperability

---

## Integration with Existing Systems

### With Current BusZ Backend
- **Payment Service:** New card endpoints before payment gateway
- **Ticket Service:** Signer service signs e-tickets
- **Booking Service:** Card verification before booking confirm
- **Database:** New tables added with migration scripts

### Backward Compatibility
- Phase 1: Card service runs alongside current payment
- Phase 2: New users default to Card System
- Phase 3: Gradual migration for existing users
- Phase 4+: Legacy payment eventually deprecated

---

## Security Features

### At Rest
- AES-256 encryption for card data
- Vault for private key storage
- Database encryption enabled
- Regular key rotation

### In Transit
- TLS 1.3 for all APIs
- Certificate pinning on mobile
- JWT signature verification
- Rate limiting on endpoints

### Audit & Compliance
- Immutable audit logs
- Signature verification logs
- Compliance with PCI DSS
- Regular penetration testing

---

## Risk Mitigation

| Risk | Severity | Mitigation |
|------|----------|-----------|
| PCI Non-Compliance | Critical | Regular audits + penetration test |
| Key Compromise | Critical | HSM + key rotation + monitoring |
| Integration Failures | High | Comprehensive testing + fallback |
| Performance Degradation | High | Load testing + caching |
| Data Corruption | High | Backup strategy + transaction locks |

---

## FAQ

### Q: Why not use existing payment gateway APIs?
A: Because we need to:
- Store cards securely for 1-click payment
- Generate digital signatures for e-tickets
- Implement wallet functionality
- Maintain complete audit trail

### Q: How long is Phase 1?
A: Approximately **2 months** with 2 experienced Java developers

### Q: Can we skip Phases?
A: Not recommended. Each phase builds on previous:
- Phase 1 without 2 = no signature capability
- Phase 1-2 without 3 = no integration
- Phase 1-3 without 4 = no mobile experience

### Q: What's the rollback plan?
A: 
- Phase 1-2: Run new service in shadow mode (no writes)
- Phase 3: Use feature flags for gradual rollout
- Phase 4+: Maintain legacy payment for 6 months

---

## Next Steps

1. **Review** these documents with architecture team
2. **Approve** the proposal & timeline
3. **Allocate** resources (2 Java devs, 1 Android dev, 1 DevOps)
4. **Setup** development environment
5. **Start** Phase 1 (Card Service)
6. **Weekly** progress tracking
7. **Monthly** stakeholder reviews

---

## Documents Map

```
BusZ-Documentation/
├── 00_Project/                    (Project overview & rules)
├── 01_Business/                   (Business processes)
├── 02_Card_System/               👈 NEW
│   ├── 01_Card_System_Overview.md    (Architecture & roadmap)
│   ├── 02_API_Specification.md       (API endpoints)
│   ├── 03_Implementation_Guide.md    (Development guide)
│   └── README.md                     (This file)
└── ...
```

---

## Contacts

- **Architecture Lead:** `TBD`
- **Backend Lead:** `TBD`
- **Mobile Lead:** `TBD`
- **DevOps Lead:** `TBD`
- **Security Lead:** `TBD`

---

## References

- PCI DSS Standard: https://www.pcisecuritystandards.org/
- Bouncy Castle: https://www.bouncycastle.org/
- Spring Security: https://spring.io/projects/spring-security
- Android Security: https://developer.android.com/training/articles/security-tips

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-08-13 | Dev Team | Initial proposal |

---

**This proposal is ready for stakeholder review and approval.**

**To proceed:** Schedule architecture review meeting with all stakeholders.
