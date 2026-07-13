# Epic Babbage - Full-Stack Pharmacy & E-Commerce Platform

Epic Babbage is a modern, high-performance full-stack pharmacy and e-commerce platform. It features a responsive Next.js frontend with rich animations, an Express.js/TypeScript backend API, and a PostgreSQL database managed via Prisma ORM. The entire stack can be run locally using Docker Compose.

---

## 📂 Project Structure

```text
epic-babbage/
├── backend/                # Express.js REST API
│   ├── src/                # API routes, controllers, and services
│   ├── Dockerfile          # Production backend image configuration
│   └── package.json
├── database/               # Database management
│   ├── schema.prisma       # Prisma DB schema definition
│   ├── seed.ts             # Seed script for initial DB data
│   └── package.json
├── frontend/               # Next.js 16 Web Application
│   ├── src/                # Pages, components, hooks, and state stores
│   ├── public/             # Static assets (images, icons)
│   ├── Dockerfile          # Frontend production image configuration
│   └── package.json
├── docker-compose.yml      # Base Docker Compose configuration
├── docker-compose.dev.yml  # Development overrides (volumes & dev scripts)
└── .gitignore              # Root Git filter file
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router) & React 19
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Animations**: GSAP (GreenSock Animation Platform) & Framer Motion
- **Form Handling & Validation**: React Hook Form & Zod
- **Internationalization**: Next-Intl (supports Arabic/English layout and content)

### Backend & Database
- **Server**: Express.js with TypeScript
- **Database ORM**: Prisma ORM
- **Database Engine**: PostgreSQL
- **Security**: JSON Web Tokens (JWT) for authentication

### Devops & Tooling
- **Containerization**: Docker & Docker Compose

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

---

### Method 1: Running with Docker Compose (Recommended)

To run the entire stack with hot-reloading enabled for local development:

1. **Spin up the services**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
   ```
   This command starts:
   - **PostgreSQL Database** on port `5432`
   - **Express Backend** on port `5000` (with live reload via `ts-node-dev`)
   - **Next.js Frontend** on port `3000` (with watchpack polling enabled)

2. **Initialize & Seed the Database**:
   Open a separate terminal window and run:
   ```bash
   # Generate Prisma Client & push schema migrations
   cd database
   npm install
   npx prisma db push
   
   # Run the database seeder to populate products and categories
   npx ts-node seed.ts
   ```

3. **Access the application**:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API Health: [http://localhost:5000/api/v1/health](http://localhost:5000/api/v1/health)

---

### Method 2: Running Manually (Without Docker)

If you prefer to run services manually on your local system, follow these steps:

#### 1. Setup the Database
- Start a local PostgreSQL instance.
- Create a database named `epic_babbage`.
- Create a `.env` file in the `/database` directory:
  ```env
  DATABASE_URL="postgresql://<username>:<password>@localhost:5432/epic_babbage"
  ```
- Generate Prisma Client and apply migrations:
  ```bash
  cd database
  npm install
  npx prisma db push
  npm run seed # Runs ts-node seed.ts
  ```

#### 2. Run the Backend API
- Create a `.env` file in the `/backend` directory:
  ```env
  DATABASE_URL="postgresql://<username>:<password>@localhost:5432/epic_babbage"
  PORT=5000
  JWT_SECRET="your_jwt_secret_key"
  ```
- Start the Express development server:
  ```bash
  cd ../backend
  npm install
  npm run dev
  ```

#### 3. Run the Frontend
- Create a `.env.local` file in the `/frontend` directory:
  ```env
  NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
  ```
- Start the Next.js development server:
  ```bash
  cd ../frontend
  npm install
  npm run dev
  ```

---

## 🔒 Environment Variables Reference

### Backend (`/backend/.env`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgrespassword@database:5432/epic_babbage` |
| `PORT` | Backend listening port | `5000` |
| `JWT_SECRET` | Secret key for signing authorization JWTs | `supersecretjwtkey123` |

### Frontend (`/frontend/.env.local`)
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:5000/api/v1` |
