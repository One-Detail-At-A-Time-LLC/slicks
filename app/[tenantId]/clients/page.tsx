// File: app/[tenantId]/settings/page.tsx
import React from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

const settingsSchema = z.object({
    name: z.string().min(1, 'Business name is required'),
    laborCost: z.number().min(0, 'Labor cost must be non-negative'),
    pricingStructure: z.array(z.object({
        serviceName: z.string().min(1, 'Service name is required'),
        basePrice: z.number().min(0, 'Base price must be non-negative'),
        sizeMultiplier: z.object({
            small: z.number().min(1, 'Size multiplier must be at least 1'),
            medium: z.number().min(1, 'Size multiplier must be at least 1'),
            large: z.number().min(1, 'Size multiplier must be at least 1'),
        }),
    })),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage({ params }: Readonly<{ params: { tenantId: string } }>) {
    const tenant = useQuery(api.tenant.getById, { id: params.tenantId });
    const updateTenant = useMutation(api.tenant.update);

    const { control, handleSubmit, formState: { errors } } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: tenant || undefined,
    });

    const onSubmit = async (data: SettingsFormData) => {
        try {
            await updateTenant({ id: params.tenantId, ...data });
            alert('Settings updated successfully');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings. Please try again.');
        }
    };

    if (!tenant) return <div>Loading...</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Business Settings</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>General Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} label="Business Name" error={errors.name?.message} />
                            )}
                        />
                        <Controller
                            name="laborCost"
                            control={control}
                            render={({ field }) => (
                                <Input {...field} type="number" label="Labor Cost (per hour)" error={errors.laborCost?.message} />
                            )}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Pricing Structure</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tenant.pricingStructure.map((service, index) => (
                            <div key={service} className="space-y-4 mb-6">
                                <Controller
                                    name={`pricingStructure.${index}.serviceName`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} label="Service Name" error={errors.pricingStructure?.[index]?.serviceName?.message} />
                                    )}
                                />
                                <Controller
                                    name={`pricingStructure.${index}.basePrice`}
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} type="number" label="Base Price" error={errors.pricingStructure?.[index]?.basePrice?.message} />
                                    )}
                                />
                                <div className="grid grid-cols-3 gap-4">
                                    <Controller
                                        name={`pricingStructure.${index}.sizeMultiplier.small`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} type="number" label="Small Size Multiplier" error={errors.pricingStructure?.[index]?.sizeMultiplier?.small?.message} />
                                        )}
                                    />
                                    <Controller
                                        name={`pricingStructure.${index}.sizeMultiplier.medium`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} type="number" label="Medium Size Multiplier" error={errors.pricingStructure?.[index]?.sizeMultiplier?.medium?.message} />
                                        )}
                                    />
                                    <Controller
                                        name={`pricingStructure.${index}.sizeMultiplier.large`}
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} type="number" label="Large Size Multiplier" error={errors.pricingStructure?.[index]?.sizeMultiplier?.large?.message} />
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                        <Button type="button" onClick={() => { /* Add new service logic */ }}>Add New Service</Button>
                    </CardContent>
                </Card>

                <Button type="submit">Save Settings</Button>
            </form>
        </div>
    );
}