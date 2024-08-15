// pages/admin-dashboard.tsx
import React from 'react';
import { useUser, useOrganization } from "@clerk/clerk-react";
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function AdminDashboard() {
    const { user } = useUser();
    const { organization } = useOrganization();
    const allServices = useQuery(api.services.getAllServices);
    const allClients = useQuery(api.clients.getAllClients);
    const createService = useMutation(api.services.createService);

    if (!user || !organization || organization.membership?.role !== 'org:admin') {
        return <div>Access denied. Admin privileges required.</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <section>
                <h2>Services Management</h2>
                <ul>
                    {allServices?.map(service => (
                        <li key={service._id}>{service.name} - ${service.price}</li>
                    ))}
                </ul>
                {/* Add form to create new service */}
            </section>
            <section>
                <h2>Client Management</h2>
                <ul>
                    {allClients?.map(client => (
                        <li key={client._id}>{client.name} - {client.email}</li>
                    ))}
                </ul>
            </section>
            {/* Add more admin-specific sections */}
        </div>
    )
}