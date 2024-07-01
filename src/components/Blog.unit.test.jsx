import { render, screen } from "@testing-library/react";
import { expect, describe, vi } from "vitest";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

describe("<Blog />", () => {
  test("renders title and author but not url", () => {
    const blog = {
      title: "test title",
      author: "test author",
      url: "test url",
      likes: 1,
      user: {
        name: "tester",
      },
    };
    const mockFn = vi.fn();

    render(<Blog blog={blog} updateBlog={mockFn} removeBlog={mockFn} />);

    const titleAuthor = screen.queryByText("test title test author");
    const url = screen.queryByText("test url");
    const likes = screen.queryByText("likes 1");

    expect(titleAuthor).toBeDefined();
    expect(url).toBeNull();
    expect(likes).toBeNull();
  });
  test("shows url and likes if toggle button is clicked", async () => {
    const blog = {
      title: "test title",
      author: "test author",
      url: "test url",
      likes: 1,
      user: {
        name: "tester",
      },
    };
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<Blog blog={blog} updateBlog={mockFn} removeBlog={mockFn} />);

    const toggleButton = screen.getByTestId("toggle-btn");
    await user.click(toggleButton);

    const url = screen.getByText("test url");
    const likes = screen.getByText("likes 1");
    expect(url).toBeDefined();
    expect(likes).toBeDefined();
  });
  test("if the like button is clicked twice, the event handler the component received as props is called twice", async () => {
    const blog = {
      title: "test title",
      author: "test author",
      url: "test url",
      likes: 1,
      user: {
        name: "tester",
      },
    };
    const mockFn = vi.fn();
    const user = userEvent.setup();

    render(<Blog blog={blog} updateBlog={mockFn} removeBlog={mockFn} />);

    const toggleButton = screen.getByTestId("toggle-btn");
    await user.click(toggleButton);
    const likeButton = screen.getByTestId("like-btn");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockFn).toBeCalledTimes(2);
  });
});
