'use client'
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import { Separator } from '@/components/ui/separator'
import { Id } from '../../../../convex/_generated/dataModel'
import Loading from '@/components/loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDate } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface MessengerTypes {
    id: Id<"users">;
    senderUser: {
        _id: Id<"users">;
        _creationTime: number;
        image?: string;
        isActive?: boolean;
        farmerProfile?: {
            isActive: boolean;
            barangayId: Id<"barangays">;
            contactNumber: string;
            address: string;
        };
        stakeholderProfile?: {
            isActive: boolean;
            contactNumber: string;
        };
        fname: string;
        lname: string;
        email: string;
        role: "admin" | "stakeholder" | "farmer";
    } | null;
    latestMessage: {
        _id: Id<"chats">;
        _creationTime: number;
        isRead: boolean;
        senderId: Id<"users">;
        receiverId: Id<"users">;
        message: string;
    } | null;
}


export default function Message() {
    const messengers = useQuery(api.chats.getMessengers)
    const [selectedMessenger, setSelectedMessenger] = useState<MessengerTypes | null>(null)
   
    const chats = useQuery(api.chats.getMessages, {senderId: selectedMessenger?.id as Id<'users'>})
    const sendMessage = useMutation(api.chats.sendMessage)
    const [messageValue, setMessageValue] = useState('')


    useEffect(() => {
        if (messengers?.length) {
            const initialMessenger = messengers[0];
            setSelectedMessenger(initialMessenger);
        }
    }, [messengers])

    const handleSend = async () => {
        if (!messageValue) {
            toast.error("Invalid message! Please try again.")
            return
        }
        if (selectedMessenger) {
            toast.promise(sendMessage({
                recieverId: selectedMessenger.id as Id<'users'>,
                message: messageValue
            }), {
                loading: 'Sending your message...',
                success: "Message sent.",
                error: "Unable to send your message."
            })
            setMessageValue("")
        } else {
            toast.warning("Please select a user first.")
        }
    }

    if (!messengers) return <Loading />
    return (
        <div className="z-[10] mt-10 md:mt-0 flex flex-col md:flex-row">
            <div className="w-full md:w-1/4 p-4 md:p-10 bg-gray-100">
                <h2 className="text-xl font-semibold">Messengers</h2>
                <ul>
                    {messengers.length > 0 ? messengers.map((messenger, index) => (
                        <li key={index} className="cursor-pointer p-2 space-y-2 bg-white hover:bg-gray-200 rounded-md" onClick={() => setSelectedMessenger(messenger)}>
                            <div className="flex gap-x-3 items-center">
                                <Avatar>
                                    <AvatarImage src={messenger?.senderUser?.image} alt={messenger?.senderUser?.lname} />
                                    <AvatarFallback>{messenger?.senderUser?.fname?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className='font-semibold'>{messenger?.senderUser?.fname} {messenger?.senderUser?.lname}</h1>
                            </div>
                            <pre className='truncate text-xs text-gray-500'>Recent Message: {messenger?.latestMessage?.message}</pre>
                        </li>
                    )) : (
                        <h1>No messengers</h1>
                    )}
                </ul>
            </div>
            <Separator orientation="vertical" className="mx-4 hidden md:block" />
            <main className="w-full md:w-3/4 p-4 h-screen bg-white">
                {selectedMessenger ? (
                    <div className='p-4 md:p-10 space-y-10'>
                        <h2 className="text-xl font-semibold">Conversation with {selectedMessenger.senderUser?.fname} {selectedMessenger.senderUser?.lname}</h2>
                        <div className="flex flex-col gap-y-3 justify-end p-5 h-[600px] bg-gray-100 ">
                            {chats && chats?.length > 0 ? (
                                <div className='flex flex-col-reverse gap-y-3 overflow-y-scroll'>
                                    {chats?.map((message, index) => (
                                        <div key={index} className={`p-2 w-full md:w-1/2 ${message.senderId === selectedMessenger.id ? 'bg-green-500 rounded-md text-white' : 'text-left bg-gray-300 rounded-md self-end'}`}>
                                            <pre className="whitespace-pre-wrap break-words">{message.message}</pre>
                                            <p className='text-xs text-white text-right'>{formatDate({ convexDate: message._creationTime })}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <h1>No messages</h1>
                            )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-5 items-center">
                            <Textarea
                                value={messageValue}
                                onChange={(e) => setMessageValue(e.target.value)}
                                className="col-span-12 md:col-span-10 border-green-200 bg-green-50 focus:ring-green-500"
                            />
                            <Button onClick={handleSend} className='col-span-12 md:col-span-2'>Send</Button>
                        </div>
                    </div>
                ) : (
                    <p>Select a messenger to view the conversation</p>
                )}
            </main>
        </div>
    )
}
