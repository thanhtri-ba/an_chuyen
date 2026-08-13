# Card & Signer Service - Implementation Guide

**Version:** 1.0  
**Target:** Development Team  
**Duration:** 8 months (Phase 1-5)  
**Status:** Draft

---

## 1. Quick Start

### 1.1 Project Setup

```bash
# Clone repository
git clone https://github.com/busz/card-signer-service.git
cd card-signer-service

# Setup backend
cd backend
./gradlew build

# Setup Android
cd ../android
./gradlew assembleDebug
```

### 1.2 Technology Stack

**Backend:**
```
Java 17
Spring Boot 3.1
Spring Data JPA
Spring Security
Bouncy Castle (Cryptography)
PostgreSQL
Redis
Docker
Kubernetes
```

**Android:**
```
Kotlin 1.9
Jetpack Compose
Retrofit 2
Room Database
BiometricPrompt API
Tink (Encryption)
```

---

## 2. Project Structure

### 2.1 Backend Directory Layout

```
card-signer-service/
├── card-service/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/busz/card/
│   │   │   │   ├── controller/
│   │   │   │   │   ├── CardController.java
│   │   │   │   │   ├── WalletController.java
│   │   │   │   │   └── TokenizationController.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── CardService.java
│   │   │   │   │   ├── WalletService.java
│   │   │   │   │   ├── EncryptionService.java
│   │   │   │   │   └── VaultService.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── CardRepository.java
│   │   │   │   │   ├── WalletRepository.java
│   │   │   │   │   └── CardTransactionRepository.java
│   │   │   │   ├── entity/
│   │   │   │   │   ├── Card.java
│   │   │   │   │   ├── CardTransaction.java
│   │   │   │   │   └── CardWallet.java
│   │   │   │   ├── dto/
│   │   │   │   │   ├── CardDTO.java
│   │   │   │   │   ├── AddCardRequest.java
│   │   │   │   │   └── CardResponse.java
│   │   │   │   ├── config/
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── CryptoConfig.java
│   │   │   │   │   └── VaultConfig.java
│   │   │   │   └── CardServiceApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml
│   │   │       ├── application-dev.yml
│   │   │       └── application-prod.yml
│   │   └── test/
│   │       └── java/com/busz/card/
│   │           ├── service/CardServiceTest.java
│   │           ├── controller/CardControllerTest.java
│   │           └── repository/CardRepositoryTest.java
│   └── build.gradle
│
├── signer-service/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/busz/signer/
│   │   │   │   ├── controller/
│   │   │   │   │   ├── CertificateController.java
│   │   │   │   │   ├── SignatureController.java
│   │   │   │   │   └── AuditLogController.java
│   │   │   │   ├── service/
│   │   │   │   │   ├── CertificateService.java
│   │   │   │   │   ├── SignerService.java
│   │   │   │   │   ├── TimestampService.java
│   │   │   │   │   └── AuditService.java
│   │   │   │   ├── repository/
│   │   │   │   │   ├── UserCertificateRepository.java
│   │   │   │   │   ├── DigitalSignatureRepository.java
│   │   │   │   │   └── AuditLogRepository.java
│   │   │   │   ├── entity/
│   │   │   │   │   ├── UserCertificate.java
│   │   │   │   │   ├── DigitalSignature.java
│   │   │   │   │   └── AuditLog.java
│   │   │   │   ├── crypto/
│   │   │   │   │   ├── CryptoProvider.java
│   │   │   │   │   ├── KeyGenerator.java
│   │   │   │   │   └── SignatureProvider.java
│   │   │   │   └── SignerServiceApplication.java
│   │   └── test/
│   │       └── java/com/busz/signer/
│   │           ├── service/SignerServiceTest.java
│   │           └── crypto/CryptoProviderTest.java
│   └── build.gradle
│
├── android/
│   ├── app/
│   │   ├── src/
│   │   │   ├── main/
│   │   │   │   ├── kotlin/com/busz/card/
│   │   │   │   │   ├── ui/
│   │   │   │   │   │   ├── card/
│   │   │   │   │   │   │   ├── CardListScreen.kt
│   │   │   │   │   │   │   ├── AddCardScreen.kt
│   │   │   │   │   │   │   └── CardDetailScreen.kt
│   │   │   │   │   │   └── payment/
│   │   │   │   │   │       ├── PaymentScreen.kt
│   │   │   │   │   │       └── BiometricPaymentScreen.kt
│   │   │   │   │   ├── viewmodel/
│   │   │   │   │   │   ├── CardViewModel.kt
│   │   │   │   │   │   └── WalletViewModel.kt
│   │   │   │   │   ├── repository/
│   │   │   │   │   │   ├── CardRepository.kt
│   │   │   │   │   │   └── PaymentRepository.kt
│   │   │   │   │   ├── api/
│   │   │   │   │   │   ├── CardApiService.kt
│   │   │   │   │   │   └── SignerApiService.kt
│   │   │   │   │   ├── security/
│   │   │   │   │   │   ├── BiometricManager.kt
│   │   │   │   │   │   └── KeystoreManager.kt
│   │   │   │   │   └── MainActivity.kt
│   │   │   │   └── AndroidManifest.xml
│   │   │   └── test/
│   │   │       └── kotlin/com/busz/card/
│   │   └── build.gradle
│   └── settings.gradle
│
├── shared/
│   ├── dto/
│   │   ├── CardDTO.java
│   │   ├── SignatureDTO.java
│   │   └── ErrorResponse.java
│   └── utils/
│       ├── CryptoUtil.java
│       └── ValidationUtil.java
│
├── docker-compose.yml
├── Dockerfile
├── kubernetes/
│   ├── deployment.yml
│   ├── service.yml
│   └── configmap.yml
│
└── docs/
    ├── API_SPECIFICATION.md
    ├── DATABASE_DESIGN.md
    ├── SECURITY_GUIDE.md
    └── DEPLOYMENT_GUIDE.md
```

---

## 3. Phase 1: Card Service Development

### 3.1 Setup Spring Boot Project

```bash
# Create project using Spring Initializr
spring boot new --java 17 --name card-service \
  --dependencies web,data-jpa,security,lombok,validation
```

### 3.2 Core Entity Setup

```java
// Card.java
@Entity
@Table(name = "cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private UUID userId;
    
    @Column(unique = true)
    private String cardToken;
    
    @Column(length = 4)
    private String lastFour;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CardType cardType; // VISA, MASTERCARD, etc.
    
    @Column(nullable = false)
    @Encrypted // Use JPA Custom annotation
    private String encryptedData;
    
    @Column(nullable = false)
    private Integer expiryMonth;
    
    @Column(nullable = false)
    private Integer expiryYear;
    
    @Column(nullable = false)
    private Boolean isDefault;
    
    @Column(nullable = false)
    private Boolean isActive;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    private LocalDateTime deletedAt; // Soft delete
}
```

### 3.3 Repository Setup

```java
// CardRepository.java
@Repository
public interface CardRepository extends JpaRepository<Card, UUID> {
    
    List<Card> findByUserIdAndIsActiveTrue(UUID userId);
    
    List<Card> findByUserIdAndDeletedAtIsNull(UUID userId);
    
    Optional<Card> findByUserIdAndIdAndDeletedAtIsNull(UUID userId, UUID cardId);
    
    Optional<Card> findByCardToken(String cardToken);
    
    @Query("SELECT c FROM Card c WHERE c.userId = ?1 AND c.isDefault = true")
    Optional<Card> findDefaultCard(UUID userId);
}
```

### 3.4 Service Implementation

```java
// CardService.java
@Service
@RequiredArgsConstructor
@Slf4j
public class CardService {
    
    private final CardRepository cardRepository;
    private final EncryptionService encryptionService;
    private final PaymentGatewayClient paymentGatewayClient;
    private final VaultService vaultService;
    
    @Transactional
    public CardDTO addCard(AddCardRequest request, String userId) {
        // Validate card
        validateCard(request);
        
        // Tokenize with payment gateway
        String cardToken = paymentGatewayClient.tokenizeCard(request);
        
        // Encrypt sensitive data
        String encrypted = encryptionService.encrypt(
            request.getFullCardData()
        );
        
        // Build and save card
        Card card = Card.builder()
            .userId(UUID.fromString(userId))
            .cardToken(cardToken)
            .lastFour(getLastFour(request.getCardNumber()))
            .cardType(detectCardType(request.getCardNumber()))
            .encryptedData(encrypted)
            .expiryMonth(request.getExpiryMonth())
            .expiryYear(request.getExpiryYear())
            .isActive(true)
            .isDefault(cardRepository.findByUserIdAndDeletedAtIsNull(
                UUID.fromString(userId)
            ).isEmpty())
            .build();
        
        cardRepository.save(card);
        log.info("Card added: {}", card.getId());
        
        return CardMapper.toDTO(card);
    }
    
    public List<CardDTO> getUserCards(String userId) {
        return cardRepository.findByUserIdAndDeletedAtIsNull(
            UUID.fromString(userId)
        )
        .stream()
        .map(CardMapper::toDTO)
        .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteCard(UUID cardId, String userId) {
        Card card = cardRepository.findByUserIdAndIdAndDeletedAtIsNull(
            UUID.fromString(userId), cardId
        ).orElseThrow(() -> new CardNotFoundException());
        
        if (card.getIsDefault()) {
            throw new CannotDeleteDefaultCardException();
        }
        
        card.setDeletedAt(LocalDateTime.now());
        cardRepository.save(card);
    }
    
    private void validateCard(AddCardRequest request) {
        // Luhn check
        if (!luhnCheck(request.getCardNumber())) {
            throw new InvalidCardException("Invalid card number");
        }
        
        // Expiry check
        if (isExpired(request.getExpiryMonth(), request.getExpiryYear())) {
            throw new CardExpiredException();
        }
        
        // CVV check
        if (request.getCvv().length() < 3 || request.getCvv().length() > 4) {
            throw new InvalidCvvException();
        }
    }
}
```

### 3.5 Controller Setup

```java
// CardController.java
@RestController
@RequestMapping("/api/v1/cards")
@RequiredArgsConstructor
@Validated
@Slf4j
public class CardController {
    
    private final CardService cardService;
    private final SecurityContextHolder securityContext;
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<ApiResponse<CardDTO>> addCard(
        @Valid @RequestBody AddCardRequest request
    ) {
        String userId = getAuthenticatedUserId();
        CardDTO card = cardService.addCard(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(ApiResponse.success(card));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<List<CardDTO>>> getCards(
        @RequestParam(defaultValue = "1") int page,
        @RequestParam(defaultValue = "10") int limit
    ) {
        String userId = getAuthenticatedUserId();
        List<CardDTO> cards = cardService.getUserCards(userId);
        return ResponseEntity.ok(ApiResponse.success(cards));
    }
    
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public ResponseEntity<Void> deleteCard(@PathVariable UUID id) {
        String userId = getAuthenticatedUserId();
        cardService.deleteCard(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    private String getAuthenticatedUserId() {
        return SecurityContextHolder.getContext()
            .getAuthentication()
            .getPrincipal();
    }
}
```

### 3.6 Configuration Setup

```yaml
# application.yml
spring:
  application:
    name: card-service
  
  datasource:
    url: jdbc:postgresql://localhost:5432/busz_card
    username: ${DB_USER}
    password: ${DB_PASSWORD}
  
  jpa:
    hibernate:
      ddl-auto: validate
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: https://auth.busz.com
  
  redis:
    host: localhost
    port: 6379

vault:
  host: ${VAULT_HOST}
  port: ${VAULT_PORT}
  token: ${VAULT_TOKEN}
  path: secret/card-service

encryption:
  algorithm: AES
  key-size: 256
```

### 3.7 Testing Setup

```java
// CardServiceTest.java
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class CardServiceTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private CardService cardService;
    
    @Test
    @DisplayName("Should add card successfully")
    void testAddCardSuccess() throws Exception {
        AddCardRequest request = AddCardRequest.builder()
            .cardNumber("4532015112830366")
            .cardHolderName("JOHN NGUYEN")
            .expiryMonth(12)
            .expiryYear(2027)
            .cvv("123")
            .build();
        
        CardDTO expectedCard = CardDTO.builder()
            .id(UUID.randomUUID())
            .lastFour("0366")
            .cardType(CardType.VISA)
            .build();
        
        when(cardService.addCard(any(), any()))
            .thenReturn(expectedCard);
        
        mockMvc.perform(post("/api/v1/cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.data.last_four").value("0366"));
    }
    
    @Test
    @DisplayName("Should reject expired card")
    void testAddExpiredCardFails() throws Exception {
        AddCardRequest request = AddCardRequest.builder()
            .cardNumber("4532015112830366")
            .cardHolderName("JOHN NGUYEN")
            .expiryMonth(1)
            .expiryYear(2024)
            .cvv("123")
            .build();
        
        mockMvc.perform(post("/api/v1/cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
}
```

---

## 4. Phase 2: Digital Signer Development

### 4.1 Cryptography Setup

```java
// CryptoProvider.java
@Service
@Slf4j
public class CryptoProvider {
    
    static {
        Security.addProvider(new BouncyCastleProvider());
    }
    
    public KeyPair generateKeyPair() throws Exception {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
        kpg.initialize(2048);
        return kpg.generateKeyPair();
    }
    
    public String signData(PrivateKey privateKey, byte[] data) throws Exception {
        Signature signature = Signature.getInstance("SHA256WithRSA");
        signature.initSign(privateKey);
        signature.update(data);
        return Base64.getEncoder().encodeToString(signature.sign());
    }
    
    public boolean verifySignature(PublicKey publicKey, byte[] data, String signature)
            throws Exception {
        Signature sig = Signature.getInstance("SHA256WithRSA");
        sig.initVerify(publicKey);
        sig.update(data);
        return sig.verify(Base64.getDecoder().decode(signature));
    }
}
```

### 4.2 Certificate Service

```java
// CertificateService.java
@Service
@RequiredArgsConstructor
@Slf4j
public class CertificateService {
    
    private final UserCertificateRepository certificateRepository;
    private final CryptoProvider cryptoProvider;
    private final VaultService vaultService;
    
    @Transactional
    public UserCertificateDTO generateCertificate(
        GenerateCertificateRequest request,
        String userId
    ) throws Exception {
        // Generate key pair
        KeyPair keyPair = cryptoProvider.generateKeyPair();
        
        // Generate X.509 certificate
        X509Certificate x509Cert = createX509Certificate(
            keyPair,
            request
        );
        
        // Save private key to Vault
        String privateKeyRef = vaultService.storePrivateKey(
            userId,
            keyPair.getPrivate()
        );
        
        // Save certificate to DB
        UserCertificate cert = UserCertificate.builder()
            .userId(UUID.fromString(userId))
            .certificateData(encodeCertificate(x509Cert))
            .publicKey(encodePublicKey(keyPair.getPublic()))
            .privateKeyVaultRef(privateKeyRef)
            .status(CertificateStatus.ACTIVE)
            .issuedAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusYears(1))
            .build();
        
        certificateRepository.save(cert);
        log.info("Certificate generated: {}", cert.getId());
        
        return CertificateMapper.toDTO(cert);
    }
    
    private X509Certificate createX509Certificate(
        KeyPair keyPair,
        GenerateCertificateRequest request
    ) throws Exception {
        X500Name issuer = new X500Name("CN=BusZ CA");
        X500Name subject = new X500Name(
            "CN=" + request.getCommonName() +
            ",O=" + request.getOrganization() +
            ",OU=BusZ"
        );
        
        BigInteger serialNumber = BigInteger.valueOf(
            System.currentTimeMillis()
        );
        
        Date notBefore = new Date();
        Date notAfter = new Date(
            System.currentTimeMillis() + (365L * 24 * 60 * 60 * 1000)
        );
        
        X509v3CertificateBuilder certBuilder = new X509v3CertificateBuilder(
            issuer,
            serialNumber,
            notBefore,
            notAfter,
            subject,
            SubjectPublicKeyInfo.getInstance(
                keyPair.getPublic().getEncoded()
            )
        );
        
        // Add extensions
        certBuilder.addExtension(
            Extension.keyUsage,
            true,
            new KeyUsage(KeyUsage.digitalSignature)
        );
        
        ContentSigner signer = new BcRSAContentSignerBuilder(
            new AlgorithmIdentifier(PKCSObjectIdentifiers.sha256WithRSAEncryption),
            new AlgorithmIdentifier(PKCSObjectIdentifiers.sha256)
        ).build(
            PrivateKeyFactory.createKey(keyPair.getPrivate().getEncoded())
        );
        
        return new JcaX509CertificateConverter()
            .setProvider(new BouncyCastleProvider())
            .getCertificate(certBuilder.build(signer));
    }
}
```

### 4.3 Signer Service

```java
// SignerService.java
@Service
@RequiredArgsConstructor
@Slf4j
public class SignerService {
    
    private final DigitalSignatureRepository signatureRepository;
    private final CertificateService certificateService;
    private final CryptoProvider cryptoProvider;
    private final VaultService vaultService;
    
    @Transactional
    public DigitalSignatureDTO signData(
        SignRequest request,
        String userId
    ) throws Exception {
        // Get user's active certificate
        UserCertificate userCert = certificateService
            .getUserActiveCertificate(userId);
        
        // Get private key from Vault
        PrivateKey privateKey = vaultService.getPrivateKey(
            userCert.getPrivateKeyVaultRef()
        );
        
        // Sign data
        String signature = cryptoProvider.signData(
            privateKey,
            request.getData().getBytes()
        );
        
        // Save signature record
        DigitalSignature digitalSig = DigitalSignature.builder()
            .entityType(request.getEntityType())
            .entityId(request.getEntityId())
            .userId(UUID.fromString(userId))
            .signature(signature)
            .publicKeyId(userCert.getId())
            .algorithm("SHA256WithRSA")
            .timestamp(LocalDateTime.now())
            .isVerified(false)
            .build();
        
        signatureRepository.save(digitalSig);
        log.info("Data signed: {}", digitalSig.getId());
        
        return SignatureMapper.toDTO(digitalSig);
    }
    
    @Transactional
    public boolean verifySignature(
        UUID signatureId,
        byte[] data
    ) throws Exception {
        DigitalSignature digitalSig = signatureRepository
            .findById(signatureId)
            .orElseThrow(() -> new SignatureNotFoundException());
        
        UserCertificate cert = certificateService
            .getCertificate(digitalSig.getPublicKeyId());
        
        PublicKey publicKey = cert.getPublicKeyObject();
        
        boolean isValid = cryptoProvider.verifySignature(
            publicKey,
            data,
            digitalSig.getSignature()
        );
        
        // Update verification status
        digitalSig.setIsVerified(isValid);
        signatureRepository.save(digitalSig);
        
        // Audit log
        auditService.logSignatureVerification(
            signatureId,
            isValid ? "VERIFIED" : "INVALID"
        );
        
        return isValid;
    }
}
```

---

## 5. Phase 3: Integration

### 5.1 Payment Service Integration

```java
// PaymentService updated
@Service
@RequiredArgsConstructor
public class PaymentService {
    
    private final CardService cardService;
    private final SignerService signerService;
    private final TicketService ticketService;
    
    @Transactional
    public PaymentDTO processPayment(PaymentRequest request) throws Exception {
        // Verify card
        CardDTO card = cardService.verifyCard(request.getCardId());
        
        // Process payment
        String transactionId = processWithPaymentGateway(request);
        
        // Sign transaction
        DigitalSignatureDTO signature = signerService.signData(
            SignRequest.builder()
                .entityType("TRANSACTION")
                .entityId(transactionId)
                .data(serializeTransaction(request))
                .build(),
            getCurrentUserId()
        );
        
        // Create ticket
        TicketDTO ticket = ticketService.createTicket(
            request.getBookingId(),
            signature.getSignatureId()
        );
        
        return PaymentMapper.toDTO(
            transactionId,
            signature,
            ticket
        );
    }
}
```

### 5.2 Database Migration

```sql
-- Migration script
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    card_token VARCHAR(255) UNIQUE,
    last_four CHAR(4),
    card_type VARCHAR(20),
    issuer VARCHAR(50),
    expiry_month INT,
    expiry_year INT,
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    encrypted_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    certificate_data TEXT,
    public_key TEXT,
    private_key_vault_ref VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    issued_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_token ON cards(card_token);
CREATE INDEX idx_certificates_user_id ON user_certificates(user_id);
```

---

## 6. Phase 4: Android Integration

### 6.1 Setup Kotlin Project

```gradle
// build.gradle.kts
android {
    compileSdk = 34
    
    defaultConfig {
        applicationId = "com.busz.card"
        minSdk = 26
        targetSdk = 34
    }
}

dependencies {
    implementation("androidx.compose.ui:ui:1.5.0")
    implementation("androidx.biometric:biometric:1.1.0")
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("androidx.security:security-crypto:1.1.0-alpha06")
    implementation("com.google.crypto.tink:tink-android:1.10.0")
}
```

### 6.2 Card ViewModel

```kotlin
// CardViewModel.kt
class CardViewModel(
    private val cardRepository: CardRepository
) : ViewModel() {
    
    private val _cards = MutableLiveData<List<Card>>()
    val cards: LiveData<List<Card>> = _cards
    
    private val _loading = MutableLiveData(false)
    val loading: LiveData<Boolean> = _loading
    
    fun loadUserCards() {
        viewModelScope.launch {
            _loading.value = true
            try {
                val userCards = cardRepository.getUserCards()
                _cards.value = userCards
            } catch (e: Exception) {
                Log.e("CardViewModel", "Error loading cards", e)
            } finally {
                _loading.value = false
            }
        }
    }
    
    fun addCard(cardData: CardData) {
        viewModelScope.launch {
            try {
                val newCard = cardRepository.addCard(cardData)
                _cards.value = (_cards.value ?: emptyList()) + newCard
            } catch (e: Exception) {
                Log.e("CardViewModel", "Error adding card", e)
            }
        }
    }
}
```

### 6.3 Biometric Payment

```kotlin
// BiometricPaymentScreen.kt
@Composable
fun BiometricPaymentScreen(card: Card) {
    val context = LocalContext.current
    val viewModel: CardViewModel = hiltViewModel()
    
    Button(onClick = {
        performBiometricPayment(context, card)
    }) {
        Text("Pay with Biometric")
    }
}

private fun performBiometricPayment(context: Context, card: Card) {
    val executor = ContextCompat.getMainExecutor(context)
    val biometricPrompt = BiometricPrompt(
        context as FragmentActivity,
        executor,
        object : BiometricPrompt.AuthenticationCallback() {
            override fun onAuthenticationSucceeded(
                result: BiometricPrompt.AuthenticationResult
            ) {
                super.onAuthenticationSucceeded(result)
                // Verify signature locally
                proceedWithPayment(card)
            }
            
            override fun onAuthenticationError(
                errorCode: Int,
                errString: CharSequence
            ) {
                super.onAuthenticationError(errorCode, errString)
                Toast.makeText(
                    context,
                    "Authentication failed",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    )
    
    val promptInfo = BiometricPrompt.PromptInfo.Builder()
        .setTitle("Confirm Payment")
        .setSubtitle("Use biometric to confirm")
        .setNegativeButtonText("Cancel")
        .build()
    
    biometricPrompt.authenticate(promptInfo)
}
```

---

## 7. Development Checklist

### Phase 1 Checklist
- [ ] Spring Boot project setup
- [ ] Database schema creation
- [ ] Card entity & repository
- [ ] CardService implementation
- [ ] CardController implementation
- [ ] EncryptionService setup
- [ ] Unit tests (70%+ coverage)
- [ ] Integration tests
- [ ] API documentation
- [ ] Code review & feedback

### Phase 2 Checklist
- [ ] Bouncy Castle setup
- [ ] CryptoProvider implementation
- [ ] CertificateService
- [ ] SignerService implementation
- [ ] AuditService
- [ ] Certificate rotation logic
- [ ] Security tests
- [ ] Performance tests
- [ ] Documentation

### Phase 3 Checklist
- [ ] Payment + Card integration
- [ ] Ticket + Signer integration
- [ ] End-to-end flow testing
- [ ] Database migration scripts
- [ ] Backward compatibility testing
- [ ] Load testing (5k+ transactions)

### Phase 4 Checklist
- [ ] Kotlin project setup
- [ ] CardViewModel
- [ ] Card UI screens
- [ ] Biometric integration
- [ ] Offline verification
- [ ] Security tests
- [ ] UAT testing

### Phase 5 Checklist
- [ ] E-wallet feature
- [ ] Subscription support
- [ ] Loyalty integration
- [ ] Analytics integration
- [ ] Performance optimization
- [ ] Production deployment

---

## 8. Git Workflow

### 8.1 Branch Strategy

```bash
# Feature branch
git checkout -b feature/card-service-mvp
git commit -m "feat: add card management service"
git push origin feature/card-service-mvp

# Create Pull Request
# Code review required (2 approvals)
# Merge to develop after approval

# Develop to staging
git checkout develop
git pull origin develop
git tag -a v1.0.0-rc1 -m "Release candidate 1"

# Staging to production
git checkout main
git merge --no-ff develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main --tags
```

---

## 9. CI/CD Pipeline

### 9.1 GitHub Actions

```yaml
# .github/workflows/build.yml
name: Build & Test
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up JDK 17
        uses: actions/setup-java@v2
        with:
          java-version: '17'
      
      - name: Build with Gradle
        run: ./gradlew build
      
      - name: Run tests
        run: ./gradlew test
      
      - name: Code coverage
        run: ./gradlew jacocoTestReport
      
      - name: Sonar analysis
        run: ./gradlew sonarqube
      
      - name: Docker build
        run: docker build -t busz/card-service:latest .
      
      - name: Push to registry
        run: docker push busz/card-service:latest
```

---

## 10. Resources & Support

- **Documentation:** `/docs/`
- **Code Examples:** `/examples/`
- **API Playground:** `https://api.busz.local`
- **Team Slack:** #card-signer-dev
- **Daily Standup:** 9:00 AM UTC
- **Sprint Review:** Every 2 weeks

---

## 11. Common Issues & Troubleshooting

### Encryption Issues
```bash
# Check if key is stored in Vault
vault list secret/card-service

# Rotate key
vault write secret/data/card-service/keys key=value
```

### Database Connection
```bash
# Check database
psql -h localhost -U admin -d busz_card -c "SELECT version();"

# Run migrations
./gradlew migrate
```

### Certificate Errors
```java
// Debug certificate
keytool -printcert -file certificate.pem
keytool -list -v -keystore keystore.jks
```

---

## 12. Next Steps

1. **Finalize requirements** with stakeholders
2. **Setup development environment**
3. **Create sprint backlog** based on phases
4. **Begin Phase 1** - Card Service
5. **Weekly progress review** with team
6. **Monthly demo** with stakeholders

---

**Document Version:** 1.0  
**Last Updated:** 2026-08-13  
**Maintained By:** BusZ Development Team
