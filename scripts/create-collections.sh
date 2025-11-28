#!/bin/bash

TOKEN=$(cat /tmp/directus_token.txt)
API="http://localhost:8060"

echo "=== Creating Hospital SaaS Collections ==="

# 1. Create Organizations (Hospitals) Collection
echo "1. Creating organizations collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "organizations",
    "meta": {
      "collection": "organizations",
      "icon": "corporate_fare",
      "note": "Hospitals and clinics",
      "display_template": "{{code}} - {{name}}",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "code",
        "type": "string",
        "meta": { "interface": "input", "options": { "placeholder": "H101" }, "width": "half", "required": true }
      },
      {
        "field": "name",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "logo",
        "type": "uuid",
        "meta": { "interface": "file-image", "special": ["file"] }
      },
      {
        "field": "address",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "city",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "state",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "phone",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "email",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "owner_name",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "owner_mobile",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "razorpay_account_id",
        "type": "string",
        "meta": { "interface": "input", "note": "For split payments" }
      },
      {
        "field": "whatsapp_number",
        "type": "string",
        "meta": { "interface": "input" }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Active","value":"active"},{"text":"Inactive","value":"inactive"},{"text":"Suspended","value":"suspended"}] }, "width": "half" },
        "schema": { "default_value": "active" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      },
      {
        "field": "date_updated",
        "type": "timestamp",
        "meta": { "special": ["date-updated"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 2. Create Departments Collection
echo "2. Creating departments collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "departments",
    "meta": {
      "collection": "departments",
      "icon": "domain",
      "note": "Hospital departments",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "name",
        "type": "string",
        "meta": { "interface": "input", "required": true }
      },
      {
        "field": "code",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "description",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Active","value":"active"},{"text":"Inactive","value":"inactive"}] } },
        "schema": { "default_value": "active" }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 3. Create Patients Collection
echo "3. Creating patients collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "patients",
    "meta": {
      "collection": "patients",
      "icon": "person",
      "note": "Patient records",
      "display_template": "{{patient_code}} - {{name}}",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "patient_code",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "note": "Auto-generated per org" }
      },
      {
        "field": "name",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "mobile",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "email",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "date_of_birth",
        "type": "date",
        "meta": { "interface": "datetime", "width": "half" }
      },
      {
        "field": "gender",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Male","value":"male"},{"text":"Female","value":"female"},{"text":"Other","value":"other"}] }, "width": "half" }
      },
      {
        "field": "blood_group",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"A+","value":"A+"},{"text":"A-","value":"A-"},{"text":"B+","value":"B+"},{"text":"B-","value":"B-"},{"text":"AB+","value":"AB+"},{"text":"AB-","value":"AB-"},{"text":"O+","value":"O+"},{"text":"O-","value":"O-"}] }, "width": "half" }
      },
      {
        "field": "address",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "emergency_contact",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "emergency_contact_name",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "allergies",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "medical_history",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 4. Create OPD Tokens Collection
echo "4. Creating opd_tokens collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "opd_tokens",
    "meta": {
      "collection": "opd_tokens",
      "icon": "confirmation_number",
      "note": "OPD queue tokens",
      "display_template": "Token #{{token_number}}",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "token_number",
        "type": "integer",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "token_date",
        "type": "date",
        "meta": { "interface": "datetime", "width": "half", "required": true }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Waiting","value":"waiting"},{"text":"In Progress","value":"in_progress"},{"text":"Completed","value":"completed"},{"text":"Cancelled","value":"cancelled"}] }, "width": "half" },
        "schema": { "default_value": "waiting" }
      },
      {
        "field": "priority",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Normal","value":"normal"},{"text":"Urgent","value":"urgent"},{"text":"Emergency","value":"emergency"}] }, "width": "half" },
        "schema": { "default_value": "normal" }
      },
      {
        "field": "symptoms",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "diagnosis",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "prescription",
        "type": "json",
        "meta": { "interface": "input-code", "options": { "language": "json" } }
      },
      {
        "field": "notes",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "consultation_fee",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "called_at",
        "type": "timestamp",
        "meta": { "interface": "datetime" }
      },
      {
        "field": "completed_at",
        "type": "timestamp",
        "meta": { "interface": "datetime" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 5. Create Beds Collection
echo "5. Creating beds collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "beds",
    "meta": {
      "collection": "beds",
      "icon": "single_bed",
      "note": "Hospital beds",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "bed_number",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "ward",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "bed_type",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"General","value":"general"},{"text":"Semi-Private","value":"semi_private"},{"text":"Private","value":"private"},{"text":"ICU","value":"icu"},{"text":"NICU","value":"nicu"}] }, "width": "half" }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Available","value":"available"},{"text":"Occupied","value":"occupied"},{"text":"Maintenance","value":"maintenance"}] }, "width": "half" },
        "schema": { "default_value": "available" }
      },
      {
        "field": "daily_rate",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 6. Create IPD Admissions Collection
echo "6. Creating ipd_admissions collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_admissions",
    "meta": {
      "collection": "ipd_admissions",
      "icon": "local_hospital",
      "note": "IPD admissions",
      "display_template": "IPD #{{ipd_number}}",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "ipd_number",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "admission_type",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Emergency","value":"emergency"},{"text":"Planned","value":"planned"},{"text":"Referral","value":"referral"}] }, "width": "half" }
      },
      {
        "field": "admission_date",
        "type": "timestamp",
        "meta": { "interface": "datetime", "width": "half", "required": true }
      },
      {
        "field": "expected_discharge",
        "type": "date",
        "meta": { "interface": "datetime", "width": "half" }
      },
      {
        "field": "discharge_date",
        "type": "timestamp",
        "meta": { "interface": "datetime", "width": "half" }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Admitted","value":"admitted"},{"text":"Discharged","value":"discharged"},{"text":"Transferred","value":"transferred"},{"text":"LAMA","value":"lama"},{"text":"Deceased","value":"deceased"}] }, "width": "half" },
        "schema": { "default_value": "admitted" }
      },
      {
        "field": "diagnosis",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "treatment_plan",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "discharge_summary",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "total_amount",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 7. Create Lab Tests Collection
echo "7. Creating lab_tests collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "lab_tests",
    "meta": {
      "collection": "lab_tests",
      "icon": "biotech",
      "note": "Laboratory tests",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "test_code",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "test_name",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "test_category",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Pathology","value":"pathology"},{"text":"Radiology","value":"radiology"},{"text":"Cardiology","value":"cardiology"},{"text":"Microbiology","value":"microbiology"}] }, "width": "half" }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Pending","value":"pending"},{"text":"Sample Collected","value":"sample_collected"},{"text":"In Progress","value":"in_progress"},{"text":"Completed","value":"completed"}] }, "width": "half" },
        "schema": { "default_value": "pending" }
      },
      {
        "field": "result",
        "type": "json",
        "meta": { "interface": "input-code", "options": { "language": "json" } }
      },
      {
        "field": "report_pdf",
        "type": "uuid",
        "meta": { "interface": "file", "special": ["file"] }
      },
      {
        "field": "notes",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "amount",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "sample_collected_at",
        "type": "timestamp",
        "meta": { "interface": "datetime" }
      },
      {
        "field": "completed_at",
        "type": "timestamp",
        "meta": { "interface": "datetime" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 8. Create Pharmacy Orders Collection
echo "8. Creating pharmacy_orders collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "pharmacy_orders",
    "meta": {
      "collection": "pharmacy_orders",
      "icon": "medication",
      "note": "Pharmacy prescriptions and orders",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "order_number",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "medicines",
        "type": "json",
        "meta": { "interface": "input-code", "options": { "language": "json" } }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Pending","value":"pending"},{"text":"Processing","value":"processing"},{"text":"Dispensed","value":"dispensed"},{"text":"Cancelled","value":"cancelled"}] }, "width": "half" },
        "schema": { "default_value": "pending" }
      },
      {
        "field": "total_amount",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "discount",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "payment_status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Unpaid","value":"unpaid"},{"text":"Paid","value":"paid"},{"text":"Partial","value":"partial"}] }, "width": "half" },
        "schema": { "default_value": "unpaid" }
      },
      {
        "field": "notes",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "dispensed_at",
        "type": "timestamp",
        "meta": { "interface": "datetime" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 9. Create Inventory Collection
echo "9. Creating inventory collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "inventory",
    "meta": {
      "collection": "inventory",
      "icon": "inventory_2",
      "note": "Medicine and supplies inventory",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "item_code",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "item_name",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "category",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Medicine","value":"medicine"},{"text":"Surgical","value":"surgical"},{"text":"Consumables","value":"consumables"},{"text":"Equipment","value":"equipment"}] }, "width": "half" }
      },
      {
        "field": "quantity",
        "type": "integer",
        "meta": { "interface": "input", "width": "half" },
        "schema": { "default_value": 0 }
      },
      {
        "field": "unit",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "min_stock_level",
        "type": "integer",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "purchase_price",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "selling_price",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "batch_number",
        "type": "string",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "expiry_date",
        "type": "date",
        "meta": { "interface": "datetime", "width": "half" }
      },
      {
        "field": "supplier",
        "type": "string",
        "meta": { "interface": "input" }
      },
      {
        "field": "status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Active","value":"active"},{"text":"Low Stock","value":"low_stock"},{"text":"Out of Stock","value":"out_of_stock"},{"text":"Expired","value":"expired"}] }, "width": "half" },
        "schema": { "default_value": "active" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 10. Create Billing Collection
echo "10. Creating billing collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "billing",
    "meta": {
      "collection": "billing",
      "icon": "receipt_long",
      "note": "Bills and invoices",
      "display_template": "Bill #{{invoice_number}}",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "invoice_number",
        "type": "string",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "bill_type",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"OPD","value":"opd"},{"text":"IPD","value":"ipd"},{"text":"Lab","value":"lab"},{"text":"Pharmacy","value":"pharmacy"},{"text":"Radiology","value":"radiology"}] }, "width": "half" }
      },
      {
        "field": "items",
        "type": "json",
        "meta": { "interface": "input-code", "options": { "language": "json" } }
      },
      {
        "field": "subtotal",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "discount",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "tax",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "total",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half", "required": true }
      },
      {
        "field": "paid_amount",
        "type": "decimal",
        "meta": { "interface": "input", "width": "half" }
      },
      {
        "field": "payment_status",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Unpaid","value":"unpaid"},{"text":"Partial","value":"partial"},{"text":"Paid","value":"paid"},{"text":"Refunded","value":"refunded"}] }, "width": "half" },
        "schema": { "default_value": "unpaid" }
      },
      {
        "field": "payment_method",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Cash","value":"cash"},{"text":"Card","value":"card"},{"text":"UPI","value":"upi"},{"text":"Online","value":"online"},{"text":"Insurance","value":"insurance"}] }, "width": "half" }
      },
      {
        "field": "razorpay_payment_id",
        "type": "string",
        "meta": { "interface": "input" }
      },
      {
        "field": "notes",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

# 11. Create IPD Daily Records Collection
echo "11. Creating ipd_daily_records collection..."
curl -s -X POST "$API/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "ipd_daily_records",
    "meta": {
      "collection": "ipd_daily_records",
      "icon": "event_note",
      "note": "Daily nursing and doctor records for IPD",
      "singleton": false
    },
    "schema": {},
    "fields": [
      {
        "field": "id",
        "type": "uuid",
        "meta": { "hidden": true, "readonly": true, "interface": "input", "special": ["uuid"] },
        "schema": { "is_primary_key": true }
      },
      {
        "field": "record_date",
        "type": "date",
        "meta": { "interface": "datetime", "required": true }
      },
      {
        "field": "record_type",
        "type": "string",
        "meta": { "interface": "select-dropdown", "options": { "choices": [{"text":"Nursing","value":"nursing"},{"text":"Doctor Visit","value":"doctor_visit"},{"text":"Vitals","value":"vitals"}] }, "width": "half" }
      },
      {
        "field": "vitals",
        "type": "json",
        "meta": { "interface": "input-code", "options": { "language": "json" }, "note": "BP, Temp, Pulse, SPO2, etc." }
      },
      {
        "field": "notes",
        "type": "text",
        "meta": { "interface": "input-multiline" }
      },
      {
        "field": "medications_given",
        "type": "json",
        "meta": { "interface": "input-code", "options": { "language": "json" } }
      },
      {
        "field": "date_created",
        "type": "timestamp",
        "meta": { "special": ["date-created"], "interface": "datetime", "readonly": true, "hidden": true }
      }
    ]
  }' | jq -r '.data.collection // .errors[0].message'

echo ""
echo "=== All collections created! ==="
echo ""
echo "Access Directus Admin at: http://localhost:8060"
echo "Email: superadmin@novoraplus.com"
echo "Password: NovoraPlus@2024"
