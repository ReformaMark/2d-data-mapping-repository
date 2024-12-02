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
    } | null;
}

export default function MessagePage() {
    const searchParams = useSearchParams()
    const sendMessageTo = searchParams.get('sendMessageTo')
    const messengers = useQuery(api.chats.getMessengers)
    const [selectedMessenger, setSelectedMessenger] = useState<MessengerTypes | null>(null)
    const [mes, setMes] = useState<Doc<'chats'>[] | null>(null)
    const messages = useMutation(api.chats.getMessages)
    const sendMessage = useMutation(api.chats.sendMessage)
    const [messageValue, setMessageValue] = useState('')

    const getMessages = useCallback(async () => {
        const targetId = selectedMessenger?.id || (sendMessageTo ? sendMessageTo as Id<'users'> : null);
        if (targetId) {
            const m = await messages({ senderId: targetId });
            setMes(m);
        } else {
            setMes([]);
        }
    }, [selectedMessenger, sendMessageTo, messages])

    useEffect(() => {
        if (messengers && messengers.length > 0) {
            const initialMessenger = sendMessageTo ? messengers.find(m => m?.id === sendMessageTo) : messengers[0];
            setSelectedMessenger(initialMessenger || null);
        }
    }, [messengers, sendMessageTo])

    useEffect(() => {
        getMessages()
    }, [getMessages, mes])

    const handleSend = async() => {
        if (messageValue === "") {
            toast.error("Invalid message! Please Try again.")
            return
        }
        if (selectedMessenger) {
            toast.promise(sendMessage({
                recieverId: selectedMessenger.id as Id<'users'>,
                message: messageValue
            }),
            {
                loading: 'Sending your message...',
                success: "Message sent.",
                error: "Unable to send your message."
            })
            setMessageValue("")
        } else {
            toast.warning("Please select user first.")
        }
    }

    if (!messengers) return <Loading />
    return (
        <div className=" mt-10 md:mt-0 flex flex-col md:flex-row">
           
        </div>
    )
}
