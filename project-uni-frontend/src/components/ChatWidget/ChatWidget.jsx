import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { IoMdChatbubbles, IoMdClose, IoMdSend } from "react-icons/io";
import { FaRobot } from "react-icons/fa";
import API from "../../services/api";
import useAuthStore from "../../useStore";
import "./ChatWidget.scss";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "مرحباً! 👋 أنا مساعد EHJEZ الذكي. كيف يمكنني مساعدتك اليوم?\n\nHello! I'm the EHJEZ AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const location = useLocation();
  const { user } = useAuthStore();

  // Only show chat for normal users (students)
  const isNormalUser = user && user.role === "user";

  // Close chat when navigating to another page
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Close chat and reset when user logs out
  useEffect(() => {
    if (!user) {
      setIsOpen(false);
      setMessages([
        {
          role: "assistant",
          content: "مرحباً! 👋 أنا مساعد EHJEZ الذكي. كيف يمكنني مساعدتك اليوم?\n\nHello! I'm the EHJEZ AI assistant. How can I help you today?",
        },
      ]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Prepare history (excluding system messages)
      const history = messages
        .filter((msg) => msg.role !== "system")
        .map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          content: msg.content,
        }));

      const response = await API.post("/chat", {
        message: userMessage,
        history: history,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.reply },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذراً، حدث خطأ. حاول مرة أخرى.\n\nSorry, an error occurred. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "How do I book a room?",
    "كيف أسجل في الموقع؟",
    "What is EHJEZ?",
    "How to become a client?",
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  // Don't render if not a normal user (student)
  if (!isNormalUser) {
    return null;
  }

  return (
    <div className="chat-widget">
      {/* Chat Toggle Button */}
      <button
        className={`chat-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <IoMdClose size={24} /> : <IoMdChatbubbles size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <FaRobot className="bot-icon" />
              <div>
                <h3>EHJEZ Assistant</h3>
                <span className="status">Online</span>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>
              <IoMdClose size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === "user" ? "user" : "assistant"}`}
              >
                {msg.role === "assistant" && (
                  <div className="avatar">
                    <FaRobot />
                  </div>
                )}
                <div className="message-content">
                  <p>{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message assistant">
                <div className="avatar">
                  <FaRobot />
                </div>
                <div className="message-content typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (only show if few messages) */}
          {messages.length <= 2 && (
            <div className="suggested-questions">
              {suggestedQuestions.map((q, i) => (
                <button key={i} onClick={() => handleSuggestedQuestion(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message... / اكتب رسالتك..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="send-btn"
            >
              <IoMdSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
