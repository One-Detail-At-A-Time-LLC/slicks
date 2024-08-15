import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const processVehicleImage = action({
    args: {
        clientId: v.id("clients"),
        vehicleId: v.id("vehicles"),
        storageId: v.id("_storage"),
    },
    handler: async (ctx, args) => {
        // 1. Retrieve the uploaded image
        const imageBlob = await ctx.storage.get(args.storageId);
        if (!imageBlob) {
            throw new Error("Image not found");
        }

        // 2. Use OpenAI's GPT-4 Vision to analyze the image
        const base64Image = await blobToBase64(imageBlob);
        const response = await openai.chat.completions.create({
            model: "gpt-4-vision-preview",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Analyze this vehicle image and provide a detailed assessment including the vehicle's condition and recommended detailing services." },
                        { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}` } },
                    ],
                },
            ],
        });

        const assessment = response.choices[0].message.content;

        // 3. Generate embedding for vector search
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: assessment,
        });
        const embedding = embeddingResponse.data[0].embedding;

        // 4. Parse the assessment
        const { description, condition, recommendedServices } = parseAssessment(assessment);

        // 5. Store the assessment in the database
        const assessmentId = await ctx.runMutation(internal.vehicleAssessments.storeAssessment, {
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

export const storeAssessment = mutation({
    args: {
        clientId: v.id("clients"),
        vehicleId: v.id("vehicles"),
        imageStorageId: v.id("_storage"),
        description: v.string(),
        condition: v.string(),
        recommendedServices: v.array(v.string()),
        embedding: v.array(v.float64()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("vehicleAssessments", args);
    },
});

export const getAssessment = query({
    args: { assessmentId: v.id("vehicleAssessments") },
    handler: async (ctx, args) => {
        const assessment = await ctx.db.get(args.assessmentId);
        if (!assessment) {
            return null;
        }
        const imageUrl = await ctx.storageId.getUrl(assessment.Storage.toString());
        return { ...assessment, imageUrl };
    },
});

// Helper functions
async function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function parseAssessment(assessment: string): { description: string; condition: string; recommendedServices: string[] } {
    // Implement parsing logic here
    // This is a simplified example
    const lines = assessment.split('\n');
    return {
        description: lines[0],
        condition: lines[1],
        recommendedServices: lines.slice(2),
    };
}