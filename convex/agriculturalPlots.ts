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
                return crop ? crop.possibleYields || 0 : 0;
            })
        ).then(yields => yields.reduce((acc, yld) => acc + yld, 0));

        await ctx.db.patch(markerId, {
            yields: totalYields,
        });

        const marker = await ctx.db.get(markerId);
        if (!marker) throw new Error("Marker not found");

        const barangay = await ctx.db.get(agriculturalPlot.barangayId);
        if (!barangay) throw new Error("Barangay not found");

        await ctx.db.insert("announcements", {
            title: `${marker.title}`,
            content: `A new farm location titled "${marker.title}" has been added to barangay ${barangay.name}.`,
            additionalInformation: plot._id,
            isActive: true
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
        const user = await ctx.db.get(farm.userId);
        if (!user) throw new Error("User not found");

        return {
            ...farm,
            mapMarker,
            cropHistory: cropHistory.filter(crop => crop !== null),
            user
        };
    }});

    
export const getFarmByUserId = query({
  
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)
        if (userId === null) return;

        const farm = await ctx.db.query('agriculturalPlots')
            .filter(q => q.eq(q.field("userId"), userId))
            .first();

        if (!farm) throw new Error("Farm not found");

        const mapMarker = await ctx.db.get(farm.markerId);
        const cropHistory = await Promise.all(
            farm.cropHistory.map(async (cropId) => {
                const crop = await ctx.db.get(cropId);
                return crop || null;
            })
        );
        const user = await ctx.db.get(farm.userId);
        if (!user) throw new Error("User not found");

        return {
            ...farm,
            mapMarker,
            cropHistory: cropHistory.filter(crop => crop !== null),
            user
        };
    }});

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


export const updateFarmInfo = mutation({
    args:{
        plotId: v.id('agriculturalPlots'),
        markerId: v.id('mapMarkers'),
        cropId: v.id("crops"),
        cropName: v.string(),
        area: v.number(),
        status: v.string(),
        landUseType: v.array(v.string()),
        possibleYields: v.number(),
        farmName: v.string()
    },

    handler: async(ctx, args) =>{
        await ctx.db.patch(args.plotId, {
            area: args.area,
            status: args.status,
            landUseType: args.landUseType,
        });
        await ctx.db.patch(args.markerId,{
            title: args.farmName,
            yields: args.possibleYields,
            markerType: args.cropName
        });

        await ctx.db.patch(args.cropId,{
            possibleYields: args.possibleYields,
            name: args.cropName
        })
    }   

})

export const updateCropManagement = mutation({
    args: {
        agriculturalPlotId: v.id('agriculturalPlots'),
        cropManagement: v.object({
            fertilizerApplication: v.object({
                type: v.string(),
                quantity: v.number(),
                applicationSchedule: v.string(),
            }),
            pestAndDiseaseControl: v.object({
                pests: v.array(v.string()),
                diseases: v.array(v.string()),
                controlMeasures: v.array(v.string()),
            }),
            cropRotationPlan: v.object({
                schedule: v.string(),
            }),
            growthMonitoring: v.object({
                growthStage: v.string(),
                healthAssessments: v.array(v.string()),
            }),
            harvestingMethods: v.string(), // "manual" | "mechanized"
        }),
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

export const updateSoilHealth = mutation({
    args:{
        agriculturalPlotId: v.id('agriculturalPlots'),
        soilInfo: v.object({
            type: v.string(), // Soil Type: Clay, loam, sandy, etc.
            pH: v.number(), // Soil pH Level: Acidity or alkalinity of the soil.
            texture: v.string(),
            nutrientContent: v.object({ // Soil Nutrient Content: Levels of nitrogen (N), phosphorus (P), and potassium (K).
                nitrogen: v.number(),
                phosphorus: v.number(),
                potassium: v.number(),
            }),
            moisture: v.object({ // Soil Moisture: Current and historical moisture levels.
                current: v.number(),
                historical: v.array(v.number()),
            }),
            erosionRisk: v.string(), // Soil Erosion Data: Risk of soil degradation or erosion.
        }),
    },
    handler: async(ctx, args) =>{
        const soilInfo = await ctx.db.patch(args.agriculturalPlotId, {
            soilInfo: args.soilInfo,
        });
        return soilInfo;
    }
})

export const updateIrrigation = mutation({
    args:{
        agriculturalPlotId: v.id('agriculturalPlots'),
        waterSource: v.optional(v.string()), // Water Source: Irrigation, rain-fed, river, or well.
        waterUsage: v.optional(v.number()), // Water Usage: Volume of water needed per crop cycle.
        irrigationSystem: v.optional(v.string()), // Irrigation System: Type of irrigation system installed (e.g., drip, sprinkler, or flood).
        rainfallData: v.optional(v.object({ // Rainfall Data: Seasonal rainfall patterns.
            season: v.string(),
            rainfallAmount: v.number(), // in millimeters
        })),
    },
    handler: async(ctx, args) =>{
        const irrigation = await ctx.db.patch(args.agriculturalPlotId, {
            waterSource: args.waterSource,
            waterUsage: args.waterUsage,
            irrigationSystem: args.irrigationSystem,
            rainfallData: args.rainfallData,
        });

        return irrigation;
    }

});

export const updateFarmInfrastructure = mutation({
    args:{
        agriculturalPlotId: v.id('agriculturalPlots'),
        farmInfrastructure: v.optional(v.object({
            storageFacilities: v.array(v.string()), // Silos, warehouses, or cold storage for harvest
            farmEquipment: v.array(v.string()), // Available machinery and tools
            transportation: v.array(v.string()), // Methods for delivering crops to market
        })),
    },
    handler: async (ctx, args) =>{
        const farmInfrastructure = await ctx.db.patch(args.agriculturalPlotId, {
            farmInfrastructure: args.farmInfrastructure,
        });
        return farmInfrastructure;
    }
})

export const updateOwner = mutation({
    args:{
        agriculturalPlotId: v.id('agriculturalPlots'),
        ownership: v.optional(v.object({
            owner: v.object({
                name: v.string(),
                contact: v.string(),
                role: v.string(), // Role in farm operations
            })
        })),
    },
    handler: async(ctx, args) => {
        const ownership = await ctx.db.patch(args.agriculturalPlotId, {
            ownership: args.ownership,
        });
        return ownership;
    }
})