"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = () => {
    if (input.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { text: input, sender: "User", timestamp }]);
      setInput("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto gap-y-4 flex flex-col-reverse">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "User" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "User" ? "bg-custom text-white" : "bg-slate-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{message.text}</span>
                {message.sender === "User" && (
                  <Check className="text-slate-300" size={16} />
                )}
              </div>
              <div className="text-xs text-slate-300 mt-1 text-right">{message.timestamp}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-6 py-4 flex items-center space-x-2 bg-slate-50 border-t border-t-slate-300 rounded-t-3xl shadow-2xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow outline-none border-none ring-0 focus:outline-none focus:border-none focus:ring-0 bg-transparent"
          placeholder="Write a message..."
        />
        <Button
          onClick={handleSendMessage}
          className="bg-custom text-white"
          size="icon"
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
