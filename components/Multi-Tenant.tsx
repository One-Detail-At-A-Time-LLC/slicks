import React, { useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

interface VehicleAssessmentProps {
    tenantId: Id<"tenants">;
    clientId: Id<"clients">;
    vehicleId: Id<"vehicles">;
}

export function VehicleAssessment({ tenantId, clientId, vehicleId }: VehicleAssessmentProps) {
    const generateUploadUrl = useMutation(api.vehicleAssessments.generateUploadUrl);
    const processVehicleImage = useMutation(api.vehicleAssessments.processVehicleImage);
    const [assessmentId, setAssessmentId] = useState<Id<"vehicleAssessments"> | null>(null);
    const assessment = useQuery(api.vehicleAssessments.getAssessment,
        assessmentId ? { tenantId, assessmentId } : "skip"
    );
    const similarVehicles = useQuery(api.vehicleAssessments.findSimilarVehicles,
        assessmentId ? { tenantId, assessmentId, limit: 3 } : "skip"
    );