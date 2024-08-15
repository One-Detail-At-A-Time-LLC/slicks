import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const startService = mutation({
    args: {
        clientId: v.id("clients"),
        vehicleId: v.id("vehicles"),
        serviceName: v.string(),
        assignedStaff: v.string(),
        estimatedDuration: v.number(),
    },
    handler: async (ctx, args) => {
        const startTime = Date.now();
        const estimatedEndTime = startTime + args.estimatedDuration;
        return await ctx.db.insert("ongoingServices", {
            ...args,
            status: "in_progress",
            startTime,
            estimatedEndTime,
        });
    },
});

export const updateServiceStatus = mutation({
    args: {
        serviceId: v.id("ongoingServices"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.serviceId, { status: args.status });
    },
});

export const getOngoingServices = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("ongoingServices")
            .filter((q) => q.eq(q.field("status"), "in_progress"))
            .collect();
    },
});