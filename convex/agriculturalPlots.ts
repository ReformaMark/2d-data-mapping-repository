import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const addAgriculturalPlot = mutation({
    args: {
        coordinates: v.array(v.array(v.number())),
        area: v.number(),
        status: v.string(),
        cropHistory: v.array(v.id("crops")),
        landUseType: v.string(),
        markerId: v.id("mapMarkers"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new Error("User not authenticated");
        }
        const user = await ctx.db.get(userId);
        if (!user) throw new Error("User not found");
        if (!user.farmerProfile) throw new Error("User does not have a farmer profile");
        
        const agriculturalPlot = await ctx.db.insert("agriculturalPlots", {
            userId: userId,
            barangayId: user.farmerProfile.barangayId,
            coordinates: args.coordinates,
            area: args.area,
            status: args.status,
            cropHistory: args.cropHistory,
            landUseType: args.landUseType,
            markerId: args.markerId,
        });
        const plot = await ctx.db.get(agriculturalPlot);
        if (!plot) throw new Error("Plot not found");
        return plot._id;
    }
})

export const addPlots = mutation({
    args: {
        agriculturalPlotId: v.id("agriculturalPlots"),
        cropId: v.id("crops"),
    },
    handler: async (ctx, args) => {
        const plot = await ctx.db.get(args.agriculturalPlotId);
        if (!plot) throw new Error("Agricultural plot not found");

        const updatedPlot = await ctx.db.patch(args.agriculturalPlotId, {
            cropHistory: [...plot.cropHistory, args.cropId],
        });

        return updatedPlot;
    }
})
