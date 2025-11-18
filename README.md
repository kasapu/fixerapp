# ServiceHub - Local Services Marketplace

A full-stack local services marketplace platform (Thumbtack clone) where customers can find, hire, and review local service professionals.

## 🚀 Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS** (v4)
- **shadcn/ui** components
- **React Hook Form** + **Zod** validation
- **Zustand** for state management
- **Socket.io** client for real-time messaging

### Backend
- **Next.js API Routes**
- **Prisma ORM**
- **PostgreSQL** database
- **Redis** for caching (with in-memory fallback)
- **NextAuth.js** for authentication
- **Stripe Connect** for payments (to be integrated)

### Authentication & Security
- NextAuth.js with credentials + OAuth providers
- bcrypt password hashing
- JWT tokens
- Role-based access control (RBAC)
- Email verification system
- Protected routes with middleware

## 📁 Project Structure

```
servicehub/
├── app/                      # Next.js 14 App Router
│   ├── api/                  # API routes
│   │   └── auth/            # Authentication endpoints
│   ├── (public)/            # Public pages (to be created)
│   ├── (customer)/          # Customer portal (to be created)
│   ├── (professional)/      # Professional portal (to be created)
│   ├── (admin)/             # Admin panel (to be created)
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── providers.tsx        # React providers
├── components/              # React components
│   ├── ui/                  # Base UI components
│   └── layouts/             # Layout components
├── lib/                     # Utility libraries
│   ├── prisma.ts           # Prisma client
│   ├── redis.ts            # Redis client
│   ├── auth.ts             # NextAuth configuration
│   ├── auth-helpers.ts     # Auth helper functions
│   ├── email.ts            # Email utilities
│   ├── utils.ts            # General utilities
│   └── validations/        # Zod schemas
├── prisma/                  # Database
│   └── schema.prisma       # Complete database schema
├── types/                   # TypeScript types
│   └── next-auth.d.ts      # NextAuth type extensions
├── .env                     # Environment variables
└── .env.example            # Environment template
```

## 🗄️ Database Schema

The application includes a comprehensive database schema with:

- **User Management**: Users, Sessions, Verification Tokens
- **Profiles**: Customer and Professional profiles with detailed information
- **Services**: Categories, Services, Professional Services
- **Marketplace**: Service Requests, Quotes, Bookings
- **Messaging**: Conversations, Messages
- **Reviews**: Two-way review system
- **Payments**: Payments, Payouts, Payment Methods
- **Admin**: Disputes, Support Tickets, Audit Logs
- **Referrals**: Referral codes and redemptions

## 🔐 Authentication Features

- [x] User registration with email verification
- [x] Login with credentials (email + password)
- [x] OAuth support (Google - configured)
- [x] Role-based access control (Customer, Professional, Admin)
- [x] Protected routes via middleware
- [x] Session management with JWT
- [x] Password hashing with bcrypt
- [ ] Two-factor authentication (2FA) - Schema ready
- [ ] Phone verification - Schema ready
- [ ] Password reset flow - To be implemented

## 🎨 UI Components

Base components implemented:
- Button with multiple variants
- Input fields
- Card layouts
- Labels
- Header with navigation
- Footer
- Responsive homepage with hero section

## 🚧 Phase 1: Foundation (COMPLETED) ✅

- [x] Next.js 14 project setup
- [x] TypeScript configuration
- [x] Tailwind CSS v4 setup
- [x] shadcn/ui base components
- [x] Prisma ORM with complete database schema
- [x] NextAuth.js authentication
- [x] User registration API
- [x] Email verification system
- [x] Role-based access control
- [x] Redis caching (with fallback)
- [x] Project structure and base layouts
- [x] Environment configuration

## 📋 Next Steps (Phase 2: Core Features)

### Service Discovery
- [ ] Category management system
- [ ] Service catalog
- [ ] Professional search with filters
- [ ] Geolocation search
- [ ] Professional profile pages

### Request & Quote System
- [ ] Service request creation flow
- [ ] Quote builder for professionals
- [ ] Quote comparison interface
- [ ] Request matching algorithm

### Messaging
- [ ] Real-time chat with Socket.io
- [ ] Message notifications
- [ ] File uploads in chat
- [ ] Conversation management

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database
- Redis (optional - fallback to in-memory cache)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd servicehub
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your database and other credentials
```

4. Set up the database
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🌐 Environment Variables

See `.env.example` for all required environment variables:

### Required for Development
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth.js
- `NEXTAUTH_URL` - Application URL

### Optional (Production)
- Redis, Stripe, AWS S3, Email, SMS, Maps, etc.

## 🔒 Security Features

- Password hashing with bcrypt (cost factor 12)
- JWT tokens with secure configuration
- CSRF protection
- SQL injection prevention (Prisma ORM)
- XSS protection
- Rate limiting (to be implemented)
- Input validation with Zod

## 📦 Key Dependencies

- `next` - React framework
- `react` & `react-dom` - React library
- `@prisma/client` - Database ORM
- `next-auth` - Authentication
- `zod` - Schema validation
- `react-hook-form` - Form handling
- `tailwindcss` - CSS framework
- `bcryptjs` - Password hashing
- `ioredis` - Redis client
- `stripe` - Payment processing

## 🤝 Contributing

This is a comprehensive marketplace platform under active development. Contributions are welcome!

## 📄 License

This project is private and proprietary.

## 🎯 Project Goals

Build a production-ready local services marketplace that includes:

- ✅ User management for customers and professionals
- ✅ Authentication and authorization
- ⏳ Service discovery and matching
- ⏳ Quote system
- ⏳ Real-time messaging
- ⏳ Payment processing with Stripe Connect
- ⏳ Review and rating system
- ⏳ Professional dashboard with analytics
- ⏳ Admin panel
- ⏳ Mobile responsive design

---

**Status**: Phase 1 Complete - Foundation is solid and ready for Phase 2 (Core Features)
