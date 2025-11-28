#!/bin/bash
# Create Test Users for Each Role

set -e

API_URL="http://localhost:8060"

# Get admin token
echo "=== Getting Admin Token ==="
LOGIN_RESPONSE=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@novoraplus.com","password":"NovoraPlus@2024"}')
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" == "null" ]; then
  echo "Failed to get token"
  exit 1
fi
echo "Got token"

# Get the first organization ID
echo ""
echo "=== Getting Organization ==="
ORG_RESPONSE=$(curl -s "${API_URL}/items/organizations?limit=1" \
  -H "Authorization: Bearer $TOKEN")
ORG_ID=$(echo $ORG_RESPONSE | jq -r '.data[0].id')
echo "Organization ID: $ORG_ID"

# Role IDs
DOCTOR_ROLE="385c1253-5488-467c-9cf3-43abdbd4eebc"
NURSE_ROLE="5a4d22ae-7ec2-46d6-a876-d3193b1a5750"
LAB_STAFF_ROLE="079d48d9-e031-42ee-ba12-d7c46ff5618b"
RECEPTION_ROLE="5646c077-e33c-4309-9663-6c02e1655512"
PHARMACY_ROLE="aaa915f0-15c7-4f51-8e78-2c46a1d48095"
BILLING_ROLE="908219b6-8706-4e6d-a258-1b729c810a83"
RADIOLOGY_ROLE="813e3192-24a5-4268-8525-2581a857a038"

# Function to create user
create_user() {
  local email="$1"
  local first_name="$2"
  local last_name="$3"
  local role_id="$4"
  local org_id="$5"
  local password="Test@1234"

  echo "Creating user: $email"
  RESULT=$(curl -s -X POST "${API_URL}/users" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"email\": \"$email\",
      \"password\": \"$password\",
      \"first_name\": \"$first_name\",
      \"last_name\": \"$last_name\",
      \"role\": \"$role_id\",
      \"org_id\": \"$org_id\",
      \"status\": \"active\"
    }")

  if echo "$RESULT" | grep -q '"id"'; then
    echo "  ✓ Created successfully"
  else
    echo "  ✗ Failed: $RESULT"
  fi
}

echo ""
echo "=== Creating Test Users ==="
echo "Default password for all: Test@1234"
echo ""

# Create test users for each role (if org exists)
if [ -n "$ORG_ID" ] && [ "$ORG_ID" != "null" ]; then
  create_user "doctor@test.com" "Test" "Doctor" "$DOCTOR_ROLE" "$ORG_ID"
  create_user "nurse@test.com" "Test" "Nurse" "$NURSE_ROLE" "$ORG_ID"
  create_user "lab@test.com" "Test" "LabTech" "$LAB_STAFF_ROLE" "$ORG_ID"
  create_user "reception@test.com" "Test" "Reception" "$RECEPTION_ROLE" "$ORG_ID"
  create_user "pharmacy@test.com" "Test" "Pharmacist" "$PHARMACY_ROLE" "$ORG_ID"
  create_user "billing@test.com" "Test" "Billing" "$BILLING_ROLE" "$ORG_ID"
  create_user "radiology@test.com" "Test" "Radiologist" "$RADIOLOGY_ROLE" "$ORG_ID"
else
  echo "No organization found. Creating one first..."
  ORG_RESULT=$(curl -s -X POST "${API_URL}/items/organizations" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "code": "DEMO-001",
      "name": "Demo Hospital",
      "type": "hospital",
      "email": "demo@hospital.com",
      "phone": "+1234567890",
      "address": "123 Medical St",
      "city": "Medical City",
      "state": "MC",
      "country": "Country",
      "status": "active"
    }')
  ORG_ID=$(echo $ORG_RESULT | jq -r '.data.id')
  echo "Created organization: $ORG_ID"

  if [ -n "$ORG_ID" ] && [ "$ORG_ID" != "null" ]; then
    create_user "doctor@test.com" "Test" "Doctor" "$DOCTOR_ROLE" "$ORG_ID"
    create_user "nurse@test.com" "Test" "Nurse" "$NURSE_ROLE" "$ORG_ID"
    create_user "lab@test.com" "Test" "LabTech" "$LAB_STAFF_ROLE" "$ORG_ID"
    create_user "reception@test.com" "Test" "Reception" "$RECEPTION_ROLE" "$ORG_ID"
    create_user "pharmacy@test.com" "Test" "Pharmacist" "$PHARMACY_ROLE" "$ORG_ID"
    create_user "billing@test.com" "Test" "Billing" "$BILLING_ROLE" "$ORG_ID"
    create_user "radiology@test.com" "Test" "Radiologist" "$RADIOLOGY_ROLE" "$ORG_ID"
  fi
fi

echo ""
echo "=== Test Users Created ==="
echo ""
echo "Login Credentials (password: Test@1234):"
echo "- Doctor:     doctor@test.com"
echo "- Nurse:      nurse@test.com"
echo "- Lab Staff:  lab@test.com"
echo "- Reception:  reception@test.com"
echo "- Pharmacy:   pharmacy@test.com"
echo "- Billing:    billing@test.com"
echo "- Radiology:  radiology@test.com"
echo ""
echo "Admin accounts:"
echo "- Super Admin:    superadmin@novoraplus.com / NovoraPlus@2024"
echo "- Hospital Admin: hospitaladmin@novoraplus.com / Hospital@2024"
