# Modern Furniture E-commerce Platform

This is a front-end application for a modern furniture e-commerce store, built with Next.js and TypeScript. It provides a clean, responsive, and user-friendly interface for customers to browse and shop for high-quality furniture.

## ✨ Key Features

- **Responsive Design**: Fully responsive layout that works on all devices, from mobile phones to desktops.
- **Dynamic Product Catalog**: Browse products by category, with detailed product pages.
- **Interactive UI**: Modern user interface components built with Radix UI and styled with Tailwind CSS.
- **Client-Side Rendering**: Built with the Next.js App Router for a fast and modern user experience.
- **TypeScript Support**: Ensures type safety and improved developer experience.
- **State Management**: Redux Toolkit for global state management
- **Form Validation**: Zod schema validation for robust form handling
- **Authentication**: Secure login system with protected routes
- **Admin Panel**: Comprehensive admin interface for product and order management

## 🛠️ Technologies Used

### Core Framework & Language
- **Framework**: [Next.js 14](https://nextjs.org/) - React framework with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Runtime**: [Node.js](https://nodejs.org/) - JavaScript runtime

### Frontend Libraries
- **UI Framework**: [React 18](https://reactjs.org/) - User interface library
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) - Re-usable components built on Radix UI
- **Component Library**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI primitives

### State Management & Data
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) - Predictable state container
- **HTTP Client**: Custom HTTP utility with fetch API
- **Form Validation**: [Zod](https://zod.dev/) - TypeScript-first schema validation

### UI/UX & Interactions
- **Animations & Carousels**: [Swiper.js](https://swiperjs.com/) - Modern touch slider
- **Icons**: [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
- **Responsive Design**: Mobile-first approach with custom hooks

## 📁 Project Structure

```
aht-ecommerce-fe/
├── public/                     # Static assets (images, icons, etc.)
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── (customer)/        # Customer routes group
│   │   │   ├── (auth)/        # Authentication pages
│   │   │   └── (main)/        # Main customer pages
│   │   ├── admin/             # Admin panel routes
│   │   │   ├── (main)/        # Admin main pages
│   │   │   └── login/         # Admin login page
│   │   ├── api/               # API routes
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── not-found.tsx      # 404 page
│   ├── asset/                 # Asset files
│   │   └── css/               # CSS files
│   ├── components/            # Reusable UI components
│   │   ├── admin/             # Admin-specific components
│   │   ├── animation/         # Animation components
│   │   ├── customer/          # Customer-facing components
│   │   └── ui/                # Base UI components (shadcn/ui)
│   ├── helper/                # Utility functions
│   │   ├── dataConfig.ts      # Data configuration
│   │   ├── general.ts         # General utility functions
│   │   └── toast.ts           # Toast notification utilities
│   ├── hooks/                 # Custom React hooks
│   │   └── use-mobile.ts      # Mobile detection hook
│   ├── lib/                   # Library configurations
│   │   ├── htpp.ts            # HTTP utility functions
│   │   └── utils.ts           # Utility functions
│   ├── middleware.ts          # Next.js middleware
│   ├── schemaValidation/      # Zod validation schemas
│   │   ├── auth.schema.ts     # Authentication validation
│   │   ├── category.schema.ts # Category validation
│   │   ├── order.shema.ts     # Order validation
│   │   └── product.schema.ts  # Product validation
│   ├── service/               # API service functions
│   │   ├── auth.ts            # Authentication service
│   │   ├── category.ts        # Category service
│   │   ├── order.ts           # Order service
│   │   ├── product.ts         # Product service
│   │   ├── uploadFile.ts      # File upload service
│   │   └── user.ts            # User service
│   └── store/                 # Redux store configuration
│       ├── features/          # Redux slices
│       ├── provider.tsx       # Redux provider
│       └── store.ts           # Store configuration
├── components.json            # shadcn/ui configuration
├── eslint.config.mjs          # ESLint configuration
├── next.config.ts             # Next.js configuration
├── next-env.d.ts              # Next.js type definitions
├── package.json               # Dependencies and scripts
├── package-lock.json          # Locked dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── .gitignore                 # Git ignore rules
```

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm) installed on your machine.
- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/your_repository.git
   ```
2. Navigate to the project directory
   ```sh
   cd aht-ecommerce-fe
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

### Running the Development Server

Run the following command to start the development server:

```sh
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

To access the admin panel, please log in at: [http://localhost:3001/admin/login](http://localhost:3001/admin/login)