const LoginForm = ({ handleLogin, handleChangeLoginForm }) => {
  return (
    <form onSubmit={handleLogin}>
      <div>
        <label htmlFor="username" name="username">
          username
        </label>
        <input onChange={handleChangeLoginForm} name="username" />
      </div>
      <div>
        <label htmlFor="password" name="password">
          password
        </label>
        <input onChange={handleChangeLoginForm} name="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
