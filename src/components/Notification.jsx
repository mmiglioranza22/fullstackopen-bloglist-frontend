const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div
      data-testid="notification"
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

export default Notification;
