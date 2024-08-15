import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { ConvexError } from "convex/values";

// Helper function to get authenticated user data and check permissions
async function checkAuth(ctx: any, requiredPermissions: string[]): Promise<UserData> {
    const token = await ctx.auth.getUserIdentity();
    if (!token) {
        throw new ConvexError("Not authenticated");
    }

    const userData = extractUserDataFromJWT(token);

    // Check if user has required permissions
    const hasPermission = requiredPermissions.some(permission =>
        userData.organizationRole === 'org:admin' || // AdminCreator has all permissions
        (permission === 'org:member' && ['org:member', 'org:manager_organization', 'org:admin'].includes(userData.organizationRole)) ||
        permission === userData.organizationRole
    );

    if (!hasPermission) {
        throw new ConvexError("Insufficient permissions");
    }

    return userData;
}

export const getAssessment = query({
    args: { assessmentId: v.id("vehicleAssessments") },
    handler: async (ctx, args) => {
        const userData = await checkAuth(ctx, ['org:member', 'org:clients']);
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
        const userData = await checkAuth(ctx, ['org:member', 'org:clients']);

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
        const userData = await checkAuth(ctx, ['org:member']);
        return await ctx.db
            .query("ongoingServices")
            .withIndex("by_tenant_and_status", (q) =>
                q.eq("tenantId", userData.organizationId).eq("status", "in_progress")
            )
            .collect();
    },
});

export const updateServiceStatus = mutation({
    args: { serviceId: v.id("ongoingServices"), status: v.string() },
    handler: async (ctx, args) => {
        const userData = await checkAuth(ctx, ['org:manager_organization', 'org:admin']);
        await ctx.db.patch(args.serviceId, { status: args.status });
    },
});