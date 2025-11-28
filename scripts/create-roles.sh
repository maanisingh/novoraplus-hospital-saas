#!/bin/bash

TOKEN=$(cat /tmp/directus_token.txt)
API="http://localhost:8060"

echo "=== Creating Hospital Roles ==="

# Define roles
roles=(
  '{"name":"Hospital Admin","description":"Administrator of a specific hospital","icon":"admin_panel_settings","admin_access":false,"app_access":true}'
  '{"name":"Doctor","description":"Medical doctor/consultant","icon":"medical_services","admin_access":false,"app_access":true}'
  '{"name":"Nurse","description":"Nursing staff","icon":"healing","admin_access":false,"app_access":true}'
  '{"name":"Reception","description":"Front desk/reception staff","icon":"support_agent","admin_access":false,"app_access":true}'
  '{"name":"Lab Staff","description":"Laboratory technician","icon":"biotech","admin_access":false,"app_access":true}'
  '{"name":"Pharmacy Staff","description":"Pharmacy personnel","icon":"medication","admin_access":false,"app_access":true}'
  '{"name":"Billing Staff","description":"Billing and accounts staff","icon":"receipt_long","admin_access":false,"app_access":true}'
  '{"name":"Radiology Staff","description":"Radiology technician","icon":"radiology","admin_access":false,"app_access":true}'
)

for role in "${roles[@]}"; do
  name=$(echo "$role" | jq -r '.name')
  echo "Creating role: $name..."
  curl -s -X POST "$API/roles" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$role" | jq -r '.data.name // .errors[0].message'
done

echo ""
echo "=== Creating Permissions for Hospital Admin ==="

# Get Hospital Admin role ID
HOSPITAL_ADMIN_ID=$(curl -s "$API/roles?filter[name][_eq]=Hospital Admin" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

echo "Hospital Admin Role ID: $HOSPITAL_ADMIN_ID"

# Collections that Hospital Admin can fully manage (CRUD)
admin_collections=("organizations" "departments" "patients" "opd_tokens" "beds" "ipd_admissions" "lab_tests" "pharmacy_orders" "inventory" "billing" "ipd_daily_records")

for collection in "${admin_collections[@]}"; do
  echo "Setting permissions for $collection..."

  # Create permission
  curl -s -X POST "$API/permissions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "role": "'$HOSPITAL_ADMIN_ID'",
      "collection": "'$collection'",
      "action": "create",
      "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
      "validation": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
      "fields": ["*"]
    }' | jq -r '.data.id // "created"'

  # Read permission
  curl -s -X POST "$API/permissions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "role": "'$HOSPITAL_ADMIN_ID'",
      "collection": "'$collection'",
      "action": "read",
      "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
      "fields": ["*"]
    }' | jq -r '.data.id // "created"'

  # Update permission
  curl -s -X POST "$API/permissions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "role": "'$HOSPITAL_ADMIN_ID'",
      "collection": "'$collection'",
      "action": "update",
      "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
      "fields": ["*"]
    }' | jq -r '.data.id // "created"'

  # Delete permission
  curl -s -X POST "$API/permissions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "role": "'$HOSPITAL_ADMIN_ID'",
      "collection": "'$collection'",
      "action": "delete",
      "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}}
    }' | jq -r '.data.id // "created"'
done

# Hospital Admin can read users from their organization
echo "Setting user read permission for Hospital Admin..."
curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$HOSPITAL_ADMIN_ID'",
    "collection": "directus_users",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' | jq -r '.data.id // "created"'

echo ""
echo "=== Creating Permissions for Doctor ==="

DOCTOR_ID=$(curl -s "$API/roles?filter[name][_eq]=Doctor" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

echo "Doctor Role ID: $DOCTOR_ID"

# Doctor can read patients, update opd_tokens (their consultations)
doctor_read=("patients" "opd_tokens" "lab_tests" "departments" "beds" "ipd_admissions")
for collection in "${doctor_read[@]}"; do
  curl -s -X POST "$API/permissions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "role": "'$DOCTOR_ID'",
      "collection": "'$collection'",
      "action": "read",
      "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
      "fields": ["*"]
    }' > /dev/null
done

# Doctor can update OPD tokens (add diagnosis, prescription)
curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$DOCTOR_ID'",
    "collection": "opd_tokens",
    "action": "update",
    "permissions": {"_and": [{"org_id": {"_eq": "$CURRENT_USER.org_id"}}, {"doctor_id": {"_eq": "$CURRENT_USER"}}]},
    "fields": ["status", "diagnosis", "prescription", "notes", "completed_at"]
  }' > /dev/null

# Doctor can create lab tests
curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$DOCTOR_ID'",
    "collection": "lab_tests",
    "action": "create",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

# Doctor can create pharmacy orders
curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$DOCTOR_ID'",
    "collection": "pharmacy_orders",
    "action": "create",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

echo "Doctor permissions set"

echo ""
echo "=== Creating Permissions for Reception ==="

RECEPTION_ID=$(curl -s "$API/roles?filter[name][_eq]=Reception" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

echo "Reception Role ID: $RECEPTION_ID"

# Reception can manage patients and create OPD tokens
curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$RECEPTION_ID'",
    "collection": "patients",
    "action": "create",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$RECEPTION_ID'",
    "collection": "patients",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$RECEPTION_ID'",
    "collection": "patients",
    "action": "update",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$RECEPTION_ID'",
    "collection": "opd_tokens",
    "action": "create",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$RECEPTION_ID'",
    "collection": "opd_tokens",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$RECEPTION_ID'",
    "collection": "departments",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$RECEPTION_ID'",
    "collection": "directus_users",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["id", "first_name", "last_name", "role"]
  }' > /dev/null

echo "Reception permissions set"

echo ""
echo "=== Creating Permissions for Lab Staff ==="

LAB_ID=$(curl -s "$API/roles?filter[name][_eq]=Lab Staff" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

# Lab staff can read and update lab tests
curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$LAB_ID'",
    "collection": "lab_tests",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$LAB_ID'",
    "collection": "lab_tests",
    "action": "update",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["status", "result", "report_pdf", "notes", "sample_collected_at", "completed_at"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$LAB_ID'",
    "collection": "patients",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["id", "patient_code", "name", "mobile"]
  }' > /dev/null

echo "Lab Staff permissions set"

echo ""
echo "=== Creating Permissions for Pharmacy Staff ==="

PHARMACY_ID=$(curl -s "$API/roles?filter[name][_eq]=Pharmacy Staff" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

# Pharmacy can manage orders and inventory
curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$PHARMACY_ID'",
    "collection": "pharmacy_orders",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$PHARMACY_ID'",
    "collection": "pharmacy_orders",
    "action": "update",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["status", "payment_status", "dispensed_at", "notes"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$PHARMACY_ID'",
    "collection": "inventory",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$PHARMACY_ID'",
    "collection": "inventory",
    "action": "update",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["quantity", "status"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$PHARMACY_ID'",
    "collection": "patients",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["id", "patient_code", "name", "mobile"]
  }' > /dev/null

echo "Pharmacy Staff permissions set"

echo ""
echo "=== Creating Permissions for Billing Staff ==="

BILLING_ID=$(curl -s "$API/roles?filter[name][_eq]=Billing Staff" \
  -H "Authorization: Bearer $TOKEN" | jq -r '.data[0].id')

# Billing can create and manage bills
curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$BILLING_ID'",
    "collection": "billing",
    "action": "create",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$BILLING_ID'",
    "collection": "billing",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$BILLING_ID'",
    "collection": "billing",
    "action": "update",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$BILLING_ID'",
    "collection": "patients",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$BILLING_ID'",
    "collection": "opd_tokens",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$BILLING_ID'",
    "collection": "lab_tests",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

curl -s -X POST "$API/permissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "'$BILLING_ID'",
    "collection": "pharmacy_orders",
    "action": "read",
    "permissions": {"org_id": {"_eq": "$CURRENT_USER.org_id"}},
    "fields": ["*"]
  }' > /dev/null

echo "Billing Staff permissions set"

echo ""
echo "=== All roles and permissions created! ==="
echo ""
echo "Roles created:"
echo "- Hospital Admin"
echo "- Doctor"
echo "- Nurse"
echo "- Reception"
echo "- Lab Staff"
echo "- Pharmacy Staff"
echo "- Billing Staff"
echo "- Radiology Staff"
