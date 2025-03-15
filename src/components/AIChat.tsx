import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { askQwenAI, DEFAULT_TOGETHER_API_KEY } from "@/lib/togetherApi";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIChatProps {
  apiKey?: string;
}

const SYSTEM_PROMPT = `You are a helpful assistant for MetaMind Fellowship, a blockchain-based scholarship platform. 
You help users navigate the platform, understand how to apply for scholarships, and how to fund scholarships as sponsors.
Your responses should be concise, helpful, and encouraging. If you don't know the answer to something,
be honest about it.`;

const AIChat: React.FC<AIChatProps> = ({ apiKey = DEFAULT_TOGETHER_API_KEY }) => {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message to conversation
    const userMessage = input.trim();
    setConversation(prev => [...prev, { role: "user", content: userMessage }]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Get response from Together API using Qwen model
      const response = await askQwenAI(apiKey, SYSTEM_PROMPT, userMessage, {
        model: "Qwen/Qwen1.5-7B-Chat",
        temperature: 0.7,
      });
      
      // Add assistant response to conversation
      setConversation(prev => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error getting response:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">MetaMind AI Assistant</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[400px] overflow-y-auto space-y-4 mb-4">
        {conversation.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Ask me anything about scholarships or how to use the platform!
          </p>
        ) : (
          conversation.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
              <Skeleton className="h-4 w-[200px] mb-2" />
              <Skeleton className="h-4 w-[170px] mb-2" />
              <Skeleton className="h-4 w-[190px]" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="resize-none"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIChat;
