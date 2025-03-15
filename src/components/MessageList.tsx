
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Message } from "./MessageModal";
import { Eye } from "lucide-react";
import { markMessageAsRead } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface MessageListProps {
  messages: Message[];
  onViewMessage: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onViewMessage }) => {
  const { toast } = useToast();
  
  const handleViewMessage = async (message: Message) => {
    // If message is unread, mark it as read
    if (!message.read) {
      try {
        // Update in backend
        await markMessageAsRead(message.id);
        
        // Mark as read in the UI (the component should get refreshed data from parent)
        message.read = true;
      } catch (error) {
        console.error("Error marking message as read:", error);
        toast({
          title: "Error",
          description: "Could not mark message as read.",
          variant: "destructive"
        });
      }
    }
    
    // Call the parent handler to show the message details
    onViewMessage(message);
  };
  
  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No messages to display</p>
        </div>
      ) : (
        messages.map(message => (
          <Card key={message.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle>{message.sender.name}</CardTitle>
              <CardDescription>
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-600">
                {message.content.length > 120 
                  ? `${message.content.substring(0, 120)}...` 
                  : message.content}
              </p>
            </CardContent>
            <CardFooter>
              <div className="flex justify-between items-center w-full">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  message.read 
                    ? "bg-gray-100 text-gray-800" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {message.read ? "Read" : "New"}
                </span>
                <Button 
                  size="sm" 
                  className="bg-purple-500 hover:bg-purple-600"
                  onClick={() => handleViewMessage(message)}
                >
                  <Eye className="mr-1 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default MessageList;
