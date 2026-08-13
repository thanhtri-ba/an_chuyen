# Card & Signer Service - Security Architecture

**Version:** 1.0  
**Classification:** Confidential  
**Compliance:** PCI DSS Level 1, GDPR  
**Last Updated:** 2026-08-13

---

## 1. Security Overview

### 1.1 Security Principles

```
1. Defense in Depth - Multiple layers of security
2. Least Privilege - Minimal access rights
3. Fail Secure - Secure by default
4. Separation of Duties - No single point of failure
5. Audit Trail - Immutable logging of all actions
```

### 1.2 Threat Model

```
External Threats:
├── Network Attacks (DDoS, Man-in-the-Middle)
├── API Attacks (SQL Injection, XSS, CSRF)
├── Card Data Theft
├── Signature Forgery
└── Certificate Compromise

Internal Threats:
├── Unauthorized Access to Private Keys
├── Database Breach
├── Malicious Code
└── Configuration Leaks
```

---

## 2. Encryption Strategy

### 2.1 Data at Rest

#### Card Data Storage
```
Plain Text: Card Number, CVV, Expiry
                    ↓
Validation (Luhn Check, Expiry)
                    ↓
Tokenization (Payment Gateway)
                    ↓
AES-256-GCM Encryption
                    ↓
Database Storage (Encrypted)
                    ↓
Vault Storage (Master Key)
```

**Implementation:**
```java
@Service
public class EncryptionService {
    
    private final Cipher cipher;
    private final SecretKey masterKey;
    
    public String encryptCardData(String plainText) throws Exception {
        byte[] iv = generateRandomIV();
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        
        cipher.init(Cipher.ENCRYPT_MODE, masterKey, spec);
        byte[] encrypted = cipher.doFinal(plainText.getBytes());
        
        // Return IV + Encrypted Data (base64)
        byte[] result = new byte[iv.length + encrypted.length];
        System.arraycopy(iv, 0, result, 0, iv.length);
        System.arraycopy(encrypted, 0, result, iv.length, encrypted.length);
        
        return Base64.getEncoder().encodeToString(result);
    }
    
    public String decryptCardData(String encrypted) throws Exception {
        byte[] data = Base64.getDecoder().decode(encrypted);
        
        // Extract IV
        byte[] iv = Arrays.copyOf(data, 12);
        byte[] cipherText = Arrays.copyOfRange(data, 12, data.length);
        
        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        GCMParameterSpec spec = new GCMParameterSpec(128, iv);
        
        cipher.init(Cipher.DECRYPT_MODE, masterKey, spec);
        byte[] plainText = cipher.doFinal(cipherText);
        
        return new String(plainText);
    }
}
```

#### Private Key Storage
```
RSA Private Key (4096-bit)
        ↓
PEM Format
        ↓
AES-256 Encryption
        ↓
HashiCorp Vault
        ↓
Hardware Security Module (HSM) - Optional
```

**Vault Configuration:**
```hcl
# /etc/vault/config.hcl
storage "postgresql" {
  connection_url = "postgresql://user:pass@localhost/vault"
}

listener "tcp" {
  address       = "0.0.0.0:8200"
  tls_cert_file = "/etc/vault/tls/tls.crt"
  tls_key_file  = "/etc/vault/tls/tls.key"
}

seal "transit" {
  address            = "https://transit-backend:8200"
  disable_renewal    = "false"
  key_name           = "autounseal"
  mount_path         = "transit/"
  tls_skip_verify    = "false"
}
```

**Storage Policy:**
```hcl
path "secret/data/card-service/keys/*" {
  capabilities = ["create", "read", "update", "list"]
}

path "secret/data/card-service/certificates/*" {
  capabilities = ["create", "read", "list"]
}
```

### 2.2 Data in Transit

#### TLS Configuration
```
Protocol:       TLS 1.3 minimum
Cipher Suites:  TLS_AES_256_GCM_SHA384 (priority)
                TLS_CHACHA20_POLY1305_SHA256
                TLS_AES_128_GCM_SHA256
Certificate:    RSA 2048+ or ECDSA 256+
OCSP Stapling:  Enabled
HSTS:           max-age=31536000; includeSubDomains
```

**Spring Boot TLS Setup:**
```yaml
server:
  ssl:
    key-store: classpath:keystore.p12
    key-store-password: ${KEYSTORE_PASSWORD}
    key-store-type: PKCS12
    key-alias: tomcat
    enabled: true
    
  http2:
    enabled: true

security:
  require-https: true
  ssl-version: TLSv1.3
```

#### Certificate Pinning (Mobile)
```kotlin
// Android Certificate Pinning
val certificatePinner = CertificatePinner.Builder()
    .add(
        "api.busz.com",
        "sha256/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
    )
    .build()

val httpClient = OkHttpClient.Builder()
    .certificatePinner(certificatePinner)
    .build()

val retrofit = Retrofit.Builder()
    .baseUrl("https://api.busz.com")
    .client(httpClient)
    .build()
```

### 2.3 Encryption Key Management

#### Key Lifecycle
```
Generation → Rotation → Archival → Destruction
   ↓           ↓           ↓          ↓
RSA-2048   Every 90d   7 years    Secure Wipe
AES-256    Every 6m    Audit Log  Certificate
```

#### Key Rotation Policy
```java
@Component
@Scheduled(cron = "0 0 0 1 */3 *") // Every 3 months
public class KeyRotationScheduler {
    
    @Autowired
    private VaultService vaultService;
    
    @Autowired
    private AuditService auditService;
    
    public void rotateEncryptionKeys() throws Exception {
        log.info("Starting encryption key rotation...");
        
        // Generate new master key
        SecretKey newMasterKey = generateNewMasterKey();
        
        // Rotate all encrypted data
        List<Card> cards = cardRepository.findAll();
        for (Card card : cards) {
            String decrypted = encryptionService.decrypt(
                card.getEncryptedData()
            );
            String reEncrypted = encryptionService.encrypt(
                decrypted,
                newMasterKey
            );
            card.setEncryptedData(reEncrypted);
            cardRepository.save(card);
        }
        
        // Archive old key
        vaultService.archiveKey("master-key-" + LocalDate.now());
        
        // Store new key
        vaultService.storeMasterKey(newMasterKey);
        
        // Audit log
        auditService.log(
            "KEY_ROTATION",
            "Master encryption key rotated",
            null
        );
        
        log.info("Key rotation completed successfully");
    }
}
```

---

## 3. Authentication & Authorization

### 3.1 API Authentication

#### JWT Token Structure
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "user-id",
  "email": "user@example.com",
  "roles": ["CUSTOMER"],
  "iat": 1692002400,
  "exp": 1692006000,
  "iss": "https://auth.busz.com"
}

Signature: HMAC-SHA256(header.payload, secret)
```

**Validation:**
```java
@Component
public class JwtTokenProvider {
    
    private final String secretKey;
    private final long expirationMs = 3600000; // 1 hour
    
    public String generateToken(UserDetails user) {
        return Jwts.builder()
            .setSubject(user.getUsername())
            .claim("roles", user.getAuthorities())
            .claim("email", user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expirationMs))
            .signWith(SignatureAlgorithm.HS256, secretKey)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            log.error("Invalid JWT: {}", e.getMessage());
            return false;
        }
    }
    
    public String getUsernameFromToken(String token) {
        return Jwts.parser()
            .setSigningKey(secretKey)
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }
}
```

### 3.2 Role-Based Access Control (RBAC)

```
Roles:
├── CUSTOMER
│   ├── READ: Own cards, transactions
│   ├── WRITE: Add/Update/Delete own cards
│   └── EXECUTE: Pay with own cards
├── MERCHANT
│   ├── READ: Own transactions
│   ├── WRITE: Update merchant info
│   └── EXECUTE: Settle transactions
├── ADMIN
│   ├── READ: All data
│   ├── WRITE: System configuration
│   └── EXECUTE: System operations
└── AUDITOR
    └── READ: Audit logs only
```

**Spring Security Configuration:**
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .exceptionHandling()
                .authenticationEntryPoint(
                    (req, res, e) -> res.sendError(401, "Unauthorized")
                )
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authorizeHttpRequests()
                .requestMatchers("/api/v1/public/**").permitAll()
                .requestMatchers("/api/v1/cards/**")
                    .hasRole("CUSTOMER")
                .requestMatchers("/api/v1/admin/**")
                    .hasRole("ADMIN")
                .requestMatchers("/api/v1/audit/**")
                    .hasRole("AUDITOR")
                .anyRequest().authenticated()
            .and()
            .addFilterBefore(
                jwtAuthenticationFilter(),
                UsernamePasswordAuthenticationFilter.class
            );
        
        return http.build();
    }
}
```

---

## 4. Cryptographic Security

### 4.1 Digital Signature Algorithm

```
Algorithm:  RSA-2048 (minimum) or ECDSA-256
Hash:       SHA-256
Format:     PKCS#1 v2.2
Padding:    OAEP for encryption
            PSS for signature
```

**Signature Generation & Verification:**
```java
public class SignatureProvider {
    
    // Sign data
    public String sign(PrivateKey privateKey, byte[] data) 
            throws Exception {
        Signature signature = Signature.getInstance("SHA256WithRSA");
        signature.initSign(privateKey);
        signature.update(data);
        
        byte[] signedData = signature.sign();
        return Base64.getEncoder().encodeToString(signedData);
    }
    
    // Verify signature
    public boolean verify(PublicKey publicKey, byte[] data, String signature) 
            throws Exception {
        Signature sig = Signature.getInstance("SHA256WithRSA");
        sig.initVerify(publicKey);
        sig.update(data);
        
        return sig.verify(Base64.getDecoder().decode(signature));
    }
    
    // Timestamp for non-repudiation
    public String getTimestamp() throws Exception {
        TimeStampToken token = requestTimestamp(data);
        return token.getTimeStampInfo().getGenTime().toString();
    }
}
```

### 4.2 Certificate Management

#### Certificate Validation
```
Certificate Chain Validation:
├── Check signature of certificate
├── Verify issuer CA certificate
├── Check certificate expiration
├── Verify key usage (digitalSignature)
├── Check certificate revocation (CRL/OCSP)
└── Validate against trusted root CAs
```

**Implementation:**
```java
public class CertificateValidator {
    
    public boolean validateCertificate(X509Certificate cert) 
            throws Exception {
        // 1. Check expiration
        cert.checkValidity();
        
        // 2. Verify signature
        PublicKey issuerPublicKey = getIssuerPublicKey(cert);
        cert.verify(issuerPublicKey);
        
        // 3. Check revocation
        CertificateRevocationChecker checker = 
            new CertificateRevocationChecker();
        if (checker.isRevoked(cert)) {
            throw new CertificateRevokedException();
        }
        
        // 4. Verify key usage
        boolean[] keyUsage = cert.getKeyUsage();
        if (keyUsage == null || !keyUsage[0]) { // digitalSignature
            throw new InvalidCertificateException();
        }
        
        return true;
    }
    
    private boolean checkRevocation(X509Certificate cert) 
            throws Exception {
        // OCSP stapling
        byte[] ocspResponse = cert.getOcspResponse();
        if (ocspResponse != null) {
            return verifyOCSPResponse(ocspResponse);
        }
        
        // CRL check
        List<String> crlDistributionPoints = 
            cert.getCRLDistributionPoints();
        for (String crlUrl : crlDistributionPoints) {
            return verifyCRL(crlUrl);
        }
        
        return true;
    }
}
```

---

## 5. Secure Coding Practices

### 5.1 Input Validation

```java
@Validated
@RestController
public class CardController {
    
    @PostMapping("/cards")
    public ResponseEntity<?> addCard(
        @Valid @RequestBody AddCardRequest request
    ) {
        // Validation annotations handle basic checks
        // Additional business logic validation
        
        // Validate card number (Luhn algorithm)
        if (!CardValidator.isValidLuhn(request.getCardNumber())) {
            throw new InvalidCardException();
        }
        
        // Validate expiry
        if (CardValidator.isExpired(request.getExpiryMonth(), 
                                     request.getExpiryYear())) {
            throw new CardExpiredException();
        }
        
        // Validate CVV length
        if (request.getCvv().length() < 3 || 
            request.getCvv().length() > 4) {
            throw new InvalidCvvException();
        }
        
        return cardService.addCard(request);
    }
}

// Validation annotations
public class AddCardRequest {
    
    @NotNull
    @Pattern(regexp = "^[0-9]{13,19}$")
    private String cardNumber;
    
    @NotNull
    @Range(min = 1, max = 12)
    private Integer expiryMonth;
    
    @NotNull
    @Range(min = 2026, max = 2050)
    private Integer expiryYear;
    
    @NotNull
    @Pattern(regexp = "^[0-9]{3,4}$")
    private String cvv;
    
    @NotBlank
    @Size(min = 3, max = 50)
    private String cardHolderName;
}
```

### 5.2 SQL Injection Prevention

```java
// ❌ WRONG - Vulnerable to SQL injection
String query = "SELECT * FROM cards WHERE user_id = " + userId;

// ✅ CORRECT - Using parameterized queries
@Repository
public interface CardRepository extends JpaRepository<Card, UUID> {
    
    @Query("SELECT c FROM Card c WHERE c.userId = :userId")
    List<Card> findByUserId(@Param("userId") UUID userId);
}

// ✅ CORRECT - Using Spring Data
List<Card> cards = cardRepository.findByUserIdAndDeletedAtIsNull(userId);
```

### 5.3 XSS Prevention

```java
// ❌ WRONG - Direct output
<div>{{ cardNickname }}</div>

// ✅ CORRECT - HTML encoding
@Bean
public SafeHtmlUtil safeHtmlUtil() {
    return new SafeHtmlUtil();
}

// In controller
model.addAttribute("cardNickname", 
    safeHtmlUtil.encodeHtml(card.getNickname()));
```

### 5.4 CSRF Protection

```java
// Enabled by default in Spring Security
// Every state-changing request requires CSRF token

// In HTML form
<form method="POST" action="/api/v1/cards">
    <input type="hidden" name="_csrf" value="${_csrf.token}"/>
    <!-- form fields -->
</form>

// In AJAX
var token = $("meta[name='_csrf']").attr("content");
$.ajax({
    url: "/api/v1/cards",
    type: "POST",
    headers: {
        "X-CSRF-TOKEN": token
    },
    data: formData
});
```

---

## 6. Rate Limiting & DDoS Protection

### 6.1 Rate Limiting

```java
@Configuration
public class RateLimitConfig {
    
    @Bean
    public RateLimiter cardApiRateLimiter() {
        return RateLimiter.create(100.0); // 100 requests/second
    }
}

@Aspect
@Component
public class RateLimitAspect {
    
    @Before("@annotation(com.busz.annotation.RateLimit)")
    public void checkRateLimit(JoinPoint joinPoint) 
            throws RateLimitExceededException {
        
        String userId = SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
        String key = "rate-limit:" + userId;
        
        if (!rateLimiter.tryAcquire()) {
            throw new RateLimitExceededException(
                "Rate limit exceeded for user: " + userId
            );
        }
    }
}

// Usage
@RateLimit(limit = 10, timeWindow = 60) // 10 requests per minute
@PostMapping("/cards")
public ResponseEntity<?> addCard(@RequestBody AddCardRequest request) {
    // ...
}
```

### 6.2 DDoS Protection

```yaml
# Spring Security DDoS protection
spring:
  security:
    filter:
      dispatcher-types: REQUEST
    
    filter-chain-proxy:
      filter-security-interceptor:
        enabled: true

# WAF Rules (via reverse proxy)
# - Rate limiting by IP
# - Connection timeout: 30s
# - Request size limit: 1MB
# - Concurrent connections: 1000/IP
```

---

## 7. Audit & Logging

### 7.1 Audit Trail

```java
@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private UUID userId;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuditAction action; // CREATE, READ, UPDATE, DELETE
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuditEntity entity; // CARD, SIGNATURE, CERTIFICATE
    
    @Column(nullable = false)
    private UUID entityId;
    
    @Column(nullable = false)
    private String ipAddress;
    
    @Column(nullable = false)
    private String userAgent;
    
    @Column(columnDefinition = "jsonb")
    private String changes; // Before/After values
    
    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private Boolean success;
    
    private String failureReason;
}

@Service
@Aspect
public class AuditService {
    
    @After("@annotation(com.busz.annotation.Auditable)")
    public void auditOperation(JoinPoint joinPoint) {
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        
        AuditLog log = AuditLog.builder()
            .userId(getCurrentUserId())
            .action(AuditAction.fromMethod(methodName))
            .entity(AuditEntity.fromArgs(args))
            .entityId(getEntityId(args))
            .ipAddress(getClientIpAddress())
            .userAgent(getClientUserAgent())
            .success(true)
            .build();
        
        auditLogRepository.save(log);
    }
}
```

### 7.2 Logging Policy

```yaml
# logback.xml
<configuration>
  <appender name="FILE" class="ch.qos.logback.core.FileAppender">
    <file>logs/card-service.log</file>
    <encoder>
      <pattern>
        %d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n
      </pattern>
    </encoder>
  </appender>
  
  <logger name="com.busz.card" level="INFO"/>
  <logger name="org.springframework.security" level="DEBUG"/>
  
  <root level="WARN">
    <appender-ref ref="FILE"/>
  </root>
</configuration>

Logging Rules:
❌ NEVER log: Card numbers, CVV, Private keys
✅ DO log: User actions, Authorization decisions, Errors
✅ Retention: 7 years for audit logs
✅ Rotation: Daily or 100MB
✅ Encryption: At rest (AES-256)
```

---

## 8. Secrets Management

### 8.1 Environment Secrets

```bash
# ❌ WRONG - Hardcoded secrets
private static final String DB_PASSWORD = "mysql123";

# ✅ CORRECT - Environment variables
DB_PASSWORD=${DB_PASSWORD}

# ✅ CORRECT - Vault secrets
spring:
  cloud:
    vault:
      host: vault.busz.com
      port: 8200
      token: ${VAULT_TOKEN}
      kv:
        version: 2
        backend: secret
```

### 8.2 Secrets Rotation

```java
@Component
@Scheduled(fixedRate = 3600000) // Every hour
public class SecretsRotationScheduler {
    
    @Autowired
    private VaultService vaultService;
    
    public void rotateSecrets() throws Exception {
        // Rotate database password
        String newDbPassword = generateSecurePassword();
        vaultService.updateSecret("db-password", newDbPassword);
        updateDataSourcePassword(newDbPassword);
        
        // Rotate API keys
        String newApiKey = generateApiKey();
        vaultService.updateSecret("api-key", newApiKey);
        
        // Rotate JWT secret
        String newJwtSecret = generateSecureKey();
        vaultService.updateSecret("jwt-secret", newJwtSecret);
        
        log.info("Secrets rotated successfully");
    }
}
```

---

## 9. PCI DSS Compliance

### 9.1 PCI DSS Requirements Summary

| Requirement | Implementation |
|------------|-----------------|
| 1. Firewall | WAF + Network isolation |
| 2. Default Security | Remove defaults, change passwords |
| 3. Protect Data | Encryption AES-256 |
| 4. Encrypt Transit | TLS 1.3 |
| 5. Malware Protection | Antivirus + IDS |
| 6. Secure Systems | Patches + updates |
| 7. Access Control | RBAC + MFA |
| 8. ID & Auth | JWT + MFA |
| 9. Physical Security | Datacenter security |
| 10. Logging & Monitoring | Audit trail |
| 11. Testing | Penetration testing |
| 12. Policy | Security policy |

### 9.2 PCI DSS Compliance Checklist

```yaml
Data Storage:
  ✅ No full PAN storage
  ✅ Tokenization used
  ✅ Encrypted at rest (AES-256)
  ✅ Access logs maintained
  
Data Transmission:
  ✅ TLS 1.3 minimum
  ✅ Certificate validation
  ✅ No unencrypted transmission
  
Access Control:
  ✅ Unique user IDs
  ✅ MFA for admin access
  ✅ Role-based access
  ✅ Session timeout (15 min)
  
Monitoring:
  ✅ Audit logs for 1 year
  ✅ Real-time monitoring
  ✅ Alert on suspicious activity
  ✅ Log integrity verified
```

---

## 10. Security Testing

### 10.1 Security Test Plan

```
Unit Tests:
- Encryption/Decryption correctness
- Signature generation/verification
- Input validation rules
- Authorization checks

Integration Tests:
- Database encryption
- Vault connectivity
- Certificate validation
- End-to-end flows

Security Tests:
- SQL Injection attempts
- XSS payload testing
- CSRF token validation
- Rate limiting effectiveness
- Authentication bypass attempts

Penetration Testing:
- External penetration test (quarterly)
- Internal penetration test (semi-annual)
- Social engineering test
- Third-party assessment
```

### 10.2 OWASP Top 10 Mitigation

| OWASP Risk | Mitigation |
|-----------|-----------|
| Injection | Parameterized queries, ORM |
| Broken Auth | JWT + MFA, Session timeout |
| Sensitive Data | AES-256, TLS 1.3 |
| XML External | Disable XXE, Input validation |
| Broken Access | RBAC, AuthZ checks |
| Security Misconfiguration | Secure defaults, scanning |
| XSS | HTML encoding, CSP headers |
| Insecure Deserialization | Avoid unsafe deserialization |
| Using Components | Dependency scanning, updates |
| Insufficient Logging | Comprehensive audit trail |

---

## 11. Disaster Recovery

### 11.1 Backup Strategy

```
Database Backups:
├── Real-time replication (Secondary)
├── Daily snapshots (30 days retention)
├── Weekly archives (1 year retention)
└── Off-site backup (Separate region)

Encryption Keys:
├── Master key: Vault + HSM backup
├── Backup keys: Separate secure location
├── Recovery procedures: Tested quarterly
└── Access logging: All key operations

Recovery Time Objectives (RTO):
├── Database: 1 hour
├── Vault: 30 minutes
├── API: 15 minutes

Recovery Point Objectives (RPO):
├── Database: 5 minutes
├── Vault: Real-time replication
├── Logs: 1 minute
```

---

## 12. Security Incident Response

### 12.1 Incident Response Plan

```
Detection → Assessment → Containment → Recovery → Lessons

Phase 1: Detection
- Monitoring alerts
- Log analysis
- User reports
- Third-party notification

Phase 2: Assessment
- Incident classification
- Severity determination
- Scope analysis
- Initial containment

Phase 3: Containment
- Isolate affected systems
- Revoke compromised credentials
- Block malicious IP
- Preserve evidence

Phase 4: Recovery
- Restore from backup
- Patch vulnerabilities
- Restore normal operations
- Verify system health

Phase 5: Lessons Learned
- Root cause analysis
- Document findings
- Update procedures
- Train team
```

---

## 13. Security Monitoring

### 13.1 Security Metrics

```
Real-time Monitoring:
- Failed authentication attempts
- Unauthorized access attempts
- Data encryption errors
- Certificate expiration warnings
- Rate limit violations
- Suspicious IP addresses

Daily Monitoring:
- New user registrations
- Large card deletions
- Bulk signature operations
- Database backup status
- Log file integrity

Weekly Monitoring:
- Vulnerability scans
- Security patch status
- Access control review
- Certificate validity check
```

### 13.2 Alerting Rules

```yaml
Alerts:
  HIGH:
    - Failed auth attempts > 10/5min
    - Certificate expiration < 30 days
    - Private key access attempts
    - Database connection loss
  
  CRITICAL:
    - Signature verification failure
    - Vault connectivity loss
    - TLS certificate error
    - Audit log tampering detected
    - Encryption key compromise
```

---

## 14. Security Checklist

### Pre-Deployment
- [ ] Code review completed (2+ reviewers)
- [ ] Security scanning passed (SonarQube, SAST)
- [ ] Dependency vulnerabilities checked
- [ ] Database encryption enabled
- [ ] Vault configured & accessible
- [ ] TLS certificates valid
- [ ] Rate limiting configured
- [ ] WAF rules applied
- [ ] Backup & recovery tested
- [ ] Audit logging enabled

### Post-Deployment
- [ ] Penetration testing scheduled
- [ ] Security monitoring active
- [ ] Incident response plan reviewed
- [ ] Team trained
- [ ] Documentation updated
- [ ] Compliance verified

---

## 15. References

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **PCI DSS:** https://www.pcisecuritystandards.org/
- **NIST Cybersecurity Framework:** https://www.nist.gov/
- **Spring Security:** https://spring.io/projects/spring-security
- **Bouncy Castle:** https://www.bouncycastle.org/

---

**Document Version:** 1.0  
**Classified:** Confidential  
**Last Updated:** 2026-08-13
