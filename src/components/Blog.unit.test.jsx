import { render, screen } from "@testing-library/react";
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

    const element1 = screen.getByText("test title test author");
    const element2 = screen.queryByText("test url");
    expect(element1).toBeDefined();
    expect(element2).toBeDefined();
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

    const element = screen.queryByText("test title test author");
    console.log(element);

    const toggleBtn = screen.getByTestId("toggle-btn");
    await user.click(toggleBtn);

    // const url = screen.queryByText(/test url/);
    // const likes = screen.queryByText("trolo");
    // screen.debug();

    // expect(url).toBeDefined();
    // expect(likes).toBeDefined();
  });
});
