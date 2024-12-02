import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
    handler: async (ctx) => {
        const barangays = await ctx.db.query("barangays").collect();

        return barangays.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        })
    }
})

export const get = query({
    handler: async (ctx) => {
        const barangays = await ctx.db.query("barangays").collect();
        return barangays;
    }
})

export const getBarangay = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        const user = await ctx.db.get(userId);
        if (!user) return null;
        const barangays = await ctx.db.query("barangays").collect();
        const barangay = barangays.find(b => b._id === user.farmerProfile?.barangayId);
        return barangay;
    }
})

export const getByName = query({
    args: {
        name: v.union(
            v.literal("Turu"),
            v.literal("Balitucan"),
            v.literal("Mapinya")
        ),
    },
    handler: async (ctx, args) => {
        const barangay = await ctx.db
            .query("barangays")
            .filter((q) => q.eq(q.field("name"), args.name))
            .first();

        if (!barangay) throw new Error(`Barangay ${args.name} not found`);
        return barangay;
    },
});