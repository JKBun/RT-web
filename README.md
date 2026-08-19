# Rotaract Club of NIBM Kandy — Web Management System (RT-Web)

A full-stack, web-based management platform and dynamic portal engineered for the **Rotaract Club of NIBM Kandy** (Chartered under Rotary District 3220, sponsored by the Rotary Club of Kandy).

---

## 🌟 Key Features

* **Interactive Public Showcase:** Responsive landing portal with video controls, avenue showcases, active leadership directory, and project impact metrics.
* **Automated Event Registration & Digital Passes:** Real-time quota validation with instant generation of unique alphanumeric pass codes (`RT-NIBM-x-xxxx`) and QR verification matrix.
* **Volunteer Service Hour Tracking:** Self-service portal for members to submit, track, and review verified community service hours for annual District citations.
* **MVC Backend Architecture:** Robust Express.js REST API with modular Model-View-Controller separation.
* **Relational MySQL Database Persistence:** Fully normalized schema (BCNF) connected to MySQL/phpMyAdmin with transactional integrity.
* **Centralized Brand Asset Management:** Easily swappable logo and theme configuration via `src/config/branding.js`.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend (View)** | React 18, Tailwind CSS, Lucide React Icons |
| **Backend (Controller & Model)** | Node.js, Express.js (MVC Architecture) |
| **Database & Persistence** | MySQL 5.7+ / 8.0+ (phpMyAdmin / XAMPP), `mysql2` Pool |
| **Styling & Design** | Custom Neon/Burgundy Theme, Responsive Flex/Grid Layouts |
| **Documentation & Reports** | Academic Final Project Report (`.docx`, `.pdf`), SQL Schema (`.sql`) |

---

## 📁 Repository Structure

```text
RT-web/
├── backend/
│   ├── config/
│   │   └── db.js                      # MySQL Connection Pool & Transaction Manager
│   ├── models/                        # Domain Models
│   │   ├── User.js                    # User & Auth Model (SHA-256 Hashing)
│   │   ├── Event.js                   # Event Scheduling & Quota Model
│   │   ├── EventRegistration.js       # Pass Issuance & Gate Check-in Model
│   │   ├── VolunteerLog.js            # Service Hours & Verification Model
│   │   ├── Project.js                 # Club Project Portfolio Model
│   │   └── Avenue.js                  # Rotary Avenues of Service Model
│   ├── controllers/                   # RESTful Controllers
│   │   ├── authController.js          # Authentication & User Management
│   │   ├── eventController.js         # Event & Avenue Operations
│   │   ├── registrationController.js  # Registration & Pass Verification
│   │   ├── volunteerController.js     # Service Hour Submissions & Approvals
│   │   ├── projectController.js       # Project Portfolio Publishing
│   │   └── reportController.js        # Audit Reports (RL-01, RL-02)
│   ├── routes/                        # Express API Routes
│   │   ├── authRoutes.js              # /api/auth
│   │   ├── eventRoutes.js             # /api/events
│   │   ├── registrationRoutes.js      # /api/registrations
│   │   ├── volunteerRoutes.js         # /api/volunteer
│   │   ├── projectRoutes.js           # /api/projects
│   │   └── reportRoutes.js            # /api/reports
│   └── middleware/
│       ├── authMiddleware.js          # Role-Based Access Control (RBAC)
│       └── errorHandler.js            # Centralized API Error Handling
├── public/                            # Static Web Assets & Logos
│   ├── rotaract-logo-nonchanging.png  # Navbar Brand Logo
│   ├── rotaract-logo-changing.png     # Hero Theme Logo
│   └── index.html                     # HTML Template
├── src/
│   ├── config/
│   │   └── branding.js                # Centralized Brand Logo Configuration
│   ├── services/
│   │   └── api.js                     # Frontend API Client
│   ├── components/                    # UI Components
│   │   ├── CurvedFlowingLines.jsx
│   │   └── InteractiveParticles.jsx
│   ├── App.jsx                        # Main Application View & State
│   ├── index.css                      # Global Styles & Tailwind Directives
│   └── index.js                       # React Entry Point
├── rotaract_nibm_db.sql               # Complete MySQL Database Schema for phpMyAdmin
├── Rotaract_Club_NIBM_Final_Project_Report.docx # Editable Academic Project Report
├── Rotaract_Club_NIBM_Final_Project_Report.pdf  # Ready-to-Print Academic Report
├── server.js                          # Express Backend Server Entry
├── package.json                       # Project Dependencies & Scripts
├── tailwind.config.js                 # Tailwind CSS Design Tokens
└── README.md                          # Project Documentation
```

---

## 🚀 Step-by-Step Setup & Execution Guide

### Prerequisites
* **Node.js**: v18.x or v20.x+ installed ([Download Node.js](https://nodejs.org/))
* **XAMPP / WAMP / MySQL Server**: For running the MySQL database ([Download XAMPP](https://www.apachefriends.org/))
* **Git**: For source control

---

### Step 1: Set Up MySQL Database in phpMyAdmin

1. Start **Apache** and **MySQL** in your XAMPP Control Panel.
2. Open your browser and go to: `http://localhost/phpmyadmin`
3. Click the **Import** tab at the top.
4. Click **Choose File** and select `rotaract_nibm_db.sql` from this repository.
5. Click **Go** at the bottom.  
   *(This creates the `rotaract_nibm_db` database and all 7 relational tables with initial seed data).*

---

### Step 2: Environment Configuration

Ensure you have a `.env` file in the root directory with the following configuration:

```env
PORT=3000
SERVER_PORT=5000
HOST=0.0.0.0
REACT_APP_API_ENDPOINT=http://localhost:5000/api

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=rotaract_nibm_db
```

---

### Step 3: Install Dependencies

Open your terminal in the project root directory and run:

```bash
npm install
```

---

### Step 4: Run the Application

You need two terminal windows:

#### Terminal 1 — Start the Backend Server:
```bash
node server.js
```
*Outputs: `[MySQL] Connected successfully to rotaract_nibm_db on localhost:3306`*  
*API runs on: `http://localhost:5000`*

#### Terminal 2 — Start the Frontend Website:
```bash
npm run dev
```
*Frontend opens automatically on: `http://localhost:3000`*

---

## 🔌 RESTful API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend and Database Health Check |
| `POST`| `/api/auth/register` | Register a new member account with hashed password |
| `POST`| `/api/auth/login` | Authenticate user and issue session token |
| `GET` | `/api/events` | Retrieve all scheduled and upcoming club events |
| `GET` | `/api/events/avenues` | Retrieve all 4 Rotary service avenues |
| `POST`| `/api/registrations` | Register for an event & issue verifiable pass code |
| `POST`| `/api/registrations/verify` | Gate verification & QR pass check-in |
| `POST`| `/api/volunteer/log` | Submit volunteer community service hours |
| `GET` | `/api/reports/attendance/:id` | Generate Attendance Audit Report (Layout **RL-01**) |
| `GET` | `/api/reports/volunteer-summary` | Generate Volunteer Hours Citation Report (Layout **RL-02**) |

---

## 🎨 How to Change Branding / Logos

To update the club logo or annual theme banner in the future:
1. Place your new image file in the `public/` folder (e.g. `public/my-logo.png`).
2. Open `src/config/branding.js` and update the corresponding path:
   ```javascript
   export const BRAND_CONFIG = {
     navbarLogo: '/my-navbar-logo.png',
     themeChangingLogo: '/my-theme-logo.png',
   };
   ```

---

## 📄 Academic Final Project Reports

* **Editable Word Document:** [`Rotaract_Club_NIBM_Final_Project_Report.docx`](./Rotaract_Club_NIBM_Final_Project_Report.docx)
* **Print-Ready PDF:** [`Rotaract_Club_NIBM_Final_Project_Report.pdf`](./Rotaract_Club_NIBM_Final_Project_Report.pdf)
* **SQL Database Script:** [`rotaract_nibm_db.sql`](./rotaract_nibm_db.sql)

---

## 👥 Authors & Contributors (Batch 2025.2F)

* **H.E. Gunasekara** — `KADSE25.2F-030`
* **Y.V. Bandara** — `KADSE25.2F-025`
* **D.A. Kulasinghe** — `KADSE25.2F-034`
* **V. Karunaratne** — `KADSE25.2F-006`

**School of Computing and Engineering — National Institute of Business Management (NIBM), Kandy Centre**
