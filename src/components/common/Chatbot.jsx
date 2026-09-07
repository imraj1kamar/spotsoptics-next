"use client";

import Link from 'next/link';
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import siteData from "@/data/site.json";
import "../../../public/assets/css/chatBoat.css";

// 1. Helper SVG Components (From the new UI)
function BotMark() {
  return (
    <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v4M8 16h.01M16 16h.01" />
    </svg>
  );
}

function SendMark() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Custom Welcome Message with siteData
  const [messages, setMessages] = useState([
    { 
      text: `Hello! 👋 Welcome to ${siteData.site?.name || "SpotOptics"}. How can I assist you with our optical instruments today?`, 
      sender: "bot" 
    }
  ]);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Quick Replies Data
  const quickReplies = [
    { label: "Explore All Products", text: "What products do you offer?" },
    { label: "Browse Applications", text: "What applications do you offer?" },
    { label: "Download Brochures", text: "Where can I download brochures?" },
    { label: "Request a Quote", text: "How can I get a quote?" },
  ];

  // Auto-open on desktop after a short delay
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth > 900) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000); // 1-second delay before auto-opening
      return () => clearTimeout(timer);
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // UI Effect: Toggle body class when chat is open (for mobile scrolling locks, etc.)
  useEffect(() => {
    document.body.classList.toggle("chatbot-open", isOpen);
    return () => document.body.classList.remove("chatbot-open");
  }, [isOpen]);

  // Common function to handle sending messages & API logic
  const sendMessage = async (userText) => {
    const textToSend = userText.trim();
    if (!textToSend || isTyping) return;

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
      
      // Simulate natural AI thinking time based on response length
      const delayMs = Math.min(Math.max((data.reply?.length || 50) * 12, 1000), 2500);
      await new Promise(resolve => setTimeout(resolve, delayMs));
      
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
  const handleSubmit = (event) => {
    event.preventDefault();
    // Prevent sending when typing in a language that requires composition (like Chinese/Japanese)
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    sendMessage(input);
  };

  return (
    <div className="chatbot-shell">
      {/* Floating Toggle Button */}
      <button 
        className={`chat-toggle-btn ${isOpen ? "is-open" : ""}`} 
        onClick={() => setIsOpen((open) => !open)} 
        aria-label={isOpen ? "Close chat" : "Open AI chat"} 
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <span className="close-mark" aria-hidden="true" />
        ) : (
          <>
            <BotMark />
            <span className="chat-toggle-label">Ask SpotOptics AI</span>
          </>
        )}
      </button>

      {/* Chat Window Container */}
      <section className={`chat-window ${isOpen ? "show" : "hide"}`} aria-label="SpotOptics AI chat" aria-hidden={!isOpen}>
        
        {/* Header */}
        <header className="chat-header">
          <div className="chat-brand">
            <div className="bot-avatar">
              <BotMark />
              <span className="status-dot" />
            </div>
            <div>
              <h1>{siteData.site?.name || "SpotOptics"} AI</h1>
              <p><span className="online-dot" /> Online & ready to help</p>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">×</button>
        </header>

        {/* Messages Container */}
        <div className="chat-messages">
          <div className="welcome-kicker">SPOTOPTICS SUPPORT</div>
          
          {messages.map((message, index) => (
  <div key={`${message.sender}-${index}`} className={`message-row ${message.sender === "user" ? "user-row" : "bot-row"}`}>
    <div className={`chat-bubble ${message.sender === "user" ? "user-bubble" : "bot-bubble"}`}>
      {message.sender === "bot" ? (
        <div className="markdown-content">
          <ReactMarkdown 
            rehypePlugins={[rehypeRaw]}
            components={{
              a: ({ node, ...props }) => {
                // Internal links ke liye Next.js Link use karein (Bina refresh page change)
                if (props.href && props.href.startsWith('/')) {
                  return (
                    <Link href={props.href} className={props.className}>
                      {props.children}
                    </Link>
                  );
                }
                // External links ke liye standard anchor tag use karein (Naye tab mein open)
                return (
                  <a {...props} target="_blank" rel="noopener noreferrer">
                    {props.children}
                  </a>
                );
              }
            }}
          >
            {message.text}
          </ReactMarkdown>
        </div>
      ) : (
        message.text
      )}
    </div>
  </div>
))}

          {/* Quick Replies (Only shows when there is exactly 1 message) */}
          {messages.length === 1 && (
            <div className="quick-replies" aria-label="Suggested questions">
              {quickReplies.map((reply, idx) => (
                <button key={idx} onClick={() => sendMessage(reply.text)}>
                  {reply.label}
                </button>
              ))}
            </div>
          )}

          {/* AI Typing Indicator */}
          {isTyping && (
            <div className="message-row bot-row">
              <div className="chat-bubble bot-bubble typing-bubble">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} suppressHydrationWarning={true} className="chat-input-form">
          <input 
            type="text" 
            aria-label="Ask SpotOptics AI a question" 
            placeholder="Ask about OMI, Optino, specs..." 
            value={input} 
            onChange={(event) => setInput(event.target.value)} 
            suppressHydrationWarning={true}
          />
          <button 
            type="submit" 
            aria-label="Send message" 
            disabled={!input.trim() || isTyping}
          >
            <SendMark />
          </button>
        </form>
        
        {/* Footer Text */}
        <p className="chat-footer">AI responses can be helpful, but may not always be exact.</p>
      </section>
    </div>
  );
}