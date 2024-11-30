import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        return user;
    }
})

export const getAllUsers = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.query('users').collect();
        return user;
    }
})

export const role = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (!user) return null;

        return user.role;
    }
});

export const editUserProfile = mutation({
    args: {
        fname: v.string(),
        lname: v.string(),
        image: v.optional(v.string()),
        farmerProfile: v.optional(
            v.object({
                contactNumber: v.string(),
                address: v.string(),
                isActive: v.boolean(),
            })),
        stakeholderProfile: v.optional(
            v.object({
            contactNumber: v.string(),
            isActive: v.boolean()
        })),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;

        const user = await ctx.db.get(userId);
        if (!user) return null;

        await ctx.db.patch(userId, {
            fname: args.fname,
            lname: args.lname,
            stakeholderProfile: args.stakeholderProfile ? {
                contactNumber: args.stakeholderProfile.contactNumber,
                isActive: args.stakeholderProfile.isActive
            } : user.stakeholderProfile,
            farmerProfile: args.farmerProfile && user.farmerProfile ? {
                contactNumber: args.farmerProfile.contactNumber,
                address: args.farmerProfile.address,
                isActive: args.farmerProfile.isActive,
                barangayId: user.farmerProfile.barangayId 
            } : user.farmerProfile,
        });

        await ctx.db.insert('activities', {
            userId: userId,
            title: 'Profile Updated',
            content: 'User profile has been updated.',
            isRead: false,
            additionalInformation: userId,
            isArchived: false
        });
        return await ctx.db.get(userId);
    }
})