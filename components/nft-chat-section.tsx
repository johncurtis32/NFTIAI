"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, MessageCircle, AlertCircle } from "lucide-react"

interface Message {
  role: "user" | "assistant" | "error"
  content: string
  timestamp: Date
}

export default function NFTChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your NFT assistant. Ask me anything about NFTs, blockchain, digital art, or cryptocurrency!",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [apiKeyError, setApiKeyError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle mobile keyboard visibility
  useEffect(() => {
    if (!isMobile) return

    const handleResize = () => {
      // Scroll to input when keyboard appears
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobile])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setApiKeyError(false)

    // Blur input on mobile to hide keyboard after sending
    if (isMobile && inputRef.current) {
      inputRef.current.blur()
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.message.content,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        // Handle specific error types
        if (response.status === 401) {
          setApiKeyError(true)
        }

        const errorMessage: Message = {
          role: "error",
          content: data.error || "Sorry, I'm having trouble responding right now. Please try again in a moment.",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        role: "error",
        content: "Network error. Please check your connection and try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // Re-focus input on mobile after response
      if (isMobile && inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus()
        }, 500)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle input focus on mobile
  const handleInputFocus = () => {
    if (isMobile) {
      // Scroll to input area when focused on mobile
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 300)
    }
  }

  const suggestedQuestions = [
    "What is an NFT?",
    "How do I create my first NFT?",
    "What are gas fees?",
    "How do I set up a crypto wallet?",
    "What makes an NFT valuable?",
    "How do NFT royalties work?",
  ]

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question)
    if (inputRef.current) {
      inputRef.current.focus()
      // On mobile, scroll to input after setting question
      if (isMobile) {
        setTimeout(() => {
          inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
        }, 100)
      }
    }
  }

  return (
    <section className="w-full bg-black border-2 border-[#a3ff12] shadow-[0_0_30px_#a3ff12] mt-16">
      {/* Chat Header */}
      <div className="bg-[#a3ff12] text-black p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black flex items-center justify-center">
            <MessageCircle size={isMobile ? 20 : 24} className="text-[#a3ff12]" />
          </div>
          <div>
            <h2 className="font-bold text-xl sm:text-2xl">NFT AI ASSISTANT</h2>
            <p className="text-sm sm:text-lg opacity-80">Get expert answers about NFTs, blockchain, and digital art</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* API Key Error Warning */}
        {apiKeyError && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-900 border-2 border-red-500 text-red-100 rounded">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm sm:text-base">OpenAI API Key Required</h3>
                <p className="text-xs sm:text-sm mt-1">
                  To use the AI chat feature, please add a valid OpenAI API key to your environment variables. Get your
                  API key at{" "}
                  <a
                    href="https://platform.openai.com/account/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-red-200"
                  >
                    platform.openai.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-[#a3ff12] font-semibold text-base sm:text-lg mb-3 sm:mb-4">POPULAR QUESTIONS:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left p-3 sm:p-4 bg-gray-900 border border-[#a3ff12] text-gray-300 hover:bg-[#a3ff12] hover:bg-opacity-10 hover:text-[#a3ff12] transition-all duration-300 text-xs sm:text-sm touch-manipulation"
                  style={{ clipPath: "polygon(0 0, 95% 0, 100% 85%, 5% 100%)" }}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="bg-gray-900 border-2 border-gray-700 min-h-[300px] sm:min-h-[400px] max-h-[400px] sm:max-h-[600px] overflow-y-auto p-3 sm:p-6 mb-4 sm:mb-6">
          <div className="space-y-4 sm:space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 sm:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {(message.role === "assistant" || message.role === "error") && (
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.role === "error" ? "bg-red-500" : "bg-[#a3ff12]"
                    }`}
                  >
                    {message.role === "error" ? (
                      <AlertCircle size={isMobile ? 16 : 20} className="text-white" />
                    ) : (
                      <Bot size={isMobile ? 16 : 20} className="text-black" />
                    )}
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[70%] p-3 sm:p-4 text-xs sm:text-sm ${
                    message.role === "user"
                      ? "bg-[#a3ff12] text-black"
                      : message.role === "error"
                        ? "bg-red-900 text-red-100 border border-red-500"
                        : "bg-gray-800 text-gray-100 border border-gray-600"
                  }`}
                  style={{
                    clipPath:
                      message.role === "user"
                        ? "polygon(5% 0, 100% 0, 95% 100%, 0% 100%)"
                        : "polygon(0 0, 95% 0, 100% 100%, 5% 100%)",
                  }}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <p className="text-xs opacity-60 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <User size={isMobile ? 16 : 20} className="text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 sm:gap-4 justify-start">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#a3ff12] flex items-center justify-center flex-shrink-0">
                  <Bot size={isMobile ? 16 : 20} className="text-black" />
                </div>
                <div
                  className="bg-gray-800 text-gray-100 border border-gray-600 p-3 sm:p-4"
                  style={{ clipPath: "polygon(0 0, 95% 0, 100% 100%, 5% 100%)" }}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Loader2 size={isMobile ? 16 : 20} className="animate-spin text-[#a3ff12]" />
                    <span className="text-xs sm:text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed for Mobile */}
        <div className="bg-black border-2 border-[#a3ff12] p-3 sm:p-6 sticky bottom-0 z-10">
          <div className="flex gap-2 sm:gap-4">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              placeholder={
                isMobile ? "Ask about NFTs..." : "Ask about NFTs, blockchain, crypto wallets, digital art..."
              }
              className="flex-1 px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#a3ff12] focus:shadow-[0_0_10px_#a3ff12] transition-all text-sm sm:text-base rounded-none"
              style={{
                clipPath: isMobile ? "none" : "polygon(0 0, 98% 0, 100% 100%, 2% 100%)",
                WebkitAppearance: "none",
                fontSize: isMobile ? "16px" : "14px", // Prevents zoom on iOS
              }}
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-3 sm:px-6 py-2 sm:py-3 bg-[#a3ff12] text-black font-semibold hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2 touch-manipulation min-w-[60px] sm:min-w-auto"
              style={{ clipPath: isMobile ? "none" : "polygon(0 0, 85% 0, 100% 100%, 15% 100%)" }}
            >
              {isLoading ? (
                <Loader2 size={isMobile ? 16 : 20} className="animate-spin" />
              ) : (
                <>
                  <Send size={isMobile ? 16 : 20} />
                  <span className="hidden sm:inline">SEND</span>
                </>
              )}
            </button>
          </div>
          <div className="mt-2 sm:mt-4 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              💡 Try asking: "How do I mint my first NFT?" or "What's the difference between ETH and WETH?"
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
