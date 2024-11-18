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
