import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        content: v.string(),
    },
    handler: async (ctx, { content }) => {
        const message = await ctx.db.insert("messages", {
            content
        })

        return message;
    }
})

export const get = query({
    args: {},
    handler: async (ctx) => {
        const messages = await ctx.db
            .query("messages")
            .collect();

        return messages
    }
})