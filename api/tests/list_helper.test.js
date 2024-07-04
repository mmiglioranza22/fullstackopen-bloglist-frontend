const { test, describe, it, before, after } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { log } = require("node:console");

let blogs = [];

// describe("total likes", () => {
//   it("of empty list is zero", () => {
//     const result = listHelper.totalLikes([]);
//     assert.strictEqual(result, 0);
//   });

//   before(() => {
//     blogs.push({
//       title: "React patterns",
//       likes: 7,
//     });
//   });
//   it("when list has only one blog equals the likes of that", () => {
//     const result = listHelper.totalLikes([blogs[0]]);
//     assert.strictEqual(result, 7);
//   });

//   before(() => {
//     blogs.push(
//       {
//         title: "Go To Statement Considered Harmful",
//         likes: 5,
//       },
//       {
//         title: "Canonical string reduction",
//         likes: 12,
//       }
//     );
//   });
//   it("of a bigger list is calculated right", () => {
//     const result = listHelper.totalLikes(blogs);
//     assert.strictEqual(result, 24);
//   });
// });

// describe("favourite blog", () => {
//   it("returns the blog with the most likes", () => {
//     const blogs = [
//       {
//         title: "React patterns",
//         likes: 25,
//       },
//       {
//         title: "Go To Statement Considered Harmful",
//         likes: 5,
//       },
//     ];
//     const result = listHelper.favoriteBlog(blogs);

//     assert.deepStrictEqual(result, {
//       title: "React patterns",
//       likes: 25,
//     });
//     assert.strictEqual(result.title, "React patterns");
//     assert.strictEqual(result.likes, 25);
//   });

//   it("returns nothing if there are no blogs", () => {
//     const result = listHelper.favoriteBlog([]);
//     assert.deepStrictEqual(result, []);
//   });
// });

// describe("most blogs", () => {
//   it("returns the author who has the largest amount of blogs", () => {
//     const blogs = [
//       {
//         author: "Bob",
//         title: "React patterns",
//         likes: 25,
//       },
//       {
//         author: "Bob",
//         title: "Go To Statement Considered Harmful",
//         likes: 5,
//       },
//       {
//         author: "Robert",
//         title: "Boca",
//         likes: 2,
//       },
//       {
//         author: "Martins",
//         title: "Juniors",
//         likes: 2,
//       },
//     ];
//     const result = listHelper.mostBlogs(blogs);

//     assert.strictEqual(result.author, "Bob");
//     assert.strictEqual(result.blogs, 2);

//     blogs.push(
//       {
//         author: "Martins",
//         title: "Juniors",
//         likes: 2,
//       },
//       {
//         author: "Martins",
//         title: "Juniors",
//         likes: 2,
//       }
//     );
//     const result2 = listHelper.mostBlogs(blogs);
//     assert.strictEqual(result2.author, "Martins");
//     assert.strictEqual(result2.blogs, 3);
//   });
// });

// describe("most likes", () => {
//   it("returns the author whose blog posts have the largest amount of likes and the total numebr of likes", () => {
//     const blogs = [
//       {
//         author: "Bob",
//         title: "React patterns",
//         likes: 5,
//       },
//       {
//         author: "Bob",
//         title: "Go To Statement Considered Harmful",
//         likes: 1,
//       },
//       {
//         author: "Robert",
//         title: "Boca",
//         likes: 5,
//       },
//       {
//         author: "Martins",
//         title: "Juniors",
//         likes: 5,
//       },
//     ];
//     const result = listHelper.mostLikes(blogs);

//     assert.strictEqual(result.author, "Bob");
//     assert.strictEqual(result.likes, 6);

//     blogs.push(
//       {
//         author: "Robert",
//         title: "Juniors",
//         likes: 2,
//       },
//       {
//         author: "Martins",
//         title: "Juniors",
//         likes: 2,
//       }
//     );
//     const result2 = listHelper.mostLikes(blogs);
//     assert.strictEqual(result2.author, "Martins");
//     assert.strictEqual(result2.likes, 7);
//   });
// });
