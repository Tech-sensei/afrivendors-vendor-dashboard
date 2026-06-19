# AfriVendors Vendor Dashboard

A comprehensive vendor management dashboard for the AfriVendors platform, empowering African service providers to manage their business operations, appointments, finances, and customer relationships all in one place.

## 🌟 Overview

AfriVendors Vendor Dashboard is a modern, feature-rich web application built with Next.js that enables vendors to efficiently manage their business presence on the AfriVendors marketplace. The platform provides vendors with powerful tools to track performance, communicate with customers, manage services, and grow their business.

## ✨ Key Features

### 📊 **Dashboard & Analytics**
- Real-time business performance metrics (daily, weekly, monthly views)
- Earnings tracking with interactive charts
- Appointment statistics and trends
- Customer engagement insights
- Wallet balance overview

### 👤 **Business Profile Management**
- Customizable business profiles with logo and banner images
- Photo gallery management
- Business hours configuration
- Location and contact information
- Social media integration
- Service category management

### 📅 **Appointment Management**
- View and manage upcoming appointments
- Appointment status tracking
- Customer communication tools
- Appointment history and analytics

### 💬 **Messaging System**
- Real-time customer messaging
- Message history and search
- Set reminders for follow-ups
- Quick response templates

### 💰 **Wallet & Payments**
- Earnings overview and transaction history
- Withdrawal management
- Payment analytics
- Financial reporting

### ⭐ **Reviews & Ratings**
- Customer review management
- Rating analytics
- Response to customer feedback
- Reputation tracking

### 🛠️ **Services Management**
- Add, edit, and remove services
- Service pricing and descriptions
- Service category organization
- Availability management

### 🔔 **Notifications**
- Real-time notification system
- Appointment reminders
- Customer message alerts
- Payment notifications

### ⚙️ **Settings**
- Account preferences
- Notification settings
- Privacy controls
- Business configuration

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: 
  - [Radix UI](https://www.radix-ui.com/) primitives
  - [shadcn/ui](https://ui.shadcn.com/) components
  - [Lucide React](https://lucide.dev/) icons
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Charts**: [Recharts](https://recharts.org/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Utilities**: 
  - `clsx` & `tailwind-merge` for className management
  - `class-variance-authority` for component variants

## 📦 Installation

### Prerequisites
- Node.js 20+ or Bun
- npm, yarn, pnpm, or bun package manager

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd afrivendors-vendor-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Structure

```
afrivendors-vendor-dashboard/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (dashboard)/         # Dashboard pages
│   │   │   ├── analytics/
│   │   │   ├── appointments/
│   │   │   ├── business-profile/
│   │   │   ├── help-support/
│   │   │   ├── messages/
│   │   │   ├── notifications/
│   │   │   ├── reviews/
│   │   │   ├── rfs-requests/
│   │   │   ├── services/
│   │   │   ├── settings/
│   │   │   └── wallet/
│   │   ├── fonts/               # Custom fonts
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   │   ├── appointments/
│   │   ├── business-profile/
│   │   ├── dashboard/
│   │   ├── messages/
│   │   ├── notifications/
│   │   ├── reviews/
│   │   ├── rfs/
│   │   ├── services/
│   │   ├── settings/
│   │   ├── ui/                  # Reusable UI components
│   │   └── wallet/
│   ├── data/                    # Mock data & types
│   ├── hooks/                   # Custom React hooks
│   └── lib/                     # Utility functions
├── public/                      # Static assets
├── components.json              # shadcn/ui configuration
└── package.json
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

The application features a premium, modern design with:
- Custom typography using Unbounded and Unageo fonts
- Consistent color palette with dark mode support
- Smooth animations and transitions
- Responsive layouts for mobile, tablet, and desktop
- Accessible UI components following WCAG guidelines

## 🔐 Authentication

The application includes authentication flows for:
- Vendor login
- Account registration
- Password recovery
- Session management

## 📱 Responsive Design

Fully responsive across all devices:
- **Mobile**: Optimized touch interfaces and bottom drawers
- **Tablet**: Adaptive layouts
- **Desktop**: Rich sidebar and multi-column layouts

## 🚧 Development Status

This project is actively under development. Current focus areas:
- Backend API integration
- Payment gateway integration (Stripe)
- Real-time messaging with WebSockets
- Advanced analytics and reporting
- Multi-language support

## 📄 License

[License information to be added]

## 🤝 Contributing

[Contribution guidelines to be added]

## 📞 Support

For support and questions, please contact [support information to be added].

---

Built with ❤️ for African vendors by the AfriVendors team
