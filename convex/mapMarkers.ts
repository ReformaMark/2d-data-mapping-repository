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
        if (!userId) throw new Error("User not authenticated");

        const user = await ctx.db.get(userId);
        if (!user) throw new Error("User not found");

        if (!user.farmerProfile) throw new Error("User does not have a farmer profile");

        const barangay = await ctx.db.get(user.farmerProfile.barangayId);
        if (!barangay) throw new Error("Barangay not found");

        const markerId = await ctx.db.insert("mapMarkers", {
            coordinates: args.coordinates,
            userId: userId,
            title: args.title,
            markerType: args.markerType,
            barangay: barangay.name,
        });
        const marker = await ctx.db.get(markerId);
        if (!marker) throw new Error("Marker not found");
        return  marker._id;
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


export const getAllMapMarkers = query({
    args:{
    },
    handler: async (ctx, args) => {
        return await ctx.db.query("mapMarkers")
            .collect();
    }
})


export const updateMapMarker = mutation({
    args: {
        markerId: v.id("mapMarkers"),
        title: v.string(),
        markerType: v.string()
    },
    handler: async (ctx, args) => {
        const marker = await ctx.db.get(args.markerId);
        if (!marker) throw new Error("Marker not found");

        await ctx.db.patch(args.markerId, {
            title: args.title,
            markerType: args.markerType
        })
    }
})
