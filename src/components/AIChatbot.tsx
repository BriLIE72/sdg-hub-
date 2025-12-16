Index: src/components/AIChatbot.tsx
===================================================================
--- src/components/AIChatbot.tsx	non-existent
+++ src/components/AIChatbot.tsx	new file
@@ -0,0 +1,266 @@
+import { useState, useRef, useEffect } from 'react';
+import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
+import { Button } from '@/components/ui/button';
+import { Input } from '@/components/ui/input';
+import { Badge } from '@/components/ui/badge';
+import { MessageSquare, Send, X, Minimize2, Maximize2, Bot, User } from 'lucide-react';
+
+interface Message {
+  id: string;
+  text: string;
+  sender: 'user' | 'bot';
+  timestamp: Date;
+  suggestions?: string[];
+}
+
+export default function AIChatbot() {
+  const [isOpen, setIsOpen] = useState(false);
+  const [isMinimized, setIsMinimized] = useState(false);
+  const [messages, setMessages] = useState<Message[]>([
+    {
+      id: '1',
+      text: "Hello! I'm your SDG Hub AI assistant. I can help you navigate the platform, find information about SDGs, policies, stakeholders, and more. How can I assist you today?",
+      sender: 'bot',
+      timestamp: new Date(),
+      suggestions: [
+        'Show me the dashboard',
+        'Tell me about SDGs',
+        'View active policies',
+      ],
+    },
+  ]);
+  const [inputValue, setInputValue] = useState('');
+  const [loading, setLoading] = useState(false);
+  const [conversationId, setConversationId] = useState('');
+  const messagesEndRef = useRef<HTMLDivElement>(null);
+
+  const scrollToBottom = () => {
+    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
+  };
+
+  useEffect(() => {
+    scrollToBottom();
+  }, [messages]);
+
+  const sendMessage = async (text: string) => {
+    if (!text.trim()) return;
+
+    // Add user message
+    const userMessage: Message = {
+      id: Date.now().toString(),
+      text,
+      sender: 'user',
+      timestamp: new Date(),
+    };
+    setMessages((prev) => [...prev, userMessage]);
+    setInputValue('');
+    setLoading(true);
+
+    try {
+      const response = await fetch('/api/chatbot', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json',
+        },
+        body: JSON.stringify({
+          message: text,
+          conversationId,
+        }),
+      });
+
+      const data = await response.json();
+
+      if (data.success) {
+        const botMessage: Message = {
+          id: (Date.now() + 1).toString(),
+          text: data.data.message,
+          sender: 'bot',
+          timestamp: new Date(),
+          suggestions: data.data.suggestions,
+        };
+        setMessages((prev) => [...prev, botMessage]);
+        setConversationId(data.data.conversationId);
+      } else {
+        const errorMessage: Message = {
+          id: (Date.now() + 1).toString(),
+          text: 'Sorry, I encountered an error. Please try again.',
+          sender: 'bot',
+          timestamp: new Date(),
+        };
+        setMessages((prev) => [...prev, errorMessage]);
+      }
+    } catch (error) {
+      console.error('Chatbot error:', error);
+      const errorMessage: Message = {
+        id: (Date.now() + 1).toString(),
+        text: 'Sorry, I encountered an error. Please try again.',
+        sender: 'bot',
+        timestamp: new Date(),
+      };
+      setMessages((prev) => [...prev, errorMessage]);
+    } finally {
+      setLoading(false);
+    }
+  };
+
+  const handleSubmit = (e: React.FormEvent) => {
+    e.preventDefault();
+    sendMessage(inputValue);
+  };
+
+  const handleSuggestionClick = (suggestion: string) => {
+    sendMessage(suggestion);
+  };
+
+  if (!isOpen) {
+    return (
+      <Button
+        onClick={() => setIsOpen(true)}
+        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
+        size="icon"
+      >
+        <MessageSquare className="h-6 w-6" />
+      </Button>
+    );
+  }
+
+  return (
+    <Card
+      className={`fixed bottom-6 right-6 shadow-2xl z-50 transition-all ${
+        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
+      }`}
+    >
+      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b">
+        <div className="flex items-center gap-2">
+          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
+            <Bot className="h-5 w-5 text-primary-foreground" />
+          </div>
+          <div>
+            <CardTitle className="text-base">SDG Hub AI Assistant</CardTitle>
+            <p className="text-xs text-muted-foreground">Always here to help</p>
+          </div>
+        </div>
+        <div className="flex items-center gap-1">
+          <Button
+            variant="ghost"
+            size="icon"
+            className="h-8 w-8"
+            onClick={() => setIsMinimized(!isMinimized)}
+          >
+            {isMinimized ? (
+              <Maximize2 className="h-4 w-4" />
+            ) : (
+              <Minimize2 className="h-4 w-4" />
+            )}
+          </Button>
+          <Button
+            variant="ghost"
+            size="icon"
+            className="h-8 w-8"
+            onClick={() => setIsOpen(false)}
+          >
+            <X className="h-4 w-4" />
+          </Button>
+        </div>
+      </CardHeader>
+
+      {!isMinimized && (
+        <CardContent className="p-0 flex flex-col h-[calc(600px-73px)]">
+          {/* Messages */}
+          <div className="flex-1 overflow-y-auto p-4 space-y-4">
+            {messages.map((message) => (
+              <div key={message.id}>
+                <div
+                  className={`flex gap-2 ${
+                    message.sender === 'user' ? 'justify-end' : 'justify-start'
+                  }`}
+                >
+                  {message.sender === 'bot' && (
+                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
+                      <Bot className="h-5 w-5 text-primary-foreground" />
+                    </div>
+                  )}
+                  <div
+                    className={`max-w-[80%] rounded-lg p-3 ${
+                      message.sender === 'user'
+                        ? 'bg-primary text-primary-foreground'
+                        : 'bg-muted'
+                    }`}
+                  >
+                    <p className="text-sm">{message.text}</p>
+                    <p className="text-xs opacity-70 mt-1">
+                      {message.timestamp.toLocaleTimeString([], {
+                        hour: '2-digit',
+                        minute: '2-digit',
+                      })}
+                    </p>
+                  </div>
+                  {message.sender === 'user' && (
+                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
+                      <User className="h-5 w-5" />
+                    </div>
+                  )}
+                </div>
+
+                {/* Suggestions */}
+                {message.sender === 'bot' && message.suggestions && (
+                  <div className="flex flex-wrap gap-2 mt-2 ml-10">
+                    {message.suggestions.map((suggestion, index) => (
+                      <Badge
+                        key={index}
+                        variant="outline"
+                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
+                        onClick={() => handleSuggestionClick(suggestion)}
+                      >
+                        {suggestion}
+                      </Badge>
+                    ))}
+                  </div>
+                )}
+              </div>
+            ))}
+
+            {loading && (
+              <div className="flex gap-2 justify-start">
+                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
+                  <Bot className="h-5 w-5 text-primary-foreground" />
+                </div>
+                <div className="bg-muted rounded-lg p-3">
+                  <div className="flex gap-1">
+                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
+                    <div
+                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
+                      style={{ animationDelay: '0.2s' }}
+                    />
+                    <div
+                      className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"
+                      style={{ animationDelay: '0.4s' }}
+                    />
+                  </div>
+                </div>
+              </div>
+            )}
+
+            <div ref={messagesEndRef} />
+          </div>
+
+          {/* Input */}
+          <div className="border-t p-4">
+            <form onSubmit={handleSubmit} className="flex gap-2">
+              <Input
+                value={inputValue}
+                onChange={(e) => setInputValue(e.target.value)}
+                placeholder="Type your message..."
+                disabled={loading}
+                className="flex-1"
+              />
+              <Button type="submit" size="icon" disabled={loading || !inputValue.trim()}>
+                <Send className="h-4 w-4" />
+              </Button>
+            </form>
+          </div>
+        </CardContent>
+      )}
+    </Card>
+  );
+}
