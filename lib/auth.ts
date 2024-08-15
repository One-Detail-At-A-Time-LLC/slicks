// lib/auth.ts
import { ConvexError } from "convex/values";

export interface UserData {
    userId: string;
    organizationId: string;
    organizationRole: string;
    email: string;
    name: string;
}

export function extractUserDataFromJWT(token: any): UserData {
    if (
        typeof token.userId !== "string" ||
        typeof token.organizationId !== "string" ||
        typeof token.organizationRole !== "string" ||
        typeof token.email !== "string" ||
        typeof token.name !== "string"
    ) {
        throw new ConvexError("Invalid JWT format");
    }

    return {
        userId: token.userId,
        organizationId: token.organizationId,
        organizationRole: token.organizationRole,
        email: token.email,
        name: token.name,
    };
}