# SpotOptics - Complete Folder Structure & File Map

This document details the complete directory layout, architecture, and file organization of the SpotOptics codebase.

---

## 📁 Repository Overview

```text
spot-optics/
├── prisma/                      # Database Schema & Migrations
│   └── schema.prisma            # Prisma MySQL Data Models (User, Menu, Software, SoftwareLink, ActivityLog, etc.)
│
├── public/                      # Static Assets (Images, Logos, Icons)
│
├── src/                         # Core Source Directory
│   ├── apiService/              # Frontend API Integration Layer
│   │   └── apiCollection.js     # Fetch / Axios requests for backend endpoints
│   │
│   ├── app/                     # Next.js 16 App Router Routes & Pages
│   │   ├── (account)/           # Protected Dashboard Route Group
│   │   │   ├── account.css      # Workspace & Dashboard styling system
│   │   │   ├── layout.jsx       # Conditional account shell layout (Sidebar & Navbar)
│   │   │   │
│   │   │   ├── components/      # UI & Layout components
│   │   │   │   ├── layout/      # Sidebar, Navbar, Header, Footer
│   │   │   │   └── ui/          # Reusable Bootstrap UI components
│   │   │   │       ├── Alert.jsx
│   │   │   │       ├── Breadcrumb.jsx
│   │   │   │       ├── Button.jsx
│   │   │   │       ├── Card.jsx
│   │   │   │       ├── DynamicForm.jsx
│   │   │   │       ├── Modal.jsx
│   │   │   │       ├── ProgressBar.jsx
│   │   │   │       ├── Table.jsx
│   │   │   │       └── ThemeToggle.jsx
│   │   │   │
│   │   │   ├── dashboard/       # Dashboard Modules
│   │   │   │   ├── page.jsx     # Overview Dashboard (Stats, Progress, Recent Activity)
│   │   │   │   ├── downloads/   # Asset Downloads Center Page
│   │   │   │   │   └── page.js
│   │   │   │   ├── links/       # Secure Links Management Page
│   │   │   │   │   └── page.js
│   │   │   │   ├── logs/        # System & Audit Logs Page
│   │   │   │   │   └── page.js
│   │   │   │   ├── menu/        # Navigation Menu Builder Page
│   │   │   │   │   └── page.js
│   │   │   │   ├── software/    # Software Catalog & Packages Page
│   │   │   │   │   └── page.js
│   │   │   │   └── users/       # User & Client Management Page
│   │   │   │       └── page.js
│   │   │   │
│   │   │   └── login/           # Authentication Login Page
│   │   │       └── page.js
│   │   │
│   │   ├── api/                 # Next.js API Route Handlers
│   │   │   ├── audit/           # Audit Logs API (/api/audit/logs)
│   │   │   ├── auth/            # Auth & Profile API (/api/auth/profile)
│   │   │   ├── chat/            # Chat Messaging API (/api/chat)
│   │   │   ├── dashboard/       # Workspace Stats API (/api/dashboard/stats)
│   │   │   ├── logs/            # System Logs API (/api/logs)
│   │   │   ├── menus/           # Menu CRUD API (/api/menus & /api/menus/[id])
│   │   │   ├── software/        # Software & Links API (/api/software & /api/software/links)
│   │   │   └── users/           # User Management API (/api/users & /api/users/[id])
│   │   │
│   │   ├── accessories/         # Public Optics Accessories Page
│   │   ├── all-products/        # Public Optics Product Catalog Page
│   │   ├── applications/        # Industrial Applications Page
│   │   ├── company-profile/     # About Us & Company Profile Page
│   │   ├── contact/             # Contact Us Page
│   │   ├── downloads/           # Public Downloads Resource Page
│   │   ├── faq/                 # Frequently Asked Questions Page
│   │   ├── knowledge/           # Knowledge Base Page
│   │   ├── privacy-policy/      # Privacy Policy Page
│   │   ├── technology/          # Technology Overview Page
│   │   ├── terms-and-conditions/# Terms and Conditions Page
│   │   │
│   │   ├── globals.css          # Global site CSS stylesheet
│   │   ├── layout.js            # Root App Layout (Redux Provider, Fonts, Meta)
│   │   ├── manifest.js          # PWA Web Application Manifest
│   │   ├── robots.js            # Dynamic SEO Robots.txt generator
│   │   └── sitemap.js           # Dynamic SEO Sitemap XML generator
│   │
│   ├── components/              # Public Web Components (Header, Footer, Product Cards)
│   ├── data/                    # Static / Mock initial datasets
│   ├── hooks/                   # Custom React Hooks
│   ├── lib/                     # System Utilities
│   │   ├── prisma.js            # Prisma Client Singleton Instance
│   │   └── demoAuth.js          # Authentication helper utilities
│   │
│   ├── redux/                   # Redux Toolkit Global State Store
│   │   ├── store.js             # Configured Redux Store
│   │   ├── api/                 # RTK Query APIs (authApi, menuApi, softwareApi)
│   │   └── slices/              # Redux Slices (authSlice, menuSlice, softwareSlice)
│   │
│   └── styles/                  # Supplemental CSS Module stylesheets
│
├── .env                         # Main Environment File
├── .env.local                   # Local Override Environment File
├── next.config.mjs              # Next.js Configuration
├── package.json                 # Project Dependencies & Scripts
├── prisma.config.js             # Prisma Configuration
└── README.md                    # Project README Documentation
```

---

## 🎯 Module Breakdown & Descriptions

### `/src/app/(account)/dashboard`
- **`page.jsx`**: Main analytics overview page rendering live stat cards, user distribution progress bar, and audit activities.
- **`users/page.js`**: User hierarchy management for Admins, Distributors, and Clients with menu access checkboxes and soft-delete controls.
- **`software/page.js`**: Software release catalog for adding binaries and assigning software to users.
- **`links/page.js`**: Software link generator creating time-sensitive tokens and download URLs.
- **`menu/page.js`**: Drag/sort menu builder for configuring dynamic sidebar items.
- **`downloads/page.js`**: Download manager tracking real-time asset downloads.
- **`logs/page.js`**: System log viewer for monitoring security events and activity histories.

### `/src/app/api`
- Backend API endpoints built with Next.js App Router route handlers. All secured routes verify JWT tokens from cookies or authorization headers.
