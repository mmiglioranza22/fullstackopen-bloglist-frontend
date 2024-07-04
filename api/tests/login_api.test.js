const { describe, it, after, beforeEach, before } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const { generateHash } = require("../utils/user_hash");

const api = supertest(app);

let token;
const testUser = { username: "test1", password: "test1", name: "test1" };
describe("API tests suite LOGIN:", () => {
  describe("1- login user", () => {
    before(async () => {
      const passwordHash = await generateHash(testUser.password);
      await User.create({ ...testUser, passwordHash });
    });

    it("logins correctly a preloaded user", async () => {
      await api
        .post("/api/login")
        .send({ username: testUser.username, password: testUser.password })
        .expect(200)
        .expect((res) => {
          assert.ok(res.body.token);
          assert.strictEqual(res.body.username, testUser.username);
          assert.strictEqual(res.body.name, testUser.name);
          token = res.body.token;
        });
    });

    after(async () => {
      await User.deleteMany({});
      await mongoose.connection.close();
    });
  });
});
