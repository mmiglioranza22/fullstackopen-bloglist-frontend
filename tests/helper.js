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
