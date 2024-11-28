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
            // organization: v.string(),
            // position: v.string(),
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
        barangay: v.string(),
        coordinates: v.array(v.number()), // [latitude, longitude]
        title: v.string(),
        description: v.optional(v.string()),
        markerType: v.string(), // "plot" | "landmark" | "facility"
        yields: v.optional(v.number()),
    }).index("by_userId", ["userId"]),

    // Agricultural Plots table
    agriculturalPlots: defineTable({
        userId: v.id("users"),
        barangayId: v.id("barangays"),
        coordinates: v.array(v.array(v.number())), // GeoJSON polygon
        area: v.number(),
        soilInfo: v.optional(v.object({
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
        })),
        waterSource: v.optional(v.string()), // Water Source: Irrigation, rain-fed, river, or well.
        waterUsage: v.optional(v.number()), // Water Usage: Volume of water needed per crop cycle.
        irrigationSystem: v.optional(v.string()), // Irrigation System: Type of irrigation system installed (e.g., drip, sprinkler, or flood).
        rainfallData: v.optional(v.object({ // Rainfall Data: Seasonal rainfall patterns.
            season: v.string(),
            rainfallAmount: v.number(), // in millimeters
        })),
        ownership: v.optional(v.object({
            owner: v.object({
                name: v.string(),
                contact: v.string(),
                role: v.string(), // Role in farm operations
            }),
            laborForce: v.array(v.object({
                workerName: v.string(),
                role: v.string(), // Role of the worker
            })),
            legalDocuments: v.object({
                landTitle: v.optional(v.string()),
                waterPermits: v.optional(v.string()),
                leaseAgreements: v.optional(v.string()),
            }),
        })),
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
        financialInformation: v.optional(v.object({
            inputCosts: v.object({
                seeds: v.number(),
                fertilizers: v.number(),
                labor: v.number(),
                equipment: v.number(),
            }),
            productionCosts: v.object({
                costPerHectare: v.number(),
            }),
            marketValue: v.object({
                currentPrice: v.number(),
                expectedPrice: v.number(),
            }),
            profitMargins: v.object({
                expectedProfit: v.number(),
            }),
        })),
        farmInfrastructure: v.optional(v.object({
            storageFacilities: v.array(v.string()), // Silos, warehouses, or cold storage for harvest
            farmEquipment: v.array(v.string()), // Available machinery and tools
            transportation: v.array(v.string()), // Methods for delivering crops to market
        })),
        status: v.string(), // "active" | "fallow" | "preparing"
        cropHistory: v.array(v.id("crops")),
        landUseType: v.array(v.string()), // "rice" | "corn" | "vegetables"
        markerId: v.id("mapMarkers"),
    })
        .index("by_userId", ["userId"])
        .index("by_barangayId", ["barangayId"])
        .index("by_markerId", ["markerId"]),

    // Crops table
    crops: defineTable({
        plotId: v.id("agriculturalPlots"),
        name: v.string(),
        plantingDate: v.string(), // ISO date string
        harvestDate: v.optional(v.string()), // ISO date string
        yields: v.optional(v.number()), // in kilograms
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