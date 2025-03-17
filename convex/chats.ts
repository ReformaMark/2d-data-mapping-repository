import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { asyncMap } from "convex-helpers";

export const getMessengers = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) return null;

        const messages = await ctx.db.query("chats")
            .filter(q => q.eq(q.field("receiverId"), userId, ))
            .order('desc')
            .collect();

        const uniqueMessengers = Array.from(new Set(messages.map(m => m.senderId)));

        const latestMessages = await Promise.all(uniqueMessengers.map(async (id) => {
            const senderUser = await ctx.db.get(id)
            const latestMessage = await ctx.db.query('chats').filter(q=> q.eq(q.field('senderId'), id)).order('desc').first()
           //null if all chat are already read
            const unreadChat = await ctx.db.query('chats')
            .filter(q => q.eq(q.field("senderId"), id))
            .filter(q => q.eq(q.field("receiverId"), userId))
            .filter(q => q.eq(q.field("isRead"), false))
            .first()
            
            return { id, senderUser, latestMessage, unreadChat };
        }));
        
        return latestMessages;
    }
});

export const getMessages = query({
    args: {
        senderId: v.optional(v.id('users'))
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) return null;
        
        if(!args.senderId) return null;

        const sentMessages = await ctx.db.query("chats")
            .withIndex("by_sender_receiver", q => q.eq("senderId", userId).eq("receiverId", args.senderId!))
            .order('desc')
            .collect();

        const receivedMessages = await ctx.db.query("chats")
            .withIndex("by_sender_receiver", q => q.eq("senderId",args.senderId!).eq("receiverId", userId))
            .order('desc')
            .collect();

        return [...sentMessages, ...receivedMessages].sort((a, b) => b._creationTime - a._creationTime);
    }
});


export const sendMessage = mutation({
    args:{
        recieverId: v.id('users'),
        message: v.string(),
    },
    handler: async(ctx, args) => {
        const userId = await getAuthUserId(ctx)
        if(userId === null) return

        const message = await ctx.db.insert('chats',{
            receiverId: args.recieverId,
            senderId: userId,
            message: args.message,
            isRead: false
        })



        return message
    },
})

export const readMessage = mutation({
    args:{
        senderId: v.id('users')
    }, 
    handler: async(ctx, args) =>{
        const userId = await getAuthUserId(ctx)
        if(userId === null) return

        const notReadChats = await ctx.db.query('chats')
            .filter(q => q.eq(q.field("senderId"), args.senderId))
            .filter(q => q.eq(q.field("receiverId"), userId))
            .filter(q => q.eq(q.field("isRead"), false))
            .collect()
    await asyncMap(notReadChats, async(chat) =>{
        await ctx.db.patch(chat._id, {
            isRead: true
        })

    })
    }
})

export const getChats = query({
    args:{
        senderId: v.id('users')
    },
    handler: async (ctx) =>{
        const userId = await getAuthUserId(ctx)
        if(userId === null) return

        const chats = await ctx.db.query('chats').collect()

        return chats
    }
})