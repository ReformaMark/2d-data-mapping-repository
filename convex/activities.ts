import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const getActivities = query({
    handler: async(ctx)=>{
        const userId = await getAuthUserId(ctx);
        if (userId === null) return [];
        const activities = await ctx.db.query('activities')
        .filter(q => q.eq(q.field('userId'), userId))
        .filter(q => q.eq(q.field('isArchived'), false))
        .collect();
        return activities;
    }
})