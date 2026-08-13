# Getting Started - Card & Signer Service

**For:** Development Team (antiravity)  
**Duration:** 30 minutes to first deployment  

---

## 1. Quick Setup (5 minutes)

```bash
# Clone repository
git clone https://github.com/busz/card-signer-service.git
cd card-signer-service

# Copy environment variables
cp .env.example .env

# Edit .env with your settings
nano .env

# Start with Docker Compose
docker-compose up -d

# Wait for services to be ready
docker-compose ps

# Verify setup
curl -X GET http://localhost:8081/actuator/health \
  -H "Authorization: Bearer <JWT>"
```

---

## 2. Project Structure

```
card-signer-service/
├── card-service/              # Card management service
│   ├── src/main/java/com/busz/card/
│   ├── pom.xml
│   └── Dockerfile
├── signer-service/            # Digital signature service
│   ├── src/main/java/com/busz/signer/
│   ├── pom.xml
│   └── Dockerfile
├── android/                   # Kotlin Android app
│   ├── app/src/main/kotlin/
│   └── build.gradle
├── tests/                     # Test files
├── kubernetes/                # K8s manifests
├── scripts/                   # Utility scripts
├── docs/                      # Documentation
└── docker-compose.yml
```

---

## 3. Development Workflow

### Phase 1: Card Service (Weeks 1-2)

```bash
# 1. Navigate to card service
cd card-service

# 2. Build and run tests
mvn clean install

# 3. Start the service
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"

# 4. Check API
curl -X GET http://localhost:8081/api/v1/cards \
  -H "Authorization: Bearer $JWT_TOKEN"

# 5. Run integration tests
mvn verify -P integration
```

### Phase 2: Signer Service (Weeks 3-4)

```bash
# Similar to Card Service
cd signer-service

mvn clean install
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=dev"
mvn verify -P integration
```

### Phase 3: Integration Testing (Weeks 5-6)

```bash
# Run end-to-end tests
cd tests
mvn test -P e2e

# Run performance tests
./scripts/load-test.sh

# Run security tests
./scripts/security-test.sh
```

### Phase 4: Mobile Development (Weeks 7-8)

```bash
# Navigate to Android project
cd android

# Build APK
./gradlew assembleDebug

# Run tests
./gradlew testDebug

# Install on emulator
./gradlew installDebug
```

---

## 4. Local Development Setup

### PostgreSQL Setup

```bash
# Create database
psql -U postgres
CREATE DATABASE busz_card;
CREATE USER busz_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE busz_card TO busz_user;

# Or use Docker
docker run --name postgres-busz \
  -e POSTGRES_DB=busz_card \
  -e POSTGRES_PASSWORD=secure_password \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### Vault Setup

```bash
# Using Docker
docker run --name vault-busz \
  -e VAULT_DEV_ROOT_TOKEN_ID="dev-token" \
  -p 8200:8200 \
  -d vault:latest

# Store a test secret
curl -X POST http://localhost:8200/v1/secret/data/card-service/test \
  -H "X-Vault-Token: dev-token" \
  -d '{"data":{"key":"value"}}'
```

### Redis Setup

```bash
# Using Docker
docker run --name redis-busz \
  -p 6379:6379 \
  -d redis:7-alpine
```

---

## 5. First API Call

```bash
# 1. Get JWT token (mock auth for dev)
JWT_TOKEN=$(curl -X POST http://localhost:8081/auth/dev-login \
  -H "Content-Type: application/json" \
  -d '{"username":"dev-user","password":"dev"}' \
  | jq -r '.token')

echo "JWT Token: $JWT_TOKEN"

# 2. Add a card
curl -X POST http://localhost:8081/api/v1/cards \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "card_number": "4532015112830366",
    "card_holder_name": "John Nguyen",
    "expiry_month": 12,
    "expiry_year": 2027,
    "cvv": "123"
  }' | jq

# 3. List cards
curl -X GET http://localhost:8081/api/v1/cards \
  -H "Authorization: Bearer $JWT_TOKEN" | jq

# 4. Sign a transaction
curl -X POST http://localhost:8082/api/v1/sign \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "entity_type": "TRANSACTION",
    "entity_id": "550e8400-e29b-41d4-a716-446655440000",
    "data": "base64-encoded-transaction-data"
  }' | jq
```

---

## 6. Database Migrations

```bash
# Migrations run automatically on startup
# If you need to run manually:

mvn flyway:info
mvn flyway:migrate
mvn flyway:validate

# Check migration status
psql -U busz_user -d busz_card -c "SELECT * FROM flyway_schema_history;"
```

---

## 7. Common Issues & Solutions

### Issue: Connection to PostgreSQL failed

```bash
# Solution 1: Check if PostgreSQL is running
docker ps | grep postgres

# Solution 2: Verify connection string in .env
echo $SPRING_DATASOURCE_URL

# Solution 3: Reset database
docker-compose down -v
docker-compose up -d postgres
```

### Issue: Vault connection refused

```bash
# Solution: Start Vault
docker-compose up -d vault

# Verify Vault is running
curl http://localhost:8200/v1/sys/health
```

### Issue: Tests failing with timeout

```bash
# Increase timeout in testcontainers.properties
echo "testcontainers.reuse.enable=true" > ~/.testcontainers.properties

# Re-run tests
mvn clean test
```

### Issue: Port already in use

```bash
# Find and kill process using port 8081
lsof -i :8081
kill -9 <PID>

# Or use different port
export SERVER_PORT=8090
mvn spring-boot:run
```

---

## 8. IDE Setup

### IntelliJ IDEA
```
1. Open project
2. File → Project Structure
3. Set JDK to Java 17
4. Enable annotation processing
5. Install Lombok plugin
6. Run → Edit Configurations → Add Spring Boot
7. Set active profile: dev
8. Click Run
```

### VS Code
```
1. Install extensions:
   - Extension Pack for Java
   - Spring Boot Extension Pack
   - Docker
   - REST Client

2. Create .vscode/launch.json
3. Use Java: Start Debugging
```

---

## 9. Useful Commands

```bash
# Build all services
mvn clean package -DskipTests

# Run specific test
mvn test -Dtest=CardServiceTest

# Generate code coverage report
mvn clean test jacoco:report

# Format code
mvn spotless:apply

# Check for vulnerabilities
mvn dependency-check:check

# Create Docker image
mvn spring-boot:build-image

# Deploy to K8s
kubectl apply -f kubernetes/

# View logs
docker-compose logs -f card-service

# Access database
docker exec -it postgres-busz psql -U busz_user -d busz_card
```

---

## 10. Next Steps

1. ✅ **Setup complete** → Run first API call (section 5)
2. ✅ **Understand structure** → Read API Specification (02_API_Specification.md)
3. ✅ **Start coding** → Follow Implementation Guide (03_Implementation_Guide.md)
4. ✅ **Write tests** → Use Testing & QA Guide (08_Testing_QA_Guide.md)
5. ✅ **Deploy** → Follow Deployment Guide (06_Deployment_DevOps.md)

---

## 11. Resources

- **API Docs:** http://localhost:8081/swagger-ui.html
- **Database UI:** http://localhost:5050 (pgAdmin)
- **Vault UI:** http://localhost:8200/ui
- **Prometheus:** http://localhost:9090
- **Grafana:** http://localhost:3000

---

## 12. Support Contacts

- **Backend Issues:** contact-backend@busz.com
- **Mobile Issues:** contact-mobile@busz.com
- **DevOps Issues:** contact-devops@busz.com
- **Slack Channel:** #card-signer-dev

---

**Ready to start? Let's go! 🚀**

For detailed documentation, see:
- Architecture: 01_Card_System_Overview.md
- API Reference: 02_API_Specification.md
- Security: 04_Security_Architecture.md
- Deployment: 06_Deployment_DevOps.md

---

**Document Version:** 1.0  
**Last Updated:** 2026-08-13
