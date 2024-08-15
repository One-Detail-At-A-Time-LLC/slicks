import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChatComponent } from './ChatComponent';

export function TenantDashboard({ tenantId }: Readonly<{ tenantId: string }>) {
    const tenant = useQuery(api.tenant.getById, { id: tenantId });
    const recentEstimates = useQuery(api.estimate.getRecent, { tenantId, limit: 5 });
    const upcomingAppointments = useQuery(api.appointment.getUpcoming, { tenantId, limit: 5 });

    if (!tenant) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">{tenant.name} Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Estimates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {recentEstimates?.map((estimate) => (
                                <li key={estimate._id} className="py-2 border-b last:border-b-0">
                                    ${estimate.totalPrice.toFixed(2)} - {new Date(estimate.createdAt).toLocaleDateString()}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Appointments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {upcomingAppointments?.map((appointment) => (
                                <li key={appointment._id} className="py-2 border-b last:border-b-0">
                                    {new Date(appointment.startTime).toLocaleString()}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button onClick={() => { /* Open EstimateForm modal */ }}>New Estimate</Button>
                        <Button onClick={() => { /* Open AppointmentScheduling modal */ }}>Schedule Appointment</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Client Communication</h2>
                <ChatComponent tenantId={tenantId} clientId="current-client-id" />
            </div>
        </div>
    );
}