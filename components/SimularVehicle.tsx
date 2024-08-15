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
    const similarVehicles = useQuery(api.vehicleAssessments.findSimilarVehicles,
        assessmentId ? { assessmentId, limit: 3 } : "skip"
    );
    const recommendations = useQuery(api.vehicleAssessments.getSimilarVehicleRecommendations,
        assessmentId ? { assessmentId } : "skip"
    );
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
            method: 'POST',
            headers: { 'Content-Type': file.type },
            body: file,
        });
        const { storageId } = await result.json();

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
                            <li key={service.Id}>{service}</li>
                        ))}
                    </ul>
                </div>
            )}
            {similarVehicles && (
                <div className="similar-vehicles">
                    <h3>Similar Vehicles</h3>
                    {similarVehicles.map((vehicle, index) => (
                        <div key={vehicle.Id} className="similar-vehicle">
                            <img src={vehicle.imageUrl} alt={`Similar vehicle ${index + 1}`} className="vehicle-thumbnail" />
                            <p><strong>Condition:</strong> {vehicle.condition}</p>
                            <p><strong>Similarity:</strong> {(vehicle.similarity * 100).toFixed(2)}%</p>
                        </div>
                    ))}
                </div>
            )}
            {recommendations && (
                <div className="recommendations">
                    <h3>Recommendations Based on Similar Vehicles</h3>
                    <p>{recommendations}</p>
                </div>
            )}
        </div>
    );
}