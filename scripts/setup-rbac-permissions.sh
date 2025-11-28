#!/bin/bash
# Setup RBAC Permissions for Hospital SAAS

set -e

API_URL="http://localhost:8060"

# Login and get token
echo "=== Getting Admin Token ==="
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@novoraplus.com","password":"NovoraPlus@2024"}')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "Failed to get token"
  exit 1
fi
echo "Got token successfully"

# Role IDs
DOCTOR_ROLE="385c1253-5488-467c-9cf3-43abdbd4eebc"
NURSE_ROLE="5a4d22ae-7ec2-46d6-a876-d3193b1a5750"
LAB_STAFF_ROLE="079d48d9-e031-42ee-ba12-d7c46ff5618b"
RECEPTION_ROLE="5646c077-e33c-4309-9663-6c02e1655512"
PHARMACY_ROLE="aaa915f0-15c7-4f51-8e78-2c46a1d48095"
HOSPITAL_ADMIN_ROLE="26315b1d-23e5-415e-b33d-cc87625c8dfc"
BILLING_ROLE="908219b6-8706-4e6d-a258-1b729c810a83"
RADIOLOGY_ROLE="813e3192-24a5-4268-8525-2581a857a038"

# Function to create a policy
create_policy() {
  local name="$1"
  local description="$2"

  echo "Creating policy: $name"
  RESULT=$(curl -s -X POST "${API_URL}/policies" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"$name\",
      \"description\": \"$description\",
      \"admin_access\": false,
      \"app_access\": true
    }")

  echo $RESULT | jq -r '.data.id'
}

# Function to create permission
create_permission() {
  local policy_id="$1"
  local collection="$2"
  local action="$3"
  local permissions="$4"  # JSON filter
  local fields="$5"  # Array of fields or "*"

  PAYLOAD="{
    \"policy\": \"$policy_id\",
    \"collection\": \"$collection\",
    \"action\": \"$action\""

  if [ -n "$permissions" ] && [ "$permissions" != "{}" ]; then
    PAYLOAD="$PAYLOAD, \"permissions\": $permissions"
  fi

  if [ -n "$fields" ]; then
    PAYLOAD="$PAYLOAD, \"fields\": $fields"
  fi

  PAYLOAD="$PAYLOAD}"

  curl -s -X POST "${API_URL}/permissions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$PAYLOAD" > /dev/null
}

# Function to assign policy to role
assign_policy_to_role() {
  local role_id="$1"
  local policy_id="$2"

  echo "Assigning policy $policy_id to role $role_id"
  curl -s -X POST "${API_URL}/access" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"role\": \"$role_id\",
      \"policy\": \"$policy_id\"
    }" > /dev/null
}

echo ""
echo "=== Creating Policies and Permissions ==="

# Org filter - restricts access to own organization
ORG_FILTER='{"org_id":{"_eq":"$CURRENT_USER.org_id"}}'

# ==== DOCTOR POLICY ====
echo ""
echo "--- Doctor Policy ---"
DOCTOR_POLICY=$(create_policy "Doctor Policy" "Full access to patient care, limited admin access")

# Doctors can read/update patients (own org)
create_permission "$DOCTOR_POLICY" "patients" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "patients" "update" "$ORG_FILTER" '["*"]'

# Doctors can manage OPD tokens (own org)
create_permission "$DOCTOR_POLICY" "opd_tokens" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "opd_tokens" "create" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "opd_tokens" "update" "$ORG_FILTER" '["*"]'

# Doctors can manage IPD admissions (own org)
create_permission "$DOCTOR_POLICY" "ipd_admissions" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "ipd_admissions" "create" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "ipd_admissions" "update" "$ORG_FILTER" '["*"]'

# Doctors can manage IPD daily records (own org)
create_permission "$DOCTOR_POLICY" "ipd_daily_records" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "ipd_daily_records" "create" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "ipd_daily_records" "update" "$ORG_FILTER" '["*"]'

# Doctors can create lab tests (own org)
create_permission "$DOCTOR_POLICY" "lab_tests" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "lab_tests" "create" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "lab_tests" "update" "$ORG_FILTER" '["*"]'

# Doctors can create pharmacy orders (own org)
create_permission "$DOCTOR_POLICY" "pharmacy_orders" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "pharmacy_orders" "create" "$ORG_FILTER" '["*"]'

# Doctors can view departments, beds (own org) - read only
create_permission "$DOCTOR_POLICY" "departments" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "beds" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "staff" "read" "$ORG_FILTER" '["*"]'

# Doctors can read medical history, diagnosis, symptoms (own org)
create_permission "$DOCTOR_POLICY" "medical_history" "read" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "medical_history" "create" "$ORG_FILTER" '["*"]'
create_permission "$DOCTOR_POLICY" "medical_history" "update" "$ORG_FILTER" '["*"]'

# Doctors read master data (global)
create_permission "$DOCTOR_POLICY" "diagnosis_master" "read" "{}" '["*"]'
create_permission "$DOCTOR_POLICY" "icd_codes" "read" "{}" '["*"]'
create_permission "$DOCTOR_POLICY" "symptoms" "read" "{}" '["*"]'
create_permission "$DOCTOR_POLICY" "investigations" "read" "{}" '["*"]'
create_permission "$DOCTOR_POLICY" "medicine_templates" "read" "{}" '["*"]'
create_permission "$DOCTOR_POLICY" "certificate_templates" "read" "{}" '["*"]'
create_permission "$DOCTOR_POLICY" "radiology_tests" "read" "{}" '["*"]'

# Doctors can read billing (view only)
create_permission "$DOCTOR_POLICY" "billing" "read" "$ORG_FILTER" '["*"]'

# Doctors read their own user info
create_permission "$DOCTOR_POLICY" "directus_users" "read" '{"id":{"_eq":"$CURRENT_USER"}}' '["id","email","first_name","last_name","avatar","role","org_id"]'

assign_policy_to_role "$DOCTOR_ROLE" "$DOCTOR_POLICY"
echo "Doctor policy created and assigned"


# ==== NURSE POLICY ====
echo ""
echo "--- Nurse Policy ---"
NURSE_POLICY=$(create_policy "Nurse Policy" "Patient care, vitals, IPD daily records")

# Nurses can read patients (own org)
create_permission "$NURSE_POLICY" "patients" "read" "$ORG_FILTER" '["*"]'
create_permission "$NURSE_POLICY" "patients" "update" "$ORG_FILTER" '["vital_signs","last_visit","notes"]'

# Nurses can manage OPD tokens (own org)
create_permission "$NURSE_POLICY" "opd_tokens" "read" "$ORG_FILTER" '["*"]'
create_permission "$NURSE_POLICY" "opd_tokens" "update" "$ORG_FILTER" '["status","vitals","notes"]'

# Nurses can read and update IPD admissions (own org)
create_permission "$NURSE_POLICY" "ipd_admissions" "read" "$ORG_FILTER" '["*"]'
create_permission "$NURSE_POLICY" "ipd_admissions" "update" "$ORG_FILTER" '["status","notes","discharge_notes"]'

# Nurses can fully manage IPD daily records (own org)
create_permission "$NURSE_POLICY" "ipd_daily_records" "read" "$ORG_FILTER" '["*"]'
create_permission "$NURSE_POLICY" "ipd_daily_records" "create" "$ORG_FILTER" '["*"]'
create_permission "$NURSE_POLICY" "ipd_daily_records" "update" "$ORG_FILTER" '["*"]'

# Nurses can view beds (own org)
create_permission "$NURSE_POLICY" "beds" "read" "$ORG_FILTER" '["*"]'
create_permission "$NURSE_POLICY" "departments" "read" "$ORG_FILTER" '["*"]'
create_permission "$NURSE_POLICY" "staff" "read" "$ORG_FILTER" '["*"]'

# Nurses can read pharmacy orders
create_permission "$NURSE_POLICY" "pharmacy_orders" "read" "$ORG_FILTER" '["*"]'

# Nurses can read lab tests
create_permission "$NURSE_POLICY" "lab_tests" "read" "$ORG_FILTER" '["*"]'

# Nurses read master data
create_permission "$NURSE_POLICY" "symptoms" "read" "{}" '["*"]'
create_permission "$NURSE_POLICY" "medicine_templates" "read" "{}" '["*"]'

# Nurses read their own user info
create_permission "$NURSE_POLICY" "directus_users" "read" '{"id":{"_eq":"$CURRENT_USER"}}' '["id","email","first_name","last_name","avatar","role","org_id"]'

assign_policy_to_role "$NURSE_ROLE" "$NURSE_POLICY"
echo "Nurse policy created and assigned"


# ==== LAB STAFF POLICY ====
echo ""
echo "--- Lab Staff Policy ---"
LAB_POLICY=$(create_policy "Lab Staff Policy" "Lab tests management")

# Lab staff can fully manage lab tests (own org)
create_permission "$LAB_POLICY" "lab_tests" "read" "$ORG_FILTER" '["*"]'
create_permission "$LAB_POLICY" "lab_tests" "create" "$ORG_FILTER" '["*"]'
create_permission "$LAB_POLICY" "lab_tests" "update" "$ORG_FILTER" '["*"]'

# Lab staff can read patients (own org)
create_permission "$LAB_POLICY" "patients" "read" "$ORG_FILTER" '["id","patient_code","name","dob","gender","phone"]'

# Lab staff can read master data
create_permission "$LAB_POLICY" "investigations" "read" "{}" '["*"]'
create_permission "$LAB_POLICY" "lab_report_templates" "read" "{}" '["*"]'

# Lab staff can read departments, staff
create_permission "$LAB_POLICY" "departments" "read" "$ORG_FILTER" '["*"]'
create_permission "$LAB_POLICY" "staff" "read" "$ORG_FILTER" '["*"]'

# Lab staff read their own user info
create_permission "$LAB_POLICY" "directus_users" "read" '{"id":{"_eq":"$CURRENT_USER"}}' '["id","email","first_name","last_name","avatar","role","org_id"]'

assign_policy_to_role "$LAB_STAFF_ROLE" "$LAB_POLICY"
echo "Lab Staff policy created and assigned"


# ==== RECEPTION POLICY ====
echo ""
echo "--- Reception Policy ---"
RECEPTION_POLICY=$(create_policy "Reception Policy" "Patient registration, OPD tokens, appointments")

# Reception can fully manage patients (own org)
create_permission "$RECEPTION_POLICY" "patients" "read" "$ORG_FILTER" '["*"]'
create_permission "$RECEPTION_POLICY" "patients" "create" "$ORG_FILTER" '["*"]'
create_permission "$RECEPTION_POLICY" "patients" "update" "$ORG_FILTER" '["*"]'

# Reception can fully manage OPD tokens (own org)
create_permission "$RECEPTION_POLICY" "opd_tokens" "read" "$ORG_FILTER" '["*"]'
create_permission "$RECEPTION_POLICY" "opd_tokens" "create" "$ORG_FILTER" '["*"]'
create_permission "$RECEPTION_POLICY" "opd_tokens" "update" "$ORG_FILTER" '["*"]'

# Reception can read IPD admissions (own org)
create_permission "$RECEPTION_POLICY" "ipd_admissions" "read" "$ORG_FILTER" '["*"]'

# Reception can read departments, staff, beds
create_permission "$RECEPTION_POLICY" "departments" "read" "$ORG_FILTER" '["*"]'
create_permission "$RECEPTION_POLICY" "staff" "read" "$ORG_FILTER" '["*"]'
create_permission "$RECEPTION_POLICY" "beds" "read" "$ORG_FILTER" '["*"]'

# Reception can read billing
create_permission "$RECEPTION_POLICY" "billing" "read" "$ORG_FILTER" '["*"]'

# Reception read their own user info
create_permission "$RECEPTION_POLICY" "directus_users" "read" '{"id":{"_eq":"$CURRENT_USER"}}' '["id","email","first_name","last_name","avatar","role","org_id"]'

assign_policy_to_role "$RECEPTION_ROLE" "$RECEPTION_POLICY"
echo "Reception policy created and assigned"


# ==== PHARMACY STAFF POLICY ====
echo ""
echo "--- Pharmacy Staff Policy ---"
PHARMACY_POLICY=$(create_policy "Pharmacy Staff Policy" "Pharmacy orders, inventory management")

# Pharmacy can fully manage pharmacy orders (own org)
create_permission "$PHARMACY_POLICY" "pharmacy_orders" "read" "$ORG_FILTER" '["*"]'
create_permission "$PHARMACY_POLICY" "pharmacy_orders" "create" "$ORG_FILTER" '["*"]'
create_permission "$PHARMACY_POLICY" "pharmacy_orders" "update" "$ORG_FILTER" '["*"]'

# Pharmacy can fully manage inventory (own org)
create_permission "$PHARMACY_POLICY" "inventory" "read" "$ORG_FILTER" '["*"]'
create_permission "$PHARMACY_POLICY" "inventory" "create" "$ORG_FILTER" '["*"]'
create_permission "$PHARMACY_POLICY" "inventory" "update" "$ORG_FILTER" '["*"]'

# Pharmacy can read patients (limited)
create_permission "$PHARMACY_POLICY" "patients" "read" "$ORG_FILTER" '["id","patient_code","name","phone"]'

# Pharmacy read master data
create_permission "$PHARMACY_POLICY" "medicine_templates" "read" "{}" '["*"]'

# Pharmacy can read departments, staff
create_permission "$PHARMACY_POLICY" "departments" "read" "$ORG_FILTER" '["*"]'
create_permission "$PHARMACY_POLICY" "staff" "read" "$ORG_FILTER" '["*"]'

# Pharmacy read their own user info
create_permission "$PHARMACY_POLICY" "directus_users" "read" '{"id":{"_eq":"$CURRENT_USER"}}' '["id","email","first_name","last_name","avatar","role","org_id"]'

assign_policy_to_role "$PHARMACY_ROLE" "$PHARMACY_POLICY"
echo "Pharmacy Staff policy created and assigned"


# ==== BILLING STAFF POLICY ====
echo ""
echo "--- Billing Staff Policy ---"
BILLING_POLICY=$(create_policy "Billing Staff Policy" "Billing and invoicing")

# Billing can fully manage billing (own org)
create_permission "$BILLING_POLICY" "billing" "read" "$ORG_FILTER" '["*"]'
create_permission "$BILLING_POLICY" "billing" "create" "$ORG_FILTER" '["*"]'
create_permission "$BILLING_POLICY" "billing" "update" "$ORG_FILTER" '["*"]'

# Billing can read patients (own org)
create_permission "$BILLING_POLICY" "patients" "read" "$ORG_FILTER" '["*"]'

# Billing can read OPD tokens (own org)
create_permission "$BILLING_POLICY" "opd_tokens" "read" "$ORG_FILTER" '["*"]'

# Billing can read IPD admissions (own org)
create_permission "$BILLING_POLICY" "ipd_admissions" "read" "$ORG_FILTER" '["*"]'

# Billing can read pharmacy orders (own org)
create_permission "$BILLING_POLICY" "pharmacy_orders" "read" "$ORG_FILTER" '["*"]'

# Billing can read lab tests (own org)
create_permission "$BILLING_POLICY" "lab_tests" "read" "$ORG_FILTER" '["*"]'

# Billing can read departments, staff
create_permission "$BILLING_POLICY" "departments" "read" "$ORG_FILTER" '["*"]'
create_permission "$BILLING_POLICY" "staff" "read" "$ORG_FILTER" '["*"]'

# Billing read master data
create_permission "$BILLING_POLICY" "service_templates" "read" "{}" '["*"]'
create_permission "$BILLING_POLICY" "payment_modes" "read" "{}" '["*"]'
create_permission "$BILLING_POLICY" "tpa_codes" "read" "{}" '["*"]'

# Billing read their own user info
create_permission "$BILLING_POLICY" "directus_users" "read" '{"id":{"_eq":"$CURRENT_USER"}}' '["id","email","first_name","last_name","avatar","role","org_id"]'

assign_policy_to_role "$BILLING_ROLE" "$BILLING_POLICY"
echo "Billing Staff policy created and assigned"


# ==== RADIOLOGY STAFF POLICY ====
echo ""
echo "--- Radiology Staff Policy ---"
RADIOLOGY_POLICY=$(create_policy "Radiology Staff Policy" "Radiology tests management")

# Radiology can read and update lab tests related to radiology (own org)
create_permission "$RADIOLOGY_POLICY" "lab_tests" "read" "$ORG_FILTER" '["*"]'
create_permission "$RADIOLOGY_POLICY" "lab_tests" "update" "$ORG_FILTER" '["status","results","report","completed_at"]'

# Radiology can read patients (own org)
create_permission "$RADIOLOGY_POLICY" "patients" "read" "$ORG_FILTER" '["id","patient_code","name","dob","gender","phone"]'

# Radiology read master data
create_permission "$RADIOLOGY_POLICY" "radiology_tests" "read" "{}" '["*"]'
create_permission "$RADIOLOGY_POLICY" "lab_report_templates" "read" "{}" '["*"]'

# Radiology can read departments, staff
create_permission "$RADIOLOGY_POLICY" "departments" "read" "$ORG_FILTER" '["*"]'
create_permission "$RADIOLOGY_POLICY" "staff" "read" "$ORG_FILTER" '["*"]'

# Radiology read their own user info
create_permission "$RADIOLOGY_POLICY" "directus_users" "read" '{"id":{"_eq":"$CURRENT_USER"}}' '["id","email","first_name","last_name","avatar","role","org_id"]'

assign_policy_to_role "$RADIOLOGY_ROLE" "$RADIOLOGY_POLICY"
echo "Radiology Staff policy created and assigned"


# ==== HOSPITAL ADMIN POLICY ====
echo ""
echo "--- Hospital Admin Policy ---"
HOSPITAL_ADMIN_POLICY=$(create_policy "Hospital Admin Policy" "Full access to own hospital data, staff management")

# Hospital Admin can manage everything in their org
COLLECTIONS=(patients opd_tokens ipd_admissions ipd_daily_records lab_tests pharmacy_orders billing inventory departments beds staff medical_history)

for collection in "${COLLECTIONS[@]}"; do
  create_permission "$HOSPITAL_ADMIN_POLICY" "$collection" "read" "$ORG_FILTER" '["*"]'
  create_permission "$HOSPITAL_ADMIN_POLICY" "$collection" "create" "$ORG_FILTER" '["*"]'
  create_permission "$HOSPITAL_ADMIN_POLICY" "$collection" "update" "$ORG_FILTER" '["*"]'
  create_permission "$HOSPITAL_ADMIN_POLICY" "$collection" "delete" "$ORG_FILTER" '["*"]'
done

# Hospital Admin can read their organization
create_permission "$HOSPITAL_ADMIN_POLICY" "organizations" "read" '{"id":{"_eq":"$CURRENT_USER.org_id"}}' '["*"]'
create_permission "$HOSPITAL_ADMIN_POLICY" "organizations" "update" '{"id":{"_eq":"$CURRENT_USER.org_id"}}' '["name","address","phone","email","logo","settings"]'

# Hospital Admin can manage users in their org
create_permission "$HOSPITAL_ADMIN_POLICY" "directus_users" "read" "$ORG_FILTER" '["*"]'
create_permission "$HOSPITAL_ADMIN_POLICY" "directus_users" "create" "{}" '["email","password","first_name","last_name","role","org_id","status"]'
create_permission "$HOSPITAL_ADMIN_POLICY" "directus_users" "update" "$ORG_FILTER" '["first_name","last_name","status","password"]'

# Hospital Admin read all master data
MASTER_COLLECTIONS=(diagnosis_master icd_codes symptoms investigations medicine_templates certificate_templates lab_report_templates radiology_tests service_templates payment_modes tpa_codes lifestyle_options user_types)

for collection in "${MASTER_COLLECTIONS[@]}"; do
  create_permission "$HOSPITAL_ADMIN_POLICY" "$collection" "read" "{}" '["*"]'
done

# Hospital Admin can read roles (but not modify)
create_permission "$HOSPITAL_ADMIN_POLICY" "directus_roles" "read" "{}" '["id","name","description","icon"]'

assign_policy_to_role "$HOSPITAL_ADMIN_ROLE" "$HOSPITAL_ADMIN_POLICY"
echo "Hospital Admin policy created and assigned"

echo ""
echo "=== RBAC Setup Complete ==="
echo ""
echo "Summary of permissions created:"
echo "- Doctor: Full patient care, OPD, IPD, lab orders, prescriptions (own org)"
echo "- Nurse: Patient vitals, IPD daily records, read-only access to orders (own org)"
echo "- Lab Staff: Full lab test management (own org)"
echo "- Reception: Patient registration, OPD tokens (own org)"
echo "- Pharmacy Staff: Pharmacy orders, inventory (own org)"
echo "- Billing Staff: Billing and invoices (own org)"
echo "- Radiology Staff: Radiology test updates (own org)"
echo "- Hospital Admin: Full access to own hospital, staff management"
