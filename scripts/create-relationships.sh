#!/bin/bash

TOKEN=$(cat /tmp/directus_token.txt)
API="http://localhost:8060"

echo "=== Creating Relationships ==="

# Add org_id to all collections
collections=("departments" "patients" "opd_tokens" "beds" "ipd_admissions" "lab_tests" "pharmacy_orders" "inventory" "billing" "ipd_daily_records")

for collection in "${collections[@]}"; do
  echo "Adding org_id to $collection..."
  curl -s -X POST "$API/fields/$collection" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "field": "org_id",
      "type": "uuid",
      "meta": {
        "interface": "select-dropdown-m2o",
        "special": ["m2o"],
        "required": true,
        "display": "related-values",
        "display_options": { "template": "{{code}} - {{name}}" }
      },
      "schema": {}
    }' | jq -r '.data.field // .errors[0].message'
done

# Create M2O relationships
echo ""
echo "=== Creating Many-to-One Relationships ==="

# departments -> organizations
echo "departments.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "departments",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

# patients -> organizations
echo "patients.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "patients",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

# beds -> organizations
echo "beds.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "beds",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

# opd_tokens -> organizations
echo "opd_tokens.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "opd_tokens",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

# Add patient_id to opd_tokens
echo "Adding patient_id to opd_tokens..."
curl -s -X POST "$API/fields/opd_tokens" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "patient_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "required": true,
      "display": "related-values",
      "display_options": { "template": "{{patient_code}} - {{name}}" }
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "opd_tokens",
    "field": "patient_id",
    "related_collection": "patients"
  }' | jq -r '.data.collection // .errors[0].message'

# Add doctor_id to opd_tokens (link to directus_users)
echo "Adding doctor_id to opd_tokens..."
curl -s -X POST "$API/fields/opd_tokens" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "doctor_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "display": "related-values",
      "display_options": { "template": "{{first_name}} {{last_name}}" }
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "opd_tokens",
    "field": "doctor_id",
    "related_collection": "directus_users"
  }' | jq -r '.data.collection // .errors[0].message'

# Add department_id to opd_tokens
echo "Adding department_id to opd_tokens..."
curl -s -X POST "$API/fields/opd_tokens" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "department_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "display": "related-values",
      "display_options": { "template": "{{name}}" }
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "opd_tokens",
    "field": "department_id",
    "related_collection": "departments"
  }' | jq -r '.data.collection // .errors[0].message'

# IPD Admissions relationships
echo "ipd_admissions.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_admissions",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding patient_id to ipd_admissions..."
curl -s -X POST "$API/fields/ipd_admissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "patient_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "required": true,
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_admissions",
    "field": "patient_id",
    "related_collection": "patients"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding bed_id to ipd_admissions..."
curl -s -X POST "$API/fields/ipd_admissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "bed_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_admissions",
    "field": "bed_id",
    "related_collection": "beds"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding doctor_id to ipd_admissions..."
curl -s -X POST "$API/fields/ipd_admissions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "doctor_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_admissions",
    "field": "doctor_id",
    "related_collection": "directus_users"
  }' | jq -r '.data.collection // .errors[0].message'

# Lab Tests relationships
echo "lab_tests.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "lab_tests",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding patient_id to lab_tests..."
curl -s -X POST "$API/fields/lab_tests" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "patient_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "required": true,
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "lab_tests",
    "field": "patient_id",
    "related_collection": "patients"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding opd_id to lab_tests..."
curl -s -X POST "$API/fields/lab_tests" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "opd_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "lab_tests",
    "field": "opd_id",
    "related_collection": "opd_tokens"
  }' | jq -r '.data.collection // .errors[0].message'

# Pharmacy Orders relationships
echo "pharmacy_orders.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "pharmacy_orders",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding patient_id to pharmacy_orders..."
curl -s -X POST "$API/fields/pharmacy_orders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "patient_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "required": true,
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "pharmacy_orders",
    "field": "patient_id",
    "related_collection": "patients"
  }' | jq -r '.data.collection // .errors[0].message'

# Inventory relationships
echo "inventory.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "inventory",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

# Billing relationships
echo "billing.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "billing",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding patient_id to billing..."
curl -s -X POST "$API/fields/billing" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "patient_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "required": true,
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "billing",
    "field": "patient_id",
    "related_collection": "patients"
  }' | jq -r '.data.collection // .errors[0].message'

# IPD Daily Records relationships
echo "ipd_daily_records.org_id -> organizations..."
curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_daily_records",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding ipd_id to ipd_daily_records..."
curl -s -X POST "$API/fields/ipd_daily_records" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "ipd_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "required": true,
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_daily_records",
    "field": "ipd_id",
    "related_collection": "ipd_admissions"
  }' | jq -r '.data.collection // .errors[0].message'

echo "Adding recorded_by to ipd_daily_records..."
curl -s -X POST "$API/fields/ipd_daily_records" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "recorded_by",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "display": "related-values"
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_daily_records",
    "field": "recorded_by",
    "related_collection": "directus_users"
  }' | jq -r '.data.collection // .errors[0].message'

# Add org_id to directus_users for multi-tenancy
echo "Adding org_id to directus_users..."
curl -s -X POST "$API/fields/directus_users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "field": "org_id",
    "type": "uuid",
    "meta": {
      "interface": "select-dropdown-m2o",
      "special": ["m2o"],
      "display": "related-values",
      "display_options": { "template": "{{code}} - {{name}}" }
    },
    "schema": {}
  }' | jq -r '.data.field // .errors[0].message'

curl -s -X POST "$API/relations" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "directus_users",
    "field": "org_id",
    "related_collection": "organizations"
  }' | jq -r '.data.collection // .errors[0].message'

echo ""
echo "=== All relationships created! ==="
