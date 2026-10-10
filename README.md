# SpotOptics - Advanced Software Management & Workspace Platform

**SpotOptics** is a modern, enterprise-grade Next.js web application and dashboard suite designed for optics software management, user role hierarchies (Admins, Distributors, Clients), time-sensitive secure link distribution, dynamic navigation building, download tracking, and audit logging.

---

## 🚀 Key Features & Modules

### 1. 🔐 User Role Hierarchy & Management (`/dashboard/users`)
- **Role Hierarchy**: Structured access levels for `ADMIN`, `DISTRIBUTOR`, and `CLIENT`.
- **User Control**: Add, update, assign menus, and toggle active/inactive status (soft deletion).
- **Sub-user Management**: Distributors can manage their assigned Clients under parent-child relationships.

### 2. 💿 Software Catalog Management (`/dashboard/software`)
- Add, edit, and deactivate software binary releases and packages.
- Dynamic software assignments to specific distributors or clients.

### 3. 🔗 Secure Link Generation (`/dashboard/links`)
- Generate time-sensitive, token-protected download links (`/api/software/links`).
- Track claim status (`isUsed: true / false`), assigner details, and receiver information.

### 4. 🧭 Dynamic Navigation Menu Builder (`/dashboard/menu`)
- Configure sidebar menus dynamically per user or role.
- Custom Lucide icons, display ordering (`sortOrder`), parent-child nested menus, and status management.

### 5. 📥 Asset Downloads Center (`/dashboard/downloads`)
- Interactive download manager with real-time stream handlers and progress indicators.

### 6. 📜 Audit & System Logs (`/dashboard/logs`)
- Live audit trail capturing user actions (`CREATED_CLIENT`, `DOWNLOADED_SOFTWARE`, `LOGIN`, etc.).
- IP tracking, user-agent details, and filterable log history.

### 7. 🌐 Public Website & Product Catalog
- SEO-optimized public pages (`/all-products`, `/technology`, `/company-profile`, `/contact`, `/applications`, `/accessories`, `/faq`, `/knowledge`).
- Dynamic sitemap (`sitemap.js`), `manifest.js`, and `robots.js`.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with MySQL database
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & RTK Query
- **Authentication**: JWT (`jose`), HTTP-only cookies, & Bearer header auth
- **Styling**: Bootstrap 5, Custom Vanilla CSS, Lucide Icons (No Tailwind CSS)
- **Language**: JavaScript (ES6+ / React 19)

---

## 📦 Getting Started

### 1. Prerequisites
- **Node.js**: v18.x or higher
- **MySQL**: Server running locally or remotely

### 2. Installation & Setup

1. **Clone the repository & install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables (`.env`)**:
   Create a `.env` file in the project root:
   ```env
   DATABASE_URL="mysql://root:password@localhost:3306/spot_optics"
   JWT_SECRET="your_custom_jwt_secret_key"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

3. **Initialize Database Schema**:
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   - Open [http://localhost:3000](http://localhost:3000) in your browser.
   - Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - Menu Management: [http://localhost:3000/dashboard/menu](http://localhost:3000/dashboard/menu)

---

## 🌐 API Routes Summary

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/profile` | `GET` | Get current authenticated user profile |
| `/api/dashboard/stats` | `GET` | Workspace stats, progress metrics, and recent activities |
| `/api/users` | `GET`, `POST` | List users, create distributor/client accounts |
| `/api/users/[id]` | `PUT`, `DELETE` | Update user details, assign menus, toggle status |
| `/api/software` | `GET`, `POST` | Software catalog CRUD operations |
| `/api/software/[id]` | `PUT`, `DELETE` | Software update & soft delete |
| `/api/software/links` | `GET`, `POST` | Generate & view secure software download links |
| `/api/menus` | `GET`, `POST` | Fetch active/all navigation items & create menus |
| `/api/menus/[id]` | `PUT`, `DELETE` | Update menu details, reorder, soft delete |
| `/api/audit/logs` | `GET` | System audit logs with module/action filters |

---

## 📄 Documentation

For full breakdown of directory layout and file organization, view [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md).
