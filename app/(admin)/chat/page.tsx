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
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex-none p-6 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <h2 className="text-3xl font-bold dark:text-white">
          Chat with Documents
        </h2>
      </div>

      {/* Main Container */}
      <div className="flex-1 p-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full bg-white dark:bg-neutral-800 rounded-lg shadow-lg flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-lime-500 text-white"
                        : "bg-gray-100 dark:bg-neutral-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="flex-none p-4 border-t border-gray-200 dark:border-neutral-700">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <input
                type="text"
                className="flex-1 p-3 border border-gray-300 dark:border-neutral-600 rounded-lg 
                          bg-white dark:bg-neutral-700 text-gray-900 dark:text-white
                          focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                className="px-6 py-3 bg-lime-500 text-white rounded-lg hover:bg-lime-400 
                         focus:outline-none focus:ring-2 focus:ring-lime-500
                         transition-colors duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
