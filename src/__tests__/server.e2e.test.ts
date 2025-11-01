import request from "supertest";
import { createApp } from "../server";
import { testDataSource } from "./setup";

describe("E2E Tests", () => {
  let app: any;

  beforeAll(async () => {
    app = createApp(testDataSource);
  });

  describe("Basic connectivity", () => {
    it("should connect to the server and get users endpoint", async () => {
      const response = await request(app).get("/users").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /users", () => {
    it("should create a new user", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        username: "johndoe",
        password: "password123",
      };

      const response = await request(app)
        .post("/users")
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.firstName).toBe("John");
      expect(response.body.lastName).toBe("Doe");
      expect(response.body.username).toBe("johndoe");
      expect(response.body).not.toHaveProperty("password");
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        firstName: "John",
        lastName: "Doe",
      };

      await request(app).post("/users").send(incompleteData).expect(400);
    });

    it("should return 409 for duplicate username", async () => {
      const userData = {
        firstName: "Jane",
        lastName: "Smith",
        username: "janedoe",
        password: "password123",
      };

      await request(app).post("/users").send(userData).expect(201);

      await request(app).post("/users").send(userData).expect(409);
    });
  });

  describe("GET /contacts", () => {
    it("should return 401 without auth token", async () => {
      await request(app).get("/contacts").expect(401);
    });

    it("should get contacts with valid auth token", async () => {
      // First create a user and login
      const userData = {
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        password: "password123",
      };
      await request(app).post("/users").send(userData).expect(201);

      const loginResponse = await request(app)
        .post("/login")
        .send({ username: "testuser", password: "password123" })
        .expect(200);

      const token = loginResponse.body.token;

      const response = await request(app)
        .get("/contacts")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("GET /getAllMyEvents", () => {
    // add new test: if not logged in, should 401
    // TDD: Test-Driven Development

    it("should return 400 for missing userId", async () => {
      await request(app).get("/getAllMyEvents").expect(400);
    });

    it("should return 400 for invalid userId", async () => {
      await request(app).get("/getAllMyEvents?userId=abc").expect(400);
    });

    it("should return empty array for user with no events", async () => {
      const response = await request(app)
        .get("/getAllMyEvents?userId=999")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });
});
