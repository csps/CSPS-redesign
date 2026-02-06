# CSPS Website Frontend

A modern, responsive web application for the Computer Science and Programming Society (CSPS), built as a comprehensive platform for student engagement, event management, merchandise sales, and administrative operations.

## 🚀 Features

### For Students
- **Dashboard**: Personalized student portal with membership information and quick access to features
- **Events**: Browse upcoming and recent events, register for activities
- **Bulletin**: Stay updated with announcements and news
- **Merchandise Store**: Purchase official CSPS merchandise with secure checkout
- **Profile Management**: Update personal information and membership details

### For Administrators
- **Student Management**: View and manage student memberships, details, and status
- **Event Management**: Create, edit, and manage society events
- **Merchandise Management**: Add products, manage inventory, variants, and pricing
- **Order Management**: Process and track merchandise orders with status updates
- **Analytics**: View charts and statistics for events, sales, and membership

### Core Features
- **Authentication**: Secure login/logout with JWT token management
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Updates**: Live data fetching with React Query
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Modern UI**: Clean, iOS-inspired design with Tailwind CSS
- **Type Safety**: Full TypeScript implementation for reliability

## 🛠 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **HTTP Client**: Axios
- **Routing**: React Router DOM v7
- **Icons**: Lucide React, React Icons
- **Charts**: Chart.js with React Chart.js 2
- **Calendar**: React Calendar
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast notifications)
- **Image Carousel**: Swiper
- **Typewriter Effect**: React Simple Typewriter
- **Utilities**: Lodash Move, JWT Decode

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd csps-redesign/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Configure API endpoints and other environment variables

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🚀 Usage

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module replacement.

### Production Build
```bash
npm run build
```
Creates an optimized production build in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

### Linting
```bash
npm run lint
```
Runs ESLint to check for code quality issues.

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API service functions
│   ├── assets/            # Images, icons, logos
│   ├── components/        # Reusable UI components
│   ├── data/              # Static data and constants
│   ├── enums/             # TypeScript enums
│   ├── helper/            # Utility functions
│   ├── hooks/             # Custom React hooks
│   ├── interfaces/        # TypeScript interfaces
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin panel pages
│   │   ├── bulletin/      # Announcements
│   │   ├── checkout/      # Payment processing
│   │   ├── dashboard/     # Student dashboard
│   │   ├── events/        # Event listings
│   │   ├── landing/       # Homepage
│   │   ├── login/         # Authentication
│   │   ├── merch/         # Merchandise store
│   │   └── ...
│   ├── router/            # Routing configuration
│   ├── store/             # Zustand state stores
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎨 Design System

- **Color Scheme**: Purple-based theme with dark mode support
- **Typography**: iOS-inspired font stack (SF Pro Text, system fonts)
- **Components**: Modular, reusable component library
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant design patterns

## 🔧 Configuration

### Vite Configuration
- SWC for fast compilation
- Tailwind CSS integration
- Path aliases for clean imports

### ESLint Configuration
- TypeScript support
- React hooks rules
- Custom rules for code consistency

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

Built by the CSPS development team for the Computer Science and Programming Society.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.
