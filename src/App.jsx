import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import PropTypes from "prop-types";

const App = () => {
  const [blogs, setBlogs] = useState([]);
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
      blogService
        .getAll()
        .then((blogs) =>
          setBlogs(blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1)))
        );
    }
  }, [user]);

  // Login logic --------
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

  // Post blog logic ----
  const blogRef = useRef();

  const createBlog = (newBlog) => {
    let timer;
    blogService
      .create(newBlog)
      .then((response) => {
        setBlogs((prev) => [...prev].concat(response));
        setMessage({
          message: `${response.title} by ${user.name} added`,
        });
        blogRef.current.toggleVisibility();
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

  const updateBlog = (blogId, payload) => {
    console.log("click");
    blogService
      .update(blogId, payload)
      .then((response) => {
        setBlogs(blogs.map((blog) => (blog._id === blogId ? response : blog)));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const removeBlog = (blogId) => {
    blogService
      .remove(blogId)
      .then((response) => {
        setBlogs(blogs.filter((blog) => blog._id !== blogId));
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Notification message={message} />
      <h2>blogs</h2>
      {!user ? (
        <>
          <h2>login to application</h2>
          <LoginForm
            handleLogin={handleLogin}
            handleChangeLoginForm={handleChangeLoginForm}
          />
        </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p>{user.name} logged in</p>
            <button style={{ width: "fit-content" }} onClick={handleLogout}>
              log out
            </button>
            <Togglable buttonLabel="Create note" ref={blogRef}>
              <BlogForm createBlog={createBlog} />
            </Togglable>
            {blogs.map((blog, i) => (
              <Blog
                key={blog.id + "-" + i}
                blog={blog}
                updateBlog={updateBlog}
                removeBlog={removeBlog}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ author: "", title: "", url: "" });
  const handleCreateBlog = (ev) => {
    setNewBlog((prev) => {
      return {
        ...prev,
        [ev.target.name]: ev.target.value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createBlog(newBlog);
  };

  return (
    <form onSubmit={handleSubmit}>
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
  );
};

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

// HOC
const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  // Makes the child fn known for the parent in the ref.current
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});
Togglable.displayName = Togglable;

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default App;
