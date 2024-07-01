import { render, screen } from "@testing-library/react";
import { expect, describe, vi } from "vitest";
import Togglable from "./Togglable";
import BlogForm from "./BlogForm";
import React from "react";
import userEvent from "@testing-library/user-event";

describe("<Togglable />", () => {
  test("shows label button container on render, props.children are not visible", async () => {
    // https://medium.com/developer-rants/how-to-test-useref-without-mocking-useref-699165f4994e
    const ref = React.createRef();
    const child = <p>child</p>;

    render(
      <Togglable buttonLabel="buttonLabel" ref={ref}>
        {child}
      </Togglable>
    );

    const hideWhenVisibleDiv = screen.getByTestId("hideWhenVisible-div");
    const hideButton = screen.getByText("child");
    const showWhenVisibleDiv = screen.getByTestId("showWhenVisible-div");
    const showButton = screen.getByText("cancel");

    // default styles for div use browser default rules.
    expect(hideWhenVisibleDiv).toHaveStyle("display: block");
    expect(hideButton).toBeInTheDocument();
    expect(showWhenVisibleDiv).toHaveStyle("display: none");
    expect(showButton).toBeInTheDocument();
  });
  test("hides label button container on click, props.children are visible", async () => {
    const ref = React.createRef();
    const child = <p>child</p>;
    const user = userEvent.setup();

    render(
      <Togglable buttonLabel="buttonLabel" ref={ref}>
        {child}
      </Togglable>
    );

    const hideWhenVisibleDiv = screen.getByTestId("hideWhenVisible-div");
    const hideButton = screen.getByTestId("hideWhenVisible-button");
    const showWhenVisibleDiv = screen.getByTestId("showWhenVisible-div");
    const showButton = screen.getByTestId("showWhenVisible-button");

    await user.click(hideButton);

    expect(hideWhenVisibleDiv).toHaveStyle("display: none");
    expect(hideButton).toBeInTheDocument();
    // default styles for div use browser default rules.
    expect(showWhenVisibleDiv).toHaveStyle("display: block");
    expect(showButton).toBeInTheDocument();
  });
});
