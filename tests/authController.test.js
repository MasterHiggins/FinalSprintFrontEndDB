const request = require("supertest");
const app = require("../index");
const db = require("../services/db");

// Mock database pool.query method
jest.mock("../services/db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("Auth Controller", () => {
  describe("GET /register", () => {
    it("should access the register route", async () => {
      const res = await request(app).get("/register");
      expect(res.statusCode).toEqual(200); // Assuming /register renders the registration page
    });
  });

  describe("POST /login", () => {
    it("should handle login errors", async () => {
      db.pool.query.mockRejectedValueOnce(new Error("Database error"));

      const res = await request(app)
        .post("/login")
        .send({ username: "testuser", password: "password" });

      expect(res.statusCode).toEqual(302);
      expect(res.header.location).toEqual("/login");
    });
  });
});
