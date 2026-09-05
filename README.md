HaatBari Express — Complete Project Documentation 
Target Region: Bangladesh (BDT Currency ৳)

1. Executive Summary
HaatBari Express is a single-page full-stack e-commerce web application engineered specifically for fast online grocery shopping and fresh produce delivery. Built on the MERN stack (MongoDB, Express, React, Node.js) with Vite and Tailwind CSS, the platform eliminates traditional e-commerce friction—such as full-page reloads and blocking browser popups—by providing an instant, component-driven single-page experience with real-time state synchronization.

haatbari-express/
├── client/                      # React + Vite Frontend
│   ├── src/
│   │   ├── assets/              # Logos, banners, vector icons
│   │   ├── components/
│   │   │   ├── Common/          # Navbar.jsx, Footer.jsx, Toast.jsx
│   │   │   ├── Cards/           # DealCard.jsx, ProductCard.jsx
│   │   │   └── Home/            # FeaturedDeals.jsx, HeroBanner.jsx
│   │   ├── Features/
│   │   │   └── context/         # CartContext.jsx
│   │   ├── pages/               # Home.jsx, Shop.jsx, ProductDetails.jsx
│   │   ├── App.jsx              # Main router & routes definition
│   │   └── main.jsx             # React DOM entry point
│   ├── .env                     # Client environment variables (VITE_API_URL)
│   └── tailwind.config.js       # Custom colors and utility extension
│
└── server/                      # Node.js + Express Backend
    ├── config/                  # Database connection (db.js)
    ├── controllers/             # Product and order controller logic
    ├── models/                  # Mongoose Schemas (Product.js, Order.js)
    ├── routes/                  # Express REST API routes (/api/products)
    └── server.js                # Express application entry point

***Component Breakdown & Functional Logic***
Navbar.jsx (Header Navigation)
Brand Identity: Renders the HaatBari Express logo and quick-navigation links.

Reactive Cart Indicator: Subscribes to CartContext to display the active item count and subtotal total in real time (e.g., Cart • ৳350 (2)).

Global Search: Search input field for filtering products across the catalog.

(FeaturedDeals.jsx) [Promotional Showcase]
Data Fetching: On component mount, executes GET /api/products?onSale=true.

Layout: Rendered within a mobile-first responsive CSS Grid (grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4).

State States: Manages loading skeletons and error handling states cleanly.

(DealCard.jsx) [Interactive Product Unit]
Discount Badge: Absolute-positioned tag (#FF1E46) indicating active sales percentage.

Product Media: Square aspect-ratio image wrapper with hover scale animation (group-hover:scale-105).

Metadata Block: Category label, 2-line title clamp, unit weight (e.g., 1 kg), star rating, and price display (৳120 vs. strike-through ৳150).

Add Action: Interactive green plus button (#00B058) executing addToCart(item) with event propagation stoppage to prevent accidental navigation clicks.

#Toast Notification Component
UX Purpose: Replaces native browser alert() windows with non-blocking feedback.

Positioning: Fixed float overlay (fixed bottom-6 right-6 z-[9999]).

Auto-Dismiss: Self-dismissing timer (2.5 seconds) allowing continuous shopping uninterrupted.

(Footer.jsx) [Directory Navigation]
Corporate Details: Business address (GEC Circle, Chowk Bazar, Chattogram), hours, and support emails.

Directory Grid: Multi-column links for Shop categories, Fresh Produce, Customer Care, and Order Tracking.

Localization & Legal: Language selector (English (BD)), copyright notice, social shortcuts, and policy links.

# Mongoose Product Schema Example
JSON
{
  "_id": "65f1a2b3c4d5e6f7a8b9c0d1",
  "name": "Organic Vine Tomatoes",
  "category": "Vegetables",
  "price": 120,
  "oldPrice": 150,
  "discount": "20% OFF",
  "weight": "1 kg",
  "rating": 4.8,
  "image": "https://example.com/images/tomatoes.jpg",
  "onSale": true,
  "createdAt": "2026-01-15T08:30:00.000Z"
}

#. Global State Data Flow
Plaintext
[ User Clicks '+' Button on DealCard ]
                  │
                  ▼
   e.stopPropagation() & e.preventDefault()
                  │
                  ▼
       addToCart(item) via useCart()
                  │
                  ▼
 ┌─────────────────────────────────────────┐
 │ CartContext State Mutates:             │
 │  1. Append item / increment quantity    │
 │  2. Recalculate Total BDT Price (৳)     │
 └─────────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
Navbar Re-renders     Toast Notification Triggers
(Count & Total ৳)     (Auto-dismisses in 2.5s)

# Design System & Style Tokens
Primary Brand Green: #00B058 (Primary buttons, brand logo, active states)

Hover State Green: #008A45 (Interactive button hover states)

Discount Tag Red: #FF1E46 (Sales tags and promotional highlights)

Deep Charcoal: #111827 (Primary headings, dark mode toast container)

Secondary Gray: #6B7280 / #9CA3AF (Subheaders, line-through pricing, muted borders)

Background Light: #F9FAFB / #F3F4F6 (Card image backgrounds, subtle borders)
