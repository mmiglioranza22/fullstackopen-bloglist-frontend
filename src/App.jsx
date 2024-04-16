import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [newBlog, setNewBlog] = useState({ author: "", title: "", url: "" });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

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
    let timer;
    e.preventDefault();
    blogService
      .login(loginData)
      .then((response) => {
        blogService.setToken(response.token);
        window.localStorage.setItem("loggedUser", JSON.stringify(response));
        setUser(response);
      })
      .catch((err) => {
        setMessage({
          message: `${err.response.data.error}`,
          error: true,
        });
        clearTimeout(timer);
        timer = setTimeout(() => {
          setMessage(null);
        }, 5000);
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
    let timer;
    blogService
      .create(newBlog)
      .then((response) => {
        setBlogs((prev) => [...prev].concat(response));
        setMessage({
          message: `${response.title} by ${user.name} added`,
        });
        clearTimeout(timer);
        timer = setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((err) => {
        setMessage({
          message: `${err.response.data.message}`,
          error: true,
        });
        clearTimeout(timer);
        timer = setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Notification message={message} />
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

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div
      style={{
        background: "grey",
        border: message.error ? "5px solid red" : "5px solid green",
        borderRadius: "5px",
        color: message.error ? "red" : "green",
        fontSize: "20px",
      }}
    >
      <p>{message.message}</p>
    </div>
  );
};

export default App;
