'use client'
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MessageSquareIcon } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentUser } from '@/features/users/api/use-current-user'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { toast } from 'sonner'
import { Id } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import Loading from '@/components/loading'

function Message({farmId}:{farmId: Id<"agriculturalPlots"> | undefined}) {
    const farm = useQuery(api.agriculturalPlots.getFarmById, {
        farmId: farmId as Id<"agriculturalPlots">
    })
    const [messageValue, setMessageValue] = useState<string>('')
    const [open, setOpen] = useState(false)
    const sendMessage = useMutation(api.chats.sendMessage)
    const user = useCurrentUser()

    const handleSend = async() => {
        if (messageValue === "") {
            toast.error("Invalid message! Please Try again.")
            return
        }
        if (farm?.userId) {
            toast.promise(sendMessage({
                recieverId: farm.userId as Id<'users'>,
                message: messageValue
            }),
            {
                loading: 'Sending your message...',
                success: "Message sent.",
                error: "Unable to send your message."
            })
            setMessageValue("")
            setOpen(false)
        } else {
            toast.warning("Please select user first.")
        }
    }

    if (!farm) return <Loading/>

  return (
    <div>
        {user?.data?._id !== farm.userId && (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger onClick={()=>setOpen(!open)} className='flex flex-col items-center justify-center hover:text-green-500 transition-colors duration-300 ease-in'>
                <MessageSquareIcon />
            </DialogTrigger>
            <DialogContent className='z-[1000]'>
                <DialogHeader>
                    <DialogTitle>Send a Message</DialogTitle>
                    <DialogDescription>
                        Write your message below:
                    </DialogDescription>
                </DialogHeader>
                <Textarea 
                    value={messageValue} 
                    onChange={(e) => {
                        setMessageValue(e.target.value)
                    }}
                    placeholder="Type your message here..." 
                    className="w-full" />
                <DialogFooter>
                    <Button onClick={handleSend}>Send</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )}
    </div>
  )
}

export default Message