"use client";
import { useState } from "react";

const ChatPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const { response } = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "user", content: input },
        { role: "bot", content: response },
      ]);
      setInput("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen bg-gray-100">
      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-80px)]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-lime-500 text-white"
                  : "bg-gray-300 text-gray-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 flex items-center border-t border-gray-300">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
