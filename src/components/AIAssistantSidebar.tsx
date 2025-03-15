import { useState } from "react";
import { askQwenAI, DEFAULT_TOGETHER_API_KEY } from "@/lib/togetherApi";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bot, SendHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantSidebarProps {
  onClose: () => void;
}

const AIAssistantSidebar = ({ onClose }: AIAssistantSidebarProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your EduChain AI assistant. How can I help you with your scholarship applications today?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    // Add user message to chat
    const userMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Prepare system prompt with context about the app
      const systemPrompt = 
        "You are an AI assistant for EduChain, a blockchain-based scholarship platform. " +
        "Help users with scholarship applications, understanding smart contracts, and " +
        "navigating the platform. Keep responses concise, accurate, and supportive. " +
        "If asked about technical blockchain concepts, explain them in simple terms. " +
        "Be encouraging to students applying for scholarships.";

      // Get response from Together API with Qwen model
      const response = await askQwenAI(
        DEFAULT_TOGETHER_API_KEY,
        systemPrompt,
        input,
        { model: "Qwen/Qwen1.5-7B-Chat" }
      );

      // Add assistant response to chat
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error with Together API:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden border-l border-t-0 border-b-0 border-r-0 rounded-none">
      <CardHeader className="p-4 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-lg">
            <Bot className="h-5 w-5 mr-2 text-purple-500" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg max-w-[85%]",
                message.role === "user"
                  ? "bg-primary text-primary-foreground ml-auto"
                  : "bg-muted mr-auto"
              )}
            >
              {message.content}
            </div>
          ))}
          {loading && (
            <div className="p-3 rounded-lg bg-muted flex items-center gap-2 max-w-[85%]">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Thinking...</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t">
        <div className="flex w-full gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about scholarships..."
            className="flex-grow resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || loading}
            size="icon"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AIAssistantSidebar;
