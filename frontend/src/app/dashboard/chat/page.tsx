"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizontal, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import coreApi from "@/lib/coreApi"; // Import the coreApi instance

interface Message {
  text: string;
  sender: string;
  timestamp: string;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { text: input, sender: "User", timestamp }]);
      setInput("");

      try {
        // Send the query to the backend
        const { data } = await coreApi.post("/chats/nutrition-assistant/", { query: input });

        // Check if the data contains the 'response' array and extract the content from it
        let responseText = "";

        if (data && data.response && Array.isArray(data.response) && data.response.length > 0) {
          // The content is in the first element of the array
          const responseContent = data.response[0]; // Get the content from index 0
          if (Array.isArray(responseContent) && responseContent.length > 1) {
            responseText = responseContent[1]; // The actual message is at index 1
          }
        } else {
          responseText = "Sorry, I couldn't understand the response.";
        }

        // Update the messages state with the response text
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: responseText, sender: "AI", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        ]);
      } catch (error) {
        console.error('Error while sending message to backend:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Sorry, there was an error with the request.", sender: "AI", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
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
    <div className="flex flex-col h-full">
      <div className="flex-grow p-4 overflow-y-auto gap-y-4 flex flex-col-reverse">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "User" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-3 rounded-t-2xl ${
                message.sender === "User" ? "bg-custom text-white rounded-l-2xl" : "bg-slate-300 rounded-r-xl"
              }`}
            >
              <div className="flex flex-col space-y-2">
                <div>
                  <span>{message.text}</span>
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="text-xs font-semibold text-slate-300">{message.timestamp}</div>
                  <div>{message.sender === "User" && (<CheckCheck className="text-slate-300 size-4" />)}</div>
                </div>
              </div>
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
          placeholder="Ask a nutrition-related question..."
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
