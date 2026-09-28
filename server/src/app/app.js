import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "../routes/auth.route.js";
import productRouter from "../routes/product.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const clientDistPath = path.join(__dirname, "../../../client/dist");
app.use(express.static(clientDistPath));

app.get("/test", (req, res) => {
  res.json({ message: "App is working smoothly!" });
});

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

// // Fallback for SPA routing
// app.get("*", (req, res) => {
//   if (!req.path.startsWith("/api")) {
//     res.sendFile(path.join(clientDistPath, "index.html"), (err) => {
//       if (err) {
//         res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
//       }
//     });
//   } else {
//     res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
//   }
// });

export default app;