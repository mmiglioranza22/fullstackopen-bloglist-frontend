export const fillLoginFormAndLogin = async (page, testUser) => {
  await page.getByTestId("username-input").fill(testUser.username);
  await page.getByTestId("password-input").fill(testUser.password);
  await page.getByTestId("button-submit").click();
};
