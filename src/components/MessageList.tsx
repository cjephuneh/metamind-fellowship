
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import MessageModal, { Message } from "./MessageModal";

// Sample messages for demonstration
const sampleMessages: Message[] = [
  {
    id: "1",
    sender: {
      name: "Alex Johnson",
      avatar: "https://ui-avatars.com/api/?name=Alex+Johnson",
      walletAddress: "0x1234...5678",
    },
    recipient: {
      name: "You",
      walletAddress: "0xabcd...efgh",
    },
    content: "Thank you for considering my application! I'm very excited about the opportunity to be part of this program.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: "2",
    sender: {
      name: "Maria Garcia",
      avatar: "https://ui-avatars.com/api/?name=Maria+Garcia",
      walletAddress: "0x8765...4321",
    },
    recipient: {
      name: "You",
      walletAddress: "0xabcd...efgh",
    },
    content: "I just submitted all the required documents for the blockchain development scholarship. Please let me know if you need any additional information.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
  },
];

interface MessageListProps {
  messages?: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages = sampleMessages }) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Messages</span>
            <Badge variant="outline">{messages.filter(m => !m.read).length} new</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2">
          <div className="space-y-1">
            {messages.map((message) => (
              <div key={message.id}>
                <div 
                  className={`flex items-start space-x-4 p-3 hover:bg-secondary/50 rounded-md cursor-pointer transition-colors ${!message.read ? 'bg-secondary/20' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium leading-none">
                        {message.sender.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(message.timestamp, { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {message.content}
                    </p>
                    {!message.read && (
                      <Badge className="mt-1" variant="secondary">New</Badge>
                    )}
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <MessageModal 
        message={selectedMessage} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default MessageList;
