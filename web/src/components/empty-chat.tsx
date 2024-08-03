import React from "react";

/**
 * @description Renders an empty chat interface with a welcome message and instructions to
 * start a conversation with Bear. It is displayed when the chat history is empty.
 */
function EmptyChat() {
  return (
      <div className="w-full h-[60vh] flex flex-col justify-center items-center text-center">
        <h1
            className={"text-2xl font-bold"}>
          Welcome to Remembear!
        </h1>
        <h3
            className={"text-lg font-semibold"}>
          Start a conversation with Bear 🐻
        </h3>
        <p
            className={"text-gray-500"}
        >
          Send messages, and more...
        </p>
      </div>
  );
}

export {EmptyChat}