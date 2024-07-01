import { useState } from "react";

const LoginForm = ({ handleBlogService }) => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const handleChangeLoginForm = (ev) => {
    setLoginData((prev) => {
      return {
        ...prev,
        [ev.target.name]: ev.target.value,
      };
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    handleBlogService(loginData);
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username" name="username">
          username
        </label>
        <input
          onChange={handleChangeLoginForm}
          name="username"
          data-testid="username-input"
        />
      </div>
      <div>
        <label htmlFor="password" name="password">
          password
        </label>
        <input
          onChange={handleChangeLoginForm}
          name="password"
          data-testid="password-input"
        />
      </div>
      <button type="submit" data-testid="button-submit">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
