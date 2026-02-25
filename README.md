# CSP-S Redesign - Frontend

<p align="center">
    <img width="200" height="200" src="https://raw.githubusercontent.com/csps/.github/main/images/CSPS_LOGO.png">
</p>

The modern, redesigned frontend for the UC Main **Computing Society of the Philippines - Students** (CSP-S) website. This repository contains the frontend application that serves as the digital hub for our inclusive community of computer science students at the University of Cebu - Main Campus.

This is part of the UC Main CSP-S organization's website infrastructure, which provides a seamless experience for students to discover events, purchase merchandise, connect with peers, and manage their community involvement.

## What's New?

The CSP-S Redesign frontend is a complete modernization of our web platform, built with the latest industry standards:

- **React 19** - The latest stable version with improved performance and developer experience
- **TypeScript** - Full type safety for reliable, maintainable code
- **Vite** - Ultra-fast build tool with instant HMR during development
- **Tailwind CSS 4** - Modern styling with dark/light theme support
- **Zustand** - Lightweight state management for efficient user data handling
- **TanStack React Query** - Smart server state management with caching

We've rebuilt the entire platform from scratch to provide a faster, more responsive, and more user-friendly experience for our community.

---

## Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.0 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **npm** (v8.0 or higher) - Comes with Node.js
- **Git** - For cloning the repository

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/csps/csps-redesign.git
   cd csps-redesign
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory by copying `.env.example`:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your API endpoint:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

---

## Usage

### Running the Application

**Development mode** with hot reload:

```bash
npm run dev
```

**Production build**:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

**Preview production build**:

```bash
npm run preview
```

**Code quality check**:

```bash
npm run lint
```

### Accessing the Platform

After starting the development server:

- **Student Dashboard**: Navigate to `http://localhost:5173/dashboard` (requires student login)
- **Admin Dashboard**: Navigate to `http://localhost:5173/admin/dashboard` (requires admin login)
- **Public Pages**: Landing page, login, and contact pages available without authentication

### Key Features

**For Students:**

- Create and manage your profile
- Browse and register for upcoming events
- Purchase official CSP-S merchandise
- Read announcements and stay connected
- Network with fellow computer science students

**For Administrators:**

- Manage student memberships and data
- Create and manage events
- Handle merchandise inventory and orders
- Track sales and community engagement
- View analytics and insights

---

## Project Structure

```
src/
├── api/              # API service functions and endpoints
├── components/       # Reusable UI components
├── pages/           # Page-level components and routes
│   ├── admin/       # Admin dashboard pages
│   ├── student/     # Student pages
│   └── public/      # Public pages (login, etc.)
├── store/           # Zustand state management
├── hooks/           # Custom React hooks
├── interfaces/      # TypeScript type definitions
├── enums/           # Application enums
├── router/          # Route configuration and protection
└── styles/          # Global styles and Tailwind config
```

---

## Tech Stack

- **Frontend**: React 19 with TypeScript 5.8
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with dark/light modes
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query, Axios
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **Icons**: Lucide React, React Icons
- **Forms**: React Hook Form with Yup validation
- **Utilities**: Chart.js, Recharts, Swiper, QR Code libraries

---

## Support & Contact

Have questions or need help? We're here to assist:

- **Report Issues**: Use [GitHub Issues](https://github.com/csps/csps-redesign/issues) to report bugs and request features
- **Email**: [ucmaincsps@gmail.com](mailto:ucmaincsps@gmail.com)
- **Facebook**: [@UCMainCSPS](https://web.facebook.com/UCMainCSPS)
- **Discord**: [Join our community](https://discord.gg/w3BPVTQUWd)

---

## Acknowledgments

Special thanks to **Calister Creations** (Cal Calajatan) for designing our beautiful CSP-S logo. Cal is a talented computer science student and graphic designer - if you need design work, check out his [Behance portfolio](https://www.behance.net)!

---

## Team

Built by the CSP-S development team at University of Cebu - Main Campus

---

**CSP-S Redesign © 2026** - All rights reserved. See LICENSE file for details.
