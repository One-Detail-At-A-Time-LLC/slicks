import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message {
    _id: string;
    content: string;
    sender: 'tenant' | 'client';
    timestamp: number;
}

export function ChatComponent({ tenantId, clientId }: Readonly<{ tenantId: string; clientId: string }>) {
    const [message, setMessage] = useState('');
    const messages = useQuery(api.messages.list, { tenantId, clientId });
    const sendMessage = useMutation(api.messages.send);

    const handleSendMessage = async () => {
        const trimmedMessage = message.trim();
        if(trimmedMessage) {
            const messageData = {
                tenantId,
                clientId,
                content: trimmedMessage,
                sender: 'tenant',
            };
            
            await sendMessage(messageData);
            setMessage('');
        }
    };

    useEffect(() => {
        // Scroll to bottom of message list when new messages arrive
        const messageList = document.getElementById('message-list');
        if (messageList) {
            messageList.scrollTop = messageList.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            <div id="message-list" className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages?.map((msg: Message) => (
                    <div
                        key={msg._id}
                        className={`p-2 rounded-lg ${msg.sender === 'tenant' ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
                            }`}
                    >
                        <p>{msg.content}</p>
                        <small className="text-gray-500">
                            {new Date(msg.timestamp).toLocaleString()}
                        </small>
                    </div>
                ))}
            </div>
            <div className="p-4 border-t">
                <div className="flex space-x-2">
                    <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        onPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                </div>
            </div>
        </div>
    );
}