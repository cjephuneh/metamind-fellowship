
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, SendHorizonal } from "lucide-react";

interface AIAssistantProps {
  context?: string;
  onClose?: () => void;
}

const AIAssistant = ({ context = "scholarship application", onClose }: AIAssistantProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<{role: "user" | "assistant", content: string}[]>([
    {
      role: "assistant",
      content: `Hi there! I'm your AI assistant for the ${context}. How can I help you today?`
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  // Simulated AI response - in a real application, this would call an API
  const getAIResponse = async (userMessage: string) => {
    setIsThinking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Sample responses based on keywords in the user's message
    let response = "";
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes("eligibility") || lowerCaseMessage.includes("qualify")) {
      response = "Eligibility criteria vary by scholarship. Generally, you'll need to meet academic requirements, be enrolled in an accredited institution, and sometimes demonstrate financial need. I recommend checking the specific requirements for each scholarship you're interested in.";
    } 
    else if (lowerCaseMessage.includes("deadline") || lowerCaseMessage.includes("due date")) {
      response = "Each scholarship has its own deadline. Make sure to submit your application well before the deadline to avoid any last-minute technical issues. You can see deadlines listed on each scholarship card.";
    }
    else if (lowerCaseMessage.includes("essay") || lowerCaseMessage.includes("personal statement")) {
      response = "For your scholarship essay or personal statement, focus on your unique story and aspirations. Be authentic, specific, and connect your experiences to your future goals. Proofread carefully and stay within the word limit.";
    }
    else if (lowerCaseMessage.includes("wallet") || lowerCaseMessage.includes("metamask")) {
      response = "Your MetaMask wallet is used to verify your identity on our platform. Make sure to keep your recovery phrase secure and never share it with anyone. If you're having trouble connecting your wallet, try refreshing the page or updating the MetaMask extension.";
    }
    else if (lowerCaseMessage.includes("documents") || lowerCaseMessage.includes("transcripts")) {
      response = "Most scholarships require academic transcripts, proof of enrollment, and sometimes financial information. Make sure these documents are up-to-date and in PDF format. Some scholarships may also request letters of recommendation.";
    }
    else {
      response = "Thank you for your question. I'd be happy to help with that. Could you provide more specific details about what you're looking for regarding scholarships, applications, or the platform?";
    }
    
    setIsThinking(false);
    return response;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message to conversation
    const updatedConversation = [
      ...conversation,
      { role: "user", content: message }
    ];
    setConversation(updatedConversation);
    setMessage("");
    
    try {
      // Get AI response
      const aiResponse = await getAIResponse(message);
      setConversation([
        ...updatedConversation,
        { role: "assistant", content: aiResponse }
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to get a response. Please try again later."
      });
    }
  };

  return (
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
          {conversation.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === "user" 
                  ? "text-right" 
                  : "text-left"
              }`}
            >
              <div
                className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.content}
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
  );
};

export default AIAssistant;
