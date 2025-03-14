
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  sender: string;
  senderType: "user" | "recipient" | "system";
  content: string;
  timestamp: string;
  read: boolean;
}

interface MessageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: {
    id: string;
    recipient: string;
    messages: Message[];
  } | null;
  onSendMessage: (content: string) => void;
}

const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  isOpen,
  onClose,
  conversation,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = React.useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  if (!conversation) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-purple-100 text-purple-600">
                {conversation.recipient.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{conversation.recipient}</span>
          </DialogTitle>
          <DialogDescription>
            Conversation history
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 h-[50vh] p-4 mb-4">
          <div className="space-y-4">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-2",
                  message.senderType === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.senderType !== "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className={
                      message.senderType === "recipient" 
                        ? "bg-purple-100 text-purple-600" 
                        : "bg-gray-100 text-gray-600"
                    }>
                      {message.senderType === "system" ? "S" : message.sender.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3",
                    message.senderType === "user"
                      ? "bg-purple-100 text-purple-900"
                      : message.senderType === "recipient"
                      ? "bg-gray-100 text-gray-900"
                      : "bg-blue-50 text-blue-900 italic"
                  )}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{message.timestamp}</span>
                  </div>
                </div>
                
                {message.senderType === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex gap-2 pt-4 border-t">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage}
            className="bg-purple-500 hover:bg-purple-600"
          >
            Send
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailModal;
