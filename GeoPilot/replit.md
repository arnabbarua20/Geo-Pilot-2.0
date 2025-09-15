# Drone Zone Manager - New Zealand

## Overview

This is a full-stack web application for reporting and visualizing drone no-fly zones across New Zealand. The application provides an interactive map interface where users can view existing restricted airspace and report new drone restriction zones. The system is designed to help drone operators stay compliant with aviation regulations and ensure safe operations.

## User Preferences

Preferred communication style: Simple, everyday language.
Authentication preference: Simple Google sign-in for reporting only - users can view map without login but must sign in to report new zones.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend concerns:

**Frontend**: React-based single-page application with TypeScript
- Built with Vite for fast development and optimized production builds
- Uses Wouter for client-side routing
- Styled with Tailwind CSS and shadcn/ui components
- Interactive maps powered by Leaflet

**Backend**: Express.js REST API server
- TypeScript-based Node.js server
- RESTful API endpoints for drone zone management
- In-memory storage with planned database integration
- Development-optimized with Vite middleware integration

**Database**: PostgreSQL with Drizzle ORM
- Schema-first approach using Drizzle ORM
- Configured for Neon Database (serverless PostgreSQL)
- Type-safe database operations

## Key Components

### Frontend Architecture
- **Component Structure**: Organized using shadcn/ui design system with custom components
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation schemas
- **Styling**: Tailwind CSS with CSS variables for theming
- **Map Integration**: Leaflet for interactive map functionality

### Backend Architecture
- **API Routes**: RESTful endpoints for CRUD operations on drone zones
- **Data Layer**: Abstracted storage interface with memory-based implementation
- **Validation**: Zod schemas shared between frontend and backend
- **Error Handling**: Centralized error handling middleware

### Data Schema
The application uses a shared schema definition for drone zones:
- **ID**: UUID primary key
- **Location**: Latitude/longitude coordinates
- **Metadata**: Title, reason, details, emergency contact
- **Classification**: Zone type (restricted/controlled/protected) and status
- **Timestamps**: Created and updated timestamps

## Data Flow

1. **Zone Viewing**: Anyone can access the map view where zones are fetched via React Query from the REST API
2. **Authentication**: Optional Google sign-in required only for reporting new zones
3. **Zone Reporting**: Authenticated users submit new zones through a form that validates data client-side and server-side
4. **Data Persistence**: Zones are stored in PostgreSQL via Drizzle ORM with fallback to memory storage, optionally saved to Firebase
5. **Real-time Updates**: React Query automatically refetches data after mutations

## External Dependencies

### Core Dependencies
- **Database**: Neon Database (serverless PostgreSQL)
- **Maps**: OpenStreetMap tiles via Leaflet
- **UI Components**: Radix UI primitives via shadcn/ui
- **Validation**: Zod for runtime type checking

### Development Tools
- **Build System**: Vite for frontend bundling
- **Database Migrations**: Drizzle Kit for schema management
- **Development Server**: Express with Vite middleware integration

### Current Integrations
- **Firebase Authentication**: Optional Google sign-in for zone reporting (gracefully degrades if not configured)
- **Firebase Firestore**: Secondary storage for user-submitted reports (optional)

## Deployment Strategy

**Development Environment**:
- Vite dev server with HMR for frontend development
- Express server with automatic restart via tsx
- Database schema updates via Drizzle push command

**Production Build**:
- Frontend: Static assets built with Vite and served from `/dist/public`
- Backend: Server bundled with esbuild to `/dist/index.js`
- Database: Production PostgreSQL via DATABASE_URL environment variable

**Environment Configuration**:
- Development: Local development with optional Firebase integration
- Production: Node.js server with static file serving and database connection
- Replit Integration: Specialized configuration for Replit deployment environment

The application is designed for easy deployment on platforms like Replit, Vercel, or traditional Node.js hosting with minimal configuration required.