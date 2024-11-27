import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const addCrop = mutation({
    args: {
        plotId: v.id("agriculturalPlots"),
        name: v.string(),
        plantingDate: v.string(),
        harvestDate: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const crop = await ctx.db.insert("crops", {
            plotId: args.plotId,
            name: args.name,
            plantingDate: args.plantingDate,
            harvestDate: args.harvestDate,
        });
        const cropId = await ctx.db.get(crop);
        if (!cropId) throw new Error("Crop not found");
        
        return cropId._id;
    }
})  