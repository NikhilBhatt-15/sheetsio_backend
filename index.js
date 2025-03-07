import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./utils/utility.js";
import auth from "./routes/auth.js";
import tablesRoutes from "./routes/table.js";
import { AuthMiddleware } from "./middlewares/authMiddleware.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { webSocketService } from "./utils/webSocketService.js";
import cookieParser from "cookie-parser";
import http from "http";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);




// start websocker server
webSocketService(server);




// Middleware and Express setup
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
connectDB(process.env.MONGO_URI, process.env.DB_NAME);

app.get("/", (req, res) => res.send("Welcome to TableSync backend"));
app.use("/api/v1/auth", auth);
app.use(AuthMiddleware);

app.use('api/v1/tablesync',tablesRoutes);
app.use(errorMiddleware);

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
