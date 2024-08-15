import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { extractUserDataFromJWT, UserData } from "../lib/auth";

// Helper function to get authenticated user data
async function getAuthenticatedUser(ctx: any): Promise<UserData> {
    const token = await ctx.auth.getUserIdentity();
    if (!token) {
        throw new Error("Not authenticated");
    }
    return extractUserDataFromJWT(token);
}

export const getAssessment = query({
    args: { assessmentId: v.id("vehicleAssessments") },
    handler: async (ctx, args) => {
        const userData = await getAuthenticatedUser(ctx);
        const assessment = await ctx.db.get(args.assessmentId);
        if (!assessment || assessment.tenantId !== userData.organizationId) {
            return null;
        }
        const imageUrl = await ctx.storage.getUrl(assessment.imageStorageId);
        return { ...assessment, imageUrl };
    },
});

export const processVehicleImage = action({
    args: {
        clientId: v.id("clients"),
        vehicleId: v.id("vehicles"),
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        const userData = await getAuthenticatedUser(ctx);

        // ... (previous implementation)

        const assessmentId = await ctx.runMutation(internal.vehicleAssessments.storeAssessment, {
            tenantId: userData.organizationId,
            clientId: args.clientId,
            vehicleId: args.vehicleId,
            imageStorageId: args.storageId,
            description,
            condition,
            recommendedServices,
            embedding,
        });

        return assessmentId;
    },
});

export const getOngoingServices = query({
    handler: async (ctx) => {
        const userData = await getAuthenticatedUser(ctx);
        return await ctx.db
            .query("ongoingServices")
            .withIndex("by_tenant_and_status", (q) =>
                q.eq("tenantId", userData.organizationId).eq("status", "in_progress")
            )
            .collect();
    },
});