import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createMapMarker = mutation({
    args: {
        coordinates: v.array(v.number()),
        title: v.string(),
        markerType: v.string()  
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return;

        const user = await ctx.db.get(userId);
        if (!user) return;

        if (!user.farmerProfile) return;

        const barangay = await ctx.db.get(user.farmerProfile.barangayId);

        if (!barangay) return;

        await ctx.db.insert("mapMarkers", {
            coordinates: args.coordinates,
            userId: userId,
            title: args.title,
            markerType: args.markerType,
            barangay: barangay.name
        })
    }
})


export const getMapMarkers = query({
  
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);

        if (!userId) return [];

        const user = await ctx.db.get(userId);
        if (!user) return [];

        if (!user.farmerProfile) return [];

        const barangay = await ctx.db.get(user.farmerProfile.barangayId);
        if (!barangay) return [];

        return await ctx.db.query("mapMarkers")
            .filter(q => q.eq(q.field("barangay"), barangay.name))
            .collect();
    }
})
