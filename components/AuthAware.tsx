import React, { useState, useRef } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';
import { useUser } from "@clerk/clerk-react";

export function VehicleAssessment({ clientId, vehicleId }: { clientId: Id<"clients">; vehicleId: Id<"vehicles"> }) {
    const { user } = useUser();
    const generateUploadUrl = useMutation(api.vehicleAssessments.generateUploadUrl);
    const processVehicleImage = useMutation(api.vehicleAssessments.processVehicleImage);
    const [assessmentId, setAssessmentId] = useState<Id<"vehicleAssessments"> | null>(null);
    const assessment = useQuery(api.vehicleAssessments.getAssessment,
        assessmentId ? { assessmentId } : "skip"
    );
    const similarVehicles = useQuery(api.vehicleAssessments.findSimilarVehicles,
        assessmentId ? { assessmentId, limit: 3 } : "skip"
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

    if (!user) {
        return <div>Please sign in to access this feature.</div>;
    }

    return (
        <div className="vehicle-assessment">
            <h2>Vehicle Assessment for {user.fullName}</h2>
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
                            <li key={index}>{service}</li>
                        ))}
                    </ul>
                </div>
            )}
            {similarVehicles && (
                <div className="similar-vehicles">
                    <h3>Similar Vehicles</h3>
                    {similarVehicles.map((vehicle, index) => (
                        <div key={index} className="similar-vehicle">
                            <img src={vehicle.imageUrl} alt={`Similar vehicle ${index + 1}`} className="vehicle-thumbnail" />
                            <p><strong>Condition:</strong> {vehicle.condition}</p>
                            <p><strong>Similarity:</strong> {(vehicle.similarity * 100).toFixed(2)}%</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export function RealtimeDashboard() {
    const { user } = useUser();
    const ongoingServices = useQuery(api.ongoingServices.getOngoingServices);
    const updateServiceStatus = useMutation(api.ongoingServices.updateServiceStatus);

    const handleStatusUpdate = async (serviceId, newStatus) => {
        await updateServiceStatus({ serviceId, status: newStatus });
    };

    if (!user) {
        return <div>Please sign in to access the dashboard.</div>;
    }

    return (
        <div className="realtime-dashboard">
            <h2>Ongoing Services for {user.organizationName}</h2>
            {ongoingServices?.map((service) => (
                <div key={service._id} className="service-card">
                    <h3>{service.serviceName}</h3>
                    <p>Client ID: {service.clientId}</p>
                    <p>Vehicle ID: {service.vehicleId}</p>
                    <p>Assigned Staff: {service.assignedStaff}</p>
                    <p>Status: {service.status}</p>
                    <p>Started: {new Date(service.startTime).toLocaleTimeString()}</p>
                    <p>Estimated End: {new Date(service.estimatedEndTime).toLocaleTimeString()}</p>
                    <button onClick={() => handleStatusUpdate(service._id, "completed")}>
                        Mark as Completed
                    </button>
                </div>
            ))}
        </div>
    );
}