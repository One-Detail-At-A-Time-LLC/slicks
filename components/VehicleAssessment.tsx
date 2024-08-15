import React, { useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

interface VehicleAssessmentProps {
    clientId: Id<"clients">;
    vehicleId: Id<"vehicles">;
}

export function VehicleAssessment({ clientId, vehicleId }: Readonly<VehicleAssessmentProps>) {
    const generateUploadUrl = useMutation(api.vehicleAssessments.generateUploadUrl);
    const processVehicleImage = useMutation(api.vehicleAssessments.processVehicleImage);
    const [assessmentId, setAssessmentId] = useState<Id<"vehicleAssessments"> | null>(null);
    const assessment = useQuery(api.vehicleAssessments.getAssessment, assessmentId ? { assessmentId } : "skip");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 1. Get the upload URL
        const uploadUrl = await generateUploadUrl();

        // 2. Upload the file
        const result = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file,
        });
        const { storageId } = await result.json();

        // 3. Process the image and get the assessment
        const newAssessmentId = await processVehicleImage({ clientId, vehicleId, storageId });
        setAssessmentId(newAssessmentId);
    };

    return (
        <div className="vehicle-assessment">
            <h2>Vehicle Assessment</h2>
            <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                ref={fileInputRef}
            />
            {assessment && (
                <div className="assessment-result">
                    <img src={assessment.imageUrl} alt="Assessed vehicle" className="vehicle-image" />
                    <h3>Assessment Result</h3>
                    <p><strong>Description:</strong> {assessment.description}</p>
                    <p><strong>Condition:</strong> {assessment.condition}</p>
                    <h4>Recommended Services:</h4>
                    <ul>
                        {assessment.recommendedServices.map((service, index) => (
                            <li key={}>{service}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}