export const sampleJson = `[
  {
    "id": "ord-001",
    "customer": {
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "profile": {
        "tier": "gold",
        "memberSince": "2021-03-15",
        "preferences": {
          "newsletter": true,
          "smsAlerts": false
        }
      }
    },
    "items": [
      {
        "sku": "WIDGET-001",
        "name": "Premium Widget",
        "quantity": 2,
        "price": 29.99,
        "metadata": {
          "color": "blue",
          "size": "medium"
        }
      },
      {
        "sku": "GADGET-002",
        "name": "Super Gadget",
        "quantity": 1,
        "price": 149.99,
        "metadata": {
          "warranty": "2 years"
        }
      }
    ],
    "shipping": {
      "address": {
        "street": "123 Main St",
        "city": "Springfield",
        "state": "IL",
        "zip": "62701",
        "country": "USA"
      },
      "method": "express",
      "cost": 15.00
    },
    "totals": {
      "subtotal": 209.97,
      "tax": 17.85,
      "shipping": 15.00,
      "total": 242.82
    },
    "status": "processing",
    "createdAt": "2024-01-15T10:30:00Z",
    "tags": ["priority", "gift-wrap"]
  },
  {
    "id": "ord-002",
    "customer": {
      "name": "Bob Smith",
      "email": "bob@example.com",
      "profile": {
        "tier": "silver",
        "memberSince": "2022-08-20",
        "preferences": {
          "newsletter": false,
          "smsAlerts": true
        }
      }
    },
    "items": [
      {
        "sku": "TOOL-003",
        "name": "Multi-Tool Kit",
        "quantity": 1,
        "price": 79.99,
        "metadata": {
          "pieces": 50
        }
      }
    ],
    "shipping": {
      "address": {
        "street": "456 Oak Ave",
        "city": "Portland",
        "state": "OR",
        "zip": "97201",
        "country": "USA"
      },
      "method": "standard",
      "cost": 5.00
    },
    "totals": {
      "subtotal": 79.99,
      "tax": 6.40,
      "shipping": 5.00,
      "total": 91.39
    },
    "status": "shipped",
    "createdAt": "2024-01-14T14:45:00Z",
    "trackingNumber": "1Z999AA10123456784"
  }
]`

export const sampleJsonDescription = 'E-commerce orders with nested customer profiles, line items, and shipping details'
