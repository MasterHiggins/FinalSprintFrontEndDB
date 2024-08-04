const request = require("supertest");
const app = require("../index");
const db = require("../services/db");
const bcrypt = require("bcrypt");

// Mock database pool.query method
jest.mock("../services/db", () => ({
  pool: {
    query: jest.fn(),
  },
}));

describe("User Login", () => {
  let agent;

  beforeAll(() => {
    agent = request.agent(app);
  });

  it("should login an existing user", async () => {
    const hashedPassword = await bcrypt.hash("jerry123", 10);
    db.pool.query.mockResolvedValueOnce({
      rows: [
        {
          user_id: 1,
          username: "jerry",
          email: "j@j.com",
          password: hashedPassword,
        },
      ],
    });

    const res = await agent
      .post("/login")
      .send({ username: "jerry", password: "jerry123" });

    expect(res.statusCode).toEqual(302);
    expect(res.header.location).toEqual("/search");
    expect(db.pool.query).toHaveBeenCalledTimes(1);
  });
});
