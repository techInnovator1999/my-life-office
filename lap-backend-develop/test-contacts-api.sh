#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3002/api/v1"

echo -e "${BLUE}=== Testing Contacts API ===${NC}\n"

# Step 1: Login to get JWT token
echo -e "${YELLOW}Step 1: Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/admin/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin"
  }')

# Check if login was successful
if echo "$LOGIN_RESPONSE" | grep -q "token"; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✓ Login successful${NC}"
  echo -e "Token: ${TOKEN:0:50}...\n"
else
  echo -e "${RED}✗ Login failed. Response:${NC}"
  echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
  echo -e "\n${YELLOW}Trying with client login...${NC}"
  
  LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/client/login" \
    -H "Content-Type: application/json" \
    -d '{
      "email": "test@example.com",
      "password": "password"
    }')
  
  if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo -e "${GREEN}✓ Login successful${NC}"
    echo -e "Token: ${TOKEN:0:50}...\n"
  else
    echo -e "${RED}✗ Client login also failed.${NC}"
    echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
    exit 1
  fi
fi

# Step 2: Test GET /contacts (List contacts)
echo -e "${YELLOW}Step 2: Testing GET /contacts (List all contacts)${NC}"
GET_RESPONSE=$(curl -s -X GET "${BASE_URL}/contacts" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

echo "$GET_RESPONSE" | jq '.' 2>/dev/null || echo "$GET_RESPONSE"
echo ""

# Step 3: Test POST /contacts (Create contact - Individual)
echo -e "${YELLOW}Step 3: Testing POST /contacts (Create Individual contact)${NC}"
CREATE_RESPONSE=$(curl -s -X POST "${BASE_URL}/contacts" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "contactType": "INDIVIDUAL",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "workPhone": "+1234567891",
    "dateOfBirth": "1990-01-15",
    "primaryAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "occupation": "Software Engineer",
    "employer": "Tech Corp",
    "spouse": "Jane Doe",
    "ssn": "123-45-6789",
    "mbiNumber": "1AB2CD3EF45",
    "notes": "Test individual contact",
    "source": "Website",
    "referredBy": "Friend"
  }')

if echo "$CREATE_RESPONSE" | grep -q "id"; then
  CONTACT_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✓ Contact created successfully${NC}"
  echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_RESPONSE"
  echo ""
else
  echo -e "${RED}✗ Failed to create contact${NC}"
  echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_RESPONSE"
  CONTACT_ID=""
fi

# Step 4: Test POST /contacts (Create Business contact)
echo -e "${YELLOW}Step 4: Testing POST /contacts (Create Business contact)${NC}"
CREATE_BUSINESS_RESPONSE=$(curl -s -X POST "${BASE_URL}/contacts" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "contactType": "BUSINESS",
    "companyName": "Acme Corporation",
    "email": "info@acme.com",
    "primaryAddress": "456 Business Ave",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "industryType": "Technology",
    "ownerName": "Bob Smith",
    "ownerTitle": "CEO",
    "ownerEmail": "bob@acme.com",
    "ownerPhone": "+1987654321",
    "otherName": "Alice Johnson",
    "otherTitle": "CFO",
    "otherEmail": "alice@acme.com",
    "otherPhone": "+1987654322",
    "notes": "Test business contact",
    "source": "Referral",
    "referredBy": "Partner"
  }')

if echo "$CREATE_BUSINESS_RESPONSE" | grep -q "id"; then
  BUSINESS_ID=$(echo "$CREATE_BUSINESS_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✓ Business contact created successfully${NC}"
  echo "$CREATE_BUSINESS_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_BUSINESS_RESPONSE"
  echo ""
else
  echo -e "${RED}✗ Failed to create business contact${NC}"
  echo "$CREATE_BUSINESS_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_BUSINESS_RESPONSE"
  BUSINESS_ID=""
fi

# Step 5: Test POST /contacts (Create Employee contact)
echo -e "${YELLOW}Step 5: Testing POST /contacts (Create Employee contact)${NC}"
CREATE_EMPLOYEE_RESPONSE=$(curl -s -X POST "${BASE_URL}/contacts" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "contactType": "EMPLOYEE",
    "firstName": "Sarah",
    "lastName": "Williams",
    "email": "sarah.williams@example.com",
    "phoneNumber": "+1555123456",
    "workPhone": "+1555123457",
    "dateOfBirth": "1985-05-20",
    "primaryAddress": "789 Employee St",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601",
    "occupation": "Manager",
    "employer": "Acme Corporation",
    "parentCompany": "Acme Holdings",
    "notes": "Test employee contact",
    "source": "Internal",
    "referredBy": "HR"
  }')

if echo "$CREATE_EMPLOYEE_RESPONSE" | grep -q "id"; then
  EMPLOYEE_ID=$(echo "$CREATE_EMPLOYEE_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
  echo -e "${GREEN}✓ Employee contact created successfully${NC}"
  echo "$CREATE_EMPLOYEE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_EMPLOYEE_RESPONSE"
  echo ""
else
  echo -e "${RED}✗ Failed to create employee contact${NC}"
  echo "$CREATE_EMPLOYEE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_EMPLOYEE_RESPONSE"
  EMPLOYEE_ID=""
fi

# Step 6: Test GET /contacts/:id (Get contact by ID)
if [ ! -z "$CONTACT_ID" ]; then
  echo -e "${YELLOW}Step 6: Testing GET /contacts/${CONTACT_ID}${NC}"
  GET_ONE_RESPONSE=$(curl -s -X GET "${BASE_URL}/contacts/${CONTACT_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json")
  
  echo "$GET_ONE_RESPONSE" | jq '.' 2>/dev/null || echo "$GET_ONE_RESPONSE"
  echo ""
fi

# Step 7: Test PATCH /contacts/:id (Update contact)
if [ ! -z "$CONTACT_ID" ]; then
  echo -e "${YELLOW}Step 7: Testing PATCH /contacts/${CONTACT_ID} (Update contact)${NC}"
  UPDATE_RESPONSE=$(curl -s -X PATCH "${BASE_URL}/contacts/${CONTACT_ID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d '{
      "occupation": "Senior Software Engineer",
      "notes": "Updated contact information"
    }')
  
  echo "$UPDATE_RESPONSE" | jq '.' 2>/dev/null || echo "$UPDATE_RESPONSE"
  echo ""
fi

# Step 8: Test GET /contacts with filters
echo -e "${YELLOW}Step 8: Testing GET /contacts with filters${NC}"
FILTER_RESPONSE=$(curl -s -X GET "${BASE_URL}/contacts?filters[contactType]=INDIVIDUAL&page=1&limit=5" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json")

echo "$FILTER_RESPONSE" | jq '.' 2>/dev/null || echo "$FILTER_RESPONSE"
echo ""

echo -e "${GREEN}=== API Testing Complete ===${NC}"


