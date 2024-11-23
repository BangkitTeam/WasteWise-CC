import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import express from "express";
import morgan from "morgan";
import dotenv from "dotenv"
import AuthRoute from "./src/routes/auth.js"
import pool from "./src/helpers/database.js"
import { createDirectory } from "./src/helpers/createDir.js";


dotenv.config();
createDirectory();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.join(__dirname, "./public");
const PORT = process.env.PORT || 8080;
const accessLogStream = fs.createWriteStream( path.join(__dirname, "logs/access.log"), { flags: "a" });


app.use(morgan("common", { stream: accessLogStream }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(publicDirectory));

const port = process.env.PORT || 8080; 
const hostname = process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0';

app.use("/auth", AuthRoute);

// Jalankan server
app.listen(port, hostname, () => {
    console.log(`Server is running on http://${hostname}:${port}...`);
});

process.on('SIGINT', () => {
    console.log("Received SIGINT signal. Gracefully shutting down...");
    pool.end(); // pastikan `pool` didefinisikan sebelumnya sebagai instance koneksi
    process.exit();
});