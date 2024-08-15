import React, { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Id } from '../convex/_generated/dataModel';

/**
 * Component for generating and displaying a service report.
 * 
 * @interface ServiceReportProps
 * @property {Id<"clients">} clientId - The ID of the client associated with the service report.
 * @property {Id<"vehicles">} vehicleId - The ID of the vehicle associated with the service report.
 * @property {Id<"vehicleAssessments">} assessmentId - The ID of the vehicle assessment associated with the service report.
 */
interface ServiceReportProps {
    clientId: Id<"clients">;
    vehicleId: Id<"vehicles">;
    assessmentId: Id<"vehicleAssessments">;
}

/**
 * Component for generating and displaying a service report.
 * 
 * @param {ServiceReportProps} props - The props for the component.
 * @returns {JSX.Element} - The rendered component.
 */
export function ServiceReport({ clientId, vehicleId, assessmentId }: Readonly<ServiceReportProps>): JSX.Element {
    // Mutation for generating a service report
    const generateReport = useMutation(api.serviceReports.generateServiceReport);
    // State for storing the ID of the generated report
    const [reportId, setReportId] = useState<Id<"serviceReports"> | null>(null);
    // Query for fetching the generated report
    const report = useQuery(api.serviceReports.getServiceReport, reportId ? { reportId } : "skip");
    // State for storing the services performed
    const [servicesPerformed, setServicesPerformed] = useState<string[]>([]);
    // State for storing the total cost of the services
    const [totalCost, setTotalCost] = useState<number>(0);

    /**
     * Handles generating a service report.
     * 
     * @returns {Promise<void>} - A promise that resolves when the report is generated.
     */
    const handleGenerateReport = async (): Promise<void> => {
        // Generate a new report and store its ID
        const newReportId = await generateReport({
            clientId,
            vehicleId,
            assessmentId,
            servicesPerformed,
            totalCost,
        });
        setReportId(newReportId);
    };

    /**
     * Handles adding a service to the list of services performed.
     * 
     * @param {string} service - The service to be added.
     * @returns {void}
     */
    const handleAddService = (service: string): void => {
        setServicesPerformed([...servicesPerformed, service]);
    };

    return (
        <div className="service-report">
            <h2>Service Report</h2>
            <div className="service-input">
                {/* Input field for adding a service */}
                <input
                    type="text"
                    placeholder="Add service"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleAddService(e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                />
                {/* Input field for setting the total cost of the services */}
                <input
                    type="number"
                    placeholder="Total cost"
                    value={totalCost}
                    onChange={(e) => setTotalCost(parseFloat(e.target.value))}
                />
            </div>
            <ul>
                {/* List of services performed */}
                {servicesPerformed.map((service, index) => (
                    <li key={index}>{service}</li>
                ))}
            </ul>
            {/* Button to generate the service report */}
            <button onClick={handleGenerateReport}>Generate Report</button>
            {report && (
                <div className="report-result">
                    <h3>Generated Report</h3>
                    <p>Date: {new Date(report.date).toLocaleDateString()}</p>
                    <p>Total Cost: ${report.totalCost.toFixed(2)}</p>
                    {/* Link to view the full report */}
                    <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                        View Full Report (PDF)
                    </a>
                </div>
            )}
        </div>
    );
    import React, { useState } from 'react';
    import { useMutation, useQuery } from 'convex/react';
    import { api } from '../convex/_generated/api';
    import { Id } from '../convex/_generated/dataModel';

    interface ServiceReportProps {
        clientId: Id<"clients">;
        vehicleId: Id<"vehicles">;
        assessmentId: Id<"vehicleAssessments">;
    }

    export function ServiceReport({ clientId, vehicleId, assessmentId }: Readonly<ServiceReportProps>) {
        const generateReport = useMutation(api.serviceReports.generateServiceReport);
        const [reportId, setReportId] = useState<Id<"serviceReports"> | null>(null);
        const report = useQuery(api.serviceReports.getServiceReport, reportId ? { reportId } : "skip");
        const [servicesPerformed, setServicesPerformed] = useState<string[]>([]);
        const [totalCost, setTotalCost] = useState<number>(0);

        const handleGenerateReport = async () => {
            const newReportId = await generateReport({
                clientId,
                vehicleId,
                assessmentId,
                servicesPerformed,
                totalCost,
            });
            setReportId(newReportId);
        };

        const handleAddService = (service: string) => {
            setServicesPerformed([...servicesPerformed, service]);
        };

        return (
            <div className="service-report">
                <h2>Service Report</h2>
                <div className="service-input">
                    <input
                        type="text"
                        placeholder="Add service"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAddService(e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                    <input
                        type="number"
                        placeholder="Total cost"
                        value={totalCost}
                        onChange={(e) => setTotalCost(parseFloat(e.target.value))}
                    />
                </div>
                <ul>
                    {servicesPerformed.map((service, index) => (
                        <li key={Service.Id}>{service}</li>
                    ))}
                </ul>
                <button onClick={handleGenerateReport}>Generate Report</button>
                {report && (
                    <div className="report-result">
                        <h3>Generated Report</h3>
                        <p>Date: {new Date(report.date).toLocaleDateString()}</p>
                        <p>Total Cost: ${report.totalCost.toFixed(2)}</p>
                        <a href={report.reportUrl} target="_blank" rel="noopener noreferrer">
                            View Full Report (PDF)
                        </a>
                    </div>
                )}
            </div>
        );
    }
}