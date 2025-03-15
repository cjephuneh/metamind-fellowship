
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEFAULT_TOGETHER_API_KEY } from "@/lib/togetherApi";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSave: (apiKey: string, provider: string) => void;
  provider?: string;
}

const SettingsModal = ({ isOpen, onClose, apiKey, onSave, provider = "together" }: SettingsModalProps) => {
  const [inputApiKey, setInputApiKey] = useState(apiKey || DEFAULT_TOGETHER_API_KEY);
  const [selectedProvider, setSelectedProvider] = useState(provider);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(inputApiKey, selectedProvider);
    toast({
      title: "Settings Saved",
      description: "Your API key has been saved successfully.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>
            Configure your AI assistant settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Tabs value={selectedProvider} onValueChange={setSelectedProvider}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="openai">OpenAI</TabsTrigger>
              <TabsTrigger value="together">Together AI</TabsTrigger>
            </TabsList>
            <TabsContent value="openai" className="mt-4">
              <div className="grid gap-2">
                <Label htmlFor="openaiApiKey">OpenAI API Key</Label>
                <Input
                  id="openaiApiKey"
                  type="password"
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  placeholder="sk-..."
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="together" className="mt-4">
              <div className="grid gap-2">
                <Label htmlFor="togetherApiKey">Together AI API Key</Label>
                <Input
                  id="togetherApiKey"
                  type="password"
                  value={inputApiKey}
                  onChange={(e) => setInputApiKey(e.target.value)}
                  placeholder="tgp_v1_..."
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
