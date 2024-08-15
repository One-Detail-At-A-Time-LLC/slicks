import React from 'react';
import { useUser, useOrganization } from "@clerk/clerk-react";
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

export default function ClientPortal() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const clientAppointments = useQuery(api.appointments.getClientAppointments);
  const createAppointment = useMutation(api.appointments.createAppointment);

  if (!user || !organization || organization.membership?.role !== 'org:clients') {
    return <div>Access denied. Client access required.</div>;
  }

  return (
    <div className="client-portal">
      <h1>Client Portal</h1>
      <section>
        <h2>Your Appointments</h2>
        <ul>
          {clientAppointments?.map(appointment => (
            <li key={appointment._id}>
              {appointment.serviceName} - {new Date(appointment.date).toLocaleString()}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Book New Appointment</h2>
        {/* Add form to create new appointment */}
      </section>
      {/* Add more client-specific sections */}
    </div>
  );
}