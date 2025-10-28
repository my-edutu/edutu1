import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Lightbulb,
  ExternalLink,
  Users,
  MessageSquare,
  Sparkles,
  Zap,
  Brain,
  Mic,
  MicOff,
  Paperclip,
  MoreHorizontal
} from 'lucide-react';
import Button from './ui/Button';
import { useDarkMode } from '../hooks/useDarkMode';
import { useAnalytics } from '../hooks/useAnalytics';
import type { AppUser } from '../types/user';

type MessageActionType = 'scholarship' | 'community' | 'expert' | 'link';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  buttons?: Array<{
    text: string;
    type: MessageActionType;
    data?: Record<string, unknown>;
  }>;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  user: AppUser | null;
}

type IconType = React.ComponentType<{ size?: number; className?: string }>;

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: `Hi ${user?.name || 'there'}! I am Edutu, your AI opportunity coach. I am here to help you uncover scholarships, build skills, and plan your career. What would you like to explore today?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useDarkMode();
  const { recordChatSession } = useAnalytics();
  const hasRecordedSessionRef = useRef(false);

  const quickPrompts: Array<{ text: string; icon: IconType; topic: string }> = [
    { text: 'Help me find scholarships', icon: Sparkles, topic: 'Scholarships' },
    { text: 'Career guidance', icon: Brain, topic: 'Career growth' },
    { text: 'Skills to develop', icon: Zap, topic: 'Skill development' },
    { text: 'Networking tips', icon: Users, topic: 'Networking' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToOpenRouter = async (conversation: Message[]): Promise<string> => {
    // In a production environment, this should call your backend API endpoint
    // The API key should be stored securely on the server, not in client code
    // For now, this throws an error to prevent the build from including the API key
    throw new Error(
      'Chat functionality requires a backend service to securely handle API keys. ' +
      'Please implement a backend proxy before deploying to production.'
    );
  };

  const handleSend = async (overrideText?: string, topic?: string) => {
    const text = (overrideText ?? input).trim();

    if (!text) return;

    const sessionTopic = topic ?? 'Custom question';

    if (!hasRecordedSessionRef.current) {
      void recordChatSession(sessionTopic);
      hasRecordedSessionRef.current = true;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date()
    };

    const typingMessage: Message = {
      id: `typing-${Date.now().toString()}`,
      type: 'bot',
      content: '',
      timestamp: new Date(),
      isTyping: true
    };

    setMessages((prev) => [...prev, userMessage, typingMessage]);
    setInput('');
    setIsTyping(true);

    const conversationForModel = [...messages, userMessage];

    try {
      const aiResponse = await sendMessageToOpenRouter(conversationForModel);
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages((prev) => prev.filter((message) => message.id !== typingMessage.id).concat(botMessage));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        type: 'bot',
        content:
          error instanceof Error
            ? `I ran into an issue reaching the Edutu AI service: ${error.message}`
            : 'I ran into an unexpected issue reaching the Edutu AI service.',
        timestamp: new Date()
      };

      setMessages((prev) => prev.filter((message) => message.id !== typingMessage.id).concat(errorMessage));
      console.error('OpenRouter request failed:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickPrompt = (prompt: string, topic: string) => {
    handleSend(prompt, topic);
  };

  const handleButtonClick = (button: { text: string; type: MessageActionType; data?: Record<string, unknown> }) => {
    switch (button.type) {
      case 'scholarship':
        console.log('Navigate to scholarship:', button.data);
        break;
      case 'community':
        console.log('Navigate to community');
        break;
      case 'expert':
        console.log('Connect with expert');
        break;
      case 'link':
        console.log('Navigate to:', button.data?.url);
        break;
      default:
        break;
    }
  };

  const toggleRecording = () => {
    setIsRecording((prev) => !prev);
    // Placeholder for future voice recording integration.
  };

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm`}>
        <div className="px-4 py-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg">
                  <Bot size={24} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
              </div>
              <div>
                <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'} flex items-center gap-2`}>
                  Edutu AI Coach
                  <Sparkles size={16} className="text-primary animate-pulse" />
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-1`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Online - Ready to help
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-xl ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}>
                <MoreHorizontal size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-600'} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-40 sm:pb-32">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up px-1`}>
            <div className={`flex gap-3 max-w-full sm:max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  message.type === 'user'
                    ? `${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`
                    : 'bg-gradient-to-br from-primary to-accent'
                }`}
              >
                {message.type === 'user' ? (
                  <User size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                ) : (
                  <Bot size={18} className="text-white" />
                )}
              </div>
              <div>
                <div
                  className={`rounded-2xl px-5 py-4 shadow-sm ${
                    message.type === 'user'
                      ? isDarkMode
                        ? 'bg-primary text-white'
                        : 'bg-primary/10 text-gray-800'
                      : isDarkMode
                        ? 'bg-gray-800 border border-gray-700 text-gray-100'
                        : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.15s]"></span>
                      <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.3s]"></span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="whitespace-pre-line leading-relaxed">{message.content}</p>

                      {message.buttons && message.buttons.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                          {message.buttons.map((button, index) => (
                            <button
                              key={`${button.text}-${index}`}
                              onClick={() => handleButtonClick(button)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                                isDarkMode
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-100'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {button.type === 'scholarship' && <ExternalLink size={14} />}
                              {button.type === 'community' && <Users size={14} />}
                              {button.type === 'expert' && <MessageSquare size={14} />}
                              {button.type === 'link' && <ExternalLink size={14} />}
                              {button.text}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}

        {messages.length === 1 && (
          <div className="space-y-4 animate-slide-up">
            <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              <Lightbulb size={16} />
              <span className="text-sm font-medium">Try asking about:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickPrompts.map((prompt, index) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={index}
                    onClick={() => handleQuickPrompt(prompt.text, prompt.topic)}
                    className={`p-4 text-left ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'
                    } border rounded-2xl transition-all hover:scale-105 shadow-sm group`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isDarkMode ? 'bg-gray-700 text-primary' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          isDarkMode ? 'text-white' : 'text-gray-800'
                        } group-hover:text-primary transition-colors`}
                      >
                        {prompt.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div
        className={`fixed left-0 right-0 bottom-24 sm:bottom-20 safe-area-bottom ${
          isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-t shadow-lg`}
      >
        <div className="px-4 py-4 sm:px-6">
          <div className="flex gap-2 sm:gap-3 max-w-4xl mx-auto">
            <button
              className={`p-3 rounded-2xl flex-shrink-0 ${
                isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } transition-colors`}
            >
              <Paperclip size={20} />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    handleSend(undefined, 'Custom question');
                  }
                }}
                placeholder="Ask me anything about opportunities, goals, or career advice..."
                className={`w-full px-5 py-4 rounded-2xl border ${
                  isDarkMode
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400'
                    : 'border-gray-200 bg-white text-gray-800 placeholder-gray-500'
                } focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm`}
              />
              {input && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                </div>
              )}
            </div>

            <button
              onClick={toggleRecording}
              className={`p-3 rounded-2xl flex-shrink-0 transition-all ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                  : isDarkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <Button
              onClick={() => handleSend(undefined, 'Custom question')}
              disabled={!input.trim() || isTyping}
              className="p-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </Button>
          </div>

          {isRecording && (
            <div className="flex items-center justify-center gap-2 mt-3 text-red-500 animate-pulse">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">Recording... Tap to stop</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
