
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Message } from "./MessageModal";

interface MessageListProps {
  messages: Message[];
  onViewMessage: (message: Message) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, onViewMessage }) => {
  return (
    <div className="space-y-4">
      {messages.map(message => (
        <Card key={message.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle>{message.sender.name}</CardTitle>
            <CardDescription>
              {formatDistanceToNow(message.timestamp, { addSuffix: true })}
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
                onClick={() => onViewMessage(message)}
              >
                View Details
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MessageList;
