import { useState } from "react";

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
        <input
          onChange={handleCreateBlog}
          name="title"
          data-testid="title-input"
        />
      </div>
      <div>
        <label htmlFor="author" name="author">
          author
        </label>
        <input
          onChange={handleCreateBlog}
          name="author"
          data-testid="author-input"
        />
      </div>
      <div>
        <label htmlFor="url" name="url">
          url
        </label>
        <input onChange={handleCreateBlog} name="url" data-testid="url-input" />
      </div>
      <button type="submit" data-testid="submit-blog">
        create
      </button>
    </form>
  );
};

export default BlogForm;
