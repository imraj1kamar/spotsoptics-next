"use client";
import React, { useState, useRef, useEffect } from "react";
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

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText) return;

    // 1. Add User Message
    setMessages((prev) => [...prev, { text: userText, sender: "user" }]);
    setInput("");
    setIsTyping(true);

    try {
      // 2. Request to Next.js API Route
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();
      
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
      setIsTyping(false);
    }
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
              {msg.text}
            </div>
          ))}
          
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

       <form onSubmit={handleSubmit} className="chat-input-form p-3 border-top d-flex align-items-center gap-2">
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
            className="chat-send-btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
            aria-label="Send Message"
          >
            ➤
          </button>
        </form>
      </div>
    </>
  );
}