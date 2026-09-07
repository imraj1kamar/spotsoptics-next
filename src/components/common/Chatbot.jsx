"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import siteData from "@/data/site.json";
import "../../../public/assets/css/chatBoat.css";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: `Hello! 👋 Welcome to ${siteData.site?.name || "SpotOptics"}. How can I assist you with our optical instruments today?`, 
      sender: "bot" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const quickReplies = [
    { label: "🔍 Explore All Products", text: "What products do you offer?" },
    { label: "🏭 Browse Applications", text: "What applications do you offer?" },
    { label: "📄 Download Brochures", text: "Where can I download brochures?" },
    { label: "✉️ Request a Quote", text: "How can I get a quote?" },
  ];

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Common function to handle sending messages (Works for both Input and Quick Replies)
  const sendMessage = async (userText) => {
    const textToSend = userText.trim();
    if (!textToSend) return;

    // 1. Add User Message to UI
    setMessages((prev) => [...prev, { text: textToSend, sender: "user" }]);
    setInput(""); // Clear input box
    setIsTyping(true); // Show typing indicator

    try {
      // 2. Request to Next.js API Route
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      
      // 3. Add Bot Response to UI
      setMessages((prev) => [
        ...prev,
        { text: data.reply || "Something went wrong. Please try again.", sender: "bot" }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { text: "Unable to connect right now. Please check your internet connection.", sender: "bot" }
      ]);
    } finally {
      setIsTyping(false); // Hide typing indicator
    }
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        className="chat-toggle-btn position-fixed rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Chat"
      >
        {isOpen ? "✕" : "💬"}
        <span className="chat-tooltip">{isOpen ? "Close" : "AI Chat"}</span>
      </button>

      {/* Chat Window Container */}
      <div className={`chat-window position-fixed d-flex flex-column ${isOpen ? 'show' : 'hide'}`}>
        
        {/* Header */}
        <div className="chat-header d-flex justify-content-between align-items-center px-4 py-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="caption-dot"></div>
            <h6 className="mb-0 fw-bold text-dark">
              {siteData.site?.name || "SpotOptics"} AI
            </h6>
          </div>
          <button 
            className="btn-close shadow-none" 
            onClick={() => setIsOpen(false)} 
            aria-label="Close Chat"
          ></button>
        </div>

        {/* Messages Container */}
        <div className="flex-grow-1 overflow-auto d-flex flex-column gap-3 p-3 chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
              {msg.sender === "bot" ? (
                /* Bot Markdown Content */
                <div className="markdown-content">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ) : (
                /* User text */
                msg.text
              )}
            </div>
          ))}

          {/* Quick Replies (Only shows when there is exactly 1 message - the initial greeting) */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {quickReplies.map((qr, idx) => (
                <button 
                  key={idx} 
                  // 👇 Fixed the function name here!
                  onClick={() => sendMessage(qr.text)}
                  className="text-sm bg-gray-100 hover:bg-blue-100 text-gray-700 px-3 py-1 rounded-pill border-0 transition-all duration-200 shadow-sm"
                  style={{ fontSize: "13px", cursor: "pointer" }}
                >
                  {qr.label}
                </button>
              ))}
            </div>
          )}

          {/* AI Typing Indicator */}
          {isTyping && (
            <div className="chat-bubble bot-bubble">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} suppressHydrationWarning={true} className="chat-input-form p-3 border-top d-flex align-items-center gap-2">
          <input 
            type="text" 
            className="form-control rounded-pill chat-input shadow-none" 
            placeholder="Ask about OMI, Optino, Specs..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            suppressHydrationWarning={true}
          />
          <button 
            type="submit" 
            className="chat-send-btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 border-0"
            aria-label="Send Message"
          >
            ➤
          </button>
        </form>
      </div>
    </>
  );
}