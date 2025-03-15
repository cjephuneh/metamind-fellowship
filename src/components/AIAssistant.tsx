
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, SendHorizonal, Info } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { askQwenAI, DEFAULT_TOGETHER_API_KEY } from "@/lib/togetherApi";
import { askOpenAI } from "@/lib/openai";

interface AIAssistantProps {
  context?: string;
  onClose?: () => void;
  apiKey?: string;
  provider?: string;
}

// Define a type for the conversation messages
type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
};

const AIAssistant = ({ 
  context = "scholarship application", 
  onClose, 
  apiKey = DEFAULT_TOGETHER_API_KEY, 
  provider = "openai" 
}: AIAssistantProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<ConversationMessage[]>([
    {
      role: "assistant",
      content: `Hi there! I'm your AI assistant for the ${context}. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ConversationMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Get AI response based on selected provider
  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Prepare system prompt with context about the app
      const systemPrompt = 
        "You are an AI assistant for EduChain, a blockchain-based scholarship platform. " +
        `You are currently helping with ${context}. ` +
        "Help users with scholarship applications, understanding smart contracts, and " +
        "navigating the platform. Keep responses concise, accurate, and supportive. " +
        "If asked about technical blockchain concepts, explain them in simple terms. " +
        "Be encouraging to students applying for scholarships.";

      // Get response from selected AI provider
      if (provider === "openai") {
        return await askOpenAI(
          apiKey,
          systemPrompt,
          userMessage,
          { model: "gpt-3.5-turbo" }
        );
      } else {
        return await askQwenAI(
          apiKey,
          systemPrompt,
          userMessage,
          { model: "Qwen/Qwen1.5-7B-Chat" }
        );
      }
    } catch (error) {
      console.error(`Error with ${provider === "openai" ? "OpenAI" : "Together API"}:`, error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    const userMessage = {
      role: "user" as const,
      content: message,
      timestamp: new Date()
    };
    
    const updatedConversation: ConversationMessage[] = [
      ...conversation,
      userMessage
    ];
    
    setConversation(updatedConversation);
    setMessage("");
    setIsThinking(true);
    
    try {
      // Get AI response
      const aiResponse = await getAIResponse(message);
      
      setConversation([
        ...updatedConversation,
        { 
          role: "assistant", 
          content: aiResponse,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to get a response. Please try again later."
      });
    } finally {
      setIsThinking(false);
    }
  };

  const handleMessageClick = (message: ConversationMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <CardTitle>AI Scholarship Assistant</CardTitle>
            </div>
            {onClose && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="h-8 w-8 p-0 text-white hover:bg-white/20"
              >
                ×
              </Button>
            )}
          </div>
          <CardDescription className="text-purple-100 mt-1">
            Ask me anything about scholarships and applications
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-80 overflow-y-auto p-4">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  msg.role === "user" 
                    ? "text-right" 
                    : "text-left"
                }`}
              >
                <div className="flex flex-col">
                  <div
                    className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                      msg.role === "user"
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                    onClick={() => handleMessageClick(msg)}
                  >
                    {msg.content}
                    <div className="flex justify-end mt-1">
                      <Info className="h-3 w-3 text-current opacity-50" />
                    </div>
                  </div>
                  {msg.timestamp && (
                    <span className="text-xs text-gray-500 mt-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="text-left mb-4">
                <div className="inline-block max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-3">
          <div className="flex w-full items-center gap-2">
            <Textarea
              placeholder="Ask a question..."
              className="min-h-10 flex-1 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              size="sm"
              className="h-10 bg-purple-500 hover:bg-purple-600"
              onClick={handleSendMessage}
              disabled={isThinking || !message.trim()}
            >
              <SendHorizonal className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Message Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedMessage?.role === "user" ? "Your Message" : "AI Response"}
            </DialogTitle>
            <DialogDescription>
              {selectedMessage?.timestamp ? 
                `Sent at ${selectedMessage.timestamp.toLocaleString()}` : 
                "Message details"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              {selectedMessage?.content}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistant;
