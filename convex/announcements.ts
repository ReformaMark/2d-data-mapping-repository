import { query } from "./_generated/server";

export const getAnnouncements = query({
    handler: async (ctx) => {
        const announcements = await ctx.db.query("announcements").order('desc').collect();
        return announcements;
    }
})