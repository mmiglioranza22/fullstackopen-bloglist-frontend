const dummy = (blogs) => {
  return 1;
};
const totalLikes = (blogs) => {
  return blogs.reduce((acc, blog) => acc + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!blogs.length) return [];
  return blogs.reduce((acc, blog) => (acc.likes > blog.likes ? acc : blog));
};

const mostBlogs = (blogs) => {
  // Keep track of authors and blogs in a dictionary
  const dictionary = {};
  // If the author was recorded, add 1 more post
  // if not, recorde the author with 1 post
  blogs.forEach((blog) => {
    if (dictionary[blog.author]) {
      dictionary[blog.author] = dictionary[blog.author] + 1;
    } else {
      dictionary[blog.author] = 1;
    }
  });

  const orderedMostBlogsAuthors = Object.entries(dictionary).map((el) => {
    return {
      author: el[0],
      blogs: el[1],
    };
  });
  return orderedMostBlogsAuthors.reduce((acc, author) =>
    acc.blogs > author.blogs ? acc : author
  );
};

const mostLikes = (blogs) => {
  // Keep track of authors and blogs in a dictionary
  const dictionary = {};
  // If the author was recorded, add the likes in that blog post to the previous likes
  // if not, recorde the author with the likes in that blog post
  blogs.forEach((blog) => {
    if (dictionary[blog.author]) {
      // the key             // the value to that key
      dictionary[blog.author] = dictionary[blog.author] + blog.likes;
    } else {
      dictionary[blog.author] = blog.likes;
    }
  });
  const orderedMostLikedAuthors = Object.entries(dictionary).map((el) => {
    return {
      author: el[0],
      likes: el[1],
    };
  });
  // If there are 2 or more authors with same number of likes, the last one is returned
  // since reduce loops until the end of the array and no conditions is being placed to handle this (return the previous in case of equality)
  return orderedMostLikedAuthors.reduce((acc, author) =>
    acc.likes > author.likes ? acc : author
  );
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
