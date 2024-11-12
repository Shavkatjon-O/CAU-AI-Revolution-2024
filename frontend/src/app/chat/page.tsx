"use client";

import { useState } from "react";
// import { Input } from "@/components/ui/input";
import {
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  text: string;
  sender: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "User" }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "User" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.sender === "User" ? "bg-custom text-white" : "bg-gray-300"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="px-6 py-4 flex items-center space-x-2 bg-white border-t border-gray-300 rounded-t-3xl">
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
          <Send />
        </Button>
      </div>
    </div>
  );
};

export default ChatPage;
