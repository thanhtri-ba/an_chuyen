# Card & Signer Service - Database Migration

**Version:** 1.0  
**Database:** PostgreSQL 14+  
**ORM:** Hibernate/JPA  
**Migration Tool:** Flyway  

---

## 1. Flyway Configuration

### 1.1 Flyway Setup

```yaml
# application.yml
spring:
  flyway:
    enabled: true
    baselineOnMigrate: true
    baselineVersion: 1.0
    locations: classpath:db/migration
    outOfOrder: false
    validateOnMigrate: true
    sqlMigrationPrefix: V
    sqlMigrationSeparator: __
    sqlMigrationSuffix: .sql
```

### 1.2 Project Structure

```
src/main/resources/db/migration/
├── V1.0__Initial_Card_Tables.sql
├── V1.1__Initial_Signer_Tables.sql
├── V1.2__Initial_Wallet_Tables.sql
├── V1.3__Add_Indexes.sql
├── V1.4__Add_Constraints.sql
└── V2.0__Add_Audit_Tables.sql
```

---

## 2. Migration Scripts

### 2.1 V1.0__Initial_Card_Tables.sql

```sql
-- ============================================================================
-- CARD SERVICE TABLES
-- ============================================================================

-- Create enum types
CREATE TYPE card_type AS ENUM ('VISA', 'MASTERCARD', 'AMEX', 'DISCOVER');
CREATE TYPE card_status AS ENUM ('ACTIVE', 'EXPIRED', 'BLOCKED', 'DELETED');

-- Cards table
CREATE TABLE IF NOT EXISTS cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Card Details
    card_token VARCHAR(255) UNIQUE NOT NULL,
    last_four CHAR(4) NOT NULL,
    card_type card_type NOT NULL,
    issuer VARCHAR(50),
    card_holder_name VARCHAR(100) NOT NULL,
    
    -- Expiry
    expiry_month INTEGER NOT NULL CHECK (expiry_month >= 1 AND expiry_month <= 12),
    expiry_year INTEGER NOT NULL CHECK (expiry_year >= 2026),
    
    -- Encrypted Data
    encrypted_data TEXT NOT NULL,
    
    -- Flags
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    card_status card_status NOT NULL DEFAULT 'ACTIVE',
    
    -- Metadata
    card_nickname VARCHAR(50),
    fingerprint VARCHAR(64) UNIQUE, -- For duplicate detection
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_cards_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Card Transactions table
CREATE TABLE IF NOT EXISTS card_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id UUID NOT NULL,
    booking_id UUID NOT NULL,
    
    -- Transaction Details
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    
    -- Gateway Reference
    transaction_reference VARCHAR(255) UNIQUE,
    gateway_response JSONB,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_card_trans_card FOREIGN KEY (card_id) 
        REFERENCES cards(id) ON DELETE RESTRICT,
    CONSTRAINT fk_card_trans_booking FOREIGN KEY (booking_id) 
        REFERENCES bookings(id) ON DELETE RESTRICT
);

-- Card Wallet table
CREATE TABLE IF NOT EXISTS card_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    
    -- Balance
    balance DECIMAL(12, 2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    
    -- Metadata
    wallet_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    
    -- Timestamps
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Wallet Transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_id UUID NOT NULL,
    
    -- Transaction Details
    transaction_type VARCHAR(20) NOT NULL, -- TOPUP, PAYMENT, TRANSFER, REFUND, BONUS
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    
    -- For transfers
    from_wallet_id UUID,
    to_wallet_id UUID,
    transfer_note TEXT,
    
    -- Reference
    reference_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_wallet_trans_wallet FOREIGN KEY (wallet_id) 
        REFERENCES card_wallets(id) ON DELETE CASCADE
);

-- Create comments
COMMENT ON TABLE cards IS 'Stores tokenized card information for users';
COMMENT ON TABLE card_transactions IS 'Records all card transactions and payments';
COMMENT ON TABLE card_wallets IS 'User wallet balance and status';
COMMENT ON TABLE wallet_transactions IS 'Wallet transaction history';

-- Insert audit log
INSERT INTO schema_version (version, description, installed_on, execution_time, success)
VALUES (1.0, 'Initial Card Tables', CURRENT_TIMESTAMP, 0, true);
```

### 2.2 V1.1__Initial_Signer_Tables.sql

```sql
-- ============================================================================
-- DIGITAL SIGNER TABLES
-- ============================================================================

-- Create enum types
CREATE TYPE certificate_status AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED', 'SUSPENDED');
CREATE TYPE signature_status AS ENUM ('PENDING', 'VALID', 'INVALID', 'EXPIRED');

-- User Certificates table
CREATE TABLE IF NOT EXISTS user_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Certificate Data (PEM format)
    certificate_data TEXT NOT NULL,
    public_key TEXT NOT NULL,
    private_key_vault_ref VARCHAR(255) NOT NULL, -- Reference to Vault
    
    -- Certificate Details
    common_name VARCHAR(255) NOT NULL,
    organization VARCHAR(100),
    country VARCHAR(2),
    subject_dn VARCHAR(500) NOT NULL,
    issuer_dn VARCHAR(500) NOT NULL,
    serial_number VARCHAR(255) NOT NULL,
    
    -- Status
    status certificate_status NOT NULL DEFAULT 'ACTIVE',
    
    -- Validity Period
    issued_at TIMESTAMP NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    
    -- Key Info
    key_algorithm VARCHAR(50) NOT NULL DEFAULT 'RSA',
    key_size INTEGER NOT NULL DEFAULT 2048,
    
    -- Revocation
    revoked_at TIMESTAMP,
    revocation_reason VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_cert_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Digital Signatures table
CREATE TABLE IF NOT EXISTS digital_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Entity Being Signed
    entity_type VARCHAR(50) NOT NULL, -- TICKET, TRANSACTION, DOCUMENT, etc.
    entity_id UUID NOT NULL,
    
    -- Signature Data
    signature TEXT NOT NULL, -- Base64 encoded
    algorithm VARCHAR(50) NOT NULL DEFAULT 'SHA256WithRSA',
    
    -- Certificate Reference
    public_key_id UUID NOT NULL,
    
    -- Timestamp
    signature_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Verification
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_timestamp TIMESTAMP,
    verification_status signature_status,
    verification_note TEXT,
    
    -- Hash for integrity
    content_hash VARCHAR(64) NOT NULL,
    hash_algorithm VARCHAR(20) DEFAULT 'SHA256',
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Keys
    CONSTRAINT fk_sig_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_sig_cert FOREIGN KEY (public_key_id) 
        REFERENCES user_certificates(id) ON DELETE RESTRICT
);

-- Signature Audit Log table
CREATE TABLE IF NOT EXISTS signature_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signature_id UUID NOT NULL,
    
    -- What was audited
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Audit Details
    action VARCHAR(50) NOT NULL, -- CREATED, VERIFIED, REVOKED, etc.
    status VARCHAR(20) NOT NULL, -- SUCCESS, FAILED, etc.
    
    -- Who did it
    audited_by VARCHAR(100),
    audited_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Details
    details JSONB, -- Any additional information
    error_message TEXT,
    
    -- Foreign Key
    CONSTRAINT fk_audit_sig FOREIGN KEY (signature_id) 
        REFERENCES digital_signatures(id) ON DELETE CASCADE
);

-- Timestamp Authority Responses table
CREATE TABLE IF NOT EXISTS timestamp_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Request Details
    data_hash VARCHAR(64) NOT NULL,
    hash_algorithm VARCHAR(20) NOT NULL,
    
    -- Timestamp
    timestamp TIMESTAMP NOT NULL,
    timestamp_token TEXT NOT NULL, -- Base64 encoded
    tsa_certificate TEXT, -- TSA's certificate
    
    -- Validity
    accuracy_microseconds INTEGER,
    ordering BOOLEAN DEFAULT FALSE,
    nonce BIGINT,
    
    -- Status
    verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Certificate Revocation List (CRL) table
CREATE TABLE IF NOT EXISTS certificate_revocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id UUID NOT NULL,
    
    -- Revocation Details
    revocation_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revocation_reason VARCHAR(100),
    
    -- CRL Entry
    serial_number VARCHAR(255) NOT NULL,
    
    -- When it was added to CRL
    added_to_crl_at TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_revoke_cert FOREIGN KEY (certificate_id) 
        REFERENCES user_certificates(id) ON DELETE CASCADE
);

-- Create comments
COMMENT ON TABLE user_certificates IS 'Stores user X.509 certificates for digital signatures';
COMMENT ON TABLE digital_signatures IS 'Records all digital signatures with verification status';
COMMENT ON TABLE signature_audit_logs IS 'Audit trail for signature operations';
COMMENT ON TABLE timestamp_responses IS 'Timestamp tokens from TSA for non-repudiation';
COMMENT ON TABLE certificate_revocations IS 'Revoked certificates tracking';
```

### 2.3 V1.2__Initial_Wallet_Tables.sql

```sql
-- ============================================================================
-- WALLET ENHANCEMENT TABLES
-- ============================================================================

-- Gift Cards table
CREATE TABLE IF NOT EXISTS gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Gift Card Details
    code VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'VND',
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, USED, EXPIRED, CANCELLED
    
    -- Issued
    issued_by UUID,
    issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Used
    used_by UUID,
    used_at TIMESTAMP,
    
    -- Expiry
    expires_at TIMESTAMP NOT NULL,
    
    -- Metadata
    description TEXT,
    
    -- Foreign Keys
    CONSTRAINT fk_gift_issued_by FOREIGN KEY (issued_by) 
        REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_gift_used_by FOREIGN KEY (used_by) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- Loyalty Points table
CREATE TABLE IF NOT EXISTS loyalty_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    
    -- Points
    total_points BIGINT NOT NULL DEFAULT 0 CHECK (total_points >= 0),
    available_points BIGINT NOT NULL DEFAULT 0,
    pending_points BIGINT NOT NULL DEFAULT 0,
    
    -- Membership Level
    membership_level VARCHAR(20) DEFAULT 'BRONZE', -- BRONZE, SILVER, GOLD, PLATINUM
    
    -- Metadata
    last_earned_at TIMESTAMP,
    last_redeemed_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_loyalty_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE
);

-- Loyalty Transactions table
CREATE TABLE IF NOT EXISTS loyalty_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    loyalty_id UUID NOT NULL,
    
    -- Transaction Type
    transaction_type VARCHAR(20) NOT NULL, -- EARN, SPEND, EXPIRE, ADJUST, BONUS
    
    -- Points
    points_amount BIGINT NOT NULL,
    
    -- Reference
    reference_id VARCHAR(255),
    reference_type VARCHAR(50), -- BOOKING, REFUND, ADMIN_ADJUSTMENT, etc.
    
    -- Description
    description TEXT,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    -- Foreign Key
    CONSTRAINT fk_loyalty_trans FOREIGN KEY (loyalty_id) 
        REFERENCES loyalty_points(id) ON DELETE CASCADE
);

-- Create comments
COMMENT ON TABLE gift_cards IS 'Gift cards for promotional purposes';
COMMENT ON TABLE loyalty_points IS 'User loyalty points and membership levels';
COMMENT ON TABLE loyalty_transactions IS 'Loyalty points transaction history';
```

### 2.4 V1.3__Add_Indexes.sql

```sql
-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Card Indexes
CREATE INDEX idx_cards_user_id ON cards(user_id);
CREATE INDEX idx_cards_token ON cards(card_token);
CREATE INDEX idx_cards_user_default ON cards(user_id, is_default) WHERE deleted_at IS NULL;
CREATE INDEX idx_cards_expiry ON cards(expiry_year, expiry_month) WHERE card_status != 'EXPIRED';

-- Card Transaction Indexes
CREATE INDEX idx_card_trans_card_id ON card_transactions(card_id);
CREATE INDEX idx_card_trans_booking_id ON card_transactions(booking_id);
CREATE INDEX idx_card_trans_status ON card_transactions(status);
CREATE INDEX idx_card_trans_created ON card_transactions(created_at DESC);

-- Wallet Indexes
CREATE INDEX idx_wallet_user_id ON card_wallets(user_id);
CREATE INDEX idx_wallet_status ON card_wallets(wallet_status);

-- Wallet Transaction Indexes
CREATE INDEX idx_wallet_trans_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_wallet_trans_type ON wallet_transactions(transaction_type);
CREATE INDEX idx_wallet_trans_created ON wallet_transactions(created_at DESC);
CREATE INDEX idx_wallet_trans_status ON wallet_transactions(status);

-- Certificate Indexes
CREATE INDEX idx_cert_user_id ON user_certificates(user_id);
CREATE INDEX idx_cert_status ON user_certificates(status);
CREATE INDEX idx_cert_expires ON user_certificates(expires_at) WHERE status = 'ACTIVE';
CREATE INDEX idx_cert_serial ON user_certificates(serial_number);

-- Signature Indexes
CREATE INDEX idx_sig_user_id ON digital_signatures(user_id);
CREATE INDEX idx_sig_entity ON digital_signatures(entity_type, entity_id);
CREATE INDEX idx_sig_timestamp ON digital_signatures(signature_timestamp DESC);
CREATE INDEX idx_sig_verified ON digital_signatures(is_verified);
CREATE INDEX idx_sig_cert ON digital_signatures(public_key_id);

-- Audit Log Indexes
CREATE INDEX idx_audit_sig_id ON signature_audit_logs(signature_id);
CREATE INDEX idx_audit_created ON signature_audit_logs(audited_at DESC);
CREATE INDEX idx_audit_action ON signature_audit_logs(action);

-- Timestamp Indexes
CREATE INDEX idx_timestamp_hash ON timestamp_responses(data_hash);
CREATE INDEX idx_timestamp_created ON timestamp_responses(created_at DESC);

-- Loyalty Indexes
CREATE INDEX idx_loyalty_user ON loyalty_points(user_id);
CREATE INDEX idx_loyalty_level ON loyalty_points(membership_level);
CREATE INDEX idx_loyalty_trans_loyalty ON loyalty_transactions(loyalty_id);
CREATE INDEX idx_loyalty_trans_type ON loyalty_transactions(transaction_type);
CREATE INDEX idx_loyalty_trans_created ON loyalty_transactions(created_at DESC);
```

### 2.5 V1.4__Add_Constraints.sql

```sql
-- ============================================================================
-- CONSTRAINTS & TRIGGERS
-- ============================================================================

-- Trigger: Update card updated_at timestamp
CREATE OR REPLACE FUNCTION update_card_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_card_update_timestamp
BEFORE UPDATE ON cards
FOR EACH ROW
EXECUTE FUNCTION update_card_timestamp();

-- Trigger: Validate card expiry
CREATE OR REPLACE FUNCTION validate_card_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.expiry_year < EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER OR
       (NEW.expiry_year = EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER AND
        NEW.expiry_month < EXTRACT(MONTH FROM CURRENT_DATE)::INTEGER) THEN
        NEW.card_status = 'EXPIRED';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_card_validate_expiry
BEFORE INSERT OR UPDATE ON cards
FOR EACH ROW
EXECUTE FUNCTION validate_card_expiry();

-- Trigger: Update wallet when transaction completes
CREATE OR REPLACE FUNCTION update_wallet_on_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'SUCCESS' AND OLD.status != 'SUCCESS' THEN
        UPDATE card_wallets
        SET balance = balance - NEW.amount
        WHERE id = (SELECT wallet_id FROM card_wallets 
                   WHERE user_id = NEW.user_id LIMIT 1);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_wallet_update
AFTER UPDATE ON wallet_transactions
FOR EACH ROW
WHEN (NEW.status != OLD.status)
EXECUTE FUNCTION update_wallet_on_transaction();

-- Trigger: Auto-verify signature status
CREATE OR REPLACE FUNCTION update_signature_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Mark as expired if certificate is expired
    IF NEW.is_verified AND 
       EXISTS (SELECT 1 FROM user_certificates 
               WHERE id = NEW.public_key_id AND expires_at < CURRENT_TIMESTAMP) THEN
        NEW.verification_status = 'EXPIRED';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_signature_status
BEFORE UPDATE ON digital_signatures
FOR EACH ROW
EXECUTE FUNCTION update_signature_status();

-- Trigger: Add to CRL when certificate revoked
CREATE OR REPLACE FUNCTION add_to_crl_on_revoke()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'REVOKED' AND OLD.status != 'REVOKED' THEN
        INSERT INTO certificate_revocations 
        (certificate_id, serial_number, revocation_time)
        VALUES (NEW.id, NEW.serial_number, CURRENT_TIMESTAMP);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_add_to_crl
BEFORE UPDATE ON user_certificates
FOR EACH ROW
EXECUTE FUNCTION add_to_crl_on_revoke();

-- Constraint: Ensure only one default card per user
CREATE UNIQUE INDEX idx_unique_default_card 
ON cards(user_id) 
WHERE is_default = true AND deleted_at IS NULL;

-- Constraint: Card token should not be empty
ALTER TABLE cards 
ADD CONSTRAINT ck_card_token_not_empty 
CHECK (TRIM(card_token) != '');

-- Constraint: Certificate validity period
ALTER TABLE user_certificates 
ADD CONSTRAINT ck_cert_expiry 
CHECK (expires_at > issued_at);

-- Constraint: Signature data should not be empty
ALTER TABLE digital_signatures 
ADD CONSTRAINT ck_signature_not_empty 
CHECK (TRIM(signature) != '');
```

### 2.6 V2.0__Add_Audit_Tables.sql

```sql
-- ============================================================================
-- AUDIT & COMPLIANCE TABLES
-- ============================================================================

-- Comprehensive Audit Log table
CREATE TABLE IF NOT EXISTS card_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    
    -- What happened
    action VARCHAR(50) NOT NULL, -- CREATE, READ, UPDATE, DELETE, etc.
    entity_type VARCHAR(50) NOT NULL, -- CARD, TRANSACTION, CERTIFICATE, etc.
    entity_id UUID,
    
    -- Who did it
    performed_by VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    
    -- Details
    changes JSONB, -- Before and after values
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, FAILED
    error_message TEXT,
    
    -- Timestamp
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Immutable log
    log_hash VARCHAR(64), -- SHA256 of log entry for integrity
    
    -- Foreign Key
    CONSTRAINT fk_audit_log_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- Compliance Events table
CREATE TABLE IF NOT EXISTS compliance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Event
    event_type VARCHAR(50) NOT NULL, -- PCI_SCAN, PENETRATION_TEST, etc.
    description TEXT,
    
    -- Result
    result VARCHAR(20) NOT NULL, -- PASSED, FAILED, WARNING
    findings TEXT,
    
    -- Dates
    scheduled_date DATE,
    executed_date DATE NOT NULL,
    
    -- Evidence
    report_url VARCHAR(255),
    report_hash VARCHAR(64),
    
    -- Timestamps
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for audit
CREATE INDEX idx_audit_log_user ON card_audit_logs(user_id);
CREATE INDEX idx_audit_log_action ON card_audit_logs(action);
CREATE INDEX idx_audit_log_entity ON card_audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_log_created ON card_audit_logs(created_at DESC);
CREATE INDEX idx_compliance_type ON compliance_events(event_type);
CREATE INDEX idx_compliance_date ON compliance_events(executed_date DESC);

-- Create comments
COMMENT ON TABLE card_audit_logs IS 'Immutable audit trail for all card operations';
COMMENT ON TABLE compliance_events IS 'Compliance testing and audit results';
```

---

## 3. Rollback Scripts

### 3.1 V1.0__Rollback.sql

```sql
-- Rollback V1.0
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS card_wallets CASCADE;
DROP TABLE IF EXISTS card_transactions CASCADE;
DROP TABLE IF EXISTS cards CASCADE;

DROP TYPE IF EXISTS card_status;
DROP TYPE IF EXISTS card_type;
```

### 3.2 Rollback All

```sql
-- Complete rollback
DROP TABLE IF EXISTS compliance_events CASCADE;
DROP TABLE IF EXISTS card_audit_logs CASCADE;
DROP TABLE IF EXISTS certificate_revocations CASCADE;
DROP TABLE IF EXISTS timestamp_responses CASCADE;
DROP TABLE IF EXISTS signature_audit_logs CASCADE;
DROP TABLE IF EXISTS digital_signatures CASCADE;
DROP TABLE IF EXISTS user_certificates CASCADE;
DROP TABLE IF EXISTS loyalty_transactions CASCADE;
DROP TABLE IF EXISTS loyalty_points CASCADE;
DROP TABLE IF EXISTS gift_cards CASCADE;
DROP TABLE IF EXISTS wallet_transactions CASCADE;
DROP TABLE IF EXISTS card_wallets CASCADE;
DROP TABLE IF EXISTS card_transactions CASCADE;
DROP TABLE IF EXISTS cards CASCADE;

DROP TYPE IF EXISTS signature_status;
DROP TYPE IF EXISTS certificate_status;
DROP TYPE IF EXISTS card_status;
DROP TYPE IF EXISTS card_type;

DROP FUNCTION IF EXISTS update_card_timestamp();
DROP FUNCTION IF EXISTS validate_card_expiry();
DROP FUNCTION IF EXISTS update_wallet_on_transaction();
DROP FUNCTION IF EXISTS update_signature_status();
DROP FUNCTION IF EXISTS add_to_crl_on_revoke();
```

---

## 4. Data Migration

### 4.1 Migrate from Legacy Payment System

```sql
-- Migrate existing payment history to card transactions
INSERT INTO card_transactions (
    id, card_id, booking_id, amount, currency, 
    status, transaction_reference, created_at, updated_at
)
SELECT 
    uuid_generate_v4(),
    NULL, -- Will be filled during cleanup
    booking_id,
    amount,
    currency,
    CASE WHEN payment_status = 'SUCCESS' THEN 'SUCCESS' 
         ELSE 'FAILED' END,
    gateway_transaction_id,
    created_at,
    updated_at
FROM legacy_payments
WHERE created_at >= '2026-08-01';

-- Initialize wallets for existing users
INSERT INTO card_wallets (id, user_id, balance, currency, last_updated)
SELECT 
    uuid_generate_v4(),
    id,
    0,
    'VND',
    CURRENT_TIMESTAMP
FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM card_wallets);

-- Migrate loyalty points from old system
INSERT INTO loyalty_points (user_id, total_points, available_points, membership_level)
SELECT 
    user_id,
    old_points_balance,
    old_points_balance,
    CASE 
        WHEN old_points_balance < 100 THEN 'BRONZE'
        WHEN old_points_balance < 500 THEN 'SILVER'
        WHEN old_points_balance < 1000 THEN 'GOLD'
        ELSE 'PLATINUM'
    END
FROM legacy_loyalty_accounts;
```

---

## 5. Verification Queries

### 5.1 Verify Migration Success

```sql
-- Check all tables created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check record counts
SELECT 'cards' as table_name, COUNT(*) as row_count FROM cards
UNION ALL
SELECT 'user_certificates', COUNT(*) FROM user_certificates
UNION ALL
SELECT 'digital_signatures', COUNT(*) FROM digital_signatures
UNION ALL
SELECT 'card_wallets', COUNT(*) FROM card_wallets
UNION ALL
SELECT 'loyalty_points', COUNT(*) FROM loyalty_points;

-- Check indexes
SELECT schemaname, tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
ORDER BY tablename, indexname;

-- Check triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public' 
ORDER BY event_object_table;

-- Verify data integrity
-- No duplicate default cards
SELECT user_id, COUNT(*) 
FROM cards 
WHERE is_default = true AND deleted_at IS NULL 
GROUP BY user_id 
HAVING COUNT(*) > 1;

-- No users with negative wallet balance
SELECT * FROM card_wallets WHERE balance < 0;

-- No expired certificates marked as ACTIVE
SELECT * FROM user_certificates 
WHERE status = 'ACTIVE' AND expires_at < CURRENT_TIMESTAMP;
```

---

## 6. Performance Tuning

### 6.1 Analyze Tables

```sql
-- Analyze tables for query optimizer
ANALYZE cards;
ANALYZE card_transactions;
ANALYZE user_certificates;
ANALYZE digital_signatures;
ANALYZE card_wallets;
ANALYZE wallet_transactions;
ANALYZE loyalty_points;

-- Check table statistics
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 6.2 Vacuum Settings

```yaml
# postgresql.conf
autovacuum = on
autovacuum_naptime = 10s
autovacuum_vacuum_threshold = 50
autovacuum_vacuum_scale_factor = 0.1
autovacuum_analyze_threshold = 50
autovacuum_analyze_scale_factor = 0.05
```

---

## 7. Backup Strategy

### 7.1 Backup Script

```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/backups/busz-card-db"
DB_NAME="busz_card"
DB_USER="postgres"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Full backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME -F c \
    -f "$BACKUP_DIR/busz_card_$TIMESTAMP.dump"

# Verify backup
pg_restore -d postgres --list "$BACKUP_DIR/busz_card_$TIMESTAMP.dump" > /dev/null

if [ $? -eq 0 ]; then
    echo "Backup successful: busz_card_$TIMESTAMP.dump"
    # Compress old backups
    gzip "$BACKUP_DIR"/busz_card_*.dump
else
    echo "Backup failed!"
    exit 1
fi
```

### 7.2 Restore Script

```bash
#!/bin/bash
# restore-database.sh

BACKUP_FILE=$1
DB_NAME="busz_card"

pg_restore -h localhost -U postgres -d $DB_NAME -v "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Restore successful"
else
    echo "Restore failed!"
    exit 1
fi
```

---

## 8. Maintenance Tasks

### 8.1 Weekly Maintenance

```sql
-- Analyze tables
ANALYZE;

-- Reindex fragmented indexes
REINDEX INDEX CONCURRENTLY idx_card_trans_created;
REINDEX INDEX CONCURRENTLY idx_audit_log_created;

-- Check for unused indexes
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE 'pg_toast%'
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 8.2 Monthly Maintenance

```sql
-- Full maintenance
VACUUM FULL ANALYZE;

-- Clean up old audit logs (keep 1 year)
DELETE FROM card_audit_logs
WHERE created_at < CURRENT_DATE - INTERVAL '1 year';

-- Archive old signatures
DELETE FROM digital_signatures
WHERE created_at < CURRENT_DATE - INTERVAL '2 years'
AND verification_status IN ('INVALID', 'EXPIRED');
```

---

**Version:** 1.0  
**Last Updated:** 2026-08-13
