import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Checkbox } from './ui/checkbox';

const estimateSchema = z.object({
    clientName: z.string().min(1, 'Client name is required'),
    vehicleMake: z.string().min(1, 'Vehicle make is required'),
    vehicleModel: z.string().min(1, 'Vehicle model is required'),
    vehicleYear: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    vehicleSize: z.enum(['small', 'medium', 'large']),
    services: z.array(z.string()).min(1, 'At least one service must be selected'),
});

type EstimateFormData = z.infer<typeof estimateSchema>;

export function EstimateForm({ tenantId }: Readonly<{ tenantId: string }>) {
    const { control, handleSubmit, formState: { errors } } = useForm<EstimateFormData>({
        resolver: zodResolver(estimateSchema),
        defaultValues: {
            services: [],
        },
    });

    const [estimateResult, setEstimateResult] = useState<number | null>(null);
    const generateEstimate = useMutation(api.estimate.generate);

    const onSubmit = async (data: EstimateFormData) => {
        try {
            const estimate = await generateEstimate({
                tenantId,
                ...data,
            });
            setEstimateResult(estimate.totalPrice);
        } catch (error) {
            console.error('Error generating estimate:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
                name="clientName"
                control={control}
                render={({ field }) => (
                    <Input {...field} placeholder="Client Name" error={errors.clientName?.message} />
                )}
            />
            <Controller
                name="vehicleMake"
                control={control}
                render={({ field }) => (
                    <Input {...field} placeholder="Vehicle Make" error={errors.vehicleMake?.message} />
                )}
            />
            <Controller
                name="vehicleModel"
                control={control}
                render={({ field }) => (
                    <Input {...field} placeholder="Vehicle Model" error={errors.vehicleModel?.message} />
                )}
            />
            <Controller
                name="vehicleYear"
                control={control}
                render={({ field }) => (
                    <Input {...field} type="number" placeholder="Vehicle Year" error={errors.vehicleYear?.message} />
                )}
            />
            <Controller
                name="vehicleSize"
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={[
                            { value: 'small', label: 'Small' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'large', label: 'Large' },
                        ]}
                        placeholder="Vehicle Size"
                        error={errors.vehicleSize?.message}
                    />
                )}
            />
            <Controller
                name="services"
                control={control}
                render={({ field }) => (
                    <div>
                        <Checkbox {...field} value="exteriorWash" label="Exterior Wash" />
                        <Checkbox {...field} value="interiorCleaning" label="Interior Cleaning" />
                        <Checkbox {...field} value="waxing" label="Waxing" />
                        <Checkbox {...field} value="detailing" label="Detailing" />
                    </div>
                )}
            />
            {errors.services && <p className="text-red-500">{errors.services.message}</p>}
            <Button type="submit">Generate Estimate</Button>
            {estimateResult !== null && (
                <p className="text-lg font-bold">Estimated Price: ${estimateResult.toFixed(2)}</p>
            )}
        </form>
    );
}