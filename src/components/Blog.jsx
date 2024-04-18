import { useState } from "react";

const Blog = ({ blog }) => {
  const [toggleDetail, setToggleDetail] = useState(false);
  return (
    <div style={{ border: "1px solid black", maxWidth: "300px" }}>
      {blog.title} {blog.author}
      <button onClick={() => setToggleDetail(!toggleDetail)}>
        {toggleDetail ? "hide" : "view"}
      </button>
      {toggleDetail && (
        <div>
          <p>{blog.url}</p>
          <p>likes {blog.likes}</p>
          <p>{blog.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
