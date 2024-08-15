import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export function RealtimeDashboard() {
    const ongoingServices = useQuery(api.ongoingServices.getOngoingServices);
    const updateServiceStatus = useMutation(api.ongoingServices.updateServiceStatus);

    const handleStatusUpdate = async (serviceId, newStatus) => {
        await updateServiceStatus({ serviceId, status: newStatus });
    };

    return (
        <div className="realtime-dashboard">
            <h2>Ongoing Services</h2>
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