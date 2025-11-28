#!/bin/bash

# Register new collections in Directus via API
DIRECTUS_URL="http://localhost:8060"

# Get admin token
printf '{"email":"superadmin@novoraplus.com","password":"Admin123!"}' > /tmp/login.json
AUTH_RESPONSE=$(curl -s -X POST "${DIRECTUS_URL}/auth/login" \
    -H "Content-Type: application/json" \
    -d @/tmp/login.json)

TOKEN=$(echo "$AUTH_RESPONSE" | jq -r '.data.access_token')

if [[ "$TOKEN" == "null" || -z "$TOKEN" ]]; then
    echo "Failed to get auth token"
    exit 1
fi

echo "Token obtained successfully"

# Collections to register
COLLECTIONS=(
    "staff"
    "radiology_tests"
    "symptoms"
    "investigations"
    "diagnosis_master"
    "medical_history"
    "lifestyle_options"
    "user_types"
    "payment_modes"
    "service_templates"
    "certificate_templates"
    "medicine_templates"
    "lab_report_templates"
    "icd_codes"
    "tpa_codes"
)

# Register each collection
for collection in "${COLLECTIONS[@]}"; do
    echo "Registering collection: $collection"

    # Check if collection exists
    response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        "${DIRECTUS_URL}/collections/${collection}")

    if [[ "$response" == "200" ]]; then
        echo "  Collection $collection already registered"
    else
        # Create collection registration
        curl -s -X POST "${DIRECTUS_URL}/collections" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d "{
                \"collection\": \"$collection\",
                \"meta\": {
                    \"collection\": \"$collection\",
                    \"icon\": \"database\",
                    \"note\": null,
                    \"display_template\": null,
                    \"hidden\": false,
                    \"singleton\": false,
                    \"translations\": null,
                    \"archive_field\": null,
                    \"archive_value\": null,
                    \"unarchive_value\": null,
                    \"sort_field\": null,
                    \"accountability\": \"all\",
                    \"color\": null
                }
            }" > /dev/null 2>&1

        echo "  Registered $collection"
    fi
done

echo ""
echo "Setting permissions for Administrator role..."

# Get Administrator role ID
ADMIN_ROLE=$(curl -s -H "Authorization: Bearer $TOKEN" "${DIRECTUS_URL}/roles" | jq -r '.data[] | select(.name == "Administrator") | .id')

if [[ -n "$ADMIN_ROLE" && "$ADMIN_ROLE" != "null" ]]; then
    echo "Administrator role ID: $ADMIN_ROLE"

    # Set full permissions for each collection
    for collection in "${COLLECTIONS[@]}"; do
        echo "Setting permissions for: $collection"

        # Create CRUD permissions
        for action in "create" "read" "update" "delete"; do
            curl -s -X POST "${DIRECTUS_URL}/permissions" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d "{
                    \"role\": \"$ADMIN_ROLE\",
                    \"collection\": \"$collection\",
                    \"action\": \"$action\",
                    \"permissions\": {},
                    \"validation\": {},
                    \"presets\": {},
                    \"fields\": [\"*\"]
                }" > /dev/null 2>&1
        done
    done

    echo "Permissions set for Administrator role"
else
    echo "Could not find Administrator role"
fi

# Clean up
rm -f /tmp/login.json

echo ""
echo "Collection registration complete!"
