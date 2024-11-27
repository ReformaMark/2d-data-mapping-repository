import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const list = query({
    handler: async (ctx) => {
        const barangays = await ctx.db.query("barangays").collect();

        return barangays.sort((a, b) => {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        })
    }
})

export const get = query({
    handler: async (ctx) => {
        const barangays = await ctx.db.query("barangays").collect();
        return barangays;
    }
})

export const getBarangay = query({
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) return null;
        const user = await ctx.db.get(userId);
        if (!user) return null;
        const barangays = await ctx.db.query("barangays").collect();
        const barangay = barangays.find(b => b._id === user.farmerProfile?.barangayId);
        return barangay;
    }
})