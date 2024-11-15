import { v } from "convex/values";
import { query } from "./_generated/server";

export const getDashboardStats = query({
    args: {},
    handler: async (ctx) => {
        const farmers = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "farmer"))
            .collect()

        const plots = await ctx.db
            .query("agriculturalPlots")
            .collect()

        const productionRecords = await ctx.db
            .query("productionData")
            .collect()

        return {
            totalFarmers: farmers.length,
            totalPlots: plots.length,
            totalProductionRecords: productionRecords.length,
        }
    }
})

export const getBarangayDetails = query({
    args: {
        name: v.union(
            v.literal("Turu"),
            v.literal("Balitucan"),
            v.literal("Mapinya")
        )
    },
    handler: async (ctx, args) => {
        const barangay = await ctx.db
            .query("barangays")
            .filter((q) => q.eq(q.field("name"), args.name))
            .first()

        if (!barangay) return null

        const farmers = await ctx.db
            .query("users")
            .filter((q) =>
                q.eq(q.field("role"), "farmer") &&
                q.eq(q.field("farmerProfile.barangayId"), barangay._id)
            )
            .collect()

        const plots = await ctx.db
            .query("agriculturalPlots")
            .filter((q) => q.eq(q.field("barangayId"), barangay._id))
            .collect()

        const currentYear = new Date().getFullYear().toString()
        const currentQuarter = `Q${Math.floor((new Date().getMonth() + 3) / 3)}`

        const productionData = await ctx.db
            .query("productionData")
            .filter((q) =>
                q.and(
                    q.eq(q.field("barangayId"), barangay._id),
                    q.eq(q.field("year"), currentYear),
                    q.eq(q.field("quarter"), currentQuarter)
                )
            )
            .collect()

        return {
            ...barangay,
            farmerCount: farmers.length,
            totalArea: plots.reduce((sum, plot) => sum + plot.area, 0),
            activePlots: plots.filter(plot => plot.status === "active").length,
            totalProduction: productionData.reduce((sum, data) => sum + data.totalProduction, 0)
        }
    }
})

export const getAggregateStats = query({
    args: {},
    handler: async (ctx) => {
        const [plots, farmers, productionData] = await Promise.all([
            ctx.db.query("agriculturalPlots").collect(),
            ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("role"), "farmer"))
                .collect(),
            ctx.db.query("productionData").collect(),
        ])

        return {
            totalArea: plots.reduce((sum, plot) => sum + plot.area, 0),
            totalFarmers: farmers.length,
            totalProduction: productionData.reduce((sum, data) => sum + data.totalProduction, 0),
        }
    }
})

export const getBarangayPlots = query({
    args: {
        name: v.union(
            v.literal("Turu"),
            v.literal("Balitucan"),
            v.literal("Mapinya")
        ),
    },
    handler: async (ctx, args) => {
        console.log("Fetching plots for barangay:", args.name);

        const barangay = await ctx.db
            .query("barangays")
            .filter((q) => q.eq(q.field("name"), args.name))
            .first()

        console.log("Found barangay:", barangay);

        if (!barangay) return []

        const plots = await ctx.db
            .query("agriculturalPlots")
            .filter((q) => q.eq(q.field("barangayId"), barangay._id))
            .collect()

        const plotsWithDetails = await Promise.all(
            plots.map(async (plot) => {
                const farmer = await ctx.db.get(plot.userId)
                const currentCrop = plot.cropHistory.length > 0
                    ? await ctx.db.get(plot.cropHistory[plot.cropHistory.length - 1])
                    : null

                return {
                    ...plot,
                    farmerName: farmer ? `${farmer.fname} ${farmer.lname}` : "Unknown",
                    currentCrop: currentCrop?.name
                }
            })
        )

        console.log(`plotsWithDetails: ${plotsWithDetails}`)

        return plotsWithDetails;
    }
})

export const getBarangayFarmers = query({
    args: {
        name: v.union(
            v.literal("Turu"),
            v.literal("Balitucan"),
            v.literal("Mapinya")
        )
    },
    handler: async (ctx, args) => {
        const barangay = await ctx.db
            .query("barangays")
            .filter((q) => q.eq(q.field("name"), args.name))
            .first()

        if (!barangay) return []

        const farmers = await ctx.db
            .query("users")
            .filter((q) =>
                q.and(
                    q.eq(q.field("role"), "farmer") &&
                    q.eq(q.field("farmerProfile.barangayId"), barangay._id)
                )
            )
            .collect()

        const farmersWithDetails = await Promise.all(
            farmers.map(async (farmer) => {
                const plots = await ctx.db
                    .query("agriculturalPlots")
                    .filter((q) => q.eq(q.field("userId"), farmer._id))
                    .collect()

                return {
                    ...farmer,
                    totalArea: plots.reduce((sum, plot) => sum + plot.area, 0),
                    activePlots: plots.filter(plot => plot.status === "active").length
                }
            })
        )

        return farmersWithDetails;
    }
})

export const getBarangayProduction = query({
    args: {
        name: v.union(
            v.literal("Turu"),
            v.literal("Balitucan"),
            v.literal("Mapinya")
        ),
        year: v.string()
    },
    handler: async (ctx, args) => {
        const barangay = await ctx.db
            .query("barangays")
            .filter((q) => q.eq(q.field("name"), args.name))
            .first()

        if (!barangay) return []

        const productionData = await ctx.db
            .query("productionData")
            .filter((q) =>
                q.and(
                    q.eq(q.field("barangayId"), barangay._id),
                    q.eq(q.field("year"), args.year)
                )
            )
            .collect()

        return productionData.sort((a, b) => a.quarter.localeCompare(b.quarter))
    }
})