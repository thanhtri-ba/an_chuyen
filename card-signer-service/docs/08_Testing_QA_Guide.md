# Card & Signer Service - Testing & QA Guide

**Version:** 1.0  
**Coverage Target:** 80%+  
**Performance Target:** p99 latency < 200ms

---

## 1. Testing Strategy

### 1.1 Test Pyramid

```
                    ▲
                   /  \
                  / E2E \           (10%)
                 /  Tests \
                /__________\
               /    /  \    \
              / Integration  \      (20%)
             /    /    \    \
            /____/__________\
           /    /    /  \    \
          /   Unit Tests        \    (70%)
         /____/_______________\
```

### 1.2 Test Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| Card Service | 85% | TBD |
| Signer Service | 90% | TBD |
| Security Utils | 95% | TBD |
| Payment Integration | 80% | TBD |
| **Overall** | **80%** | TBD |

---

## 2. Unit Testing

### 2.1 Card Service Unit Tests

```java
// src/test/java/com/busz/card/service/CardServiceTest.java
@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class CardServiceTest {
    
    @InjectMocks
    private CardService cardService;
    
    @Mock
    private CardRepository cardRepository;
    
    @Mock
    private EncryptionService encryptionService;
    
    @Mock
    private VaultService vaultService;
    
    private Card testCard;
    private AddCardRequest testRequest;
    
    @BeforeEach
    void setUp() {
        testCard = Card.builder()
            .id(UUID.randomUUID())
            .userId(UUID.randomUUID())
            .cardToken("tok_visa_4532")
            .lastFour("0366")
            .cardType(CardType.VISA)
            .expiryMonth(12)
            .expiryYear(2027)
            .isActive(true)
            .isDefault(false)
            .build();
        
        testRequest = AddCardRequest.builder()
            .cardNumber("4532015112830366")
            .cardHolderName("JOHN NGUYEN")
            .expiryMonth(12)
            .expiryYear(2027)
            .cvv("123")
            .build();
    }
    
    @Test
    @DisplayName("Should add card successfully")
    void testAddCardSuccess() {
        // Arrange
        when(encryptionService.encrypt(anyString()))
            .thenReturn("encrypted-data");
        when(cardRepository.save(any(Card.class)))
            .thenReturn(testCard);
        when(cardRepository.findByUserIdAndDeletedAtIsNull(any()))
            .thenReturn(Collections.emptyList());
        
        // Act
        CardDTO result = cardService.addCard(testRequest, testCard.getUserId().toString());
        
        // Assert
        assertNotNull(result);
        assertEquals("0366", result.getLastFour());
        assertEquals(CardType.VISA, result.getCardType());
        verify(cardRepository, times(1)).save(any(Card.class));
        verify(encryptionService, times(1)).encrypt(anyString());
    }
    
    @Test
    @DisplayName("Should reject expired card")
    void testAddExpiredCardFails() {
        // Arrange
        testRequest.setExpiryYear(2024);
        testRequest.setExpiryMonth(1);
        
        // Act & Assert
        assertThrows(CardExpiredException.class, () ->
            cardService.addCard(testRequest, testCard.getUserId().toString())
        );
    }
    
    @Test
    @DisplayName("Should validate card number using Luhn algorithm")
    void testLuhnValidation() {
        // Invalid card number
        testRequest.setCardNumber("4532015112830367"); // Changed last digit
        
        assertThrows(InvalidCardException.class, () ->
            cardService.addCard(testRequest, testCard.getUserId().toString())
        );
    }
    
    @Test
    @DisplayName("Should reject CVV < 3 digits")
    void testInvalidCVV() {
        testRequest.setCvv("12");
        
        assertThrows(InvalidCvvException.class, () ->
            cardService.addCard(testRequest, testCard.getUserId().toString())
        );
    }
    
    @Test
    @DisplayName("Should encrypt card data before storage")
    void testCardEncryption() {
        // Arrange
        when(encryptionService.encrypt(anyString()))
            .thenReturn("encrypted-sensitive-data");
        when(cardRepository.save(any(Card.class)))
            .thenReturn(testCard);
        when(cardRepository.findByUserIdAndDeletedAtIsNull(any()))
            .thenReturn(Collections.emptyList());
        
        // Act
        cardService.addCard(testRequest, testCard.getUserId().toString());
        
        // Assert
        ArgumentCaptor<Card> cardCaptor = ArgumentCaptor.forClass(Card.class);
        verify(cardRepository).save(cardCaptor.capture());
        assertNotNull(cardCaptor.getValue().getEncryptedData());
    }
    
    @Test
    @DisplayName("Should prevent duplicate default cards")
    void testDuplicateDefaultCardPrevention() {
        // Arrange - user already has a default card
        Card defaultCard = Card.builder()
            .userId(testCard.getUserId())
            .isDefault(true)
            .build();
        
        when(cardRepository.findByUserIdAndDeletedAtIsNull(testCard.getUserId()))
            .thenReturn(Collections.singletonList(defaultCard));
        
        // Act
        when(cardRepository.save(any(Card.class)))
            .thenReturn(testCard);
        CardDTO result = cardService.addCard(testRequest, testCard.getUserId().toString());
        
        // Assert - new card should not be default
        assertEquals(false, result.getIsDefault());
    }
    
    @Test
    @DisplayName("Should delete card with soft delete")
    void testCardSoftDelete() {
        // Arrange
        when(cardRepository.findByUserIdAndIdAndDeletedAtIsNull(
            testCard.getUserId(), testCard.getId()))
            .thenReturn(Optional.of(testCard));
        when(cardRepository.save(any(Card.class)))
            .thenReturn(testCard);
        
        // Act
        cardService.deleteCard(testCard.getId(), testCard.getUserId().toString());
        
        // Assert
        ArgumentCaptor<Card> cardCaptor = ArgumentCaptor.forClass(Card.class);
        verify(cardRepository).save(cardCaptor.capture());
        assertNotNull(cardCaptor.getValue().getDeletedAt());
    }
}
```

### 2.2 Signer Service Unit Tests

```java
@SpringBootTest
@ActiveProfiles("test")
class SignerServiceTest {
    
    @InjectMocks
    private SignerService signerService;
    
    @Mock
    private DigitalSignatureRepository signatureRepository;
    
    @Mock
    private CertificateService certificateService;
    
    @Mock
    private CryptoProvider cryptoProvider;
    
    @Test
    @DisplayName("Should sign data successfully")
    void testSignDataSuccess() throws Exception {
        // Arrange
        String userId = UUID.randomUUID().toString();
        byte[] dataToSign = "test-data".getBytes();
        String expectedSignature = "base64-encoded-signature";
        
        UserCertificate mockCert = new UserCertificate();
        when(certificateService.getUserActiveCertificate(userId))
            .thenReturn(mockCert);
        when(cryptoProvider.signData(any(PrivateKey.class), eq(dataToSign)))
            .thenReturn(expectedSignature);
        
        SignRequest request = SignRequest.builder()
            .entityType("TICKET")
            .entityId(UUID.randomUUID())
            .data(Base64.getEncoder().encodeToString(dataToSign))
            .build();
        
        // Act
        DigitalSignatureDTO result = signerService.signData(request, userId);
        
        // Assert
        assertNotNull(result);
        assertEquals(expectedSignature, result.getSignature());
        verify(cryptoProvider).signData(any(PrivateKey.class), eq(dataToSign));
    }
    
    @Test
    @DisplayName("Should verify signature correctly")
    void testVerifySignatureSuccess() throws Exception {
        // Arrange
        UUID signatureId = UUID.randomUUID();
        byte[] data = "test-data".getBytes();
        
        DigitalSignature mockSignature = new DigitalSignature();
        mockSignature.setId(signatureId);
        mockSignature.setSignature("base64-signature");
        
        when(signatureRepository.findById(signatureId))
            .thenReturn(Optional.of(mockSignature));
        when(cryptoProvider.verifySignature(any(), eq(data), anyString()))
            .thenReturn(true);
        
        // Act
        boolean result = signerService.verifySignature(signatureId, data);
        
        // Assert
        assertTrue(result);
        verify(cryptoProvider).verifySignature(any(), eq(data), anyString());
    }
    
    @Test
    @DisplayName("Should reject invalid signature")
    void testVerifySignatureFails() throws Exception {
        // Arrange
        UUID signatureId = UUID.randomUUID();
        byte[] data = "test-data".getBytes();
        
        DigitalSignature mockSignature = new DigitalSignature();
        when(signatureRepository.findById(signatureId))
            .thenReturn(Optional.of(mockSignature));
        when(cryptoProvider.verifySignature(any(), eq(data), anyString()))
            .thenReturn(false);
        
        // Act
        boolean result = signerService.verifySignature(signatureId, data);
        
        // Assert
        assertFalse(result);
    }
}
```

---

## 3. Integration Testing

### 3.1 Card Service Integration Tests

```java
@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class CardServiceIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private CardRepository cardRepository;
    
    @Autowired
    private TestDatabaseInitializer databaseInitializer;
    
    @BeforeEach
    void setUp() {
        cardRepository.deleteAll();
        databaseInitializer.initTestData();
    }
    
    @Test
    @DisplayName("Should add, retrieve, and delete card")
    void testCardLifecycle() throws Exception {
        // 1. Add card
        AddCardRequest addRequest = AddCardRequest.builder()
            .cardNumber("4532015112830366")
            .cardHolderName("Test User")
            .expiryMonth(12)
            .expiryYear(2027)
            .cvv("123")
            .build();
        
        MvcResult addResult = mockMvc.perform(post("/api/v1/cards")
            .header("Authorization", "Bearer " + getTestJWT())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(addRequest)))
            .andExpect(status().isCreated())
            .andReturn();
        
        String cardId = JsonPath.read(addResult.getResponse().getContentAsString(),
            "$.data.id");
        
        // 2. Retrieve card
        mockMvc.perform(get("/api/v1/cards/" + cardId)
            .header("Authorization", "Bearer " + getTestJWT()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data.last_four").value("0366"))
            .andExpect(jsonPath("$.data.card_type").value("VISA"));
        
        // 3. Update card
        UpdateCardRequest updateRequest = UpdateCardRequest.builder()
            .cardNickname("Main Card")
            .isDefault(true)
            .build();
        
        mockMvc.perform(put("/api/v1/cards/" + cardId)
            .header("Authorization", "Bearer " + getTestJWT())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(updateRequest)))
            .andExpect(status().isOk());
        
        // 4. Delete card
        mockMvc.perform(delete("/api/v1/cards/" + cardId)
            .header("Authorization", "Bearer " + getTestJWT()))
            .andExpect(status().isNoContent());
    }
    
    @Test
    @DisplayName("Should prevent adding duplicate cards")
    void testDuplicateCardPrevention() throws Exception {
        AddCardRequest request = AddCardRequest.builder()
            .cardNumber("4532015112830366")
            .cardHolderName("Test User")
            .expiryMonth(12)
            .expiryYear(2027)
            .cvv("123")
            .build();
        
        // First request should succeed
        mockMvc.perform(post("/api/v1/cards")
            .header("Authorization", "Bearer " + getTestJWT())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated());
        
        // Second request with same card should fail
        mockMvc.perform(post("/api/v1/cards")
            .header("Authorization", "Bearer " + getTestJWT())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isConflict());
    }
}
```

---

## 4. Security Testing

### 4.1 Security Test Cases

```java
@SpringBootTest
@ActiveProfiles("test")
class SecurityTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Test
    @DisplayName("Should reject request without JWT token")
    void testUnauthorizedAccess() throws Exception {
        mockMvc.perform(get("/api/v1/cards"))
            .andExpect(status().isUnauthorized());
    }
    
    @Test
    @DisplayName("Should reject request with invalid JWT token")
    void testInvalidJWT() throws Exception {
        mockMvc.perform(get("/api/v1/cards")
            .header("Authorization", "Bearer invalid-token"))
            .andExpect(status().isUnauthorized());
    }
    
    @Test
    @DisplayName("Should prevent SQL injection in card search")
    void testSQLInjectionPrevention() throws Exception {
        String maliciousInput = "1' OR '1'='1";
        
        mockMvc.perform(get("/api/v1/cards?search=" + maliciousInput)
            .header("Authorization", "Bearer " + getTestJWT()))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error.code").value("INVALID_REQUEST"));
    }
    
    @Test
    @DisplayName("Should prevent XSS in card nickname")
    void testXSSPrevention() throws Exception {
        UpdateCardRequest request = UpdateCardRequest.builder()
            .cardNickname("<script>alert('xss')</script>")
            .build();
        
        mockMvc.perform(put("/api/v1/cards/" + UUID.randomUUID())
            .header("Authorization", "Bearer " + getTestJWT())
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isBadRequest());
    }
    
    @Test
    @DisplayName("Should prevent CSRF attacks")
    void testCSRFProtection() throws Exception {
        mockMvc.perform(post("/api/v1/cards")
            .contentType(MediaType.APPLICATION_JSON)
            .content("{}")
            .header("X-CSRF-TOKEN", "invalid-token"))
            .andExpect(status().isForbidden());
    }
    
    @Test
    @DisplayName("Should enforce HTTPS only")
    void testHTTPSEnforcement() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setSecure(false);
        
        // Should redirect or reject non-HTTPS requests
        mockMvc.perform(get("/api/v1/cards")
            .secure(false))
            .andExpect(status().isMovedPermanently());
    }
    
    @Test
    @DisplayName("Should rate limit excessive requests")
    void testRateLimiting() throws Exception {
        // Send 101 requests rapidly (limit is 100/minute)
        for (int i = 0; i < 101; i++) {
            MvcResult result = mockMvc.perform(get("/api/v1/cards")
                .header("Authorization", "Bearer " + getTestJWT()))
                .andReturn();
            
            if (i >= 100) {
                assertEquals(429, result.getResponse().getStatus());
            }
        }
    }
}
```

---

## 5. Performance Testing

### 5.1 Load Test Configuration

```bash
#!/bin/bash
# scripts/load-test.sh

set -e

echo "=== Card Service Load Test ==="
echo "Configuration:"
echo "  Duration: 300 seconds"
echo "  Threads: 50"
echo "  Target RPS: 1000"
echo "  Database: PostgreSQL"
echo ""

# Start monitoring
echo "Starting Prometheus monitoring..."
docker-compose up -d prometheus

sleep 5

echo "Running Apache Bench..."
ab -n 50000 \
   -c 50 \
   -t 300 \
   -H "Authorization: Bearer $JWT_TOKEN" \
   https://api.busz.local/api/v1/cards/

echo ""
echo "Generating Grafana report..."
curl -X GET http://localhost:3000/api/annotations

echo "Test completed!"
echo "Results available at: http://localhost:3000 (Grafana)"
```

### 5.2 Performance Metrics

```
Success Criteria:
✅ p50 latency: < 100ms
✅ p95 latency: < 150ms
✅ p99 latency: < 200ms
✅ Error rate: < 0.1%
✅ Success rate: > 99.9%
✅ Throughput: > 500 RPS
✅ Memory usage: < 1GB per instance
✅ CPU usage: < 70%
```

---

## 6. End-to-End Testing

### 6.1 E2E Test Scenarios

```bash
#!/bin/bash
# tests/e2e/complete-payment-flow.bats

@test "Customer adds card successfully" {
    response=$(curl -X POST https://api.busz.local/api/v1/cards \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d '{
            "card_number": "4532015112830366",
            "card_holder_name": "John Nguyen",
            "expiry_month": 12,
            "expiry_year": 2027,
            "cvv": "123"
        }')
    
    [ "$(echo $response | jq '.success')" = "true" ]
    [ -n "$(echo $response | jq '.data.id')" ]
}

@test "Customer can pay with card" {
    # Add card
    card=$(curl -X POST https://api.busz.local/api/v1/cards \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d '{...}' | jq '.data.id')
    
    # Create payment
    payment=$(curl -X POST https://api.busz.local/api/v1/payments \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -d "{
            \"booking_id\": \"booking-123\",
            \"card_id\": \"$card\"
        }")
    
    [ "$(echo $payment | jq '.data.status')" = "PENDING" ]
}

@test "E-ticket with signature is generated" {
    # After successful payment, ticket should have signature
    ticket=$(curl -X GET "https://api.busz.local/api/v1/tickets/$TICKET_ID" \
        -H "Authorization: Bearer $JWT_TOKEN")
    
    [ -n "$(echo $ticket | jq '.data.signature_id')" ]
    [ "$(echo $ticket | jq '.data.signature_verified')" = "true" ]
}

@test "Customer can verify ticket signature" {
    signature=$(curl -X POST https://api.busz.local/api/v1/verify \
        -d "{
            \"signature_id\": \"$SIG_ID\",
            \"data\": \"$TICKET_DATA\"
        }")
    
    [ "$(echo $signature | jq '.data.is_valid')" = "true" ]
}
```

---

## 7. Test Automation

### 7.1 GitHub Actions Test Pipeline

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test123
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: 17
        cache: maven
    
    - name: Unit Tests
      run: mvn test
    
    - name: Integration Tests
      run: mvn verify -P integration
    
    - name: Code Coverage
      run: mvn jacoco:report
    
    - name: Upload Coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./target/site/jacoco/jacoco.xml
    
    - name: OWASP Dependency Check
      run: mvn org.owasp:dependency-check-maven:check
    
    - name: SonarQube
      env:
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
      run: mvn sonar:sonar
```

---

## 8. Quality Gates

```yaml
SonarQube Quality Gate:
  - Bugs: 0
  - Code Smells: A (Good)
  - Coverage: > 80%
  - Duplications: < 3%
  - Security Hotspots: All reviewed
  - Vulnerabilities: 0

Security Scan:
  - SAST: No critical issues
  - Dependency: No critical CVEs
  - Container: Trivy scan clean
  - Code Review: 2+ approvals

Performance:
  - API latency p99: < 200ms
  - Database query: < 50ms
  - Cache hit rate: > 80%
```

---

## 9. Test Report Template

```markdown
# Test Report - Card Service v1.0

## Executive Summary
- **Total Tests:** 250
- **Passed:** 248 (99.2%)
- **Failed:** 2 (0.8%)
- **Coverage:** 82%

## Test Breakdown
| Category | Total | Pass | Fail | Coverage |
|----------|-------|------|------|----------|
| Unit | 180 | 180 | 0 | 85% |
| Integration | 50 | 48 | 2 | 80% |
| Security | 15 | 15 | 0 | 90% |
| Performance | 5 | 5 | 0 | 95% |

## Known Issues
1. Test case ID: 248 - Race condition in concurrent card updates
   - Status: Known issue
   - Impact: Low
   - Fix: Implement row-level locking

## Recommendations
- Fix 2 failing integration tests before production deployment
- Increase test coverage to 85%
- Add more edge case scenarios
```

---

**Version:** 1.0  
**Last Updated:** 2026-08-13
