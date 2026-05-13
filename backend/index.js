import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./lib/prismaClient.js";
import AuthRouter from "./routes/authRoute.js";
import TeacherRouter from "./routes/teacherRoute.js";
import StudentsRouter from "./routes/studentsRoute.js";
import attendanceRouter from "./routes/attendanceRoute.js";
import classRouter from "./routes/classRoute.js";
import healthRouter from "./routes/healthRouter.js";
import examRouter from "./routes/examRouter.js";
import subjectsRouter from "./routes/subjectsRoute.js";
import disciplineRouter from "./routes/disciplineRoute.js";
import teachersAttendanceRouter from "./routes/teachersAttendanceRoute.js";
import financeRouter from "./routes/financeRoute.js";
import feeRouter from "./routes/feeRoute.js";
import familyFeeRouter from "./routes/familyFeeRoute.js";
import salaryRouter from "./routes/salaryRoute.js";
import DailyQuranRouter from "./routes/DailyQuranSession.js";
import halaqaRouter from "./routes/halaqaRoute.js";
import lessonRecordRouter from "./routes/lessonRecordRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 4000;

const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? process.env.CORS_ORIGIN || "https://your-school-app.vercel.app"
      : "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cookieParser());

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

let dbConnected = false;

async function connectDB() {
  if (dbConnected) {
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error("Please define DATABASE_URL in your environment variables");
  }

  try {
    await prisma.$connect();
    dbConnected = true;
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error.message || error);
    throw error;
  }
}

app.use(async (_req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("Database connection failed:", err);
    res.status(500).json({
      message: "Database connection failed",
      error: err.message || "Unable to connect to PostgreSQL",
    });
  }
});

app.use("/api/auth", AuthRouter);
app.use("/api/teachers", TeacherRouter);
app.use("/api/students", StudentsRouter);
app.use("/api/classes", classRouter);
app.use("/api/attendance", attendanceRouter);
app.use("/api/health", healthRouter);
app.use("/api/exams", examRouter);
app.use("/api/subjects", subjectsRouter);
app.use("/api/teachersAttendance", teachersAttendanceRouter);
app.use("/api/discipline", disciplineRouter);
app.use("/api/finance", financeRouter);
app.use("/api/fees", feeRouter);
app.use("/api/family-fees", familyFeeRouter);
app.use("/api/salaries", salaryRouter);
app.use("/api/halaqas", halaqaRouter);
app.use("/api/lesson-records", lessonRecordRouter);
app.use("/api/dailyQuran", DailyQuranRouter);

app.get("/api", (_req, res) => {
  res.json({
    message: "quranic management system API is running!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    dbConnected,
    cors: {
      allowedOrigins: corsOptions.origin,
      credentials: corsOptions.credentials,
    },
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    database: dbConnected ? "connected" : "disconnected",
    environment: process.env.NODE_ENV,
  });
});

app.use((err, _req, res, _next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Something went wrong",
    message: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    timestamp: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString(),
  });
});

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
    console.log(
      `CORS Origin: ${
        process.env.NODE_ENV === "production"
          ? process.env.CORS_ORIGIN || "https://your-school-app.vercel.app"
          : "http://localhost:5173"
      }`,
    );
  });
}

export default app;
