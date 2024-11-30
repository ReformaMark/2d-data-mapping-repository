import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addCrop = mutation({
    args: {
        plotId: v.id("agriculturalPlots"),
        name: v.string(),
        plantingDate: v.string(),
        harvestDate: v.optional(v.string()),
        possibleYields: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const crop = await ctx.db.insert("crops", {
            plotId: args.plotId,
            name: args.name,
            plantingDate: args.plantingDate,
            harvestDate: args.harvestDate,
            possibleYields: args.possibleYields,
        });
        const cropId = await ctx.db.get(crop);
        if (!cropId) throw new Error("Crop not found");
        
        return cropId._id;
    }
})  

export const getCrops = query({
    handler: async (ctx) => {
        const crops = await ctx.db.query("crops").collect();
        return crops;
    }
})

export const updateCrop = mutation({
    args: {
        cropId: v.id("crops"),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const crop = await ctx.db.patch(args.cropId, {
            name: args.name,
        });
        return crop;
    }
})
