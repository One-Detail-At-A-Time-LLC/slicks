// pages/manager-dashboard.tsx
import React from 'react';
import { useUser, useOrganization } from "@clerk/clerk-react";
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function ManagerDashboard() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const ongoingServices = useQuery(api.ongoingServices.getOngoingServices);
  const updateServiceStatus = useMutation(api.ongoingServices.updateServiceStatus);

  if (!user || !organization || organization.membership?.role !== 'org:manager_organization') {
    return <div>Access denied. Manager privileges required.</div>;
  }

  return (
    <div className="manager-dashboard">
      <h1>Manager Dashboard</h1>
      <section>
        <h2>Ongoing Services</h2>
        {ongoingServices?.map(service => (
          <div key={service._id} className="service-card">
            <h3>{service.serviceName}</h3>
            <p>Status: {service.status}</p>
            <button onClick={() => updateServiceStatus({ serviceId: service._id, status: 'completed' })}>
              Mark as Completed
            </button>
          </div>
        ))}
      </section>
      {/* Add more manager-specific sections */}
    </div>
  );
}