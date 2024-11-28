import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

// User IDs
const FARMER_ID = "jx70rx5t2w79pnj0tmbb6v0dtd74nxxz" as Id<"users">;
const ADMIN_ID = "jx7e7r40ay23p79p71z39xahex74kkr9" as Id<"users">;

// Barangay IDs
const BARANGAY_IDS = {
  MAPINYA: "kd73y8r1perv6d937pee06p85174m5qc" as Id<"barangays">,
  BALITUCAN: "kd7217pwfj4xq2wwgat0pjqjzx74n7p4" as Id<"barangays">,
  TURU: "kd73fbwkv7sbfskrfd8bxcaa5n74n2y3" as Id<"barangays">,
};

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // First, let's create some sample agricultural plots
    const plotIds = await Promise.all([
      // Plots for Mapinya
      ctx.db.insert("agriculturalPlots", {
        userId: FARMER_ID,
        barangayId: BARANGAY_IDS.MAPINYA,
        coordinates: [
          [120.6893, 15.2135],
          [120.6899, 15.2135],
          [120.6899, 15.2140],
          [120.6893, 15.2140],
        ], // Example coordinates
        area: 2.5,
        status: "active",
        cropHistory: [], // We'll update this after creating crops
        landUseType: ["rice"],
        soilInfo: {
          type: "clay",
          pH: 6.5,
          texture: "fine",
          nutrientContent: {
            nitrogen: 0.5,
            phosphorus: 0.3,
            potassium: 0.4,
          },
          moisture: {
            current: 0.2,
            historical: [0.1, 0.15, 0.2],
          },
          erosionRisk: "low",
        },
        markerId: "some-marker-id" as Id<"mapMarkers">,
      }),
      ctx.db.insert("agriculturalPlots", {
        userId: FARMER_ID,
        barangayId: BARANGAY_IDS.MAPINYA,
        coordinates: [
          [120.6903, 15.2145],
          [120.6909, 15.2145],
          [120.6909, 15.2150],
          [120.6903, 15.2150],
        ],
        area: 1.8,
        status: "preparing",
        cropHistory: [],
        landUseType: ["corn"],
        soilInfo: {
          type: "loam",
          pH: 6.8,
          texture: "medium",
          nutrientContent: {
            nitrogen: 0.6,
            phosphorus: 0.4,
            potassium: 0.5,
          },
          moisture: {
            current: 0.25,
            historical: [0.2, 0.22, 0.25],
          },
          erosionRisk: "medium",
        },
        markerId: "another-marker-id" as Id<"mapMarkers">,
      }),
    ]);

    // Create crops for the plots
    const cropIds = await Promise.all([
      ctx.db.insert("crops", {
        plotId: plotIds[0],
        name: "Rice IR64",
        plantingDate: "2024-01-15",
        harvestDate: "2024-04-15",
      }),
      ctx.db.insert("crops", {
        plotId: plotIds[0],
        name: "Rice NSIC Rc222",
        plantingDate: "2023-08-15",
        harvestDate: "2023-11-15",
      }),
    ]);

    // Update plot with crop history
    await ctx.db.patch(plotIds[0], {
      cropHistory: cropIds,
    });

    // Create production data
    await Promise.all([
      // Mapinya Production Data
      ctx.db.insert("productionData", {
        barangayId: BARANGAY_IDS.MAPINYA,
        cropType: "rice",
        year: "2024",
        quarter: "Q1",
        totalProduction: 125.5,
        totalArea: 45.2,
        averageYield: 2.78,
        notes: "Good harvest despite minor pest issues",
      }),
      ctx.db.insert("productionData", {
        barangayId: BARANGAY_IDS.MAPINYA,
        cropType: "corn",
        year: "2024",
        quarter: "Q1",
        totalProduction: 85.3,
        totalArea: 32.1,
        averageYield: 2.66,
        notes: "Normal yield with favorable weather conditions",
      }),

      // Balitucan Production Data
      ctx.db.insert("productionData", {
        barangayId: BARANGAY_IDS.BALITUCAN,
        cropType: "rice",
        year: "2024",
        quarter: "Q1",
        totalProduction: 142.8,
        totalArea: 50.5,
        averageYield: 2.83,
        notes: "Excellent harvest with new irrigation system",
      }),

      // Turu Production Data
      ctx.db.insert("productionData", {
        barangayId: BARANGAY_IDS.TURU,
        cropType: "rice",
        year: "2024",
        quarter: "Q1",
        totalProduction: 118.2,
        totalArea: 42.8,
        averageYield: 2.76,
        notes: "Good overall production",
      }),
    ]);

    // Create map markers
    await Promise.all([
      ctx.db.insert("mapMarkers", {
        userId: ADMIN_ID,
        barangay: "Mapinya",
        coordinates: [120.6893, 15.2135],
        title: "Irrigation Pump Station",
        description: "Main water source for rice fields",
        markerType: "facility",
      }),
      ctx.db.insert("mapMarkers", {
        userId: ADMIN_ID,
        barangay: "Mapinya",
        coordinates: [120.6903, 15.2145],
        title: "Storage Facility",
        description: "Community grain storage",
        markerType: "facility",
      }),
    ]);

    return {
      success: true,
      message: "Database seeded successfully",
    };
  },
});