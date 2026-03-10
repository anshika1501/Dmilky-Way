# Project Setup

This project has:
- Backend: Django REST API in `milkman/` (port 8000)
- Frontend: React + Vite app in `backened/` (port 5173)

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+

## Backend (Django) Setup

1) Create and activate a virtual environment (Windows PowerShell):

```
cd d:\Learning\Trae\testDay2\milkman
py -3 -m venv .venv
.venv\Scripts\activate
```

2) Install dependencies:

```
pip install "Django>=6,<7" djangorestframework django-cors-headers
```

3) Run migrations and start the server:

```
python manage.py migrate
python manage.py runserver
```

Backend runs at http://localhost:8000/

## Frontend (React + Vite) Setup

1) Install dependencies:

```
cd d:\Learning\Trae\testDay2\backened
npm install
```

2) Start the dev server:

```
npm run dev
```

Frontend runs at http://localhost:5173/

## API Endpoints

- Categories: `/category/`
- Products: `/product/`
- Customers: `/customer/`
- Subscriptions: `/subscriptions/`

Import the included Postman collection for quick testing:
`milkman-apis.postman_collection.json` in the project root.

## Notes

- CORS is enabled in the backend (`django-cors-headers`) for local development.
- Ensure backend is running before using the frontend or Postman requests.

## System Sequence Diagram

Here is a high-level sequence diagram of the E-Milk Shop application flow:

```mermaid
sequenceDiagram
    actor User
    participant Frontend as React Frontend (Vite)
    participant Auth as Django Auth API
    participant API as Django REST API
    participant DB as SQLite DB

    %% User Browsing Flow
    User->>Frontend: Access Homepage
    Frontend->>API: GET /product/
    API->>DB: Fetch Active Products
    DB-->>API: Return Product Data
    API-->>Frontend: 200 OK (Product List)
    Frontend-->>User: Display Products & Plans

    %% Authentication Flow
    User->>Frontend: Click Login / Register
    Frontend->>Auth: POST /api/token/ (or /register/)
    Auth->>DB: Validate Credentials
    DB-->>Auth: Validation Result
    Auth-->>Frontend: 200 OK (JWT Access & Refresh Tokens)
    Frontend-->>User: Update UI (Logged In State)
    
    %% Subscription/Checkout Flow
    User->>Frontend: Add to Cart & Checkout Plan
    Frontend->>API: POST /subscriptions/ (with JWT Authorization)
    API->>Auth: Validate JWT Token
    Auth-->>API: Token Valid
    API->>DB: Create Subscription Record
    DB-->>API: Record Created
    API-->>Frontend: 201 Created (Subscription Details)
    Frontend-->>User: Navigate to Thank You / Dashboard
    
    %% Admin Flow
    actor Admin
    Admin->>Frontend: Access Admin Dashboard
    Frontend->>API: GET /customer/, /staff/, etc.
    API->>DB: Fetch Admin Data
    DB-->>API: Return Records
    API-->>Frontend: 200 OK (Admin Views)
    Frontend-->>Admin: Display Management Dashboard
```
