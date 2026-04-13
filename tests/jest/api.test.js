// tests/jest/api.test.js
import request from "supertest";
import express from "express";
import { backendPMA } from "../../src/back/conflict-stats.js";

const app = express();
app.use(express.json());
backendPMA(app);

test("GET /api/v2/conflict-stats devuelve datos", async () => {
  const res = await request(app).get("/api/v2/conflict-stats");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});