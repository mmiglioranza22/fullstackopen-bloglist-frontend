import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";

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
    // should bring only those blogs related to the user
    if (user) {
      blogService
        .getAll()
        .then((blogs) =>
          setBlogs(blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1)))
        );
    }
  }, [user]);

  const handleLogout = () => {
    window.localStorage.removeItem("loggedUser");
    setUser(null);
  };

  const handleBlogService = (loginData) => {
    let timer;
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

  // Post blog logic ----
  const blogRef = useRef();

  const createBlog = (newBlog) => {
    let timer;
    blogService
      .create(newBlog)
      .then((response) => {
        setBlogs((prev) =>
          [...prev]
            .concat(response)
            .sort((a, b) => (a.likes < b.likes ? 1 : -1))
        );
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
          <LoginForm handleBlogService={handleBlogService} />
        </>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <p>{user.name} logged in</p>
            <button style={{ width: "fit-content" }} onClick={handleLogout}>
              log out
            </button>
            <Togglable buttonLabel="Create blog" ref={blogRef}>
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

export default App;
