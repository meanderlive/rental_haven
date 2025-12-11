# RentalHaven - Property Rental Platform

A modern property rental platform built with React frontend and Java Spring Boot backend.

## 🏗️ Project Structure

```
RentalHaven/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   └── static/        # Static assets
│   ├── index.html
│   └── package.json
├── java-backend/           # Spring Boot Backend
│   ├── src/
│   │   ├── main/java/com/rentalhaven/
│   │   │   ├── controller/    # REST API controllers
│   │   │   ├── model/         # Data models
│   │   │   ├── repository/    # Data access layer
│   │   │   └── SecurityConfig.java
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
├── shared/                 # Shared TypeScript schemas
│   └── schema.ts
├── package.json            # Frontend dependencies
├── vite.config.ts          # Vite configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🚀 Quick Start

### Frontend (React)
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend (Java Spring Boot)
```bash
cd java-backend

# Start the backend
mvn spring-boot:run
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me?email={email}` - Get user profile

### Properties
- `GET /api/properties` - List all properties
- `GET /api/properties/{id}` - Get property details
- `POST /api/properties` - Create new property (owner only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/owner` - Get owner bookings
- `PUT /api/bookings/{id}` - Update booking

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **React Query** - Data fetching
- **Wouter** - Routing

### Backend
- **Spring Boot 3** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Data persistence
- **PostgreSQL** - Database
- **Maven** - Build tool

## 🔧 Configuration

### Frontend
- Port: 5173 (development)
- API Base URL: http://localhost:8080

### Backend
- Port: 8080
- Database: PostgreSQL (localhost:5432/rentalhaven)

## 📝 Development Notes

- All hooks must be called at the top of React components
- CORS is configured to allow frontend requests
- Authentication endpoints are public, others require auth
- Static properties are served as fallback when API fails

## 🚫 Removed Components

- **Node.js/Express server** - Replaced by Java backend
- **Drizzle ORM** - Not needed with JPA
- **Unused dependencies** - Cleaned up package.json 