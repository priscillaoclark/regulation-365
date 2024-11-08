"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Loader2, AlertCircle, Bot, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const RegChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (messages.length > 0 && shouldAutoScroll) {
      const chatContainer = chatContainerRef.current;
      if (chatContainer) {
        const isScrolledNearBottom =
          chatContainer.scrollHeight - chatContainer.clientHeight <=
          chatContainer.scrollTop + 100;

        if (isScrolledNearBottom) {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          setHasUnreadMessages(true);
        }
      }
    }
  }, [messages, shouldAutoScroll]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    setHasUnreadMessages(false);
  };

  const handleScroll = () => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const isScrolledNearBottom =
        chatContainer.scrollHeight - chatContainer.clientHeight <=
        chatContainer.scrollTop + 100;

      if (isScrolledNearBottom) {
        setHasUnreadMessages(false);
      }

      setShouldAutoScroll(isScrolledNearBottom);
    }
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setError(null);
    setIsLoading(true);

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("/api/reg-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex-none p-4 border-b bg-background">
        <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
          <Bot className="h-6 w-6 text-lime-500" />
          Major Regulatory Knowledge Base
        </h2>
        <p className="mt-1 text-muted-foreground text-sm">
          Ask questions about major financial regulations and get detailed
          answers from our AI assistant.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 overflow-hidden">
        <Card className="mx-auto h-full max-w-4xl flex flex-col">
          <CardHeader className="flex-none pb-3 border-b">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 text-lime-500" />
              Regulatory Chat Assistant
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Ask questions about major financial regulations and requirements
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
            {/* Messages Container */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
              onScroll={handleScroll}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-4">
                  <Bot className="h-12 w-12 text-muted-foreground opacity-50" />
                  <div className="text-muted-foreground max-w-md">
                    <p className="font-medium">
                      Welcome to the Regulatory Knowledge Base!
                    </p>
                    <p className="text-sm mt-2">
                      Ask questions about major financial regulations like
                      Dodd-Frank, Bank Secrecy Act, and more. Get detailed
                      answers backed by regulatory text.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user"
                            ? "bg-lime-500 text-white"
                            : "bg-gray-100 dark:bg-neutral-800 text-foreground"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-4 py-2">
                        <Loader2 className="h-5 w-5 animate-spin text-lime-500" />
                      </div>
                    </div>
                  )}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {hasUnreadMessages && (
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-24 right-8 rounded-full shadow-lg"
                onClick={scrollToBottom}
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                New messages
              </Button>
            )}

            {/* Input Area - Fixed at bottom */}
            <div className="flex-none border-t p-4 bg-background mt-auto">
              <form onSubmit={sendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question about financial regulations..."
                  className="flex-1 min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-lime-500 hover:bg-lime-600 text-white"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegChatPage;
