"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import coreApi from "@/lib/coreApi";

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages([
      {
        text: "Welcome! I am your AI Nutritionist. Feel free to ask me any nutrition-related questions.",
        sender: "AI Assistant",
        timestamp,
      },
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: input, sender: "User", timestamp },
      ]);
      setInput("");

      try {
        const { data } = await coreApi.post("/chats/ai-question/", {
          question: input,
        });

        let responseText = "";

        if (data && data.response && Array.isArray(data.response) && data.response.length > 0) {
          const responseContent = data.response[0];
          if (Array.isArray(responseContent) && responseContent.length > 1) {
            responseText = responseContent[1];
          }
        } else {
          responseText = "Sorry, I couldn't understand the response.";
        }

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: responseText,
            sender: "AI Assistant",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } catch (error) {
        console.error("Error while sending message to backend:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "Sorry, there was an error with the request.",
            sender: "AI Assistant",
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full pb-16 pt-20">
      <div className="flex-grow p-4 overflow-y-auto gap-y-4 flex flex-col">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "User" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-t-2xl ${
                message.sender === "User" ? "bg-custom text-white rounded-l-2xl" : "bg-indigo-100 rounded-r-xl"
              }`}
            >
              <div className="flex flex-col space-y-2">
                <div>
                  <span>{message.text}</span>
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className={`text-xs font-semibold ${message.sender === "User" ? "text-slate-100" : "text-slate-600"}`}>
                    {message.timestamp}
                  </div>
                  {message.sender === "User" && (
                    <div>
                      <CheckCheck className="text-slate-300 size-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-6 py-4 pb-8 flex items-center space-x-2 bg-slate-50 border-t border-t-indigo-300">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow outline-none border-none ring-0 focus:outline-none focus:border-none focus:ring-0 bg-transparent"
          placeholder="Ask a nutrition related question..."
        />
        <Button
          onClick={handleSendMessage}
          className="bg-custom hover:bg-indigo-800 text-white rounded-full h-10 w-10"
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
};

export default Page;
