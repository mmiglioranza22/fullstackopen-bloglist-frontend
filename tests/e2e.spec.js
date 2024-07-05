const { test, expect, beforeEach, describe } = require("@playwright/test");
const { fillLoginFormAndLogin, setupDatabaseAndRedirect } = require("./helper");

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
        // open form
        await page.getByTestId("hideWhenVisible-button").click();
        // fill it
        await page.getByTestId("title-input").fill(newBlog.title);
        await page.getByTestId("author-input").fill(newBlog.author);
        await page.getByTestId("url-input").fill(newBlog.url);
        // submit
        await page.getByTestId("submit-blog").click();

        const successNotification = await page.getByText(
          `${newBlog.title} by ${testUser.name} added`
        );

        await expect(successNotification).toBeVisible();
        await expect(page.getByTestId("hideWhenVisible-button")).toBeVisible();
        await expect(
          page.getByText(`${newBlog.title} ${newBlog.author}`)
        ).toBeVisible();
      });
    });
  });
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
