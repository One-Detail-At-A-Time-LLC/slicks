import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    tenants: defineTable({
        name: v.string(),
        ownerId: v.string(),
        pricingStructure: v.array(
            v.object({
                serviceName: v.string(),
                basePrice: v.number(),
                sizeMultiplier: v.object({
                    small: v.number(),
                    medium: v.number(),
                    large: v.number(),
                }),
            })
        ),
        costOfGoods: v.array(
            v.object({
                itemName: v.string(),
                cost: v.number(),
            })
        ),
        laborCost: v.number(),
        qrCode: v.string(),
    }).index("by_ownerId", ["ownerId"]),

    clients: defineTable({
        tenantId: v.id("tenants"),
        name: v.string(),
        email: v.string(),
        phone: v.string(),
    }).index("by_tenantId", ["tenantId"]),

    vehicles: defineTable({
        clientId: v.id("clients"),
        make: v.string(),
        model: v.string(),
        year: v.number(),
        size: v.union(v.literal("small"), v.literal("medium"), v.literal("large")),
    }).index("by_clientId", ["clientId"]),

    estimates: defineTable({
        tenantId: v.id("tenants"),
        clientId: v.id("clients"),
        vehicleId: v.id("vehicles"),
        services: v.array(v.string()),
        totalPrice: v.number(),
        status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
        createdAt: v.number(),
    }).index("by_tenantId", ["tenantId"]),

    appointments: defineTable({
        estimateId: v.id("estimates"),
        startTime: v.number(),
        endTime: v.number(),
        status: v.union(v.literal("scheduled"), v.literal("completed"), v.literal("cancelled")),
        depositPaid: v.boolean(),
    }).index("by_estimateId", ["estimateId"]),

    messages: defineTable({
        tenantId: v.id("tenants"),
        clientId: v.id("clients"),
        content: v.string(),
        sender: v.union(v.literal("tenant"), v.literal("client")),
        timestamp: v.number(),
    }).index("by_tenantId_clientId", ["tenantId", "clientId"]),
});