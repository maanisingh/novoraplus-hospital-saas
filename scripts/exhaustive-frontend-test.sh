#!/bin/bash
# Exhaustive Frontend Functionality Test for Hospital SAAS
# Tests login, RBAC, data access, and CRUD operations

set -e

API_URL="http://localhost:8060"
FRONTEND_URL="https://hospital.alexandratechlab.com"

echo "=============================================="
echo "  HOSPITAL SAAS - EXHAUSTIVE FRONTEND TEST"
echo "=============================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

passed=0
failed=0

test_result() {
  local test_name="$1"
  local result="$2"  # 0 = pass, 1 = fail
  local details="$3"

  if [ "$result" -eq 0 ]; then
    echo -e "${GREEN}✓ PASS${NC}: $test_name"
    ((passed++))
  else
    echo -e "${RED}✗ FAIL${NC}: $test_name"
    echo -e "  ${YELLOW}Details: $details${NC}"
    ((failed++))
  fi
}

echo -e "${BLUE}=== 1. FRONTEND ACCESSIBILITY ===${NC}"
echo ""

# Test frontend is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$HTTP_CODE" == "200" ]; then
  test_result "Frontend accessible ($FRONTEND_URL)" 0
else
  test_result "Frontend accessible" 1 "HTTP $HTTP_CODE"
fi

# Test API is accessible via public URL
API_PUBLIC="https://hospital-api.alexandratechlab.com"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_PUBLIC/server/ping")
if [ "$HTTP_CODE" == "200" ]; then
  test_result "API accessible ($API_PUBLIC)" 0
else
  test_result "API accessible" 1 "HTTP $HTTP_CODE"
fi

echo ""
echo -e "${BLUE}=== 2. AUTHENTICATION TESTS ===${NC}"
echo ""

# Test Super Admin Login
RESULT=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@novoraplus.com","password":"NovoraPlus@2024"}')
if echo "$RESULT" | grep -q '"access_token"'; then
  test_result "Super Admin login" 0
  SUPERADMIN_TOKEN=$(echo $RESULT | jq -r '.data.access_token')
else
  test_result "Super Admin login" 1 "$RESULT"
fi

# Test Hospital Admin Login
RESULT=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"hospitaladmin@novoraplus.com","password":"Hospital@2024"}')
if echo "$RESULT" | grep -q '"access_token"'; then
  test_result "Hospital Admin login" 0
  HOSPITALADMIN_TOKEN=$(echo $RESULT | jq -r '.data.access_token')
else
  test_result "Hospital Admin login" 1 "$RESULT"
fi

# Test each role login
ROLES=("doctor" "nurse" "lab" "reception" "pharmacy" "billing" "radiology")
declare -A ROLE_TOKENS

for role in "${ROLES[@]}"; do
  RESULT=$(curl -s -X POST "${API_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${role}@test.com\",\"password\":\"Test@1234\"}")
  if echo "$RESULT" | grep -q '"access_token"'; then
    test_result "$role login" 0
    ROLE_TOKENS[$role]=$(echo $RESULT | jq -r '.data.access_token')
  else
    test_result "$role login" 1 "$RESULT"
  fi
done

echo ""
echo -e "${BLUE}=== 3. RBAC PERMISSION TESTS ===${NC}"
echo ""

# Test Doctor can access patients
RESULT=$(curl -s "${API_URL}/items/patients" -H "Authorization: Bearer ${ROLE_TOKENS[doctor]}")
if echo "$RESULT" | grep -q '"data"'; then
  test_result "Doctor can read patients" 0
else
  test_result "Doctor can read patients" 1 "$RESULT"
fi

# Test Doctor can access OPD tokens
RESULT=$(curl -s "${API_URL}/items/opd_tokens" -H "Authorization: Bearer ${ROLE_TOKENS[doctor]}")
if echo "$RESULT" | grep -q '"data"'; then
  test_result "Doctor can read OPD tokens" 0
else
  test_result "Doctor can read OPD tokens" 1 "$RESULT"
fi

# Test Nurse can access patients (limited)
RESULT=$(curl -s "${API_URL}/items/patients" -H "Authorization: Bearer ${ROLE_TOKENS[nurse]}")
if echo "$RESULT" | grep -q '"data"'; then
  test_result "Nurse can read patients" 0
else
  test_result "Nurse can read patients" 1 "$RESULT"
fi

# Test Lab Staff can access lab_tests
RESULT=$(curl -s "${API_URL}/items/lab_tests" -H "Authorization: Bearer ${ROLE_TOKENS[lab]}")
if echo "$RESULT" | grep -q '"data"'; then
  test_result "Lab Staff can read lab tests" 0
else
  test_result "Lab Staff can read lab tests" 1 "$RESULT"
fi

# Test Reception can create patients
RESULT=$(curl -s -X POST "${API_URL}/items/patients" \
  -H "Authorization: Bearer ${ROLE_TOKENS[reception]}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient RBAC",
    "patient_code": "PAT-RBAC-001",
    "dob": "1990-01-01",
    "gender": "male",
    "phone": "1234567890",
    "org_id": "6e7f8aa4-5267-433b-aca2-91a4da255caf"
  }')
if echo "$RESULT" | grep -q '"id"'; then
  test_result "Reception can create patients" 0
  PATIENT_ID=$(echo $RESULT | jq -r '.data.id')
else
  test_result "Reception can create patients" 1 "$RESULT"
fi

# Test Pharmacy can access inventory
RESULT=$(curl -s "${API_URL}/items/inventory" -H "Authorization: Bearer ${ROLE_TOKENS[pharmacy]}")
if echo "$RESULT" | grep -q '"data"'; then
  test_result "Pharmacy can read inventory" 0
else
  test_result "Pharmacy can read inventory" 1 "$RESULT"
fi

# Test Billing can access billing
RESULT=$(curl -s "${API_URL}/items/billing" -H "Authorization: Bearer ${ROLE_TOKENS[billing]}")
if echo "$RESULT" | grep -q '"data"'; then
  test_result "Billing can read billing records" 0
else
  test_result "Billing can read billing records" 1 "$RESULT"
fi

# Test Radiology can access lab_tests
RESULT=$(curl -s "${API_URL}/items/lab_tests" -H "Authorization: Bearer ${ROLE_TOKENS[radiology]}")
if echo "$RESULT" | grep -q '"data"'; then
  test_result "Radiology can read lab tests" 0
else
  test_result "Radiology can read lab tests" 1 "$RESULT"
fi

echo ""
echo -e "${BLUE}=== 4. RBAC RESTRICTION TESTS ===${NC}"
echo ""

# Test Nurse CANNOT create patients (should fail)
RESULT=$(curl -s -X POST "${API_URL}/items/patients" \
  -H "Authorization: Bearer ${ROLE_TOKENS[nurse]}" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","patient_code":"X","dob":"2000-01-01","gender":"male","org_id":"6e7f8aa4-5267-433b-aca2-91a4da255caf"}')
if echo "$RESULT" | grep -q '"errors"'; then
  test_result "Nurse cannot create patients (RBAC works)" 0
else
  test_result "Nurse cannot create patients" 1 "RBAC not restricting"
fi

# Test Lab Staff CANNOT access billing (should fail)
RESULT=$(curl -s "${API_URL}/items/billing" -H "Authorization: Bearer ${ROLE_TOKENS[lab]}")
if echo "$RESULT" | grep -q '"errors"'; then
  test_result "Lab Staff cannot access billing (RBAC works)" 0
else
  test_result "Lab Staff cannot access billing" 1 "RBAC not restricting"
fi

# Test Pharmacy CANNOT access IPD admissions (should fail)
RESULT=$(curl -s "${API_URL}/items/ipd_admissions" -H "Authorization: Bearer ${ROLE_TOKENS[pharmacy]}")
if echo "$RESULT" | grep -q '"errors"'; then
  test_result "Pharmacy cannot access IPD (RBAC works)" 0
else
  test_result "Pharmacy cannot access IPD" 1 "RBAC not restricting"
fi

echo ""
echo -e "${BLUE}=== 5. DATA MANAGEMENT TESTS ===${NC}"
echo ""

# Get org ID for testing
ORG_ID="6e7f8aa4-5267-433b-aca2-91a4da255caf"

# Test creating a patient (as Hospital Admin)
RESULT=$(curl -s -X POST "${API_URL}/items/patients" \
  -H "Authorization: Bearer $HOSPITALADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Patient Full\",
    \"patient_code\": \"PAT-FULL-001\",
    \"dob\": \"1985-06-15\",
    \"gender\": \"female\",
    \"phone\": \"9876543210\",
    \"email\": \"testpatient@test.com\",
    \"address\": \"123 Test Street\",
    \"org_id\": \"$ORG_ID\"
  }")
if echo "$RESULT" | grep -q '"id"'; then
  test_result "Hospital Admin can create patient" 0
  NEW_PATIENT_ID=$(echo $RESULT | jq -r '.data.id')
else
  test_result "Hospital Admin can create patient" 1 "$RESULT"
fi

# Test creating OPD token
RESULT=$(curl -s -X POST "${API_URL}/items/opd_tokens" \
  -H "Authorization: Bearer $HOSPITALADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"token_number\": \"OPD-TEST-001\",
    \"patient_id\": \"$NEW_PATIENT_ID\",
    \"status\": \"waiting\",
    \"org_id\": \"$ORG_ID\"
  }")
if echo "$RESULT" | grep -q '"id"'; then
  test_result "Hospital Admin can create OPD token" 0
else
  test_result "Hospital Admin can create OPD token" 1 "$RESULT"
fi

# Test creating department
RESULT=$(curl -s -X POST "${API_URL}/items/departments" \
  -H "Authorization: Bearer $HOSPITALADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Department\",
    \"code\": \"TEST-DEPT\",
    \"org_id\": \"$ORG_ID\",
    \"status\": \"active\"
  }")
if echo "$RESULT" | grep -q '"id"'; then
  test_result "Hospital Admin can create department" 0
  DEPT_ID=$(echo $RESULT | jq -r '.data.id')
else
  test_result "Hospital Admin can create department" 1 "$RESULT"
fi

# Test creating bed
RESULT=$(curl -s -X POST "${API_URL}/items/beds" \
  -H "Authorization: Bearer $HOSPITALADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"bed_number\": \"BED-001\",
    \"department_id\": \"$DEPT_ID\",
    \"type\": \"general\",
    \"status\": \"available\",
    \"org_id\": \"$ORG_ID\"
  }")
if echo "$RESULT" | grep -q '"id"'; then
  test_result "Hospital Admin can create bed" 0
else
  test_result "Hospital Admin can create bed" 1 "$RESULT"
fi

# Test creating staff member
RESULT=$(curl -s -X POST "${API_URL}/items/staff" \
  -H "Authorization: Bearer $HOSPITALADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Test Staff Member\",
    \"designation\": \"doctor\",
    \"email\": \"teststaff@hospital.com\",
    \"phone\": \"1111111111\",
    \"department_id\": \"$DEPT_ID\",
    \"org_id\": \"$ORG_ID\",
    \"status\": \"active\"
  }")
if echo "$RESULT" | grep -q '"id"'; then
  test_result "Hospital Admin can create staff" 0
  STAFF_ID=$(echo $RESULT | jq -r '.data.id')
else
  test_result "Hospital Admin can create staff" 1 "$RESULT"
fi

echo ""
echo -e "${BLUE}=== 6. USER MANAGEMENT TESTS ===${NC}"
echo ""

# Test Super Admin can create new user
RESULT=$(curl -s -X POST "${API_URL}/users" \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"newuser@test.com\",
    \"password\": \"NewUser@123\",
    \"first_name\": \"New\",
    \"last_name\": \"User\",
    \"role\": \"385c1253-5488-467c-9cf3-43abdbd4eebc\",
    \"org_id\": \"$ORG_ID\",
    \"status\": \"active\"
  }")
if echo "$RESULT" | grep -q '"id"'; then
  test_result "Super Admin can create user" 0
else
  test_result "Super Admin can create user" 1 "$RESULT"
fi

# Test listing users
RESULT=$(curl -s "${API_URL}/users" -H "Authorization: Bearer $SUPERADMIN_TOKEN")
if echo "$RESULT" | grep -q '"data"'; then
  USER_COUNT=$(echo $RESULT | jq '.data | length')
  test_result "Super Admin can list users (found $USER_COUNT)" 0
else
  test_result "Super Admin can list users" 1 "$RESULT"
fi

echo ""
echo -e "${BLUE}=== 7. MASTER DATA ACCESS TESTS ===${NC}"
echo ""

# Test reading master data (should work for all roles)
MASTER_COLLECTIONS=("diagnosis_master" "icd_codes" "symptoms" "investigations" "medicine_templates")

for collection in "${MASTER_COLLECTIONS[@]}"; do
  RESULT=$(curl -s "${API_URL}/items/$collection" -H "Authorization: Bearer ${ROLE_TOKENS[doctor]}")
  if echo "$RESULT" | grep -q '"data"'; then
    test_result "Master data: $collection accessible" 0
  else
    test_result "Master data: $collection accessible" 1 "$RESULT"
  fi
done

echo ""
echo -e "${BLUE}=== 8. ORGANIZATION ISOLATION TESTS ===${NC}"
echo ""

# Create a second organization
RESULT=$(curl -s -X POST "${API_URL}/items/organizations" \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ORG2-001",
    "name": "Second Hospital",
    "type": "hospital",
    "email": "second@hospital.com",
    "status": "active"
  }')
if echo "$RESULT" | grep -q '"id"'; then
  ORG2_ID=$(echo $RESULT | jq -r '.data.id')
  test_result "Created second organization" 0

  # Create patient in org2
  RESULT=$(curl -s -X POST "${API_URL}/items/patients" \
    -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"name\": \"Patient in Org2\",
      \"patient_code\": \"PAT-ORG2-001\",
      \"dob\": \"1995-01-01\",
      \"gender\": \"male\",
      \"org_id\": \"$ORG2_ID\"
    }")

  # Test that Doctor in Org1 cannot see Org2 patient
  RESULT=$(curl -s "${API_URL}/items/patients?filter[patient_code][_eq]=PAT-ORG2-001" \
    -H "Authorization: Bearer ${ROLE_TOKENS[doctor]}")
  PATIENT_COUNT=$(echo $RESULT | jq '.data | length')
  if [ "$PATIENT_COUNT" == "0" ]; then
    test_result "Organization isolation working (Doctor cannot see Org2 data)" 0
  else
    test_result "Organization isolation" 1 "Doctor can see Org2 data!"
  fi
else
  test_result "Organization isolation test" 1 "Could not create second org"
fi

echo ""
echo -e "${BLUE}=== 9. FRONTEND PAGE TESTS ===${NC}"
echo ""

# Test main pages are accessible
PAGES=("/" "/dashboard" "/patients" "/opd" "/ipd" "/lab" "/pharmacy" "/billing" "/staff" "/departments" "/reports")

for page in "${PAGES[@]}"; do
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}${page}")
  if [ "$HTTP_CODE" == "200" ] || [ "$HTTP_CODE" == "307" ] || [ "$HTTP_CODE" == "302" ]; then
    test_result "Page accessible: $page" 0
  else
    test_result "Page accessible: $page" 1 "HTTP $HTTP_CODE"
  fi
done

echo ""
echo "=============================================="
echo -e "${BLUE}            TEST SUMMARY${NC}"
echo "=============================================="
echo ""
echo -e "  ${GREEN}Passed: $passed${NC}"
echo -e "  ${RED}Failed: $failed${NC}"
echo -e "  Total:  $((passed + failed))"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}All tests passed! ✓${NC}"
else
  echo -e "${YELLOW}Some tests failed. Please review the output above.${NC}"
fi

echo ""
echo "=============================================="
echo "           TEST CREDENTIALS"
echo "=============================================="
echo ""
echo "Super Admin:    superadmin@novoraplus.com / NovoraPlus@2024"
echo "Hospital Admin: hospitaladmin@novoraplus.com / Hospital@2024"
echo ""
echo "Test Users (password: Test@1234):"
echo "  - Doctor:     doctor@test.com"
echo "  - Nurse:      nurse@test.com"
echo "  - Lab Staff:  lab@test.com"
echo "  - Reception:  reception@test.com"
echo "  - Pharmacy:   pharmacy@test.com"
echo "  - Billing:    billing@test.com"
echo "  - Radiology:  radiology@test.com"
echo ""
echo "Frontend: $FRONTEND_URL"
echo "API:      $API_PUBLIC"
echo ""
