import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [newBlog, setNewBlog] = useState({ author: "", title: "", url: "" });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
      blogService.setToken(JSON.parse(loggedUser)?.token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

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
    blogService.login(loginData).then((response) => {
      blogService.setToken(response.token);
      window.localStorage.setItem("loggedUser", JSON.stringify(response));
      setUser(response);
    });
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const handleCreateBlog = (ev) => {
    setNewBlog((prev) => {
      return {
        ...prev,
        [ev.target.name]: ev.target.value,
      };
    });
  };

  const createBlog = (e) => {
    e.preventDefault();
    blogService.create(newBlog).then((response) => {
      setBlogs((prev) => [...prev].concat(response));
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {!user ? (
        <>
          <h2>login to application</h2>
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
        </>
      ) : (
        <>
          <div>
            <p>{user.name} logged in</p>
            <button style={{ width: "fit-content" }} onClick={handleLogout}>
              log out
            </button>
            <form onSubmit={createBlog}>
              <div>
                <label htmlFor="title" name="title">
                  title
                </label>
                <input onChange={handleCreateBlog} name="title" />
              </div>
              <div>
                <label htmlFor="author" name="author">
                  author
                </label>
                <input onChange={handleCreateBlog} name="author" />
              </div>
              <div>
                <label htmlFor="url" name="url">
                  url
                </label>
                <input onChange={handleCreateBlog} name="url" />
              </div>
              <button type="submit">create</button>
            </form>
          </div>
          <h2>blogs</h2>
          {blogs.map((blog, i) => (
            <Blog key={blog.id + "-" + i} blog={blog} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
