import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addAgriculturalPlot = mutation({
    args: {
        coordinates: v.array(v.array(v.number())),
        area: v.number(),
        status: v.string(),
        cropHistory: v.array(v.id("crops")),
        landUseType: v.array(v.string()),
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

        await ctx.db.patch(args.agriculturalPlotId, {
            cropHistory: [...plot.cropHistory, args.cropId],
        });

        const agriculturalPlot = await ctx.db.get(args.agriculturalPlotId);

        if (!agriculturalPlot) throw new Error("Agricultural plot not found");

        const markerId = agriculturalPlot.markerId;

        const totalYields = await Promise.all(
            agriculturalPlot.cropHistory.map(async (cropId) => {
                const crop = await ctx.db.get(cropId);
                return crop ? crop.yields || 0 : 0;
            })
        ).then(yields => yields.reduce((acc, yld) => acc + yld, 0));

        await ctx.db.patch(markerId, {
            yields: totalYields,
        });

        return agriculturalPlot;
    }
})

export const getAgriculturalPlot = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("User not authenticated");
       
        const agriculturalPlot = await ctx.db.query("agriculturalPlots").collect();
        if (!agriculturalPlot) throw new Error("Agricultural plot not found");
        return agriculturalPlot;
    }
})

export const getAllFarms = query({
    handler: async (ctx) => {
        const agriculturalPlots = await ctx.db.query("agriculturalPlots").collect();
        if (!agriculturalPlots) throw new Error("Agricultural plots not found");

        const mapMarkers = await ctx.db.query("mapMarkers").collect();
        const crops = await ctx.db.query("crops").collect();

        const enrichedPlots = agriculturalPlots.map(plot => ({
            ...plot,
            mapMarker: mapMarkers.find(marker => marker._id === plot.markerId),
            cropHistory: plot.cropHistory.map(cropId => crops.find(crop => crop._id === cropId))
        }));

        return enrichedPlots;
    }
})

export const getFarmById = query({
    args: {
        farmId: v.id("agriculturalPlots"),
    },
    handler: async (ctx, args) => {
        const farm = await ctx.db.get(args.farmId);
        if (!farm) throw new Error("Farm not found");

        const mapMarker = await ctx.db.get(farm.markerId);
        const cropHistory = await Promise.all(
            farm.cropHistory.map(async (cropId) => {
                const crop = await ctx.db.get(cropId);
                return crop || null;
            })
        );

        return {
            ...farm,
            mapMarker,
            cropHistory: cropHistory.filter(crop => crop !== null)
        };
    }
});

export const addCropManagement = mutation({
    args: {
        agriculturalPlotId: v.id("agriculturalPlots"),
        cropManagement: v.optional(v.object({
            fertilizerApplication: v.object({
                type: v.string(),
                quantity: v.number(),
                applicationSchedule: v.string(), // ISO date string or description
            }),
            pestAndDiseaseControl: v.object({
                pests: v.array(v.string()),
                diseases: v.array(v.string()),
                controlMeasures: v.array(v.string()),
            }),
            cropRotationPlan: v.object({
                schedule: v.string(), // Description or ISO date string
            }),
            growthMonitoring: v.object({
                growthStage: v.string(),
                healthAssessments: v.array(v.string()),
            }),
            harvestingMethods: v.string(), // "manual" | "mechanized"
        })),
    },
    handler: async (ctx, args) => {
        const cropManagement = await ctx.db.patch(args.agriculturalPlotId, {
            cropManagement: args.cropManagement,
        });
        return cropManagement;
    }
});

export const updateAgriculturalPlot = mutation({
    args: {
        agriculturalPlotId: v.id("agriculturalPlots"),
        area: v.number(),
        landUseType: v.array(v.string()),
        status: v.string(),
    },
    handler: async (ctx, args) => {
      await ctx.db.patch(args.agriculturalPlotId, {
            area: args.area,
            landUseType: args.landUseType,
            status: args.status,
        });
        return args.agriculturalPlotId;
    }
})
