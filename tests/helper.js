export const setupDatabaseAndRedirect = async ({ page, request }, user) => {
  await request.delete("http://localhost:5173/api/testing/reset");
  await request.post("http://localhost:5173/api/users", {
    data: {
      name: user.name,
      username: user.username,
      password: user.password,
    },
  });
  // redirect
  await page.goto("http://localhost:5173");
};

export const fillLoginFormAndLogin = async (page, user) => {
  await page.getByTestId("username-input").fill(user.username);
  await page.getByTestId("password-input").fill(user.password);
  await page.getByTestId("button-submit").click();
};

export const createBlog = async (page, blog) => {
  // open form
  await page.getByTestId("hideWhenVisible-button").click();
  // fill it
  await page.getByTestId("title-input").fill(blog.title);
  await page.getByTestId("author-input").fill(blog.author);
  await page.getByTestId("url-input").fill(blog.url);
  // submit
  await page.getByTestId("submit-blog").click();
};

export const likeBlog = async (page, blog) => {
  // get the specific blog by its text
  const blogText = await page.getByText(`${blog.title} ${blog.author}`);
  const blogParentContainer = await blogText.locator("..");
  // click its view button
  await blogParentContainer.getByRole("button", { name: "view" }).click();
  await page.getByTestId("like-btn").click();
};
