import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { constants } from "http2";

export const app = express();
const port = 5002;

// Middleware

app.use(cors());
app.use(bodyParser.json());
