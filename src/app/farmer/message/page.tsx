'use client'
import { useMutation, useQuery } from 'convex/react'
import React, { useEffect, useState, useCallback } from 'react'
import { api } from '../../../../convex/_generated/api'
import { Separator } from '@/components/ui/separator'
import { Doc, Id } from '../../../../convex/_generated/dataModel'
import Loading from '@/components/loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSearchParams } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface MessengerTypes {
    id: Id<"users">;
    senderUser: {
        _id: Id<"users">;
        _creationTime: number;
        image?: string | undefined;
        isActive?: boolean | undefined;
        farmerProfile?: {
            isActive: boolean;
            barangayId: Id<"barangays">;
            contactNumber: string;
            address: string;
        } | undefined;
        stakeholderProfile?: {
            isActive: boolean;
            contactNumber: string;
        } | undefined;
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
    };
}

export default function MessagePage() {
    const searchParams = useSearchParams()
    const sendMessageTo = searchParams.get('sendMessageTo')
    const messengers = useQuery(api.chats.getMessengers)
    const [selectedMessenger, setSelectedMessenger] = useState<MessengerTypes | null>(null)
    const [mes, setMes] = useState<Doc<'chats'>[] | null>(null)
    const messages = useMutation(api.chats.getMessages)
    // const [searchValue, setSearchValue ] = useState('')
    const sendMessage = useMutation(api.chats.sendMessage)
    const [messageValue, setMessageValue] = useState('')

    const getMessages = useCallback(async () => {
        if (selectedMessenger === null) {
            if (sendMessageTo) {
                const m = await messages({ senderId: sendMessageTo as Id<'users'> })
                setMes(m)
            } else {
                setMes([])
            }
        } else {
            const m = await messages({ senderId: selectedMessenger.id as Id<'users'> })
            setMes(m)
        }
    }, [selectedMessenger, sendMessageTo, messages])

    // const filterUsers = users?.filter(u => u.lname.includes(searchValue) || u.fname.includes(searchValue) || `${u.fname} ${u.lname}`.includes(searchValue))
    
    useEffect(() => {
        if (messengers && messengers.length > 0) {
            setSelectedMessenger(messengers[0]);
        }
    }, [messengers])

    useEffect(() => {
        getMessages()
    }, [getMessages, mes])

    const handleSend = async() =>{

        if(messageValue === "") {
            toast.error("Invalid message! Please Try again.")
            return
        }
        if (selectedMessenger){
            toast.promise(sendMessage({
                recieverId: selectedMessenger.id as Id<'users'>,
                message: messageValue
            }),
            {
                loading: 'Sending your message...',
                success: "Message sent.",
                error: "Unable to send your message."
            }
            )

            setMessageValue("")
        } else {
            toast.warning("Please select user first.")
        }
       
    }

    if (!messengers) return <Loading />
    return (
        <div className="flex">
            <aside className="w-1/4 p-10 bg-gray-100">
                <h2 className="text-xl font-semibold">Messengers</h2>
                <ul className=''>
                    {messengers.length > 0 ? messengers.map((messenger, index) => (
                        <li key={index} className="cursor-pointer p-2 space-y-2 bg-white hover:bg-gray-200 rounded-md" onClick={() => setSelectedMessenger(messenger)}>
                            <div className="flex gap-x-5 items-center">
                                <Avatar>
                                    <AvatarImage src={messenger?.senderUser?.image} alt={messenger?.senderUser?.lname} />
                                    <AvatarFallback>{messenger?.senderUser?.fname?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <h1 className=' font-semibold '>{messenger?.senderUser?.fname} {messenger?.senderUser?.lname}</h1>
                            </div>
                            <pre className='truncate text-xs text-gray-500'> Recent Message: {messenger?.latestMessage.message}</pre>
                        </li>
                    )) : (
                        <h1>No messengers</h1>
                    )}
                </ul>
            </aside>
            <Separator orientation="vertical" className="mx-4" />
            <main className="w-3/4 p-4 h-screen bg-white">
                {selectedMessenger ? (
                    <div className='p-10 space-y-10'>
                        <h2 className="text-xl font-semibold">Conversation with {selectedMessenger.senderUser?.fname} {selectedMessenger.senderUser?.lname}</h2>
                        <div className="flex flex-col gap-y-3 justify-end p-5 h-[600px] gap-x-10  bg-gray-100">
                            {mes && mes.length > 0 ? (
                                <div className='flex flex-col-reverse overflow-y-auto gap-y-3'>
                                    {mes.map((message, index) => (
                                        <div key={index} className={`p-2 w-1/2 ${message.senderId === selectedMessenger.id ? 'a  bg-green-500 rounded-md text-white' : 'text-right bg-gray-300 rounded-md self-end'}`}>
                                            <pre>{message.message}</pre>
                                            <p className='text-xs text-white text-right'>{formatDate({convexDate: message._creationTime})}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <h1>No messages</h1>
                            )}
                        </div>
                        <div className="grid grid-cols-12 gap-x-5 items-center">
                            <Textarea
                                value={messageValue}
                                onChange={(e) => {
                                    setMessageValue(e.target.value)
                                }}
                                className="col-span-10 border-green-200 bg-green-50 focus:ring-green-500"
                            />
                            <Button onClick={handleSend} className='col-span-2'>Send</Button>
                        </div>
                    </div>
                ) : (
                    <p>Select a messenger to view the conversation</p>
                )}
            </main>
        </div>
    )
}