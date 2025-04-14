# CS 489 Web Development Project

Group project for CS 489 during SP25.

This is a **travel planner web application** that helps users research destinations, plan trips, and organize itineraries.

Built with [Next.js](https://nextjs.org) and bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), it features a fullstack architecture with a PostgreSQL database, modern UI using shadcn and Tailwind CSS, and potential integrations with map or travel APIs.

## Getting Started

### Prerequisites
This project uses Docker to manage a local PostgreSQL database for development.

1. Ensure you have Docker installed on your machine. You can download it from [Docker's official website](https://www.docker.com/).
2. Install Node.js and npm (or an alternative package manager like Yarn, pnpm, or Bun).

### Environment Variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```properties
# Database Configuration
DATABASE_URL="postgresql://admin:password@localhost:5432/dev-db"
POSTGRES_USER=admin
POSTGRES_PASSWORD=password
POSTGRES_DB=dev-db

# Authentication (NextAuth.js)
NEXTAUTH_SECRET="your_random_secret_key"

# Google OAuth (valid values are required for Google sign-in)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

GEOAPIFY_API_KEY="you_geoapifyr_api_key"
```

These values are used to configure the PostgreSQL database, Prisma, external APIs, and authentication flows for development.

> Contact maintainers for existing OAuth/geoapify values or create in [Google Cloud Console](https://console.cloud.google.com/) and [Geoapify](https://www.geoapify.com/get-started-with-maps-api/).

### Database Setup
1. Start the PostgreSQL database using Docker:
```bash
docker compose up
```
2. Sync the Prisma schema with the database schema:
```bash
npx prisma db push
```

### Running the Development Server:
1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
2. Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Additional Notes

This project uses NextAuth.js for authentication. For more information, visit the [NextAuth.js documentation](https://next-auth.js.org/).

This project uses reusable UI components from [shadcn UI](https://ui.shadcn.com/).

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

For more information on Prisma, visit the [Prisma documentation](https://www.prisma.io/docs/).
