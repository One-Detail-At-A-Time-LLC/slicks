"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Button } from './ui/button';
import { DatePicker } from './ui/date-picker';
import { TimePicker } from './ui/time-picker';

const appointmentSchema = z.object({
    estimateId: z.string().min(1, 'Estimate ID is required'),
    date: z.date(),
    time: z.string().regex(/^([0-1]?\d|2[0-3]):[0-5]\d$/, 'Invalid time format'),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

/**
 * Renders a form for scheduling an appointment.
 *
 * @param {Object} props - The component props.
 * @param {string} props.tenantId - The ID of the tenant.
 * @param {string} props.estimateId - The ID of the estimate.
 * @return {JSX.Element} The rendered form.
 */
export function AppointmentScheduling({ tenantId, estimateId }: Readonly<{ tenantId: string; estimateId: string }>) {
    const { control, handleSubmit, formState: { errors } } = useForm<AppointmentFormData>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            estimateId,
        },
    });

    const [schedulingResult, setSchedulingResult] = useState<string | null>(null);
    const scheduleAppointment = useMutation(api.appointment.schedule);

    /**
     * Handles the submission of the appointment scheduling form.
     *
     * @param {AppointmentFormData} data - The form data containing the estimate ID, selected date, and selected time.
     * @return {Promise<void>} A promise that resolves when the appointment scheduling is complete.
     */
    const onSubmit = async ({ estimateId, date: selectedDate, time: selectedTime }: AppointmentFormData) => {
        if (!selectedDate || !selectedTime) {
            return;
        }

        const startTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`);
        if (isNaN(startTime.getTime())) {
            return;
        }

        try {
            const appointment = await scheduleAppointment({
                tenantId,
                estimateId,
                startTime: startTime.getTime(),
            });
            setSchedulingResult(`Appointment scheduled successfully for ${appointment.startTime}`);
        } catch (error) {
            console.error('Error scheduling appointment:', error);
            setSchedulingResult('Failed to schedule appointment. Please try again.');
        }
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
        }} className="space-y-4">
            <Controller
                name="date"
                control={control}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        placeholder="Select Date"
                        error={errors.date?.message}
                    />
                )}
            />
            <Controller
                name="time"
                control={control}
                render={({ field }) => (
                    <TimePicker
                        {...field}
                        placeholder="Select Time"
                        error={errors.time?.message}
                    />
                )}
            />
            <Button type="submit">Schedule Appointment</Button>
            {schedulingResult && (
                <p className={`text-lg ${schedulingResult.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                    {schedulingResult}
                </p>
            )}
        </form>
    );
}