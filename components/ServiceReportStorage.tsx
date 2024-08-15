import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";
import PDFDocument from 'pdfkit';

export const generateServiceReport = action({
    args: {
        clientId: v.id("clients"),
        vehicleId: v.id("vehicles"),
        assessmentId: v.id("vehicleAssessments"),
        servicesPerformed: v.array(v.string()),
        totalCost: v.number(),
    },
    handler: async (ctx, args) => {
        // 1. Fetch necessary data
        const client = await ctx.runQuery(api.clients.getClient, { clientId: args.clientId });
        const vehicle = await ctx.runQuery(api.vehicles.getVehicle, { vehicleId: args.vehicleId });
        const assessment = await ctx.runQuery(api.vehicleAssessments.getAssessment, { assessmentId: args.assessmentId });

        if (!client || !vehicle || !assessment) {
            throw new Error("Required data not found");
        }

        // 2. Generate PDF
        const pdfBuffer = await generatePDF(client, vehicle, assessment, args.servicesPerformed, args.totalCost);

        // 3. Store PDF in Convex storage
        const storageId = await ctx.storage.store(pdfBuffer);

        // 4. Save report metadata to the database
        const reportId = await ctx.runMutation(internal.serviceReports.storeReportMetadata, {
            clientId: args.clientId,
            vehicleId: args.vehicleId,
            assessmentId: args.assessmentId,
            reportStorageId: storageId,
            date: Date.now(),
            servicesPerformed: args.servicesPerformed,
            totalCost: args.totalCost,
        });

        return reportId;
    },
});

export const storeReportMetadata = mutation({
    args: {
        clientId: v.id("clients"),
        vehicleId: v.id("vehicles"),
        assessmentId: v.id("vehicleAssessments"),
        reportStorageId: v.id("_storage"),
        date: v.number(),
        servicesPerformed: v.array(v.string()),
        totalCost: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("serviceReports", args);
    },
});

export const getServiceReport = query({
    args: { reportId: v.id("serviceReports") },
    handler: async (ctx, args) => {
        const report = await ctx.db.get(args.reportId);
        if (!report) {
            return null;
        }
        const reportUrl = await ctx.storage.getUrl(report.reportStorageId);
        return { ...report, reportUrl };
    },
});

// Helper function to generate PDF
async function generatePDF(client, vehicle, assessment, servicesPerformed, totalCost) {
    return new Promise((resolve) => {
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));

        doc.fontSize(18).text('Auto Detailing Service Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Client: ${client.name}`);
        doc.text(`Vehicle: ${vehicle.make} ${vehicle.model} (${vehicle.year})`);
        doc.text(`Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.text('Vehicle Assessment:', { underline: true });
        doc.text(assessment.description);
        doc.moveDown();
        doc.text('Services Performed:', { underline: true });
        servicesPerformed.forEach(service => doc.text(`- ${service}`));
        doc.moveDown();
        doc.text(`Total Cost: $${totalCost.toFixed(2)}`, { bold: true });

        doc.end();
    });
}