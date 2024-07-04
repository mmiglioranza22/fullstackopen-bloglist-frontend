const { describe, it, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { generateHash } = require("../utils/user_hash");

const api = supertest(app);

describe("API tests suite - USERS:", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });
  describe("1- create user:", () => {
    it("creates a new user correctly in DB", async () => {
      const newUser = {
        name: "new user",
        username: "root",
        password: "root",
      };
      await api
        .post("/api/users")
        .send(newUser)
        .expect((res) => {
          assert.ok(res.body.id);
          assert.ok(!res.body.passwordHash);
          assert.strictEqual(res.body.name, newUser.name);
          assert.strictEqual(res.body.username, newUser.username);
        });
    });
    it("return error if name or username are not present", async () => {
      let users;
      await api
        .get("/api/users")
        .expect(200)
        .expect((res) => {
          users = res.body.length;
        });
      const invalidName = {
        username: "1234",
        password: "1234",
      };
      await api
        .post("/api/users")
        .send(invalidName)
        .expect(400)
        .expect((res) => {
          assert(res.body.message.includes("Path `name` is required"));
        });
      const invalidUsername = {
        name: "1234",
        password: "1234",
      };
      await api
        .post("/api/users")
        .send(invalidUsername)
        .expect(400)
        .expect((res) => {
          assert(res.body.message.includes("Path `username` is required"));
        });
      await api
        .get("/api/users")
        .expect(200)
        .expect((res) => {
          assert.strictEqual(res.body.length, users);
        });
    });
    it("return error if name or username are not valid", async () => {
      let users;
      await api
        .get("/api/users")
        .expect(200)
        .expect((res) => {
          users = res.body.length;
        });
      const invalidName = {
        name: "12",
        username: "1234",
        password: "1234",
      };
      await api
        .post("/api/users")
        .send(invalidName)
        .expect(400)
        .expect((res) => {
          assert(
            res.body.message.includes("name must be at leat 3 characters long")
          );
        });
      const invalidUsername = {
        name: "1234",
        username: "12",
        password: "1234",
      };
      await api
        .post("/api/users")
        .send(invalidUsername)
        .expect(400)
        .expect((res) => {
          assert(
            res.body.message.includes(
              "username must be at leat 3 characters long"
            )
          );
        });
      await api
        .get("/api/users")
        .expect(200)
        .expect((res) => {
          assert.strictEqual(res.body.length, users);
        });
    });
  });
  after(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });
});
