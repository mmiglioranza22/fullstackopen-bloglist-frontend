import { render, screen } from "@testing-library/react";
import { expect, describe, vi } from "vitest";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

describe("<BlogForm />", () => {
  test("form calls the event handler it received as props with the right details when a new blog is created", async () => {
    const mockFn = vi.fn();
    const user = userEvent.setup();
    render(<BlogForm createBlog={mockFn} />);
    const title = screen.getByTestId("title-input");
    const author = screen.getByTestId("author-input");
    const url = screen.getByTestId("url-input");
    await user.type(title, "test title");
    await user.type(author, "test author");
    await user.type(url, "test url");

    // Form must be submited for values to be saved in mockFn.mock.calls
    const submitButton = screen.getByRole("button");
    await user.click(submitButton);
    expect(mockFn.mock.calls[0][0].title).toEqual("test title");
    expect(mockFn.mock.calls[0][0].author).toEqual("test author");
    expect(mockFn.mock.calls[0][0].url).toEqual("test url");
  });
});
