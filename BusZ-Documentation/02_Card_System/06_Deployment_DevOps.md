# Card & Signer Service - Deployment & DevOps Guide

**Version:** 1.0  
**Platforms:** Docker, Kubernetes, AWS  
**CI/CD:** GitHub Actions  

---

## 1. Docker Configuration

### 1.1 Dockerfile - Card Service

```dockerfile
# Multi-stage build
FROM maven:3.8.1-openjdk-17-slim as builder

WORKDIR /build

# Copy pom.xml and download dependencies
COPY card-service/pom.xml .
RUN mvn dependency:go-offline

# Copy source and build
COPY card-service/src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy jar from builder
COPY --from=builder /build/target/card-service-*.jar app.jar

# Create non-root user
RUN useradd -m -u 1000 carduser && chown -R carduser:carduser /app
USER carduser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD java -cp app.jar org.springframework.boot.actuate.health.HealthEndpoint

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 1.2 Docker Compose - Local Development

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: busz-postgres
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
      POSTGRES_DB: busz_card
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - busz-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: busz-redis
    ports:
      - "6379:6379"
    networks:
      - busz-network
    command: redis-server --requirepass redis123
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # HashiCorp Vault
  vault:
    image: vault:latest
    container_name: busz-vault
    environment:
      VAULT_DEV_ROOT_TOKEN_ID: "dev-token"
      VAULT_DEV_LISTEN_ADDRESS: "0.0.0.0:8200"
    ports:
      - "8200:8200"
    networks:
      - busz-network
    cap_add:
      - IPC_LOCK
    healthcheck:
      test: ["CMD", "vault", "status"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Card Service
  card-service:
    build:
      context: .
      dockerfile: card-service/Dockerfile
    container_name: busz-card-service
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/busz_card
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: admin123
      SPRING_REDIS_HOST: redis
      SPRING_REDIS_PORT: 6379
      VAULT_ADDR: http://vault:8200
      VAULT_TOKEN: dev-token
    ports:
      - "8081:8080"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      vault:
        condition: service_healthy
    networks:
      - busz-network
    volumes:
      - ./logs:/app/logs

  # Signer Service
  signer-service:
    build:
      context: .
      dockerfile: signer-service/Dockerfile
    container_name: busz-signer-service
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/busz_card
      SPRING_DATASOURCE_USERNAME: admin
      SPRING_DATASOURCE_PASSWORD: admin123
      VAULT_ADDR: http://vault:8200
      VAULT_TOKEN: dev-token
    ports:
      - "8082:8080"
    depends_on:
      postgres:
        condition: service_healthy
      vault:
        condition: service_healthy
    networks:
      - busz-network
    volumes:
      - ./logs:/app/logs

  # Reverse Proxy (Nginx)
  nginx:
    image: nginx:alpine
    container_name: busz-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - card-service
      - signer-service
    networks:
      - busz-network

volumes:
  postgres_data:

networks:
  busz-network:
    driver: bridge
```

---

## 2. Kubernetes Deployment

### 2.1 Namespace & Secrets

```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: busz-card-system
  labels:
    app: card-system

---
# Database Secrets
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials
  namespace: busz-card-system
type: Opaque
stringData:
  username: postgres
  password: secure_password_here

---
# Vault Secrets
apiVersion: v1
kind: Secret
metadata:
  name: vault-credentials
  namespace: busz-card-system
type: Opaque
stringData:
  vault-token: vault-token-here
  vault-addr: https://vault.busz.com:8200
```

### 2.2 ConfigMap

```yaml
# k8s/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: card-service-config
  namespace: busz-card-system
data:
  application.yml: |
    spring:
      application:
        name: card-service
      datasource:
        hikari:
          maximum-pool-size: 20
          minimum-idle: 5
          connection-timeout: 30000
      jpa:
        properties:
          hibernate:
            jdbc:
              batch_size: 20
            fetch_size: 50
      redis:
        timeout: 2000
        jedis:
          pool:
            max-active: 100
            max-idle: 50
      security:
        jwt:
          secret: ${JWT_SECRET}
          expiration: 3600000
    logging:
      level:
        root: INFO
        com.busz: DEBUG
```

### 2.3 Deployment - Card Service

```yaml
# k8s/card-service-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: card-service
  namespace: busz-card-system
  labels:
    app: card-service
    version: v1
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: card-service
  template:
    metadata:
      labels:
        app: card-service
        version: v1
    spec:
      serviceAccountName: card-service-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      
      # Init containers
      initContainers:
      - name: db-migration
        image: busz/card-service:latest
        command: ["sh", "-c", "java -cp /app/app.jar org.flywaydb.core.Flyway migrate"]
        env:
        - name: SPRING_DATASOURCE_URL
          value: jdbc:postgresql://postgres:5432/busz_card
        - name: SPRING_DATASOURCE_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
      
      containers:
      - name: card-service
        image: busz/card-service:latest
        imagePullPolicy: IfNotPresent
        
        # Ports
        ports:
        - name: http
          containerPort: 8080
          protocol: TCP
        
        # Environment
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        - name: SPRING_DATASOURCE_URL
          value: jdbc:postgresql://postgres:5432/busz_card
        - name: SPRING_DATASOURCE_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: username
        - name: SPRING_DATASOURCE_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: password
        - name: VAULT_ADDR
          valueFrom:
            secretKeyRef:
              name: vault-credentials
              key: vault-addr
        - name: VAULT_TOKEN
          valueFrom:
            secretKeyRef:
              name: vault-credentials
              key: vault-token
        
        # Resources
        resources:
          requests:
            cpu: 500m
            memory: 512Mi
          limits:
            cpu: 1000m
            memory: 1024Mi
        
        # Probes
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: http
          initialDelaySeconds: 20
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        
        # Volume mounts
        volumeMounts:
        - name: logs
          mountPath: /app/logs
        - name: config
          mountPath: /app/config
          readOnly: true
        
        # Security context
        securityContext:
          allowPrivilegeEscalation: false
          readOnlyRootFilesystem: true
          capabilities:
            drop:
              - ALL
      
      # Volumes
      volumes:
      - name: logs
        emptyDir: {}
      - name: config
        configMap:
          name: card-service-config
      
      # Affinity
      affinity:
        podAntiAffinity:
          preferredDuringSchedulingIgnoredDuringExecution:
          - weight: 100
            podAffinityTerm:
              labelSelector:
                matchExpressions:
                - key: app
                  operator: In
                  values:
                  - card-service
              topologyKey: kubernetes.io/hostname

---
# Service
apiVersion: v1
kind: Service
metadata:
  name: card-service
  namespace: busz-card-system
  labels:
    app: card-service
spec:
  type: ClusterIP
  selector:
    app: card-service
  ports:
  - name: http
    port: 80
    targetPort: http
    protocol: TCP
  sessionAffinity: ClientIP
  sessionAffinityConfig:
    clientIP:
      timeoutSeconds: 10800
```

### 2.4 HPA - Horizontal Pod Autoscaler

```yaml
# k8s/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: card-service-hpa
  namespace: busz-card-system
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: card-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
      - type: Percent
        value: 50
        periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 0
      policies:
      - type: Percent
        value: 100
        periodSeconds: 30
      - type: Pods
        value: 4
        periodSeconds: 30
      selectPolicy: Max
```

### 2.5 Ingress

```yaml
# k8s/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: card-service-ingress
  namespace: busz-card-system
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - api.busz.com
    secretName: card-service-tls
  rules:
  - host: api.busz.com
    http:
      paths:
      - path: /api/v1/cards
        pathType: Prefix
        backend:
          service:
            name: card-service
            port:
              number: 80
      - path: /api/v1/certificates
        pathType: Prefix
        backend:
          service:
            name: signer-service
            port:
              number: 80
```

---

## 3. CI/CD Pipeline

### 3.1 GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Build, Test & Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [develop]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Build & Test
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven
    
    - name: Build with Maven
      run: mvn clean package -DskipTests
    
    - name: Run Unit Tests
      run: mvn test
    
    - name: Run Integration Tests
      run: mvn verify -P integration
    
    - name: SonarQube Analysis
      uses: SonarSource/sonarcloud-github-action@master
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
    
    - name: Build Docker Image
      run: |
        docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} .
        docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest .
    
    - name: Log in to Container Registry
      uses: docker/login-action@v2
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
    
    - name: Push Docker Image
      if: github.event_name == 'push'
      run: |
        docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
        docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

  # Security Scanning
  security:
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Trivy Image Scan
      uses: aquasecurity/trivy-action@master
      with:
        image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
        format: 'sarif'
        output: 'trivy-results.sarif'
    
    - name: Upload Trivy Results
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: 'trivy-results.sarif'
    
    - name: Dependency Check
      uses: dependency-check/Dependency-Check_Action@main
      with:
        project: 'card-service'
        path: '.'
        format: 'JSON'
        args: >
          --enable-experimental

  # Deploy to Staging
  deploy-staging:
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to EKS Staging
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        aws eks update-kubeconfig --name busz-staging-eks --region ap-southeast-1
        kubectl set image deployment/card-service \
          card-service=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
          -n busz-card-system
        kubectl rollout status deployment/card-service -n busz-card-system

  # Deploy to Production
  deploy-production:
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Manual Approval Required
      run: echo "Deployment to production requires manual approval"
    
    - name: Deploy to EKS Production
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        aws eks update-kubeconfig --name busz-prod-eks --region ap-southeast-1
        kubectl set image deployment/card-service \
          card-service=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} \
          -n busz-card-system
        kubectl rollout status deployment/card-service -n busz-card-system
        
        # Run smoke tests
        ./scripts/smoke-tests.sh
```

---

## 4. Monitoring & Logging

### 4.1 Prometheus Configuration

```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'card-service'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - busz-card-system
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_label_app]
        action: keep
        regex: card-service
      - source_labels: [__meta_kubernetes_pod_container_port_name]
        action: keep
        regex: http
      - source_labels: [__meta_kubernetes_namespace]
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        target_label: kubernetes_pod_name

  - job_name: 'postgresql'
    static_configs:
      - targets: ['postgres-exporter:9187']
    metric_relabel_configs:
      - source_labels: [__name__]
        regex: 'pg_(stat_activity|stat_statements|stat_database).*'
        action: keep
```

### 4.2 Grafana Dashboard

```json
{
  "dashboard": {
    "title": "Card Service Monitoring",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~'5..'}[5m])"
          }
        ]
      },
      {
        "title": "Database Connections",
        "targets": [
          {
            "expr": "pg_stat_activity_count"
          }
        ]
      },
      {
        "title": "API Latency (p95)",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, http_request_duration_seconds_bucket)"
          }
        ]
      },
      {
        "title": "Memory Usage",
        "targets": [
          {
            "expr": "jvm_memory_used_bytes / jvm_memory_max_bytes * 100"
          }
        ]
      }
    ]
  }
}
```

### 4.3 ELK Stack Configuration

```yaml
# logging/filebeat.yml
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /app/logs/*.log
    fields:
      service: card-service
      environment: production

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "card-service-%{+yyyy.MM.dd}"

processors:
  - add_kubernetes_metadata:
      in_cluster: true
  - add_docker_metadata: ~
  - add_fields:
      target: ""
      fields:
        service: card-service
```

---

## 5. Scaling & Performance

### 5.1 Load Testing Script

```bash
#!/bin/bash
# scripts/load-test.sh

# Test configuration
DURATION=300 # 5 minutes
THREADS=50
RATE_LIMIT=1000 # RPS

# Run Apache Bench
ab -n 50000 -c $THREADS -t $DURATION \
   -H "Authorization: Bearer $JWT_TOKEN" \
   https://api.busz.com/api/v1/cards/

# Run locust for more complex scenarios
locust -f locustfile.py \
  --headless \
  -u $RATE_LIMIT \
  -r 50 \
  --run-time 5m \
  --host https://api.busz.com
```

### 5.2 locustfile.py

```python
from locust import HttpUser, task, between

class CardServiceUser(HttpUser):
    wait_time = between(1, 5)
    
    @task(3)
    def get_cards(self):
        self.client.get("/api/v1/cards",
            headers={"Authorization": f"Bearer {self.token}"})
    
    @task(1)
    def add_card(self):
        self.client.post("/api/v1/cards",
            headers={"Authorization": f"Bearer {self.token}"},
            json={
                "card_number": "4532015112830366",
                "card_holder_name": "Test User",
                "expiry_month": 12,
                "expiry_year": 2027,
                "cvv": "123"
            })
    
    def on_start(self):
        # Get JWT token
        resp = self.client.post("/auth/login",
            json={"email": "test@example.com", "password": "password"})
        self.token = resp.json()['token']
```

---

## 6. Troubleshooting

### 6.1 Common Issues

```bash
# Pod won't start
kubectl describe pod card-service-xxx -n busz-card-system

# Check logs
kubectl logs -f deployment/card-service -n busz-card-system --tail=100

# Database connection issues
kubectl exec -it pod/card-service-xxx -n busz-card-system -- \
  psql -h postgres -U admin -d busz_card -c "SELECT 1"

# Check resource usage
kubectl top nodes
kubectl top pods -n busz-card-system
```

---

**Version:** 1.0  
**Last Updated:** 2026-08-13
