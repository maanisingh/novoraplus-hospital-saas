-- RBAC Permissions Setup for Hospital SAAS
-- This script creates proper permissions for each role policy

-- Policy IDs (from our created policies)
-- Doctor Policy: 0dda909f-33ea-4c77-a421-2412e3bae05d
-- Nurse Policy: 490dcd48-718c-4348-be16-84d9cad2e4bb
-- Lab Staff Policy: f986ac50-1854-4006-b142-dd28cd6c1a88
-- Reception Policy: 5632a226-3456-4e47-93f5-9aa0da69e931
-- Pharmacy Staff Policy: daf61b51-e6a9-4dc9-9708-7729dbce0f99
-- Billing Staff Policy: 60a9a7cb-a12f-498d-8eb0-39e787577edc
-- Radiology Staff Policy: efe667e4-b897-475f-abaf-8402dbe2f942
-- Hospital Admin Policy (new): 6fa1d463-7451-4a3f-a0cb-30135d8c5bf3

-- Delete duplicate/empty Hospital Admin Policy
DELETE FROM directus_access WHERE policy = '6fa1d463-7451-4a3f-a0cb-30135d8c5bf3';
DELETE FROM directus_permissions WHERE policy = '6fa1d463-7451-4a3f-a0cb-30135d8c5bf3';
DELETE FROM directus_policies WHERE id = '6fa1d463-7451-4a3f-a0cb-30135d8c5bf3';

-- Delete any permissions from our new policies (start fresh)
DELETE FROM directus_permissions WHERE policy IN (
  '0dda909f-33ea-4c77-a421-2412e3bae05d',
  '490dcd48-718c-4348-be16-84d9cad2e4bb',
  'f986ac50-1854-4006-b142-dd28cd6c1a88',
  '5632a226-3456-4e47-93f5-9aa0da69e931',
  'daf61b51-e6a9-4dc9-9708-7729dbce0f99',
  '60a9a7cb-a12f-498d-8eb0-39e787577edc',
  'efe667e4-b897-475f-abaf-8402dbe2f942'
);

-- =====================================================
-- DOCTOR POLICY PERMISSIONS
-- =====================================================
-- Doctor: Full patient care access (own org only)

-- Patients - CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'patients', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'patients', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- OPD Tokens - CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'opd_tokens', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'opd_tokens', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'opd_tokens', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- IPD Admissions - CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'ipd_admissions', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'ipd_admissions', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'ipd_admissions', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- IPD Daily Records - CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'ipd_daily_records', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'ipd_daily_records', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'ipd_daily_records', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Lab Tests - CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'lab_tests', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'lab_tests', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'lab_tests', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Pharmacy Orders - Create/Read (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'pharmacy_orders', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'pharmacy_orders', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Medical History - CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'medical_history', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'medical_history', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'medical_history', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Read-only access (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'departments', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'beds', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'staff', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'billing', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Master data - Read only (global)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'diagnosis_master', 'read', '{}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'icd_codes', 'read', '{}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'symptoms', 'read', '{}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'investigations', 'read', '{}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'medicine_templates', 'read', '{}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'certificate_templates', 'read', '{}', '*'),
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'radiology_tests', 'read', '{}', '*');

-- User profile - read own
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('0dda909f-33ea-4c77-a421-2412e3bae05d', 'directus_users', 'read', '{"id":{"_eq":"$CURRENT_USER"}}', 'id,email,first_name,last_name,avatar,role,org_id');


-- =====================================================
-- NURSE POLICY PERMISSIONS
-- =====================================================

-- Patients - Read, limited update (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'patients', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'patients', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', 'vital_signs,last_visit,notes');

-- OPD Tokens - Read, limited update (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'opd_tokens', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'opd_tokens', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', 'status,vitals,notes');

-- IPD - Read, limited update (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'ipd_admissions', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'ipd_admissions', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', 'status,notes,discharge_notes');

-- IPD Daily Records - Full CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'ipd_daily_records', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'ipd_daily_records', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'ipd_daily_records', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Read-only access (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'beds', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'departments', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'staff', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'pharmacy_orders', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'lab_tests', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Master data
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'symptoms', 'read', '{}', '*'),
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'medicine_templates', 'read', '{}', '*');

-- User profile
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('490dcd48-718c-4348-be16-84d9cad2e4bb', 'directus_users', 'read', '{"id":{"_eq":"$CURRENT_USER"}}', 'id,email,first_name,last_name,avatar,role,org_id');


-- =====================================================
-- LAB STAFF POLICY PERMISSIONS
-- =====================================================

-- Lab Tests - Full CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'lab_tests', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'lab_tests', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'lab_tests', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Patients - Read limited fields (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'patients', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', 'id,patient_code,name,dob,gender,phone');

-- Read-only access (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'departments', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'staff', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Master data
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'investigations', 'read', '{}', '*'),
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'lab_report_templates', 'read', '{}', '*');

-- User profile
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('f986ac50-1854-4006-b142-dd28cd6c1a88', 'directus_users', 'read', '{"id":{"_eq":"$CURRENT_USER"}}', 'id,email,first_name,last_name,avatar,role,org_id');


-- =====================================================
-- RECEPTION POLICY PERMISSIONS
-- =====================================================

-- Patients - Full CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('5632a226-3456-4e47-93f5-9aa0da69e931', 'patients', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('5632a226-3456-4e47-93f5-9aa0da69e931', 'patients', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('5632a226-3456-4e47-93f5-9aa0da69e931', 'patients', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- OPD Tokens - Full CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('5632a226-3456-4e47-93f5-9aa0da69e931', 'opd_tokens', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('5632a226-3456-4e47-93f5-9aa0da69e931', 'opd_tokens', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('5632a226-3456-4e47-93f5-9aa0da69e931', 'opd_tokens', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Read-only access (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('5632a226-3456-4e47-93f5-9aa0da69e931', 'ipd_admissions', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('5632a226-3456-4e47-93f5-9aa0da69e931', 'departments', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('5632a226-3456-4e47-93f5-9aa0da69e931', 'staff', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('5632a226-3456-4e47-93f5-9aa0da69e931', 'beds', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('5632a226-3456-4e47-93f5-9aa0da69e931', 'billing', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- User profile
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('5632a226-3456-4e47-93f5-9aa0da69e931', 'directus_users', 'read', '{"id":{"_eq":"$CURRENT_USER"}}', 'id,email,first_name,last_name,avatar,role,org_id');


-- =====================================================
-- PHARMACY STAFF POLICY PERMISSIONS
-- =====================================================

-- Pharmacy Orders - Full CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'pharmacy_orders', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'pharmacy_orders', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'pharmacy_orders', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Inventory - Full CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'inventory', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'inventory', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'inventory', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Patients - Read limited fields (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'patients', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', 'id,patient_code,name,phone');

-- Read-only access (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'departments', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'staff', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Master data
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'medicine_templates', 'read', '{}', '*');

-- User profile
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('daf61b51-e6a9-4dc9-9708-7729dbce0f99', 'directus_users', 'read', '{"id":{"_eq":"$CURRENT_USER"}}', 'id,email,first_name,last_name,avatar,role,org_id');


-- =====================================================
-- BILLING STAFF POLICY PERMISSIONS
-- =====================================================

-- Billing - Full CRUD (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'billing', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'billing', 'create', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'billing', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Read-only access (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'patients', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'opd_tokens', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'ipd_admissions', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'pharmacy_orders', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'lab_tests', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'departments', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'staff', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Master data
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'service_templates', 'read', '{}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'payment_modes', 'read', '{}', '*'),
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'tpa_codes', 'read', '{}', '*');

-- User profile
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('60a9a7cb-a12f-498d-8eb0-39e787577edc', 'directus_users', 'read', '{"id":{"_eq":"$CURRENT_USER"}}', 'id,email,first_name,last_name,avatar,role,org_id');


-- =====================================================
-- RADIOLOGY STAFF POLICY PERMISSIONS
-- =====================================================

-- Lab Tests (radiology) - Read and Update (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('efe667e4-b897-475f-abaf-8402dbe2f942', 'lab_tests', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('efe667e4-b897-475f-abaf-8402dbe2f942', 'lab_tests', 'update', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', 'status,results,report,completed_at');

-- Patients - Read limited fields (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('efe667e4-b897-475f-abaf-8402dbe2f942', 'patients', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', 'id,patient_code,name,dob,gender,phone');

-- Read-only access (own org)
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('efe667e4-b897-475f-abaf-8402dbe2f942', 'departments', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*'),
('efe667e4-b897-475f-abaf-8402dbe2f942', 'staff', 'read', '{"org_id":{"_eq":"$CURRENT_USER.org_id"}}', '*');

-- Master data
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('efe667e4-b897-475f-abaf-8402dbe2f942', 'radiology_tests', 'read', '{}', '*'),
('efe667e4-b897-475f-abaf-8402dbe2f942', 'lab_report_templates', 'read', '{}', '*');

-- User profile
INSERT INTO directus_permissions (policy, collection, action, permissions, fields) VALUES
('efe667e4-b897-475f-abaf-8402dbe2f942', 'directus_users', 'read', '{"id":{"_eq":"$CURRENT_USER"}}', 'id,email,first_name,last_name,avatar,role,org_id');


-- =====================================================
-- LINK POLICIES TO ROLES VIA directus_access
-- =====================================================

-- First delete any existing links for our roles (except existing Hospital Admin)
DELETE FROM directus_access WHERE role IN (
  '385c1253-5488-467c-9cf3-43abdbd4eebc',  -- Doctor
  '5a4d22ae-7ec2-46d6-a876-d3193b1a5750',  -- Nurse
  '079d48d9-e031-42ee-ba12-d7c46ff5618b',  -- Lab Staff
  '5646c077-e33c-4309-9663-6c02e1655512',  -- Reception
  'aaa915f0-15c7-4f51-8e78-2c46a1d48095',  -- Pharmacy Staff
  '908219b6-8706-4e6d-a258-1b729c810a83',  -- Billing Staff
  '813e3192-24a5-4268-8525-2581a857a038'   -- Radiology Staff
);

-- Create access entries (link roles to policies)
INSERT INTO directus_access (role, policy, sort) VALUES
('385c1253-5488-467c-9cf3-43abdbd4eebc', '0dda909f-33ea-4c77-a421-2412e3bae05d', 1),  -- Doctor -> Doctor Policy
('5a4d22ae-7ec2-46d6-a876-d3193b1a5750', '490dcd48-718c-4348-be16-84d9cad2e4bb', 1),  -- Nurse -> Nurse Policy
('079d48d9-e031-42ee-ba12-d7c46ff5618b', 'f986ac50-1854-4006-b142-dd28cd6c1a88', 1),  -- Lab Staff -> Lab Staff Policy
('5646c077-e33c-4309-9663-6c02e1655512', '5632a226-3456-4e47-93f5-9aa0da69e931', 1),  -- Reception -> Reception Policy
('aaa915f0-15c7-4f51-8e78-2c46a1d48095', 'daf61b51-e6a9-4dc9-9708-7729dbce0f99', 1),  -- Pharmacy Staff -> Pharmacy Staff Policy
('908219b6-8706-4e6d-a258-1b729c810a83', '60a9a7cb-a12f-498d-8eb0-39e787577edc', 1),  -- Billing Staff -> Billing Staff Policy
('813e3192-24a5-4268-8525-2581a857a038', 'efe667e4-b897-475f-abaf-8402dbe2f942', 1);  -- Radiology Staff -> Radiology Staff Policy

-- Hospital Admin already has permissions via the existing Hospital Admin Policy (58808cf8-02df-4068-934e-167ca733dcd1)
-- Just need to ensure it's linked to the role
DELETE FROM directus_access WHERE role = '26315b1d-23e5-415e-b33d-cc87625c8dfc';
INSERT INTO directus_access (role, policy, sort) VALUES
('26315b1d-23e5-415e-b33d-cc87625c8dfc', '58808cf8-02df-4068-934e-167ca733dcd1', 1);  -- Hospital Admin -> Hospital Admin Policy

-- Verify results
SELECT p.name as policy_name, COUNT(perm.id) as permission_count
FROM directus_policies p
LEFT JOIN directus_permissions perm ON perm.policy = p.id
GROUP BY p.id, p.name
ORDER BY p.name;
