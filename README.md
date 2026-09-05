haatbari-express/
├── client/                      # React + Vite Frontend Application
│   ├── src/
│   │   ├── assets/              # Static images, logos, and icons
│   │   ├── components/          # Reusable UI Components
│   │   │   ├── Common/          # Navbar, Footer, Toast Notification
│   │   │   ├── Cards/           # DealCard, ProductCard
│   │   │   └── Home/            # FeaturedDeals, HeroBanner
│   │   ├── Features/            # Application Contexts
│   │   │   └── context/         # CartContext.jsx
│   │   ├── pages/               # Route Pages (Home, Shop, ProductDetails)
│   │   ├── App.jsx              # Main App Routes Configuration
│   │   └── main.jsx             # Entry Point
│   ├── .env.example             # Example environment variables
│   └── tailwind.config.js       # Tailwind CSS Configuration
│
└── server/                      # Node.js + Express Backend API
    ├── config/                  # Database Configuration (db.js)
    ├── controllers/             # Request Handling Logic
    ├── models/                  # Mongoose Schemas (Product.js, Order.js)
    ├── routes/                  # Express API Endpoint Routes
    ├── .env.example             # Backend Environment Template
    └── server.js                # Server Entry Point
