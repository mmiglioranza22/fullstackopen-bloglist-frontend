import { forwardRef, useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";

// HOC
const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };
  // Makes the child fn known for the parent in the ref.current
  // To recap, the useImperativeHandle function is a React hook, that is used for
  // defining functions in a component, which can be invoked from outside of the component.
  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible} data-testid="hideWhenVisible-div">
        <button onClick={toggleVisibility} data-testid="hideWhenVisible-button">
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible} data-testid="showWhenVisible-div">
        {props.children}
        <button onClick={toggleVisibility} data-testid="showWhenVisible-button">
          cancel
        </button>
      </div>
    </div>
  );
});
Togglable.displayName = Togglable;

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
