# Property Rental Platform - replit.md

## Overview

This is a full-stack property rental platform built with React, Express.js, and PostgreSQL. The application allows users to browse and book properties, while property owners can list and manage their rentals. It features role-based authentication, property management, booking systems, and review functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query for server state and caching
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Handling**: Multer for property image uploads
- **Database Provider**: Neon serverless PostgreSQL

### Project Structure
```
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and configurations
├── server/               # Backend Express application
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Database operations abstraction
│   └── db.ts            # Database connection setup
├── shared/               # Shared types and schemas
│   └── schema.ts         # Drizzle database schema and Zod validation
└── migrations/           # Database migration files
```

## Key Components

### Database Schema
- **Users**: Authentication, profiles, and role management (user/owner/admin)
- **Properties**: Property listings with details, pricing, and status
- **Bookings**: Reservation system with date validation and payment tracking
- **Reviews**: Rating and feedback system for properties
- **Sessions**: Session storage for authentication

### Authentication System
- JWT token-based authentication with localStorage storage
- Role-based access control (user, owner, admin)
- Password hashing with bcryptjs
- Middleware for protecting routes and validating tokens

### Property Management
- Property listing with image uploads
- Status management (pending, approved, rejected)
- Search and filtering capabilities
- Owner dashboard for property management

### Booking System
- Date availability checking
- Booking status tracking (pending, confirmed, cancelled, completed)
- Total amount calculation
- User and owner booking management

### UI/UX Features
- Responsive design with mobile-first approach
- Dark/light theme support through CSS variables
- Component library based on Radix UI primitives
- Form validation with React Hook Form and Zod
- Loading states and error handling

## Data Flow

### Authentication Flow
1. User registers/logs in through auth modal
2. JWT token stored in localStorage
3. Token automatically included in API requests
4. Server validates token and attaches user to request

### Property Booking Flow
1. User searches/browses properties
2. Property details displayed with availability checking
3. Booking form validates dates and guest count
4. Server checks availability and creates booking
5. Booking confirmation sent to user and owner

### Property Listing Flow
1. Owner creates property through form
2. Images uploaded and stored
3. Property submitted with "pending" status
4. Admin reviews and approves/rejects
5. Approved properties appear in search results

## External Dependencies

### Frontend Dependencies
- **@radix-ui/***: Accessible UI primitives for complex components
- **@tanstack/react-query**: Server state management and caching
- **@hookform/resolvers**: Integration between React Hook Form and Zod
- **wouter**: Lightweight routing solution
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe CSS class variants

### Backend Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe SQL ORM with excellent TypeScript support
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT token generation and verification
- **multer**: File upload handling
- **zod**: Schema validation library

### Development Dependencies
- **TypeScript**: Type safety across the entire stack
- **Vite**: Fast build tool with HMR
- **Tailwind CSS**: Utility-first CSS framework
- **ESBuild**: Fast JavaScript bundler for server code

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with automatic restart via tsx
- Database migrations managed through Drizzle Kit
- Environment variables for database connection

### Production Build
- Frontend: `vite build` outputs to `dist/public`
- Backend: `esbuild` bundles server code to `dist/index.js`
- Single deployment with Express serving both API and static files
- Database migrations run via `drizzle-kit push`

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `JWT_SECRET`: Secret key for JWT token signing
- `NODE_ENV`: Environment specification (development/production)

The application uses a monorepo structure with shared TypeScript types and schemas, enabling type safety across the full stack while maintaining clear separation between frontend and backend concerns.