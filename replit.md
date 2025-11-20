# Inventory Management System

## Overview

This is a full-stack inventory management application for tracking products, borrowed items, stock levels, and expiration dates. The system provides a comprehensive dashboard with smart notifications for low stock and expiring products, along with a reminder system for reordering.

**Key Features:**
- Product inventory tracking with shelf locations and categories
- Borrowed items management with return tracking
- Low stock alerts based on configurable minimum quantities
- Expiration date monitoring with notifications
- Reminder/notes system for reordering
- Dashboard with real-time statistics
- Dark/light theme support
- Mobile-responsive Material Design 3 interface

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server with HMR support
- Wouter for lightweight client-side routing (SPA pattern)

**UI Component Library:**
- shadcn/ui components built on Radix UI primitives for accessibility
- Material Design 3 design system with Roboto font family
- Tailwind CSS for utility-first styling with custom theme configuration
- Class Variance Authority (CVA) for component variant management

**State Management:**
- TanStack Query (React Query v5) for server state management and caching
- Local React state for UI-specific concerns (dialogs, forms)
- React Hook Form with Zod validation for form handling

**Data Persistence Strategy:**
- Dual storage approach: localStorage for client-side persistence + server-side database
- On application mount, localStorage data is synced to server via `/api/init` endpoint
- All mutations sync back to localStorage after successful server updates
- This enables offline-first behavior and data recovery if database resets

### Backend Architecture

**Server Framework:**
- Express.js running on Node.js with ESM module support
- TypeScript for type safety across the entire stack
- Development mode uses tsx for hot-reloading

**API Design:**
- RESTful API pattern with resource-based endpoints
- Routes organized by entity type (products, borrowed items, reminders)
- JSON request/response format with error handling middleware
- CRUD operations: GET (list/detail), POST (create), PUT (update), DELETE (remove)

**Storage Layer:**
- Abstracted storage interface (`IStorage`) for flexibility
- Currently using in-memory storage (`MemStorage`) with Map data structures
- Designed to easily swap to database implementation (Drizzle ORM configured)
- UUID generation for entity IDs

**Development Setup:**
- Vite middleware integrated into Express for seamless dev experience
- Custom logging middleware for API request tracking
- Static file serving for production builds

### Data Storage Solutions

**Database Configuration (PostgreSQL via Drizzle):**
The application is configured to use PostgreSQL with Drizzle ORM, though currently running with in-memory storage:

- Drizzle ORM v0.39+ for type-safe database queries
- Neon Database serverless driver (@neondatabase/serverless)
- Schema-first approach with Zod validation generated from Drizzle schemas
- Migration management via drizzle-kit

**Database Schema Design:**

*Products Table:*
- Tracks inventory items with quantity, shelf location, categories
- Supports expiration date tracking and minimum quantity thresholds
- Auto-generated UUIDs for primary keys

*Borrowed Items Table:*
- Links to products via productId and productName (denormalized for simplicity)
- Tracks borrower, quantity, borrow/return dates
- Boolean flag (returned: 0/1) for tracking return status

*Reminders Table:*
- Notes system for reordering products
- Includes product name, note content, priority levels (high/medium/low)
- Timestamp for creation tracking

**Client-Side Storage:**
- Browser localStorage for offline persistence
- Separate keys for products, borrowed items, and reminders
- JSON serialization of entity arrays
- Initialization hook syncs localStorage to server on app startup

### Authentication and Authorization

**Current Implementation:**
- No authentication system implemented
- Open access to all endpoints and features
- Session management infrastructure present (connect-pg-simple) but not active

**Design Considerations:**
- Express session middleware configured in dependencies
- Ready for future implementation of user authentication
- Would likely use session-based auth with PostgreSQL session store

### External Dependencies

**Third-Party UI Libraries:**
- Radix UI components (@radix-ui/*) for accessible primitives
- Lucide React for icon system
- date-fns for date formatting and manipulation
- embla-carousel-react for carousel functionality (if needed)

**Development & Build Tools:**
- TypeScript compiler for type checking
- ESBuild for production server bundling
- PostCSS with Autoprefixer for CSS processing
- Replit-specific plugins for dev environment integration

**Database & Data Layer:**
- @neondatabase/serverless - PostgreSQL serverless driver
- drizzle-orm - Type-safe ORM
- drizzle-zod - Schema to Zod validator conversion
- connect-pg-simple - PostgreSQL session store (configured but not active)

**Validation & Forms:**
- Zod for runtime schema validation
- @hookform/resolvers for React Hook Form + Zod integration
- Drizzle-generated schemas ensure consistency between DB and validation

**Styling Dependencies:**
- Tailwind CSS for utility classes
- clsx + tailwind-merge (via cn utility) for conditional class merging
- class-variance-authority for component variants

**Key Design Decision:**
The dual-storage approach (localStorage + server) was chosen to provide resilience against database resets during development while maintaining a clean API-driven architecture. This allows the application to work offline and recover data automatically when the server restarts.