import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    users: defineTable({
        image: v.optional(v.string()),
        fname: v.string(),
        lname: v.string(),
        email: v.string(),
        role: v.union(
            v.literal("admin"),
            v.literal("stakeholder"),
            v.literal("farmer")
        ),
        farmerProfile: v.optional(v.object({
            barangayId: v.id("barangays"), // Reference to barangays table
            contactNumber: v.string(),
            address: v.string(),
            isActive: v.boolean(),
            lastLogin: v.optional(v.string()),
        })),
        stakeholderProfile: v.optional(v.object({
            organization: v.string(),
            position: v.string(),
            contactNumber: v.string(),
        })),
    })
        .index("by_email", ["email"])
        .index("by_role", ["role"])
        .index("by_farmerProfile_barangayId", ["farmerProfile.barangayId"]),

    // Barangays table
    barangays: defineTable({
        name: v.union(
            v.literal("Turu"),
            v.literal("Balitucan"),
            v.literal("Mapinya")
        ),
        address: v.string(),
        coordinates: v.array(v.number()), // [latitude, longitude]
        boundaries: v.array(v.array(v.number())), // GeoJSON polygon coordinates
        area: v.number(), // in hectares
    }).index("by_name", ["name"]),

    // Map Markers table
    mapMarkers: defineTable({
        userId: v.id("users"),
        coordinates: v.array(v.number()), // [latitude, longitude]
        title: v.string(),
        description: v.optional(v.string()),
        markerType: v.string(), // "plot" | "landmark" | "facility"
    }).index("by_userId", ["userId"]),

    // Agricultural Plots table
    agriculturalPlots: defineTable({
        userId: v.id("users"),
        barangayId: v.id("barangays"),
        coordinates: v.array(v.array(v.number())), // GeoJSON polygon
        area: v.number(),
        status: v.string(), // "active" | "fallow" | "preparing"
        cropHistory: v.array(v.id("crops")),
        landUseType: v.string(), // "rice" | "corn" | "vegetables"
    })
        .index("by_userId", ["userId"])
        .index("by_barangayId", ["barangayId"]),

    // Crops table
    crops: defineTable({
        plotId: v.id("agriculturalPlots"),
        name: v.string(),
        plantingDate: v.string(), // ISO date string
        harvestDate: v.optional(v.string()), // ISO date string
    }).index("by_plotId", ["plotId"]),

    // Production Data table
    productionData: defineTable({
        barangayId: v.id("barangays"),
        cropType: v.string(),
        year: v.string(),
        quarter: v.string(), // "Q1" | "Q2" | "Q3" | "Q4"
        totalProduction: v.number(),
        totalArea: v.number(),
        averageYield: v.number(),
        notes: v.optional(v.string()),
    })
        .index("by_barangay", ["barangayId"])
        .index("by_crop", ["cropType"])
        .index("by_year_quarter", ["year", "quarter"]),

    // Analytics Data table (for caching/aggregating analytics)
    analyticsData: defineTable({
        type: v.string(), // "yield_trend" | "crop_distribution" | "production_summary"
        period: v.string(), // "yearly" | "quarterly"
        data: v.string(), // JSON stringified analytics data
        lastUpdated: v.string(), // ISO date string
    }).index("by_type_period", ["type", "period"]),
});

export default schema;