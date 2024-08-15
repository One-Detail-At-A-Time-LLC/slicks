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
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold">{tenant.name} Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <Card className="col-span-1 md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Estimates</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {recentEstimates?.map((estimate) => (
                                <li key={estimate._id} className="py-2 border-b last:border-b-0">
                                    <span className="font-semibold">${estimate.totalPrice.toFixed(2)}</span> - {new Date(estimate.createdAt).toLocaleDateString()}
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
                        <ul className="space-y-2">
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
                        <Button className="w-full" onClick={() => { /* Open EstimateForm modal */ }}>New Estimate</Button>
                        <Button className="w-full" onClick={() => { /* Open AppointmentScheduling modal */ }}>Schedule Appointment</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <h2 className="text-xl md:text-2xl font-bold mb-4">Client Communication</h2>
                <ChatComponent tenantId={tenantId} clientId="current-client-id" />
            </div>
        </div>
    );
}
