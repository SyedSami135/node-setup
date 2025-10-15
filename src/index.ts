import { db } from "./lib/db";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import logger from "morgan";
import * as rfs from "rotating-file-stream";
import rootRouter from "./routes";
import path from "path";
import rateLimit from "express-rate-limit";

dotenv.config({ quiet: true });
const app = express();

// Create a rotating write stream with date-based filenames
const logStream = rfs.createStream((time, index) => {
  if (!time || typeof time === "number") return "access.log";
  const date = time as Date;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `access-${year}-${month}-${day}.log`;
}, {
  interval: "1d",
  path: path.join(__dirname, "../logs"),
  maxFiles: 30,
});

// Trust the first proxy
app.set("trust proxy", 1);

// Rate limiter configuration
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: "Too many requests from this IP, please try again after 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
});



// Standard CORS setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const middleware = [
  logger("combined", { stream: logStream }),
  limiter,
  express.urlencoded({ extended: true }),
  express.json(),
];

app.use(middleware);

const port = parseInt(process.env.PORT || "3000", 10);
app.use(express.json());

app.use(rootRouter);
app.use(limiter);

const httpServer = createServer(app);

// Connect to the database and then start the server
async function startServer() {
  try {
    await db.$connect();
    console.log(`[${new Date().toISOString()}] ✅ Database connection established.`);
    httpServer.listen(port, () => {
      console.log(`[${new Date().toISOString()}] 🚀 Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(`[${new Date().toISOString()}] ❌ Failed to connect to the database.`);
    if (error instanceof Error) {
      console.error(error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

startServer();
