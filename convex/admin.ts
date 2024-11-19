import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { createAccount, getAuthUserId } from "@convex-dev/auth/server";

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

export const getDashboardOverview = query({
    args: {},
    handler: async (ctx) => {
        // Get all users by role
        const [farmers, stakeholders, admins] = await Promise.all([
            ctx.db.query("users")
                .filter((q) => q.eq(q.field("role"), "farmer"))
                .collect(),
            ctx.db.query("users")
                .filter((q) => q.eq(q.field("role"), "stakeholder"))
                .collect(),
            ctx.db.query("users")
                .filter((q) => q.eq(q.field("role"), "admin"))
                .collect()
        ]);

        // Get active plots
        const plots = await ctx.db
            .query("agriculturalPlots")
            .filter((q) => q.eq(q.field("status"), "active"))
            .collect();

        // Get total area of all plots
        const totalArea = plots.reduce((sum, plot) => sum + plot.area, 0);

        // Get recent audit logs count
        const recentAuditLogs = await ctx.db
            .query("auditLogs")
            .order("desc")
            .take(100)

        return {
            totalFarmers: farmers.length,
            activeFarmers: farmers.filter(f => f.farmerProfile?.isActive).length,
            totalStakeholders: stakeholders.length,
            activeStakeholders: stakeholders.filter(s => s.stakeholderProfile?.isActive).length,
            totalAdmins: admins.length,
            activePlots: plots.length,
            totalAreaHectares: Math.round(totalArea * 100) / 100,
            recentActivityCount: recentAuditLogs.length
        }
    }
})

export const getBarangayDetails = query({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        // Get barangay data
        const barangay = await ctx.db
            .query("barangays")
            .filter((q) => q.eq(q.field("name"), args.name))
            .first();

        if (!barangay) throw new Error("Barangay not found");

        // Get farmers count
        const farmers = await ctx.db
            .query("users")
            .filter((q) => 
                q.and(
                    q.eq(q.field("role"), "farmer"),
                    q.eq(q.field("farmerProfile.barangayId"), barangay._id)
                )
            )
            .collect();

        // Get plots data
        const plots = await ctx.db
            .query("agriculturalPlots")
            .filter((q) => q.eq(q.field("barangayId"), barangay._id))
            .collect();

        // Get production data for current quarter
        const currentYear = new Date().getFullYear().toString();
        const currentQuarter = `Q${Math.floor((new Date().getMonth() + 3) / 3)}`;

        const productionData = await ctx.db
            .query("productionData")
            .filter((q) => 
                q.and(
                    q.eq(q.field("barangayId"), barangay._id),
                    q.eq(q.field("year"), currentYear),
                    q.eq(q.field("quarter"), currentQuarter)
                )
            )
            .collect();

        return {
            barangay,
            totalArea: plots.reduce((sum, plot) => sum + plot.area, 0),
            farmerCount: farmers.length,
            activePlots: plots.filter(plot => plot.status === "active").length,
            totalProduction: productionData.reduce((sum, record) => sum + record.totalProduction, 0)
        };
    }
});
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

export const getAllAdmins = query({
    args: {},
    handler: async (ctx) => {
        const admins = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "admin"))
            .collect()

        return admins
    },
})

export const getAllFarmers = query({
    args: {},
    handler: async (ctx) => {
        const farmers = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "farmer"))
            .collect()

        // Get additional data for each farmer
        const farmersWithDetails = await Promise.all(
            farmers.map(async (farmer) => {
                const plots = await ctx.db
                    .query("agriculturalPlots")
                    .filter((q) => q.eq(q.field("userId"), farmer._id))
                    .collect()

                const barangay = farmer.farmerProfile?.barangayId
                    ? await ctx.db.get(farmer.farmerProfile.barangayId)
                    : null

                return {
                    ...farmer,
                    totalArea: plots.reduce((sum, plot) => sum + plot.area, 0),
                    farmerProfile: {
                        ...farmer.farmerProfile,
                        barangayName: barangay?.name || "Unknown"
                    }
                }
            })
        )

        return farmersWithDetails.sort((a, b) =>
            `${a.lname} ${a.fname}`.localeCompare(`${b.lname} ${b.fname}`)
        )
    },
})

export const getAllStakeholders = query({
    args: {},
    handler: async (ctx) => {
        const stakeholders = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "stakeholder"))
            .collect()

        // Get basic profile details for each stakeholder
        const stakeholdersWithDetails = stakeholders.map((stakeholder) => ({
            ...stakeholder,
            stakeholderProfile: {
                ...stakeholder.stakeholderProfile,
                contactNumber: stakeholder.stakeholderProfile?.contactNumber ?? "",
            }
        }))

        // Sort by last name, then first name
        return stakeholdersWithDetails.sort((a, b) =>
            `${a.lname} ${a.fname}`.localeCompare(`${b.lname} ${b.fname}`)
        )
    },
})

export const toggleUserStatus = mutation({
    args: {
        userId: v.id("users"),
        userType: v.union(v.literal("farmer"), v.literal("stakeholder")),
        adminId: v.id("users")
    },
    handler: async (ctx, args) => {
        // Get the current user
        const user = await ctx.db.get(args.userId)

        if (!user) {
            throw new Error("User not found")
        }

        // Verify user type matches
        if (user.role !== args.userType) {
            throw new Error(`User is not a ${args.userType}`)
        }

        // Get current profile based on user type
        const profile = args.userType === "farmer"
            ? user.farmerProfile
            : user.stakeholderProfile

        if (!profile) {
            throw new Error(`${args.userType} profile not found`)
        }

        // Toggle the active status
        const updatedProfile = {
            ...profile,
            isActive: !profile.isActive
        }

        // Update the user with the new profile
        await ctx.db.patch(args.userId, {
            [args.userType === "farmer" ? "farmerProfile" : "stakeholderProfile"]: updatedProfile
        })

        await ctx.db.insert("auditLogs", {
            userId: args.adminId,
            action: profile.isActive ? "Account Deactivated" : "Account Activated",
            targetId: args.userId,
            targetType: args.userType,
            details: `${args.userType} account ${updatedProfile.isActive ? "activated" : "deactivated"}: ${user.fname} ${user.lname}`,
            timestamp: Date.now(),
        })

        return {
            success: true,
            isActive: updatedProfile.isActive
        }
    }
})

export const createFarmer = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        fname: v.string(),
        lname: v.string(),
        barangayId: v.id("barangays"),
        contactNumber: v.string(),
        address: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const adminId = await getAuthUserId(ctx)
            if (!adminId) throw new ConvexError("Not authenticated")

            const admin = await ctx.db.get(adminId)
            if (!admin) throw new ConvexError("Admin not found")

            if (admin.role !== "admin") throw new ConvexError("Unauthorized")


            const existingUser = await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("email"), args.email))
                .first()

            if (existingUser) throw new ConvexError("Email already exists")

            const { email, password, barangayId, ...userData } = args

            // @ts-expect-error - TODO: fix this
            const accountResponse = await createAccount(ctx, {
                provider: "password",
                account: {
                    id: email,
                    secret: password,
                },
                profile: {
                    email,
                    fname: userData.fname,
                    lname: userData.lname,
                    role: "farmer",
                    farmerProfile: {
                        barangayId,
                        contactNumber: userData.contactNumber,
                        address: userData.address,
                        isActive: true,
                    }
                }
            })

            if (!accountResponse?.user?._id) throw new ConvexError("Failed to create account")

            await ctx.db.insert("auditLogs", {
                userId: adminId,
                action: "Created Farmer Account",
                targetId: accountResponse.user._id,
                targetType: "farmer",
                details: `Created farmer account for ${userData.fname} ${userData.lname}`,
                timestamp: Date.now(),
            })

            const newUser = await ctx.db.get(accountResponse.user._id);
            if (!newUser) {
                throw new ConvexError("Failed to retrieve created farmer");
            }

            return newUser;

        } catch (error) {
            console.error("Error in createFarmer:", error);
            throw error;
        }
    }
})

export const createAdmin = mutation({
    args: {
        email: v.string(),
        password: v.string(),
        fname: v.string(),
        lname: v.string(),
    },
    handler: async (ctx, args) => {
        try {
            const adminId = await getAuthUserId(ctx)
            if (!adminId) throw new ConvexError("Not authenticated")

            const admin = await ctx.db.get(adminId)
            if (!admin) throw new ConvexError("Admin not found")

            if (admin.role !== "admin") throw new ConvexError("Unauthorized")

            const existingUser = await ctx.db
                .query("users")
                .filter((q) => q.eq(q.field("email"), args.email))
                .first()

            if (existingUser) throw new ConvexError("Email already exists")

            const { email, password, ...userData } = args

            // @ts-expect-error - TODO: fix this
            const accountResponse = await createAccount(ctx, {
                provider: "password",
                account: {
                    id: email,
                    secret: password,
                },
                profile: {
                    email,
                    fname: userData.fname,
                    lname: userData.lname,
                    role: "admin",
                }
            });

            if (!accountResponse?.user?._id) throw new ConvexError("Failed to create account")

            await ctx.db.patch(accountResponse.user._id, {
                isActive: true
            });

            await ctx.db.insert("auditLogs", {
                userId: adminId,
                action: "Created Admin Account",
                targetId: accountResponse.user._id,
                targetType: "admin",
                details: `Created admin account for ${args.fname} ${args.lname}`,
                timestamp: Date.now(),
            });

            return accountResponse.user;
        } catch (error) {
            console.error("Error in createAdmin:", error);
            throw error;
        }
    }
})

export const toggleAdminStatus = mutation({
    args: {
        adminId: v.id("users"),
        currentAdminId: v.id("users")
    },
    handler: async (ctx, args) => {
        const admin = await ctx.db.get(args.adminId);
        if (!admin) throw new ConvexError("Admin not found");

        // Prevent self-deactivation
        if (args.adminId === args.currentAdminId) {
            throw new ConvexError("Cannot deactivate your own account");
        }

        await ctx.db.patch(args.adminId, {
            isActive: !admin.isActive
        });

        // Create audit log
        await ctx.db.insert("auditLogs", {
            userId: args.currentAdminId,
            action: admin.isActive ? "Deactivated Admin Account" : "Activated Admin Account",
            targetId: args.adminId,
            targetType: "admin",
            details: `${admin.isActive ? "Deactivated" : "Activated"} admin account for ${admin.fname} ${admin.lname}`,
            timestamp: Date.now(),
        });
    }
});

export const deleteAdmin = mutation({
    args: {
        adminId: v.id("users"),
        currentAdminId: v.id("users")
    },
    handler: async (ctx, args) => {
        const admin = await ctx.db.get(args.adminId);
        if (!admin) throw new ConvexError("Admin not found");

        // Prevent self-deletion
        if (args.adminId === args.currentAdminId) {
            throw new ConvexError("Cannot delete your own account");
        }

        // Create audit log before deletion
        await ctx.db.insert("auditLogs", {
            userId: args.currentAdminId,
            action: "Deleted Admin Account",
            targetId: args.adminId,
            targetType: "admin",
            details: `Deleted admin account for ${admin.fname} ${admin.lname}`,
            timestamp: Date.now(),
        });

        await ctx.db.delete(args.adminId);
    }
});

export const getRecentAuditLogs = query({
    args: {},
    handler: async (ctx) => {
        const logs = await ctx.db
            .query("auditLogs")
            .order("desc")
            .take(20)

        return logs
    },
})

export const getAuditLogs = query({
    args: {
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let q = ctx.db.query("auditLogs").order("desc");

        if (args.startDate && args.endDate) {
            q = q.filter((q) =>
                q.and(
                    q.gte(q.field("timestamp"), args.startDate!),
                    q.lte(q.field("timestamp"), args.endDate!)
                )
            );
        }

        return await q.collect();
    },
});

export const updateFarmerProfile = mutation({
    args: {
        farmerId: v.id("users"),
        fname: v.string(),
        lname: v.string(),
        email: v.string(),
        contactNumber: v.string(),
        address: v.string(),
        barangayName: v.union(
            v.literal("Turu"),
            v.literal("Balitucan"),
            v.literal("Mapinya")
        )
    },
    handler: async (ctx, args) => {
        const farmer = await ctx.db.get(args.farmerId);
        if (!farmer) throw new ConvexError("Farmer not found");
        if (farmer.role !== "farmer") throw new ConvexError("User is not a farmer");

        // Get barangay ID
        const barangay = await ctx.db
            .query("barangays")
            .filter((q) => q.eq(q.field("name"), args.barangayName))
            .first();

        if (!barangay) throw new ConvexError("Barangay not found");

        // Update user document
        await ctx.db.patch(args.farmerId, {
            fname: args.fname,
            lname: args.lname,
            email: args.email,
            farmerProfile: {
                ...farmer.farmerProfile,
                barangayId: barangay._id,
                contactNumber: args.contactNumber,
                address: args.address,
                isActive: farmer.farmerProfile?.isActive ?? true
            }
        });

        // Create audit log
        await ctx.db.insert("auditLogs", {
            userId: args.farmerId, // Using farmer's ID as the actor
            action: "Updated Farmer Profile",
            targetId: args.farmerId,
            targetType: "farmer",
            details: `Updated profile for farmer ${args.fname} ${args.lname}`,
            timestamp: Date.now(),
        });

        return { success: true };
    }
});

export const updateStakeholderProfile = mutation({
    args: {
        stakeholderId: v.id("users"),
        fname: v.string(),
        lname: v.string(),
        email: v.string(),
        contactNumber: v.string(),
    },
    handler: async (ctx, args) => {
        const stakeholder = await ctx.db.get(args.stakeholderId);
        if (!stakeholder) throw new ConvexError("Stakeholder not found");
        if (stakeholder.role !== "stakeholder") throw new ConvexError("User is not a stakeholder");

        // Update user document
        await ctx.db.patch(args.stakeholderId, {
            fname: args.fname,
            lname: args.lname,
            email: args.email,
            stakeholderProfile: {
                ...stakeholder.stakeholderProfile,
                contactNumber: args.contactNumber,
                isActive: stakeholder.stakeholderProfile?.isActive ?? true
            }
        });

        // Create audit log
        await ctx.db.insert("auditLogs", {
            userId: args.stakeholderId,
            action: "Updated Stakeholder Profile",
            targetId: args.stakeholderId,
            targetType: "stakeholder",
            details: `Updated profile for stakeholder ${args.fname} ${args.lname}`,
            timestamp: Date.now(),
        });

        return { success: true };
    }
});