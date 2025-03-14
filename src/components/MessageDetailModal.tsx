
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "@/components/ui/separator";

export interface Message {
  id: string;
  sender: {
    name: string;
    avatar?: string;
    walletAddress: string;
  };
  recipient: {
    name: string;
    walletAddress: string;
  };
  content: string;
  timestamp: Date;
  read: boolean;
}

interface MessageDetailModalProps {
  message: Message | null;
  isOpen: boolean;
  onClose: () => void;
}

const MessageDetailModal = ({ message, isOpen, onClose }: MessageDetailModalProps) => {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Message Details</DialogTitle>
          <DialogDescription>
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-start space-x-4 mb-4">
          <Avatar>
            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-medium">{message.sender.name}</h4>
            <p className="text-xs text-muted-foreground truncate">
              {message.sender.walletAddress}
            </p>
          </div>
        </div>
        <Separator className="my-2" />
        <div className="mt-4 bg-secondary/30 p-4 rounded-lg">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <div className="flex justify-between items-center mt-4 text-xs text-muted-foreground">
          <span>To: {message.recipient.name}</span>
          <span>{message.read ? "Read" : "Unread"}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageDetailModal;
