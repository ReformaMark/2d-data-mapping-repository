"use client"

import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const messages = useQuery(api.messages.get);
  const sendMessage = useMutation(api.messages.create);
  const [newMessage, setNewMessage] = useState("");

  // if (messages === undefined) return <Skeleton className="w-full h-[50px] mt-4" />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex flex-col gap-4 mb-8">
        {messages?.map((message) => (
          <div
            key={message._id}
            className="p-4 bg-white rounded-lg shadow"
          >
            {message.content}
          </div>
        ))}
      </div>

      <form 
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newMessage.trim()) return;
          
          try {
            await sendMessage({ content: newMessage });
            setNewMessage("");
            toast.success("Message sent!");
          } catch (error) {
            toast.error("Failed to send message");
          }
        }}
      >
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
