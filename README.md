

## Prerequisites
- Node.js (v18 or newer recommended)
- PostgreSQL database
- [Optional] Docker (for running Postgres locally)

## Setup

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database connection string and other settings.
   - Example `.env`:
     ```env
     DATABASE_URL=postgresql://user:password@localhost:5432/dbname
     PORT=3000
     ```

4. **Prisma setup:**
   - Generate the Prisma client:
     ```sh
     npx prisma generate
     ```
   - Run migrations to set up the database schema:
     ```sh
     npx prisma migrate dev
     ```
   - (Optional) Seed the database:
     ```sh
     npx prisma db seed
     ```

5. **Development:**
   - Start the development server with hot reload:
     ```sh
     npm run dev
     ```
   - The API will be available at `http://localhost:3000` (or your configured port).

6. **Production build:**
   - Build the project:
     ```sh
     npm run build
     ```
   - Start the production server:
     ```sh
     npm start
     ```

## Project Structure
- `src/` - Main source code
- `prisma/` - Prisma schema and seed scripts
- `logs/` - Rotating access logs (git-ignored)

## Useful Commands
- `npm run dev` - Start dev server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled server
- `npx prisma migrate dev` - Run DB migrations
- `npx prisma db seed` - Seed the database
- `npx prisma studio` - Open Prisma Studio (DB GUI)

---

For any issues, please check your environment variables and database connection first.
