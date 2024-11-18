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
        isActive: v.optional(v.boolean()),
        farmerProfile: v.optional(v.object({
            barangayId: v.id("barangays"), // Reference to barangays table
            contactNumber: v.string(),
            address: v.string(),
            isActive: v.boolean(),
        })),
        stakeholderProfile: v.optional(v.object({
            organization: v.string(),
            position: v.string(),
            contactNumber: v.string(),
            isActive: v.boolean(),
        })),
    })
        .index("by_email", ["email"])
        .index("by_role", ["role"])
        .index("by_farmerProfile_barangayId", ["farmerProfile.barangayId"]),

    // Barangays table
    barangays: defineTable({
        name: v.string(),
        coordinates: v.array(v.array(v.number())), // GeoJSON polygon coordinates
        resources: v.array(v.object({
            name: v.string(),
            description: v.string(),
            coordinates: v.array(v.number()), // [latitude, longitude]
            icon: v.string(),
            production: v.number()
        })),
        production: v.optional(v.object({
            rice: v.number(),
            corn: v.number(),
            carrots: v.number(),
            tomatoes: v.number(),
            eggplant: v.number()
        }))
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

    auditLogs: defineTable({
        userId: v.id("users"), // Admin who performed the action
        action: v.string(), // Description of the action
        targetId: v.id("users"), // User affected by the action
        targetType: v.string(), // "farmer" or "stakeholder"
        details: v.string(), // Additional context
        timestamp: v.number(), // Unix timestamp
    }).index("by_timestamp", ["timestamp"]),
});

export default schema;