const { test, expect, beforeEach, describe } = require("@playwright/test");
const {
  fillLoginFormAndLogin,
  setupDatabaseAndRedirect,
  createBlog,
} = require("./helper");

const testUser = {
  name: "test user",
  username: "test:user",
  password: "test",
};
const fakeUser = {
  name: "non-existing user",
  username: "non-existing:user",
  password: "wrongPassword",
};

const newBlog = {
  title: "New blog",
  author: testUser.name,
  url: "localhost:8080",
};

const blogs = [
  {
    title: "New blog 1 will have 1 like",
    author: testUser.name,
    url: "localhost:8080",
  },
  {
    title: "New blog 2 will have 3 likes",
    author: testUser.name,
    url: "localhost:8080",
  },
  {
    title: "New blog 3 will have 2 likes",
    author: testUser.name,
    url: "localhost:8080",
  },
];

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await setupDatabaseAndRedirect({ page, request }, testUser);
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("blogs")).toBeVisible();
    await expect(page.getByText("login to application")).toBeVisible();
    await expect(page.getByTestId("username-input")).toBeVisible();
    await expect(page.getByTestId("password-input")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await fillLoginFormAndLogin(page, testUser);
      const welcomeMessage = await page.getByText(`${testUser.name} logged in`);
      const logoutButton = await page.getByText("log out");

      await expect(welcomeMessage).toBeVisible();
      await expect(logoutButton).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await fillLoginFormAndLogin(page, fakeUser);

      const errorNotification = await page.getByText(
        "invalid username or password"
      );
      const loginButton = await page.getByTestId("button-submit");

      await expect(errorNotification).toBeVisible();
      await expect(loginButton).toBeVisible();
    });
    describe("When logged in", () => {
      beforeEach(async ({ page, request }) => {
        await setupDatabaseAndRedirect({ page, request }, testUser);
        await fillLoginFormAndLogin(page, testUser);
      });

      test("a new blog can be created", async ({ page }) => {
        await createBlog(page, newBlog);

        const successNotification = await page.getByText(
          `${newBlog.title} by ${testUser.name} added`
        );

        await expect(successNotification).toBeVisible();
        await expect(page.getByTestId("hideWhenVisible-button")).toBeVisible();
        await expect(
          page.getByText(`${newBlog.title} ${newBlog.author}`)
        ).toBeVisible();
      });

      test("an existing blog can be liked", async ({ page }) => {
        await createBlog(page, newBlog);

        await page.getByTestId("toggle-btn").click();

        await expect(page.getByText("likes 0")).toBeVisible();

        await page.getByTestId("like-btn").click();

        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("an existing blog can be deleted only by the blog creator", async ({
        page,
      }) => {
        page.on("dialog", async (dialog) => {
          await dialog.accept();
        });
        await createBlog(page, newBlog);

        await page.getByTestId("toggle-btn").click();

        await page.getByTestId("remove-btn").click();

        await expect(
          page.getByText(`${newBlog.title} ${newBlog.author}`)
        ).toBeHidden();
      });
    });
  });

  // describe("Creating blogs", () => {
  //   beforeEach(async ({ page, request }) => {
  //     await setupDatabaseAndRedirect({ page, request }, testUser);
  //     await fillLoginFormAndLogin(page, testUser);
  //     await createBlog(page, blogs[0]);
  //     await createBlog(page, blogs[1]);
  //     await createBlog(page, blogs[2]);
  //   });

  //   test("blogs are ordered by the amount of likes", async ({ page }) => {

  //   });
  // });
});

/**
 * Notes on playwright functioning
 *
 * the execution of each test starts from the browser's "zero state",
 * all changes made to the browser's state by the previous tests are reset
 *
 * Playwright tests assume that the system under test is running when the tests are executed.
 * Unlike, for example, backend integration tests, Playwright tests do not start the system under test during testing.
 *
 * Don't use more than 1 worker if tests involve database to avoid inconsistencies
 * (db should be rolledback to initial state at the end otherwise).Ideally, the server's database
 * should be the same each time we run the tests, so our tests can be reliably and easily repeatable
 */
