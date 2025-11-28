-- Master Data Tables for Hospital SAAS
-- These tables store lookup/reference data used across the system

-- 1. Symptoms / Complaints
CREATE TABLE IF NOT EXISTS symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Investigations
CREATE TABLE IF NOT EXISTS investigations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    category VARCHAR(100), -- Lab, Radiology, Others
    department VARCHAR(100),
    normal_range VARCHAR(255),
    unit VARCHAR(50),
    price DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Diagnosis Master
CREATE TABLE IF NOT EXISTS diagnosis_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    icd_code VARCHAR(20),
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Medical History (Past Medical & Past Surgical combined with type)
CREATE TABLE IF NOT EXISTS medical_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'medical' or 'surgical'
    category VARCHAR(100),
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Lifestyle Options (Addiction, Diet, Appetite, Sleep, Bladder, Bowel)
CREATE TABLE IF NOT EXISTS lifestyle_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- addiction, diet, appetite, sleep, bladder, bowel
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Types
CREATE TABLE IF NOT EXISTS user_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Payment Modes
CREATE TABLE IF NOT EXISTS payment_modes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    type VARCHAR(50), -- cash, card, upi, insurance, credit
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Service Templates
CREATE TABLE IF NOT EXISTS service_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    department VARCHAR(100),
    category VARCHAR(100),
    price DECIMAL(10,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Certificate Templates
CREATE TABLE IF NOT EXISTS certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100), -- medical, fitness, birth, death, discharge, etc.
    template_content TEXT,
    header_content TEXT,
    footer_content TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Medicine Templates (Prescription templates)
CREATE TABLE IF NOT EXISTS medicine_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    diagnosis VARCHAR(255),
    medicines JSONB DEFAULT '[]', -- Array of {medicine, dosage, frequency, duration, instructions}
    advice TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Lab Report Templates
CREATE TABLE IF NOT EXISTS lab_report_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    test_category VARCHAR(100),
    parameters JSONB DEFAULT '[]', -- Array of {name, unit, normal_range, method}
    header_content TEXT,
    footer_content TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. ICD Codes (International Classification of Diseases)
CREATE TABLE IF NOT EXISTS icd_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(500) NOT NULL,
    category VARCHAR(255),
    chapter VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. TPA Codes (Third Party Administrator codes for insurance)
CREATE TABLE IF NOT EXISTS tpa_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    tpa_name VARCHAR(255),
    category VARCHAR(100),
    rate DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_symptoms_org ON symptoms(org_id);
CREATE INDEX IF NOT EXISTS idx_investigations_org ON investigations(org_id);
CREATE INDEX IF NOT EXISTS idx_diagnosis_org ON diagnosis_master(org_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_org ON medical_history(org_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_org ON lifestyle_options(org_id);
CREATE INDEX IF NOT EXISTS idx_user_types_org ON user_types(org_id);
CREATE INDEX IF NOT EXISTS idx_payment_modes_org ON payment_modes(org_id);
CREATE INDEX IF NOT EXISTS idx_service_templates_org ON service_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_certificate_templates_org ON certificate_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_medicine_templates_org ON medicine_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_lab_report_templates_org ON lab_report_templates(org_id);
CREATE INDEX IF NOT EXISTS idx_tpa_codes_org ON tpa_codes(org_id);
CREATE INDEX IF NOT EXISTS idx_icd_codes_code ON icd_codes(code);
